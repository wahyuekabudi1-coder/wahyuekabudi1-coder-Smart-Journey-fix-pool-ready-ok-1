import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { TOURS, FAQS } from '../data';
import { Clock, Star, MapPin, Calendar, Users, Sparkles, HelpCircle, ChevronDown, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import TourDetailView from './TourDetailView';
import { motion, AnimatePresence } from 'motion/react';
import ComingSoonPage from '../components/ComingSoonPage';

export const DURATION_FILTERS = [
  { id: 'all', label: 'Semua Durasi', days: null },
  { id: '1d', label: '1D', days: 1 },
  { id: '2d', label: '2D1N', days: 2 },
  { id: '3d', label: '3D2N', days: 3 },
  { id: '4d', label: '4D3N', days: 4 },
  { id: '5d', label: '5D4N', days: 5 },
  { id: '8d', label: '8D7N', days: 8 }
];

export default function ToursView() {
  const { formatPrice, searchParams, setSearchParams, tours } = useApp();

  if (searchParams?.selectedTourId) {
    return (
      <TourDetailView
        tourId={searchParams.selectedTourId}
        onBack={() => setSearchParams({ ...searchParams, selectedTourId: undefined })}
      />
    );
  }

  const [selectedDurationPreset, setSelectedDurationPreset] = useState<string>('all'); // 'all', '1d', '2d', '3d', '4d', '5d', '6d', '7d', '8d'
  const [expandedTourId, setExpandedTourId] = useState<string | null>('bromo'); // Expand first tour by default
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0); // Expand first FAQ

  useEffect(() => {
    if (searchParams?.selectedTourId) {
      const tourId = searchParams.selectedTourId;
      setExpandedTourId(tourId);
      
      const timer = setTimeout(() => {
        const element = document.getElementById(`tour-card-${tourId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [searchParams?.selectedTourId]);

  // Search Widget state inside Tours view
  const [searchDestination, setSearchDestination] = useState('bromo');
  const [searchDate, setSearchDate] = useState('');
  const [searchGuests, setSearchGuests] = useState(2);

  // Booking details
  const [bookingTour, setBookingTour] = useState<any>(null);

  // Extract number of days helper
  const getTourDaysNum = (durationStr: string): number => {
    const match = durationStr.match(/^(\d+)\s*Day/i);
    return match ? parseInt(match[1], 10) : 1;
  };

  const filteredTours = tours.filter(t => {
    const days = getTourDaysNum(t.duration);
    
    let matchesDuration = true;
    if (selectedDurationPreset !== 'all') {
      const filterObj = DURATION_FILTERS.find(f => f.id === selectedDurationPreset);
      if (filterObj && filterObj.days !== null) {
        matchesDuration = days === filterObj.days;
      }
    }
    
    return matchesDuration;
  });

  const handleBookTour = (tour: any) => {
    setBookingTour({
      tour,
      details: {
        date: searchDate || '2026-07-12',
        guests: Number(searchGuests),
        tourId: tour.id,
        pickupLocation: 'Hotel Lobby / Airport Arrival'
      }
    });
  };

  return (
    <div id="tours-view" className="bg-white text-neutral-800 min-h-screen pt-28 md:pt-32 lg:pt-36 pb-16 md:pb-24">
      
      {/* Hero Banner */}
      <section className="relative h-[40vh] min-h-[280px] flex items-center justify-center mb-16 rounded-[32px] overflow-hidden max-w-7xl mx-4 sm:mx-6 lg:mx-8 xl:mx-auto shadow-md">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1920&q=80"
            alt="East Java Waterfalls"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/85 via-neutral-900/40 to-black/60" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 space-y-4">
          <span className="inline-flex items-center space-x-1.5 bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-300 font-mono uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Curated Guided Expeditions</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Our Premium Tours &amp; Safaris
          </h1>
          <p className="text-xs sm:text-base text-neutral-200 max-w-xl mx-auto leading-relaxed font-medium">
            All-inclusive private and shared tours designed to let you experience the magic of East Java with zero planning stress.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        
        {/* TOURS BROWSER */}
        <section className="space-y-12">
          
          {/* Simple Duration Filter Bar */}
          <div className="bg-neutral-50 border border-neutral-200/80 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-lg text-neutral-900 tracking-tight font-sans">
                  Saring Berdasarkan Durasi Tour
                </h3>
                <p className="text-xs text-neutral-500">
                  Temukan paket perjalanan Jawa Timur terbaik sesuai dengan ketersediaan waktu Anda.
                </p>
              </div>
              
              {selectedDurationPreset !== 'all' && (
                <button
                  onClick={() => setSelectedDurationPreset('all')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 px-4 py-2 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
                >
                  Tampilkan Semua Durasi
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
              {DURATION_FILTERS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedDurationPreset(preset.id)}
                  className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all text-center border flex items-center justify-center cursor-pointer ${
                    selectedDurationPreset === preset.id
                      ? 'bg-amber-500 text-neutral-950 border-amber-500 shadow-md shadow-amber-500/10 font-extrabold'
                      : 'bg-white border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Catalog grid */}
          {filteredTours.length === 0 ? (
            <div className="text-center py-20 px-4 bg-neutral-50 rounded-3xl border border-neutral-200/60 max-w-lg mx-auto space-y-4">
              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-full inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search-x"><path d="m13.5 8.5-5 5"/><path d="m8.5 8.5 5 5"/><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-800">Tidak Ada Paket Tour yang Cocok</h3>
              <p className="text-xs text-neutral-500 leading-relaxed max-w-sm mx-auto">
                Maaf, tidak ada paket tour dengan durasi "{DURATION_FILTERS.find(f => f.id === selectedDurationPreset)?.label}". Silakan pilih durasi lain atau reset filter Anda.
              </p>
              <button
                onClick={() => {
                  setSelectedDurationPreset('all');
                }}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Atur Ulang Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  id={`tour-card-${tour.id}`}
                  onClick={() => setSearchParams({ ...searchParams, selectedTourId: tour.id })}
                  className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-300/85 transition-all flex flex-col justify-between group cursor-pointer"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden shrink-0">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info and Actions */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-600 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-amber-500" />
                          <span>East Java</span>
                        </span>
                        <span className="flex items-center gap-1 text-xs text-neutral-500">
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                          <span className="font-bold text-neutral-800">{tour.rating}</span>
                        </span>
                      </div>
                      <h4 className="font-extrabold text-lg text-neutral-900 leading-tight mb-2 group-hover:text-amber-600 transition-colors">
                        {tour.name}
                      </h4>
                      <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                        {tour.description}
                      </p>
                      <div className="flex items-center space-x-4 mb-4 text-xs text-neutral-500 border-b border-neutral-100 pb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4 text-amber-500" />
                          <span>{tour.duration}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span>Permits Included</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div>
                        <span className="text-[10px] text-neutral-400 block uppercase font-mono">From</span>
                        <span className="text-xl font-black text-amber-600">
                          {formatPrice(tour.startingPrice, tour.startingPriceIDR)}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-medium"> / pax</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookTour(tour);
                        }}
                        className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1 shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] cursor-pointer"
                      >
                        <span>Book Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* FAQ ACCORDION */}
        <section className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 md:p-12 space-y-8">
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex p-3 bg-amber-500/10 text-amber-600 rounded-2xl mb-2">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900">Frequently Asked Questions</h2>
            <p className="text-xs text-neutral-600">
              Find answers to common questions regarding our private and shared tours, booking confirmations, and physical guidelines.
            </p>
          </div>

          <div className="divide-y divide-neutral-200 max-w-3xl mx-auto">
            {FAQS.map((faq, index) => {
              const isFaqExpanded = expandedFaqIndex === index;
              return (
                <div key={index} className="py-4.5">
                  <button
                    onClick={() => setExpandedFaqIndex(isFaqExpanded ? null : index)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm sm:text-base text-neutral-800 hover:text-amber-600 transition-colors py-2 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 text-amber-500 ${isFaqExpanded ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isFaqExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed pt-2.5 pb-2">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </div>

      {/* SECURE RESERVATION PORTAL */}
      {bookingTour && (
        <CheckoutModal
          isOpen={!!bookingTour}
          onClose={() => setBookingTour(null)}
          serviceType="tour"
          serviceName={bookingTour.tour.name}
          basePriceUSD={bookingTour.tour.startingPrice}
          basePriceIDR={bookingTour.tour.startingPriceIDR}
          initialDetails={bookingTour.details}
        />
      )}

    </div>
  );
}
