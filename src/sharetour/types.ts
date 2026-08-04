export interface TimeSchedule {
  time: string;
  activity: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  timeSchedules: TimeSchedule[];
  activity?: string; // backward compatibility
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  description: string;
  coverImage: string;
  included: string[];
  excluded: string[];
  itinerary: ItineraryItem[];
  startingPrice: number;
  highlight?: string;
  faq?: FAQItem[];
  gallery?: string[];
  whatsToBring?: string[];
  status?: "draft" | "published";
  price?: number;
}

export interface Batch {
  id: string;
  tripId: string;
  departureDate: string; // e.g., "2026-07-15"
  quota: number;
  availableSeats: number;
  price: number;
  status: 'Open' | 'Closed';
}

export type BookingStatus = 'Pending' | 'Confirmed' | 'Rejected';

export interface ParticipantData {
  name: string;
  englishName: string;
  weChatId: string;
  xiaoHongShuId: string;
  city: string;
  whatsapp?: string;
  email: string;
  flightNumber?: string;
}

export interface Booking {
  id: string;
  bookingCode: string;
  tripId: string;
  tripTitle?: string;
  batchId: string;
  departureDate?: string;
  fullName: string;
  email: string;
  phone: string;
  participantsCount: number;
  participantsNames: string[];
  proofOfPayment: string; // base64 or file name / "NOT_APPLICABLE_PREVIEW"
  status: BookingStatus;
  rejectReason?: string;
  totalPrice: number;
  createdAt: string;
  participantData?: ParticipantData;
  adminNotes?: string;
}

export interface DatabaseState {
  trips: Trip[];
  batches: Batch[];
  bookings: Booking[];
}

