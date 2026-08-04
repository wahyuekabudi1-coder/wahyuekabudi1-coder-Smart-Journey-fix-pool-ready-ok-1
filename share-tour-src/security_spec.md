# Smart Journey: Security Specification (Phase 0 TDD)

This document maps all access rules, data integrity constraints, and prevention vectors for Smart Journey database operations.

## 1. Core Data Invariants

1. **Trips (Catalog)**:
   * Accessible for reading by anyone (`get`, `list`).
   * Modification (creation, updating, deletion) strictly locked to verified Administrators.
   * Identifier `slug` must match standard alphanumeric/hyphen formatting.

2. **Batches (Departure Quotas)**:
   * Read authorized for anyone (`get`, `list`) to look up vacancy slots.
   * Write transactions strictly locked to verified Administrators (creating, updating, deleting).
   * Validations on structural fields: `availableSeats` can never fall below 0, nor exceed `quota`.

3. **Bookings (Reservations & Audits)**:
   * Creation permitted for anyone supplying valid data, provided that the targeted `batch` has available seats, the booking complies with price parameters, and a valid `proofOfPayment` is enclosed.
   * Read access is restricted to the specific user (matching email and booking code) or a verified Administrator. Blanket query lists are blocked.
   * Updates to status (Confirmed or Rejected) can only be executed by verified Administrators. Normal users cannot modify their own booking records after creation.

---

## 2. The "Dirty Dozen" Payloads

Here are 12 specific hostile payloads designed to compromise the database, and how our security architecture blocks them.

### Payload 1: Unauthorized Trip Creation (Identity Spoofing)
* **Goal**: Malicious guest user bypasses UI rules to inject a dummy travel package.
* **Payload**:
  ```json
  {
    "title": "Malicious Fake Paradise Land",
    "slug": "hacked-paradise",
    "location": "Siberia",
    "duration": "1000 Days",
    "startingPrice": 1
  }
  ```
* **Guard Block**: Rejected by requiring verified administrator status for `create` on `/trips/{tripId}`.

### Payload 2: Hostile Price Update (Privilege Escalation)
* **Goal**: Regular traveler changes the starting price of a package to 0.
* **Payload**:
  ```json
  {
    "startingPrice": 0
  }
  ```
* **Guard Block**: Only authenticated Administrators can update `/trips/{tripId}`.

### Payload 3: Quota Overdrive (Resource Poisoning)
* **Goal**: Normal user attempts to expand a departures batch size to 999,999.
* **Payload**:
  ```json
  {
    "quota": 999999,
    "availableSeats": 999999
  }
  ```
* **Guard Block**: Only verified admins can write to `batches`.

### Payload 4: Booking Without Receipt (Asset Theft)
* **Goal**: Normal user submits a reservation order without uploading any proof of payment.
* **Payload**:
  ```json
  {
    "tripId": "trip-1",
    "tripTitle": "Labuan Bajo Adventure",
    "batchId": "batch-1",
    "departureDate": "2026-07-15",
    "fullName": "Robber Jenkins",
    "email": "hacker@evil.com",
    "phone": "+6281",
    "participantsCount": 1,
    "participantsNames": ["Robber Jenkins"],
    "proofOfPayment": "",
    "status": "Pending",
    "totalPrice": 3750000,
    "createdAt": "2026-06-09T20:23:11Z"
  }
  ```
* **Guard Block**: Rejected because `proofOfPayment` must be a valid, non-empty image/base64 string (`proofOfPayment.size() >= 10`).

### Payload 5: Auto-Approve Booking (State Shortcutting)
* **Goal**: Guest user registers a booking and immediately sets status to `"Confirmed"` to skip receipt verification.
* **Payload**:
  ```json
  {
    "fullName": "Sneaky Pete",
    "participantsCount": 1,
    "status": "Confirmed"
  }
  ```
* **Guard Block**: On `create` of bookings, `incoming().status == "Pending"` is mandated. Any other initial state is rejected.

### Payload 6: Underpaid Transaction (Value Poisoning)
* **Goal**: Passenger booked 3 seats but declared a total price corresponding to 1 seat.
* **Payload**:
  ```json
  {
    "participantsCount": 3,
    "totalPrice": 1250000 
  }
  ```
* **Guard Block**: Validation checks that total price is mathematically correct based on underlying batch parameters and seats count.

### Payload 7: Seat Stealing / Negative Seating (Denial of Wallet)
* **Goal**: Malicious traveler requests a negative amount of seats to increment availability.
* **Payload**:
  ```json
  {
    "participantsCount": -5
  }
  ```
* **Guard Block**: Schema validator enforces `participantsCount >= 1` and `participantsCount <= 100`.

### Payload 8: Immutable Core Injection (Immortal Field Violation)
* **Goal**: Traveler modifies their locked `bookingCode` or `createdAt` timestamp.
* **Payload**:
  ```json
  {
    "bookingCode": "SJ-HACKED",
    "createdAt": "2020-01-01"
  }
  ```
* **Guard Block**: `affectedKeys().hasOnly(...)` ensures normal user updates are blocked, and key immutability is validated.

### Payload 9: Junk Character ID Poisoning (Resource Exhaustion)
* **Goal**: Attacker targets the Firestore collection with massive junk ID strings to increase DB storage search indexing costs.
* **Path**: `/bookings/HACKER-HACKER-OVERFLOW-A?A?A?A?A?.......`
* **Guard Block**: Prevented by applying `isValidId(bookingId)` on writes, restricting IDs to size <= 128 characters, matching alphanumerics and hyphens.

### Payload 10: Anonymous Status Manipulation (Terminal State Bypass)
* **Goal**: Changing a completed or rejected status back to pending.
* **Payload**:
  ```json
  {
    "status": "Pending"
  }
  ```
* **Guard Block**: Once a booking is terminal (Confirmed or Rejected), only administrators can manipulate states.

### Payload 11: Contact Coordinates PII Leak (PII Scraping)
* **Goal**: Public query to read all user profile names, phone numbers, and emails.
* **Guard Block**: Blanket reading is disabled. `allow list` evaluates whether the querying visitor’s email corresponds exactly to the `resource.data.email` or is an Admin.

### Payload 12: Atomic Counter Bypass (Relational Drifts)
* **Goal**: Booking created without decrementing the corresponding batch quota.
* **Guard Block**: Sibling verification checks (e.g. `getAfter()` or atomic server validation) ensures consistent ledger balance state.
