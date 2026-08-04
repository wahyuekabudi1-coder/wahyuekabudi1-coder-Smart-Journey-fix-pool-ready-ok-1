import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ActivePage, Booking, Tour, AirportRoute, Airport, 
  TaxiMasterArea, TaxiMasterDestination, TaxiPricingRule, TaxiAreaRule, TaxiImportHistory,
  OperationalCity, RentalLocation, RentalVehicle, RentalCategory, RentalAddon, ZonePricing,
  Review
} from './types';
import { TOURS, REVIEWS } from './data';

interface AppContextProps {
  activePage: ActivePage;
  setPage: (page: ActivePage) => void;
  currency: 'USD' | 'IDR';
  setCurrency: (currency: 'USD' | 'IDR') => void;
  isPrivacyOpen: boolean;
  setPrivacyOpen: (open: boolean) => void;
  isTermsOpen: boolean;
  setTermsOpen: (open: boolean) => void;
  isComingSoonOpen: boolean;
  setComingSoonOpen: (open: boolean) => void;
  comingSoonService: 'tours' | 'airport' | 'taxi' | null;
  setComingSoonService: (service: 'tours' | 'airport' | 'taxi' | null) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'bookingDate' | 'status'>) => Booking;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Refunded', paymentStatus?: 'Unpaid' | 'Paid' | 'Pending') => void;
  formatPrice: (usdPrice: number, idrPrice: number) => string;
  tours: Tour[];
  addTour: (tour: Tour) => void;
  updateTour: (tour: Tour) => void;
  deleteTour: (id: string) => void;
  schedules: any[];
  addSchedule: (schedule: any) => void;
  updateSchedule: (schedule: any) => void;
  deleteSchedule: (id: string) => void;
  logs: any[];
  addLog: (message: string, type?: 'tour' | 'rental' | 'taxi' | 'airport' | 'system') => void;
  searchParams: {
    destination?: string;
    date?: string;
    guests?: number;
    tourType?: string;
    airport?: string;
    pickupLocation?: string;
    pickupTime?: string;
    returnDate?: string;
    vehicleType?: string;
    withDriver?: boolean;
  };
  setSearchParams: (params: any) => void;
  maxBookingsPerDay: number;
  setMaxBookingsPerDay: (limit: number) => void;
  airportRoutes: AirportRoute[];
  setAirportRoutes: React.Dispatch<React.SetStateAction<AirportRoute[]>>;
  airports: Airport[];
  setAirports: React.Dispatch<React.SetStateAction<Airport[]>>;
  taxiMasterAreas: TaxiMasterArea[];
  setTaxiMasterAreas: React.Dispatch<React.SetStateAction<TaxiMasterArea[]>>;
  taxiMasterDestinations: TaxiMasterDestination[];
  setTaxiMasterDestinations: React.Dispatch<React.SetStateAction<TaxiMasterDestination[]>>;
  taxiPricingRules: TaxiPricingRule[];
  setTaxiPricingRules: React.Dispatch<React.SetStateAction<TaxiPricingRule[]>>;
  taxiAreaRules: TaxiAreaRule[];
  setTaxiAreaRules: React.Dispatch<React.SetStateAction<TaxiAreaRule[]>>;
  taxiImportHistory: TaxiImportHistory[];
  setTaxiImportHistory: React.Dispatch<React.SetStateAction<TaxiImportHistory[]>>;
  rentalCities: OperationalCity[];
  setRentalCities: React.Dispatch<React.SetStateAction<OperationalCity[]>>;
  rentalLocations: RentalLocation[];
  setRentalLocations: React.Dispatch<React.SetStateAction<RentalLocation[]>>;
  rentalVehicles: RentalVehicle[];
  setRentalVehicles: React.Dispatch<React.SetStateAction<RentalVehicle[]>>;
  rentalCategories: RentalCategory[];
  setRentalCategories: React.Dispatch<React.SetStateAction<RentalCategory[]>>;
  rentalAddons: RentalAddon[];
  setRentalAddons: React.Dispatch<React.SetStateAction<RentalAddon[]>>;
  rentalZonePricing: ZonePricing[];
  setRentalZonePricing: React.Dispatch<React.SetStateAction<ZonePricing[]>>;
  serviceLimits: {
    tour: number;
    airport: number;
    taxi: number;
    rental: number;
  };
  setServiceLimit: (type: 'tour' | 'airport' | 'taxi' | 'rental', limit: number) => void;
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
  approveReview: (id: string) => void;
  rejectReview: (id: string) => void;
}


const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePageState] = useState<ActivePage>('home');
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD');
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isComingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonService, setComingSoonService] = useState<'tours' | 'airport' | 'taxi' | null>(null);
  const [maxBookingsPerDay, setMaxBookingsPerDayState] = useState<number>(() => {
    const stored = localStorage.getItem('smartjourney_max_bookings_per_day');
    return stored ? parseInt(stored, 10) : 5;
  });

  const setMaxBookingsPerDay = (limit: number) => {
    setMaxBookingsPerDayState(limit);
    localStorage.setItem('smartjourney_max_bookings_per_day', limit.toString());
  };

  const [serviceLimits, setServiceLimits] = useState<{
    tour: number;
    airport: number;
    taxi: number;
    rental: number;
  }>(() => {
    const stored = localStorage.getItem('smartjourney_service_limits');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          tour: parsed.tour ?? 5,
          airport: parsed.airport ?? 5,
          taxi: parsed.taxi ?? 5,
          rental: parsed.rental ?? 5,
        };
      } catch (e) {
        console.error('Failed to parse service limits', e);
      }
    }
    return {
      tour: 5,
      airport: 5,
      taxi: 5,
      rental: 5,
    };
  });

  const setServiceLimit = (type: 'tour' | 'airport' | 'taxi' | 'rental', limit: number) => {
    setServiceLimits(prev => {
      const updated = { ...prev, [type]: limit };
      localStorage.setItem('smartjourney_service_limits', JSON.stringify(updated));
      return updated;
    });
  };

  const [reviews, setReviews] = useState<Review[]>(() => {
    const stored = localStorage.getItem('smartjourney_reviews');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse reviews', e);
      }
    }
    return REVIEWS.map((r, i) => ({
      ...r,
      status: r.status || 'approved',
      serviceType: r.serviceType || (i % 4 === 0 ? 'tour' : i % 4 === 1 ? 'taxi' : i % 4 === 2 ? 'airport' : 'rental')
    }));
  });

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: formattedDate,
      status: 'pending'
    };
    setReviews(prev => {
      const updated = [newReview, ...prev];
      localStorage.setItem('smartjourney_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  const approveReview = (id: string) => {
    setReviews(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
      localStorage.setItem('smartjourney_reviews', JSON.stringify(updated));
      return updated;
    });
  };

  const rejectReview = (id: string) => {
    setReviews(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('smartjourney_reviews', JSON.stringify(updated));
      return updated;
    });
  };
  
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('smartjourney_bookings');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse bookings', e);
      }
    }
    const seedBookings: Booking[] = [
      {
        id: 'SJ-2026-9823',
        type: 'tour',
        serviceName: 'Mount Bromo Midnight Sunrise Tour',
        details: {
          date: '2026-07-15',
          guests: 2,
          vehicleName: 'Toyota Innova Reborn',
          pickupLocation: 'Surabaya Hotel'
        },
        totalPrice: 98,
        totalPriceIDR: 1500000,
        customerName: 'Alex Carter',
        customerEmail: 'alex.carter@gmail.com',
        customerPhone: '+61 412 345 678',
        bookingDate: '2026-07-05 20:15:00',
        status: 'Confirmed',
        paymentStatus: 'Unpaid'
      },
      {
        id: 'TX-2026-0012',
        type: 'taxi',
        serviceName: 'Taksi Servis (Juanda Airport ⇄ Malang City)',
        details: {
          date: '2026-07-13',
          time: '09:00',
          pickupLocation: 'Juanda International Airport (SUB), Terminal 1',
          destination: 'Malang City Center, East Java',
          vehicleName: 'Toyota Innova Reborn',
          guests: 4
        },
        totalPrice: 60,
        totalPriceIDR: 910000,
        customerName: 'Budi Hartono',
        customerEmail: 'budi.hartono@yahoo.com',
        customerPhone: '+62 812 3456 7890',
        bookingDate: '2026-07-11 10:30:00',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        id: 'TX-2026-0013',
        type: 'taxi',
        serviceName: 'Taksi Servis (Juanda Airport ⇄ Mount Bromo)',
        details: {
          date: '2026-07-14',
          time: '23:30',
          pickupLocation: 'Juanda International Airport (SUB), Terminal 2',
          destination: 'Cemoro Lawang, Mount Bromo',
          vehicleName: 'Toyota Avanza',
          guests: 3
        },
        totalPrice: 65,
        totalPriceIDR: 990000,
        customerName: 'Siti Aminah',
        customerEmail: 'siti.aminah@gmail.com',
        customerPhone: '+62 878 1234 5678',
        bookingDate: '2026-07-12 15:45:00',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      },
      {
        id: 'TX-2026-0014',
        type: 'taxi',
        serviceName: 'Taksi Servis (Malang City ⇄ Juanda Airport)',
        details: {
          date: '2026-07-15',
          time: '14:00',
          pickupLocation: 'Hotel Tugu Malang',
          destination: 'Juanda International Airport (SUB)',
          vehicleName: 'Toyota Alphard',
          guests: 2
        },
        totalPrice: 150,
        totalPriceIDR: 2280000,
        customerName: 'Melanie Tan',
        customerEmail: 'melanie.tan@outlook.com',
        customerPhone: '+65 9123 4567',
        bookingDate: '2026-07-13 11:20:00',
        status: 'Pending',
        paymentStatus: 'Pending'
      },
      {
        id: 'TX-2026-0015',
        type: 'taxi',
        serviceName: 'Taksi Servis (Yogyakarta Airport ⇄ Jogja Center)',
        details: {
          date: '2026-07-15',
          time: '08:15',
          pickupLocation: 'Yogyakarta International Airport (YIA)',
          destination: 'Malioboro City Hotel, Yogyakarta',
          vehicleName: 'Toyota Avanza',
          guests: 3
        },
        totalPrice: 40,
        totalPriceIDR: 600000,
        customerName: 'Robert Wilson',
        customerEmail: 'robert.wilson@domain.com',
        customerPhone: '+44 7123 456789',
        bookingDate: '2026-07-10 09:00:00',
        status: 'Completed',
        paymentStatus: 'Paid'
      },
      {
        id: 'TX-2026-0016',
        type: 'taxi',
        serviceName: 'Taksi Servis (Ngurah Rai Airport ⇄ Seminyak)',
        details: {
          date: '2026-07-20',
          time: '18:30',
          pickupLocation: 'Ngurah Rai International Airport (DPS), Bali',
          destination: 'The Seminyak Beach Resort & Spa, Bali',
          vehicleName: 'Toyota HiAce',
          guests: 8
        },
        totalPrice: 45,
        totalPriceIDR: 685000,
        customerName: 'Yuki Takahashi',
        customerEmail: 'yuki.t@gmail.com',
        customerPhone: '+81 90 1234 5678',
        bookingDate: '2026-07-12 16:15:00',
        status: 'Confirmed',
        paymentStatus: 'Paid'
      }
    ];
    localStorage.setItem('smartjourney_bookings', JSON.stringify(seedBookings));
    return seedBookings;
  });

  const [searchParams, setSearchParams] = useState<any>({});
  
  // Custom states for Admin Panel (Synchronized instantly for customer-facing live publication)
  const [tours, setTours] = useState<Tour[]>(() => {
    const stored = localStorage.getItem('smartjourney_tours');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse tours', e);
      }
    }
    localStorage.setItem('smartjourney_tours', JSON.stringify(TOURS));
    return TOURS;
  });

  const [schedules, setSchedules] = useState<any[]>(() => {
    const stored = localStorage.getItem('smartjourney_schedules');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse schedules', e);
      }
    }
    const defaultSchedules = [
      { id: 'sc-1', date: '2026-07-10', type: 'peak', surcharge: 20, note: 'Idul Adha Peak Holiday' },
      { id: 'sc-2', date: '2026-07-15', type: 'allocation', tourId: 'bromo', driver: 'Budi Santoso', vehicle: 'Innova Reborn (L 1289 AA)' },
      { id: 'sc-3', date: '2026-07-20', type: 'blocked', note: 'Kawah Ijen Closed for Monthly Conservation Maintenance' }
    ];
    localStorage.setItem('smartjourney_schedules', JSON.stringify(defaultSchedules));
    return defaultSchedules;
  });

  const [logs, setLogs] = useState<any[]>(() => {
    const stored = localStorage.getItem('smartjourney_logs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse logs', e);
      }
    }
    const defaultLogs = [
      { time: '2026-07-07 08:30', event: 'System initialized successfully' },
      { time: '2026-07-07 08:35', event: 'OTA API endpoints online' },
      { time: '2026-07-07 09:00', event: 'Synchronized pricing parameters with Bank Indonesia exchange rates' }
    ];
    localStorage.setItem('smartjourney_logs', JSON.stringify(defaultLogs));
    return defaultLogs;
  });

  const [airportRoutes, setAirportRoutes] = useState<AirportRoute[]>(() => {
    const saved = localStorage.getItem('sj_airport_routes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { id: 'ar-1', airport: 'SUB', city: 'Surabaya', priceUSD: 25, priceIDR: 380000, status: 'Published' },
      { id: 'ar-2', airport: 'DPS', city: 'Denpasar / Seminyak', priceUSD: 30, priceIDR: 450000, status: 'Published' },
      { id: 'ar-3', airport: 'YIA', city: 'Yogyakarta', priceUSD: 40, priceIDR: 600000, status: 'Published' },
      { id: 'ar-4', airport: 'CGK', city: 'Jakarta', priceUSD: 35, priceIDR: 530000, status: 'Published' },
      { id: 'ar-5', airport: 'SUB', city: 'Malang', priceUSD: 60, priceIDR: 910000, status: 'Published' },
      { id: 'ar-6', airport: 'SUB', city: 'Probolinggo (Bromo)', priceUSD: 60, priceIDR: 910000, status: 'Published' },
    ];
  });
  
  useEffect(() => {
    localStorage.setItem('sj_airport_routes', JSON.stringify(airportRoutes));
  }, [airportRoutes]);

  const [airports, setAirports] = useState<Airport[]>(() => {
    const saved = localStorage.getItem('sj_airports_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return [
      { code: 'DPS', name: 'Ngurah Rai International Airport (DPS - Bali)', description: 'Bandara Internasional utama Bali di Tuban, Kuta. Melayani rute pariwisata premium internasional & domestik.', status: 'Active', surchargeUSD: 5, surchargeIDR: 75000 },
      { code: 'SUB', name: 'Juanda International Airport (SUB - Surabaya)', description: 'Bandara Internasional Jawa Timur berlokasi di Sidoarjo, melayani rute bisnis & wisata regional.', status: 'Active', surchargeUSD: 3, surchargeIDR: 45000 },
      { code: 'YIA', name: 'Yogyakarta International Airport (YIA)', description: 'Bandara megah modern di Kulon Progo, melayani pariwisata Candi Borobudur, Prambanan dan DIY Yogyakarta.', status: 'Active', surchargeUSD: 4, surchargeIDR: 60000 },
      { code: 'CGK', name: 'Soekarno-Hatta International Airport (CGK - Jakarta)', description: 'Bandara Internasional metropolitan tersibuk di Indonesia berlokasi di Tangerang, gerbang utama ibukota Jakarta.', status: 'Active', surchargeUSD: 5, surchargeIDR: 75000 }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sj_airports_list', JSON.stringify(airports));
  }, [airports]);

  // Sync with URL hash

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.split('?')[0].replace('#/', '');
      const validPages: ActivePage[] = ['home', 'tours', 'airport', 'taxi', 'partnerships', 'contact', 'bookings', 'car-rental', 'about', 'midtrans-pay', 'admin'];
      if (validPages.includes(hash as ActivePage)) {
        setActivePageState(hash as ActivePage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '') {
        setActivePageState('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setPage = (page: ActivePage) => {
    setActivePageState(page);
    window.location.hash = `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addBooking = (bookingData: Omit<Booking, 'id' | 'bookingDate' | 'status'>): Booking => {
    const targetDate = bookingData.details?.date;
    if (targetDate) {
      const isBlocked = (schedules || []).some(s => s.date === targetDate && s.type === 'blocked');
      const confirmedCount = bookings.filter(b => 
        b.details && 
        b.details.date === targetDate && 
        b.type === bookingData.type &&
        (b.status === 'Confirmed' || b.status === 'Completed')
      ).length;
      
      if (isBlocked) {
        throw new Error('Maaf, tanggal ini telah ditutup oleh pihak operasional (Blackout Date).');
      }
      const currentLimit = serviceLimits[bookingData.type] ?? 5;
      if (confirmedCount >= currentLimit) {
        throw new Error(`Maaf, kuota pemesanan harian (${currentLimit} slot) untuk layanan ini pada tanggal ini telah penuh.`);
      }
    }

    const id = `SJ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const bookingDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newBooking: Booking = {
      ...bookingData,
      id,
      bookingDate,
      status: 'Confirmed', // Instantly confirm for premium customer delight!
      paymentStatus: 'Unpaid'
    };

    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('smartjourney_bookings', JSON.stringify(updated));
    addLog(`New booking ${id} received for ${bookingData.serviceName}`);
    return newBooking;
  };

  const updateBookingStatus = (
    id: string, 
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Refunded', 
    paymentStatus?: 'Unpaid' | 'Paid' | 'Pending'
  ) => {
    const updated = bookings.map(b => {
      if (b.id === id) {
        return { 
          ...b, 
          status, 
          paymentStatus: paymentStatus !== undefined ? paymentStatus : b.paymentStatus 
        };
      }
      return b;
    });
    setBookings(updated);
    localStorage.setItem('smartjourney_bookings', JSON.stringify(updated));
    addLog(`Booking ${id} status updated to ${status}${paymentStatus ? ` (${paymentStatus})` : ''}`);
  };

  // Tours actions
  const addTour = (tour: Tour) => {
    const updated = [tour, ...tours];
    setTours(updated);
    localStorage.setItem('smartjourney_tours', JSON.stringify(updated));
    addLog(`New trip package created: ${tour.name} (${tour.id})`);
  };

  const updateTour = (updatedTour: Tour) => {
    const updated = tours.map(t => t.id === updatedTour.id ? updatedTour : t);
    setTours(updated);
    localStorage.setItem('smartjourney_tours', JSON.stringify(updated));
    addLog(`Trip package ${updatedTour.id} updated details by admin`);
  };

  const deleteTour = (id: string) => {
    const updated = tours.filter(t => t.id !== id);
    setTours(updated);
    localStorage.setItem('smartjourney_tours', JSON.stringify(updated));
    addLog(`Trip package ${id} removed from the inventory`);
  };

  // Schedules
  const addSchedule = (schedule: any) => {
    const newSchedule = { ...schedule, id: `sc-${Date.now()}` };
    const updated = [newSchedule, ...schedules];
    setSchedules(updated);
    localStorage.setItem('smartjourney_schedules', JSON.stringify(updated));
    addLog(`Added schedule rule: ${schedule.type} on ${schedule.date}`);
  };

  const updateSchedule = (updatedSchedule: any) => {
    const updated = schedules.map(s => s.id === updatedSchedule.id ? updatedSchedule : s);
    setSchedules(updated);
    localStorage.setItem('smartjourney_schedules', JSON.stringify(updated));
    addLog(`Updated schedule rule ${updatedSchedule.id}`);
  };

  const deleteSchedule = (id: string) => {
    const updated = schedules.filter(s => s.id !== id);
    setSchedules(updated);
    localStorage.setItem('smartjourney_schedules', JSON.stringify(updated));
    addLog(`Deleted schedule rule ${id}`);
  };

  // Logs
  const addLog = (event: string, type?: 'tour' | 'rental' | 'taxi' | 'airport' | 'system') => {
    const now = new Date();
    const time = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Auto-detect type if not provided
    let detectedType = type;
    if (!detectedType) {
      const ev = event.toLowerCase();
      if (ev.includes('tour') || ev.includes('wisata') || ev.includes('bromo') || ev.includes('katalog')) {
        detectedType = 'tour';
      } else if (ev.includes('rental') || ev.includes('sewa') || ev.includes('mobil') || ev.includes('fleet') || ev.includes('chauffeur')) {
        detectedType = 'rental';
      } else if (ev.includes('taxi') || ev.includes('taksi') || ev.includes('rute')) {
        detectedType = 'taxi';
      } else if (ev.includes('airport') || ev.includes('bandara') || ev.includes('jemput')) {
        detectedType = 'airport';
      } else {
        detectedType = 'system';
      }
    }

    const newLog = { time, event, type: detectedType };
    setLogs(prev => {
      const updated = [newLog, ...prev].slice(0, 100); // keep last 100 logs
      localStorage.setItem('smartjourney_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const formatPrice = (usdPrice: number, idrPrice: number) => {
    if (currency === 'USD') {
      return `$${usdPrice}`;
    } else {
      // Format IDR smoothly (e.g. IDR 1.2M or full format)
      if (idrPrice >= 1000000) {
        return `IDR ${(idrPrice / 1000000).toFixed(1)}M`;
      }
      return `IDR ${idrPrice.toLocaleString('id-ID')}`;
    }
  };

  // --- TAXI DATABASE ENGINE (EXCEL-DRIVEN WORKFLOW) ---
  const [taxiMasterAreas, setTaxiMasterAreas] = useState<TaxiMasterArea[]>(() => {
    const saved = localStorage.getItem('sj_taxi_master_areas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: TaxiMasterArea[] = [
      { id: "A001", name: "Surabaya", code: "SUB", type: "City", lat: -7.2575, lon: 112.7521, status: "Active" },
      { id: "A002", name: "Malang", code: "MLG", type: "City", lat: -7.9653, lon: 112.6214, status: "Active" },
      { id: "A003", name: "Probolinggo (Bromo)", code: "BRO", type: "City", lat: -7.9425, lon: 112.9530, status: "Active" },
      { id: "A004", name: "Denpasar / Seminyak", code: "DPS-C", type: "City", lat: -8.6500, lon: 115.2167, status: "Active" },
      { id: "A005", name: "Yogyakarta", code: "YOG", type: "City", lat: -7.7956, lon: 110.3695, status: "Active" },
      { id: "A006", name: "Jakarta", code: "JKT", type: "City", lat: -6.2088, lon: 106.8456, status: "Active" },
      { id: "A007", name: "Juanda Airport (SUB)", code: "SUB", type: "Airport", lat: -7.3798, lon: 112.7874, status: "Active" },
      { id: "A008", name: "Ngurah Rai Airport (DPS)", code: "DPS", type: "Airport", lat: -8.7481, lon: 115.1674, status: "Active" },
      { id: "A009", name: "Soekarno-Hatta Airport (CGK)", code: "CGK", type: "Airport", lat: -6.1256, lon: 106.6559, status: "Active" },
      { id: "A010", name: "Yogyakarta Airport (YIA)", code: "YIA", type: "Airport", lat: -7.9001, lon: 110.0573, status: "Active" }
    ];
    localStorage.setItem('sj_taxi_master_areas', JSON.stringify(seed));
    return seed;
  });

  const [taxiMasterDestinations, setTaxiMasterDestinations] = useState<TaxiMasterDestination[]>(() => {
    const saved = localStorage.getItem('sj_taxi_master_destinations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: TaxiMasterDestination[] = [
      { id: "D001", area_id: "A001", name: "Tunjungan Plaza Area", lat: -7.2625, lon: 112.7381, status: "Active" },
      { id: "D002", area_id: "A002", name: "Stasiun Malang Kotabaru", lat: -7.9775, lon: 112.6375, status: "Active" },
      { id: "D003", area_id: "A003", name: "Cemoro Lawang (Mount Bromo)", lat: -7.9250, lon: 112.9600, status: "Active" },
      { id: "D004", area_id: "A004", name: "Kuta Beach Area", lat: -8.7214, lon: 115.1695, status: "Active" },
      { id: "D005", area_id: "A004", name: "Ubud Center Palace", lat: -8.5069, lon: 115.2625, status: "Active" },
      { id: "D006", area_id: "A005", name: "Yogyakarta City Center", lat: -7.7956, lon: 110.3695, status: "Active" },
      { id: "D007", area_id: "A006", name: "Central Jakarta City", lat: -6.2088, lon: 106.8456, status: "Active" }
    ];
    localStorage.setItem('sj_taxi_master_destinations', JSON.stringify(seed));
    return seed;
  });

  const [taxiPricingRules, setTaxiPricingRules] = useState<TaxiPricingRule[]>(() => {
    const saved = localStorage.getItem('sj_taxi_pricing_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const baseRules = [
      { id: "P001", source_id: "A007", destination_id: "A001", vehicle_type: "Standard", price_usd: 25, price_idr: 380000, status: "Active" },
      { id: "P002", source_id: "A008", destination_id: "A004", vehicle_type: "Standard", price_usd: 30, price_idr: 450000, status: "Active" },
      { id: "P003", source_id: "A010", destination_id: "A005", vehicle_type: "Standard", price_usd: 40, price_idr: 600000, status: "Active" },
      { id: "P004", source_id: "A009", destination_id: "A006", vehicle_type: "Standard", price_usd: 35, price_idr: 530000, status: "Active" },
      { id: "P005", source_id: "A007", destination_id: "A002", vehicle_type: "Standard", price_usd: 60, price_idr: 910000, status: "Active" },
      { id: "P006", source_id: "A007", destination_id: "A003", vehicle_type: "Standard", price_usd: 60, price_idr: 910000, status: "Active" }
    ];
    const seed: TaxiPricingRule[] = [];
    baseRules.forEach(rule => {
      seed.push({
        id: rule.id + "_S",
        source_id: rule.source_id,
        destination_id: rule.destination_id,
        vehicle_type: "Standard",
        price_usd: rule.price_usd,
        price_idr: rule.price_idr,
        status: "Active"
      });
      seed.push({
        id: rule.id + "_F",
        source_id: rule.source_id,
        destination_id: rule.destination_id,
        vehicle_type: "Family",
        price_usd: Math.round(rule.price_usd * 1.2),
        price_idr: Math.round(rule.price_idr * 1.2),
        status: "Active"
      });
      seed.push({
        id: rule.id + "_P",
        source_id: rule.source_id,
        destination_id: rule.destination_id,
        vehicle_type: "Premium",
        price_usd: Math.round(rule.price_usd * 1.5),
        price_idr: Math.round(rule.price_idr * 1.5),
        status: "Active"
      });
      seed.push({
        id: rule.id + "_V",
        source_id: rule.source_id,
        destination_id: rule.destination_id,
        vehicle_type: "Van",
        price_usd: Math.round(rule.price_usd * 1.8),
        price_idr: Math.round(rule.price_idr * 1.8),
        status: "Active"
      });
    });
    localStorage.setItem('sj_taxi_pricing_rules', JSON.stringify(seed));
    return seed;
  });

  const [taxiAreaRules, setTaxiAreaRules] = useState<TaxiAreaRule[]>(() => {
    const saved = localStorage.getItem('sj_taxi_area_rules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: TaxiAreaRule[] = [
      { id: "AR001", area_id: "A008", surcharge_usd: 5, surcharge_idr: 75000, is_blackout: false, note: "Ngurah Rai Airport Surcharge" },
      { id: "AR002", area_id: "A007", surcharge_usd: 3, surcharge_idr: 45000, is_blackout: false, note: "Juanda Airport Surcharge" }
    ];
    localStorage.setItem('sj_taxi_area_rules', JSON.stringify(seed));
    return seed;
  });

  const [taxiImportHistory, setTaxiImportHistory] = useState<TaxiImportHistory[]>(() => {
    const saved = localStorage.getItem('sj_taxi_import_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: TaxiImportHistory[] = [
      {
        id: "IMP-001",
        date: "2026-07-10 10:00",
        filename: "initial_sawah_jaya_seed.xlsx",
        importedBy: "System Autoloader",
        importedRows: 25,
        updatedRows: 0,
        skippedRows: 0,
        failedRows: 0,
        status: "Success",
        log: ["Master Area: 10 loaded successfully", "Master Destination: 7 loaded successfully", "Pricing Rules: 24 loaded successfully", "Area Rules: 2 loaded successfully"]
      }
    ];
    localStorage.setItem('sj_taxi_import_history', JSON.stringify(seed));
    return seed;
  });

  // --- CAR RENTAL MANAGEMENT STATES ---
  const [rentalCities, setRentalCities] = useState<OperationalCity[]>(() => {
    const saved = localStorage.getItem('sj_rental_cities');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: OperationalCity[] = [
      { id: "city-malang", name: "Malang", status: "Active", displayOrder: 1 },
      { id: "city-bali", name: "Bali", status: "Active", displayOrder: 2 }
    ];
    localStorage.setItem('sj_rental_cities', JSON.stringify(seed));
    return seed;
  });

  const [rentalLocations, setRentalLocations] = useState<RentalLocation[]>(() => {
    const saved = localStorage.getItem('sj_rental_locations');
    const seed: RentalLocation[] = [
      // Malang Service Areas - Zona Nol (Kota Malang & 5 Kecamatan)
      { id: "loc-mlg-klojen", cityId: "city-malang", name: "Kecamatan Klojen (Kota Malang - Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 1 },
      { id: "loc-mlg-blimbing", cityId: "city-malang", name: "Kecamatan Blimbing (Kota Malang - Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 2 },
      { id: "loc-mlg-lowokwaru", cityId: "city-malang", name: "Kecamatan Lowokwaru (Kota Malang - Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 3 },
      { id: "loc-mlg-sukun", cityId: "city-malang", name: "Kecamatan Sukun (Kota Malang - Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 4 },
      { id: "loc-mlg-kedungkandang", cityId: "city-malang", name: "Kecamatan Kedungkandang (Kota Malang - Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 5 },
      { id: "loc-mlg-1", cityId: "city-malang", name: "Stasiun Malang (Kota Malang - Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 6 },
      { id: "loc-mlg-2", cityId: "city-malang", name: "Bandara Abdul Rachman Saleh (Kota Malang - Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 7 },
      { id: "loc-mlg-3", cityId: "city-malang", name: "Alun-Alun Kota Malang (Zona Nol)", zone: "Zone 0", status: "Active", displayOrder: 8 },
      
      // Malang Service Areas - Zona Satu (Kabupaten Malang & Kota Batu)
      { id: "loc-mlg-batu", cityId: "city-malang", name: "Kota Batu (Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 9 },
      { id: "loc-mlg-singosari", cityId: "city-malang", name: "Kecamatan Singosari (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 10 },
      { id: "loc-mlg-karangploso", cityId: "city-malang", name: "Kecamatan Karangploso (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 11 },
      { id: "loc-mlg-dau", cityId: "city-malang", name: "Kecamatan Dau (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 12 },
      { id: "loc-mlg-kepanjen", cityId: "city-malang", name: "Kecamatan Kepanjen (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 13 },
      { id: "loc-mlg-pakisaji", cityId: "city-malang", name: "Kecamatan Pakisaji (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 14 },
      { id: "loc-mlg-wagir", cityId: "city-malang", name: "Kecamatan Wagir (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 15 },
      { id: "loc-mlg-bululawang", cityId: "city-malang", name: "Kecamatan Bululawang (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 16 },
      { id: "loc-mlg-gondanglegi", cityId: "city-malang", name: "Kecamatan Gondanglegi (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 17 },
      { id: "loc-mlg-turen", cityId: "city-malang", name: "Kecamatan Turen (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 18 },
      { id: "loc-mlg-pakis", cityId: "city-malang", name: "Kecamatan Pakis (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 19 },
      { id: "loc-mlg-tumpang", cityId: "city-malang", name: "Kecamatan Tumpang (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 20 },
      { id: "loc-mlg-lawang", cityId: "city-malang", name: "Kecamatan Lawang (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 21 },
      { id: "loc-mlg-pujon", cityId: "city-malang", name: "Kecamatan Pujon (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 22 },
      { id: "loc-mlg-ngantang", cityId: "city-malang", name: "Kecamatan Ngantang (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 23 },
      { id: "loc-mlg-kasembon", cityId: "city-malang", name: "Kecamatan Kasembon (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 24 },
      { id: "loc-mlg-tajinan", cityId: "city-malang", name: "Kecamatan Tajinan (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 25 },
      { id: "loc-mlg-wajak", cityId: "city-malang", name: "Kecamatan Wajak (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 26 },
      { id: "loc-mlg-poncokusumo", cityId: "city-malang", name: "Kecamatan Poncokusumo (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 27 },
      { id: "loc-mlg-jabung", cityId: "city-malang", name: "Kecamatan Jabung (Kabupaten Malang - Zona Satu)", zone: "Zone 1", status: "Active", displayOrder: 28 },

      // Malang Service Areas - Zona Dua (Luar Kota & Kabupaten Tetangga)
      { id: "loc-mlg-lumajang-reg", cityId: "city-malang", name: "Kabupaten Lumajang (Zona Dua)", zone: "Zone 2", status: "Active", displayOrder: 29 },
      { id: "loc-mlg-kediri-reg", cityId: "city-malang", name: "Kabupaten Kediri (Zona Dua)", zone: "Zone 2", status: "Active", displayOrder: 30 },
      { id: "loc-mlg-blitar-reg", cityId: "city-malang", name: "Kabupaten Blitar (Zona Dua)", zone: "Zone 2", status: "Active", displayOrder: 31 },
      { id: "loc-mlg-probolinggo-reg", cityId: "city-malang", name: "Kabupaten Probolinggo (Zona Dua)", zone: "Zone 2", status: "Active", displayOrder: 32 },
      { id: "loc-mlg-pasuruan-reg", cityId: "city-malang", name: "Kabupaten Pasuruan (Zona Dua)", zone: "Zone 2", status: "Active", displayOrder: 33 },
      { id: "loc-mlg-bromo", cityId: "city-malang", name: "Gunung Bromo (Zona Dua)", zone: "Zone 2", status: "Active", displayOrder: 34 },
      { id: "loc-mlg-tumpaksewu", cityId: "city-malang", name: "Air Terjun Tumpak Sewu (Zona Dua)", zone: "Zone 2", status: "Active", displayOrder: 35 },

      // Bali Service Areas
      { id: "loc-bali-1", cityId: "city-bali", name: "Ngurah Rai International Airport (DPS)", zone: "Zone 0", status: "Active", displayOrder: 36 },
      { id: "loc-bali-2", cityId: "city-bali", name: "Kuta / Legian Hotel Area", zone: "Zone 0", status: "Active", displayOrder: 37 },
      { id: "loc-bali-3", cityId: "city-bali", name: "Seminyak Luxury Villa Area", zone: "Zone 0", status: "Active", displayOrder: 38 },
      { id: "loc-bali-4", cityId: "city-bali", name: "Sanur Beach & Ferry Harbor", zone: "Zone 0", status: "Active", displayOrder: 39 },
      { id: "loc-bali-5", cityId: "city-bali", name: "Nusa Dua Resort Complex", zone: "Zone 0", status: "Active", displayOrder: 40 },
      { id: "loc-bali-6", cityId: "city-bali", name: "Ubud Sacred Monkey Forest / Center", zone: "Zone 1", status: "Active", displayOrder: 41 },
      { id: "loc-bali-7", cityId: "city-bali", name: "Tanah Lot Sea Temple", zone: "Zone 1", status: "Active", displayOrder: 42 },
      { id: "loc-bali-8", cityId: "city-bali", name: "Uluwatu Cliff Temple Area", zone: "Zone 1", status: "Active", displayOrder: 43 },
      { id: "loc-bali-9", cityId: "city-bali", name: "Kintamani Mount Batur View Area", zone: "Zone 2", status: "Active", displayOrder: 44 },
      { id: "loc-bali-10", cityId: "city-bali", name: "Lovina Beach (North Bali / Dolphin Tour)", zone: "Zone 2", status: "Active", displayOrder: 45 }
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && 'zone' in parsed[0]) {
          const hasKediri = parsed.some((l: any) => l.id === 'loc-mlg-kediri-reg');
          if (hasKediri) {
            return parsed;
          }
        }
      } catch (e) {}
    }

    localStorage.setItem('sj_rental_locations', JSON.stringify(seed));
    return seed;
  });

  const [rentalCategories, setRentalCategories] = useState<RentalCategory[]>(() => {
    const saved = localStorage.getItem('sj_rental_categories_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: RentalCategory[] = [
      {
        id: "cat-city",
        name: "City Car",
        description: "Compact and agile, perfect for city tours and narrow streets.",
        displayOrder: 1,
        status: "Active",
        priceZone0USD: 12,
        priceZone0IDR: 175000,
        priceZone1USD: 17,
        priceZone1IDR: 250000,
        priceZone2USD: 24,
        priceZone2IDR: 350000
      },
      {
        id: "cat-std",
        name: "MPV Standard",
        description: "Economical and comfortable standard family vehicles.",
        displayOrder: 2,
        status: "Active",
        priceZone0USD: 17,
        priceZone0IDR: 255000,
        priceZone1USD: 25,
        priceZone1IDR: 375000,
        priceZone2USD: 34,
        priceZone2IDR: 500000
      },
      {
        id: "cat-prm",
        name: "Premium MPV",
        description: "High-end corporate sedans and executive family MPVs.",
        displayOrder: 3,
        status: "Active",
        priceZone0USD: 34,
        priceZone0IDR: 500000,
        priceZone1USD: 47,
        priceZone1IDR: 700000,
        priceZone2USD: 64,
        priceZone2IDR: 950000
      },
      {
        id: "cat-lux",
        name: "Luxury",
        description: "Premium ultra-luxury fleet for VIP executives and guests.",
        displayOrder: 4,
        status: "Active",
        priceZone0USD: 120,
        priceZone0IDR: 1800000,
        priceZone1USD: 160,
        priceZone1IDR: 2400000,
        priceZone2USD: 215,
        priceZone2IDR: 3200000
      },
      {
        id: "cat-hiace",
        name: "HiAce",
        description: "Spacious passenger transporters for large groups.",
        displayOrder: 5,
        status: "Active",
        priceZone0USD: 100,
        priceZone0IDR: 1500000,
        priceZone1USD: 135,
        priceZone1IDR: 2000000,
        priceZone2USD: 180,
        priceZone2IDR: 2700000
      },
      {
        id: "cat-elf",
        name: "Elf",
        description: "Reliable medium-sized tourist coaches.",
        displayOrder: 6,
        status: "Active",
        priceZone0USD: 68,
        priceZone0IDR: 1000000,
        priceZone1USD: 94,
        priceZone1IDR: 1400000,
        priceZone2USD: 120,
        priceZone2IDR: 1800000
      },
      {
        id: "cat-bus",
        name: "Bus",
        description: "Large capacity premium coaches for travel groups.",
        displayOrder: 7,
        status: "Active",
        priceZone0USD: 170,
        priceZone0IDR: 2500000,
        priceZone1USD: 235,
        priceZone1IDR: 3500000,
        priceZone2USD: 300,
        priceZone2IDR: 4500000
      }
    ];
    localStorage.setItem('sj_rental_categories_v3', JSON.stringify(seed));
    return seed;
  });

  const [rentalVehicles, setRentalVehicles] = useState<RentalVehicle[]>(() => {
    const saved = localStorage.getItem('sj_rental_vehicles_v3');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: RentalVehicle[] = [
      {
        id: "sigra",
        name: "Toyota Sigra",
        categoryId: "cat-city",
        cityId: "city-malang",
        passengers: 4,
        luggage: 1,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        description: "An economical, nimble city hatchback. Ideal for quick transfers or running errands around local areas with superb fuel savings.",
        features: ["Ultra Compact", "Air Conditioning", "Great maneuverability"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "avanza",
        name: "Toyota Avanza",
        categoryId: "cat-std",
        cityId: "city-malang",
        passengers: 5,
        luggage: 2,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        description: "The absolute classic Indonesian family car. Compact yet highly functional, economical, and perfectly sized for urban streets or winding mountain roads.",
        features: ["Comfortable seating", "Dual SRS Airbags", "Bluetooth Audio System", "Excellent fuel efficiency"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "xenia",
        name: "Toyota Xenia",
        categoryId: "cat-std",
        cityId: "city-malang",
        passengers: 5,
        luggage: 2,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        description: "Comfortable and spacious family vehicle, perfect for daily commuting or tourist explorations.",
        features: ["Comfortable seats", "Stereo System", "AC blower"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "rush",
        name: "Toyota Rush",
        categoryId: "cat-std",
        cityId: "city-malang",
        passengers: 5,
        luggage: 2,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        description: "Compact SUV perfect for exploring scenic terrains with style and power.",
        features: ["High ground clearance", "Airbags", "Modern dash console"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "innova",
        name: "Toyota Innova Reborn",
        categoryId: "cat-prm",
        cityId: "city-malang",
        passengers: 7,
        luggage: 4,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
        description: "Highly preferred for corporate business, long family trips, and executive airport transfers. Offers superior cabin insulation, plush seats, and high safety standards.",
        features: ["Plush Captain Seats", "Ambience Light Control", "Triple Zone Climate Control", "Extra Luggage Capacity"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "hiace-commuter",
        name: "Toyota Hiace Commuter",
        categoryId: "cat-hiace",
        cityId: "city-malang",
        passengers: 15,
        luggage: 6,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
        description: "Perfect for mid-sized travel groups, corporate outings, and extended family gatherings. Sturdy, comfortable, and reliable.",
        features: ["15 Ergonomic Passenger Seats", "High Ceiling Air Venting", "Underseat luggage space", "Reclining mechanism"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "hiace-premio",
        name: "Toyota Hiace Premio",
        categoryId: "cat-hiace",
        cityId: "city-malang",
        passengers: 11,
        luggage: 8,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        description: "The pinnacle of luxury group transportation in Indonesia. Generous legroom, premium semi-leather individual seats, and advanced suspension for an ultra-smooth journey.",
        features: ["11 Premium Semi-Leather Seats", "USB ports for every passenger", "Luxury cabin acoustic damping", "VSC & Hill Start Assist"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "avanza-bali",
        name: "Toyota Avanza (Bali)",
        categoryId: "cat-std",
        cityId: "city-bali",
        passengers: 5,
        luggage: 2,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80",
        description: "Compact yet highly functional, economical, and perfectly sized for Bali roads.",
        features: ["Comfortable seating", "Excellent fuel efficiency", "Perfect for Bali beach routes"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "innova-bali",
        name: "Toyota Innova Reborn (Bali)",
        categoryId: "cat-prm",
        cityId: "city-bali",
        passengers: 7,
        luggage: 4,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80",
        description: "Preferred executive family ride with captain seats and climate control.",
        features: ["Captain Seats", "Ambience Light", "Powerful diesel performance"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "hiace-commuter-bali",
        name: "Toyota Hiace Commuter (Bali)",
        categoryId: "cat-hiace",
        cityId: "city-bali",
        passengers: 15,
        luggage: 6,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
        description: "Perfect for mid-sized tourist groups in Bali.",
        features: ["15 Seats", "High Ceiling", "AC Vents for all seats"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      },
      {
        id: "hiace-premio-bali",
        name: "Toyota Hiace Premio (Bali)",
        categoryId: "cat-hiace",
        cityId: "city-bali",
        passengers: 11,
        luggage: 8,
        hasAC: true,
        image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
        description: "Luxury group transport van for upscale tourists.",
        features: ["Premium Semi-Leather Seats", "USB chargers", "Luxury cabin damping"],
        status: "Active",
        supportedZones: ["Zone 0", "Zone 1", "Zone 2"]
      }
    ];
    localStorage.setItem('sj_rental_vehicles_v3', JSON.stringify(seed));
    return seed;
  });

  const [rentalAddons, setRentalAddons] = useState<RentalAddon[]>(() => {
    const saved = localStorage.getItem('sj_rental_addons');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const seed: RentalAddon[] = [
      { id: "fuel", name: "All-Route Fuel Package (Bahan Bakar)", description: "Bypass refueling on tour. Full tank of fuel included for your entire travel route.", priceUSD: 15, priceIDR: 220000, pricingType: "Per Day", status: "Active", displayOrder: 1, applicableCategories: ["all"], isRequired: false },
      { id: "driver_meal", name: "Chauffeur Meal Allowance (Uang Makan Sopir)", description: "Provide a direct daily meal allowance for your dedicated professional driver.", priceUSD: 5, priceIDR: 75000, pricingType: "Per Day", status: "Active", displayOrder: 2, applicableCategories: ["all"], isRequired: false },
      { id: "parking", name: "Parking Fee Coverage (Biaya Parkir)", description: "Covers all public, tourist spot, hotel, and airport parking tickets.", priceUSD: 4, priceIDR: 60000, pricingType: "Fixed", status: "Active", displayOrder: 3, applicableCategories: ["all"], isRequired: false },
      { id: "tolls", name: "Highway Toll Road Pass (Biaya Tol)", description: "Unlimited express toll road usage for much faster and smoother overland travel.", priceUSD: 8, priceIDR: 120000, pricingType: "Fixed", status: "Active", displayOrder: 4, applicableCategories: ["all"], isRequired: false }
    ];
    localStorage.setItem('sj_rental_addons', JSON.stringify(seed));
    return seed;
  });

  const [rentalZonePricing, setRentalZonePricing] = useState<ZonePricing[]>(() => {
    const saved = localStorage.getItem('sj_rental_zone_pricing');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0 && parsed.some((p: any) => p.pickupZoneCode === 'Zone 0')) {
          return parsed;
        }
      } catch (e) {}
    }
    const seed: ZonePricing[] = [
      { id: "zp-mlg-1", cityId: "city-malang", pickupZoneCode: "Zone 0", dropoffZoneCode: "Zone 0", priceUSD: 0, priceIDR: 0, status: "Active" },
      { id: "zp-mlg-2", cityId: "city-malang", pickupZoneCode: "Zone 0", dropoffZoneCode: "Zone 1", priceUSD: 15, priceIDR: 225000, status: "Active" },
      { id: "zp-mlg-3", cityId: "city-malang", pickupZoneCode: "Zone 0", dropoffZoneCode: "Zone 2", priceUSD: 30, priceIDR: 450000, status: "Active" },
      { id: "zp-mlg-4", cityId: "city-malang", pickupZoneCode: "Zone 1", dropoffZoneCode: "Zone 1", priceUSD: 15, priceIDR: 225000, status: "Active" },
      { id: "zp-mlg-5", cityId: "city-malang", pickupZoneCode: "Zone 1", dropoffZoneCode: "Zone 2", priceUSD: 30, priceIDR: 450000, status: "Active" },
      { id: "zp-mlg-6", cityId: "city-malang", pickupZoneCode: "Zone 2", dropoffZoneCode: "Zone 2", priceUSD: 30, priceIDR: 450000, status: "Active" },
      { id: "zp-bali-1", cityId: "city-bali", pickupZoneCode: "Zone 0", dropoffZoneCode: "Zone 0", priceUSD: 0, priceIDR: 0, status: "Active" },
      { id: "zp-bali-2", cityId: "city-bali", pickupZoneCode: "Zone 0", dropoffZoneCode: "Zone 1", priceUSD: 10, priceIDR: 150000, status: "Active" },
      { id: "zp-bali-3", cityId: "city-bali", pickupZoneCode: "Zone 0", dropoffZoneCode: "Zone 2", priceUSD: 25, priceIDR: 375000, status: "Active" },
      { id: "zp-bali-4", cityId: "city-bali", pickupZoneCode: "Zone 1", dropoffZoneCode: "Zone 1", priceUSD: 15, priceIDR: 225000, status: "Active" },
      { id: "zp-bali-5", cityId: "city-bali", pickupZoneCode: "Zone 1", dropoffZoneCode: "Zone 2", priceUSD: 25, priceIDR: 375000, status: "Active" },
      { id: "zp-bali-6", cityId: "city-bali", pickupZoneCode: "Zone 2", dropoffZoneCode: "Zone 2", priceUSD: 35, priceIDR: 525000, status: "Active" }
    ];
    localStorage.setItem('sj_rental_zone_pricing', JSON.stringify(seed));
    return seed;
  });

  useEffect(() => {
    localStorage.setItem('sj_rental_cities', JSON.stringify(rentalCities));
  }, [rentalCities]);

  useEffect(() => {
    localStorage.setItem('sj_rental_locations', JSON.stringify(rentalLocations));
  }, [rentalLocations]);

  useEffect(() => {
    localStorage.setItem('sj_rental_categories_v3', JSON.stringify(rentalCategories));
  }, [rentalCategories]);

  useEffect(() => {
    localStorage.setItem('sj_rental_vehicles_v3', JSON.stringify(rentalVehicles));
  }, [rentalVehicles]);

  useEffect(() => {
    localStorage.setItem('sj_rental_addons', JSON.stringify(rentalAddons));
  }, [rentalAddons]);

  useEffect(() => {
    localStorage.setItem('sj_rental_zone_pricing', JSON.stringify(rentalZonePricing));
  }, [rentalZonePricing]);

  useEffect(() => {
    localStorage.setItem('sj_taxi_master_areas', JSON.stringify(taxiMasterAreas));
  }, [taxiMasterAreas]);

  useEffect(() => {
    localStorage.setItem('sj_taxi_master_destinations', JSON.stringify(taxiMasterDestinations));
  }, [taxiMasterDestinations]);

  useEffect(() => {
    localStorage.setItem('sj_taxi_pricing_rules', JSON.stringify(taxiPricingRules));
  }, [taxiPricingRules]);

  useEffect(() => {
    localStorage.setItem('sj_taxi_area_rules', JSON.stringify(taxiAreaRules));
  }, [taxiAreaRules]);

  useEffect(() => {
    localStorage.setItem('sj_taxi_import_history', JSON.stringify(taxiImportHistory));
  }, [taxiImportHistory]);

  return (
    <AppContext.Provider
      value={{
        activePage,
        setPage,
        currency,
        setCurrency,
        isPrivacyOpen,
        setPrivacyOpen,
        isTermsOpen,
        setTermsOpen,
        isComingSoonOpen,
        setComingSoonOpen,
        comingSoonService,
        setComingSoonService,
        bookings,
        addBooking,
        updateBookingStatus,
        formatPrice,
        tours,
        addTour,
        updateTour,
        deleteTour,
        schedules,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        logs,
        addLog,
        searchParams,
        setSearchParams,
        maxBookingsPerDay,
        setMaxBookingsPerDay,
        airportRoutes,
        setAirportRoutes,
        airports,
        setAirports,
        taxiMasterAreas,
        setTaxiMasterAreas,
        taxiMasterDestinations,
        setTaxiMasterDestinations,
        taxiPricingRules,
        setTaxiPricingRules,
        taxiAreaRules,
        setTaxiAreaRules,
        taxiImportHistory,
        setTaxiImportHistory,
        rentalCities,
        setRentalCities,
        rentalLocations,
        setRentalLocations,
        rentalVehicles,
        setRentalVehicles,
        rentalCategories,
        setRentalCategories,
        rentalAddons,
        setRentalAddons,
        rentalZonePricing,
        setRentalZonePricing,
        serviceLimits,
        setServiceLimit,
        reviews,
        setReviews,
        addReview,
        approveReview,
        rejectReview
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
