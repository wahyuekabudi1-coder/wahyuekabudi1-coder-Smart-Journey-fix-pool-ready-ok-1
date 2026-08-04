# Portability Audit & Export Checklist
This document provides a full performance and portability audit for the **Smart Journey Booking System**. It verifies that the application can run 100% independently on any local desktop, server, or cloud platform (including VS Code) without requiring Google AI Studio.

---

## 1. Project Overview & Architecture
The Smart Journey Booking System is a full-stack, single-repository application:
- **Frontend**: React (v19) powered by Vite (v6) with Tailwind CSS (v4) for styling.
- **Backend**: Express (v4) Node.js custom server with a fully-integrated local database file.
- **Compiler**: Bundled using `esbuild` for production optimization & standard CJS output (`dist/server.cjs`).

---

## 2. Portability Audit Result

### 1. Required Environment Variables
To run locally, you can create a `.env` file at the root. The following variables are supported (though both are optional for offline startup):
- `APP_URL`: The domain or base url where the server is hosted (e.g., `http://localhost:3000`). Used for generating links if needed.
- `GEMINI_API_KEY`: Used if future custom AI modules or packages are active.

### 2. External Services Used
The application has zero hard external dependencies, making it ultra-portable:
- **Fonts**: Google Fonts (`Inter`, `Space Grotesk`, `JetBrains Mono`) are imported via CSS.
- **Images**: Default trip covers use standard Unsplash URLs.
- **Payment & Chats**: Purely client-interactive overlays and modals. The WeChat QR display is powered by `/public/images/wechat.png` or fallback vector svgs.

### 3. Is Data Stored Outside Project Files?
**No.** All user data, reservations, trips, schedule logs, and batch configurations are stored directly inside the filesystem within the workspace files.

### 4. Is a Cloud Database Required?
**No.** The application runs a lightweight disk-backed JSON transaction engine which reads and writes directly to local file `src/db.json`. There are no requirements for PostgreSQL, Cloud SQL, Firebase Firestore, or Supabase.

### 5. Is All Application Data Included in the Exported ZIP/Git?
**Yes.** Because `/src/db.json` is located inline in the `/src` folder, every booking made by customers, edit of quotas, or update of itineraries is instantly saved inside `src/db.json`. Therefore, a file ZIP export or GitHub push will include **100% of the database state**.

### 6. Critical Files & Backup Recommendations
The physical files storing all business info that must be backed up are:
1. `src/db.json` — **Critical Database**: Houses all schedules, custom trips, active batches, and customer bookings (contact details, flight numbers, WeChat/WhatsApp identifiers).
2. `public/images/wechat.png` — **Contact Assets**: The official QR code image used when clients click on "Pesan Manual" or "WeChat".
3. `.env` — **System Keys**: Keeps local custom ports or key configs if modified.

### 7. Hidden Platform Dependencies
**None.** The codebase uses standard NPM routines (`npm run dev`, `npm run build`, `npm start`) and is completely decoupled from any cloud runtimes.

---

## 3. Step-by-Step Restoration & Local Launch
Follow these exact instructions on any fresh computer to get up and running:

### Step A: Prerequisites
1. Download and install **Node.js LTS** (v18, v20, or v22 are recommended).
2. Verify installation in your terminal:
   ```bash
   node -v
   npm -v
   ```

### Step B: Unzip & Open
1. Extract the downloaded `project.zip` file containing this project.
2. Open the directory in your code editor (e.g., **VS Code**).
3. Open a terminal panel directly inside VS Code in the project root directory.

### Step C: Install Dependencies
Install all required libraries specified in `package.json`:
```bash
npm install
```

### Step D: Running Development Mode
Start the full-stack server (Vite middleware routes asset compilation on-the-fly, while Express serves API calls):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Step E: Running Production Build
Compiles frontend assets to static files inside `/dist` and bundles `server.ts` to `/dist/server.cjs`:
```bash
npm run build
npm start
```
The production system will be active at [http://localhost:3000](http://localhost:3000).
