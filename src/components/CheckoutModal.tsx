import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { X, ShieldCheck, CheckCircle2, Star, Sparkles, User, Mail, Phone, Calendar, ArrowRight, ChevronRight, Fuel, Briefcase } from 'lucide-react';
import { VEHICLES } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'tour' | 'airport' | 'taxi' | 'rental';
  serviceName: string;
  basePriceUSD: number;
  basePriceIDR: number;
  initialDetails: any;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  serviceType,
  serviceName,
  basePriceUSD,
  basePriceIDR,
  initialDetails
}: CheckoutModalProps) {
  const { addBooking, formatPrice, bookings, schedules, serviceLimits } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[1]); // Innova default
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate pricing upgrades if vehicle is premium or large
  const getVehicleMultiplier = () => {
    if (serviceType === 'tour') return 1.0; // Tour price is pre-set by package tier selection
    if (selectedVehicle.id === 'avanza') return 0.9;
    if (selectedVehicle.id === 'innova') return 1.0;
    if (selectedVehicle.id === 'hiace-commuter') return 1.5;
    if (selectedVehicle.id === 'hiace-premio') return 1.8;
    return 1.0;
  };

  const calculateFinalPrice = () => {
    const mult = getVehicleMultiplier();
    const days = initialDetails.days || 1;
    const guests = serviceType === 'tour' ? (initialDetails.guests || 1) : 1;
    const finalUSD = Math.round(basePriceUSD * mult * days * guests);
    const finalIDR = Math.round(basePriceIDR * mult * days * guests);
    return { usd: finalUSD, idr: finalIDR };
  };

  const finalPrice = calculateFinalPrice();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) return;
    setErrorMessage(null);

    const targetDate = initialDetails?.date;
    if (targetDate) {
      const isBlocked = (schedules || []).some(s => s.date === targetDate && s.type === 'blocked');
      const confirmedCount = (bookings || []).filter(b => 
        b.details && 
        b.details.date === targetDate && 
        b.type === serviceType &&
        (b.status === 'Confirmed' || b.status === 'Completed')
      ).length;
      
      if (isBlocked) {
        setErrorMessage('Maaf, tanggal ini telah ditutup oleh pihak operasional (Blackout Date). Silakan pilih tanggal lain.');
        return;
      }
      const limit = serviceLimits[serviceType] ?? 5;
      if (confirmedCount >= limit) {
        setErrorMessage(`Maaf, kuota pemesanan harian (${limit} slot) untuk layanan ini pada tanggal ini telah penuh. Silakan pilih tanggal lain.`);
        return;
      }
    }

    const bookingPayload = {
      type: serviceType,
      serviceName,
      details: {
        ...initialDetails,
        vehicleId: selectedVehicle.id,
        vehicleName: selectedVehicle.name,
      },
      totalPrice: finalPrice.usd,
      totalPriceIDR: finalPrice.idr,
      customerName,
      customerEmail,
      customerPhone,
    };

    try {
      const newBooking = addBooking(bookingPayload);
      setConfirmedBooking(newBooking);
      setStep(2);
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat memproses reservasi Anda.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-start sm:items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div className="fixed inset-0 cursor-default" onClick={onClose} />

      {/* Main Container */}
      <div className="relative bg-neutral-900 border border-white/10 rounded-3xl w-full max-w-2xl shadow-2xl z-10 flex flex-col my-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-neutral-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 bg-amber-500/10 rounded-lg text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Secure Private Reservation</h3>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">Premium Travel Standard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Stages */}
        <div className="p-6 md:p-8 grow">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6"
              >
                {/* Summary & Vehicle Selection (Col 7) */}
                <form onSubmit={handleSubmit} className="md:col-span-12 space-y-6">
                  
                  {/* Service Card */}
                  <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[9px] font-bold text-amber-400 font-mono uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full">
                        {serviceType}
                      </span>
                      <h4 className="text-base font-bold text-white mt-2 leading-tight">{serviceName}</h4>
                      <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5 flex-wrap">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        <span>Date: {initialDetails.date} {initialDetails.time ? `at ${initialDetails.time}` : ''}</span>
                        {initialDetails.guests && <span>· {initialDetails.guests} Guests</span>}
                        {initialDetails.luggage !== undefined && <span>· {initialDetails.luggage} Bags</span>}
                        {initialDetails.days && <span>· {initialDetails.days} Days</span>}
                      </p>
                      {initialDetails.cityAddress && (
                        <p className="text-[11px] text-neutral-300 mt-2 bg-white/5 p-2.5 rounded-xl border border-white/5 font-mono">
                          <strong className="text-amber-500">📍 Detail Alamat:</strong> {initialDetails.cityAddress}
                        </p>
                      )}
                      {initialDetails.routeType === 'Round Trip' && (
                        <p className="text-[11px] text-amber-400 mt-2 bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/10 font-mono">
                          🔄 <strong>Jadwal Kepulangan:</strong> {initialDetails.returnDateText} {initialDetails.returnTimeText ? `at ${initialDetails.returnTimeText}` : ''} {initialDetails.returnFlightNumber ? `(${initialDetails.returnFlightNumber})` : ''}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-neutral-400 font-mono">ESTIMATED FARE</div>
                      <div className="text-2xl font-black text-amber-400">
                        {formatPrice(finalPrice.usd, finalPrice.idr)}
                      </div>
                      <div className="text-[10px] text-neutral-500">All-Inclusive Fixed Pricing</div>
                    </div>
                  </div>

                  {/* Vehicle Upgrades or Package Tier Benefits */}
                  {serviceType === 'tour' && initialDetails.packageTier ? (
                    <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
                        <div>
                          <h5 className="text-sm font-black text-amber-500 font-mono tracking-wider uppercase">
                            {initialDetails.packageTier}
                          </h5>
                          <p className="text-[10px] text-neutral-400">Pilihan paket wisata premium terkurasi</p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed italic">
                        "Fasilitas lengkap, transportasi privat sesuai tier, konsumsi, tiket masuk fast-track, dan pemandu lokal berlisensi sudah termasuk."
                      </p>
                      <div className="pt-2 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] text-neutral-400">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                          Tiket Masuk & Retribusi
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                          Layanan Chauffeur AC
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                          Guide Lokal Berlisensi
                        </span>
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-amber-500" />
                          Snack & Air Mineral
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-1 block">
                        Choose Private Vehicle Class
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {VEHICLES.map((car) => {
                          const isSelected = selectedVehicle.id === car.id;
                          return (
                            <div
                              key={car.id}
                              onClick={() => setSelectedVehicle(car)}
                              className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                                isSelected
                                  ? 'bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/5'
                                  : 'bg-white/5 border-white/5 hover:border-white/15'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="font-bold text-sm text-white">{car.name}</h5>
                                  <p className="text-[10px] text-neutral-400">{car.category} MPV/Van</p>
                                </div>
                                <span className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-amber-400 bg-amber-500 text-neutral-950' : 'border-neutral-600'
                                }`}>
                                  {isSelected && <span className="h-2 w-2 rounded-full bg-neutral-950" />}
                                </span>
                              </div>

                              {/* Capacity details */}
                              <div className="flex items-center space-x-3 text-neutral-400 text-xs mt-3.5">
                                <span className="flex items-center space-x-1">
                                  <User className="h-3.5 w-3.5 text-amber-500" />
                                  <span>{car.passengers} Pax</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Briefcase className="h-3.5 w-3.5 text-amber-500" />
                                  <span>{car.luggage} Bags</span>
                                </span>
                                <span className="flex items-center space-x-1">
                                  <Fuel className="h-3.5 w-3.5 text-amber-500" />
                                  <span>A/C</span>
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Customer Information Form */}
                  <div className="space-y-4 pt-2">
                    <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider pl-1 block">
                      Lead Passenger Contact Information
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-base sm:text-sm text-white w-full focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                        />
                      </div>

                      {/* Email */}
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                        <input
                          type="email"
                          required
                          placeholder="Email Address"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-base sm:text-sm text-white w-full focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative sm:col-span-2">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                        <input
                          type="tel"
                          required
                          placeholder="WhatsApp Phone Number (e.g. +62 812-3456-7890)"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-3.5 text-base sm:text-sm text-white w-full focus:outline-none focus:border-amber-500 placeholder-neutral-500"
                        />
                      </div>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-200 text-xs rounded-2xl p-4 flex items-start gap-2.5 animate-fade-in">
                      <div className="p-0.5 rounded-full bg-red-500/10 text-red-500 shrink-0">
                        <X className="h-4 w-4" />
                      </div>
                      <p className="font-semibold leading-tight">{errorMessage}</p>
                    </div>
                  )}

                  {/* Submission segment */}
                  <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-[11px] text-neutral-400 leading-relaxed max-w-sm">
                      By confirming reservation, you agree to our 24h flexible cancelation policy. No pre-payment required today; you can secure payment upon travel arrival.
                    </p>
                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-8 py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/10 hover:scale-[1.02] transition-all"
                    >
                      <span>Secure Booking</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>

                </form>
              </motion.div>
            ) : (
              /* Step 2: Confirmation Success */
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6"
              >
                <div className="inline-flex items-center justify-center bg-emerald-500/15 text-emerald-400 p-5 rounded-full relative">
                  <CheckCircle2 className="h-12 w-12" />
                  <Sparkles className="absolute top-1.5 right-1.5 h-5 w-5 text-amber-400 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white">Booking Confirmed!</h4>
                  <p className="text-sm text-neutral-400">
                    Your luxury ride is secured. A confirmation is dispatched to <span className="text-white font-medium">{customerEmail}</span> and WhatsApp.
                  </p>
                </div>

                {/* Digital Ticket display */}
                <div className="bg-neutral-950 border border-white/10 rounded-2xl p-6 text-left max-w-md mx-auto relative overflow-hidden">
                  {/* Decorative Ticket Cuts */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-neutral-900 rounded-r-full border-r border-white/10" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-8 bg-neutral-900 rounded-l-full border-l border-white/10" />
                  
                  <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                    <div>
                      <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase">SmartJourney Reservation</span>
                      <h5 className="font-bold text-sm text-white mt-1">{serviceName}</h5>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] text-neutral-500 font-mono block">RESERVATION ID</span>
                      <span className="text-xs font-mono font-bold text-white">{confirmedBooking?.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 text-xs mb-4">
                    <div>
                      <span className="text-neutral-500 block">Lead Passenger</span>
                      <span className="text-white font-medium">{customerName}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">WhatsApp Contact</span>
                      <span className="text-white font-medium">{customerPhone}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Departure Date</span>
                      <span className="text-white font-medium">{initialDetails.date} {initialDetails.time ? `at ${initialDetails.time}` : ''}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">
                        {serviceType === 'tour' ? 'Package Option' : 'Vehicle Class'}
                      </span>
                      <span className="text-white font-medium">
                        {serviceType === 'tour' && initialDetails.packageTier 
                          ? initialDetails.packageTier 
                          : selectedVehicle.name}
                      </span>
                    </div>
                    {initialDetails.cityAddress && (
                      <div className="col-span-2">
                        <span className="text-neutral-500 block">📍 Detail Alamat Kota</span>
                        <span className="text-white font-medium font-mono">{initialDetails.cityAddress}</span>
                      </div>
                    )}
                    {initialDetails.routeType === 'Round Trip' && (
                      <div className="col-span-2 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10 text-[11px]">
                        <span className="text-amber-500 font-bold block">🔄 Jadwal Kepulangan (Return Trip)</span>
                        <span className="text-neutral-200 font-medium font-mono">
                          {initialDetails.returnDateText} {initialDetails.returnTimeText ? `at ${initialDetails.returnTimeText}` : ''} {initialDetails.returnFlightNumber ? `(${initialDetails.returnFlightNumber})` : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white/5 p-3 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Total Price Paid (On-Site)</span>
                    <span className="font-mono font-black text-amber-400">
                      {formatPrice(finalPrice.usd, finalPrice.idr)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-center space-x-4 pt-4">
                  <button
                    onClick={() => {
                      onClose();
                      // Set page to bookings via click
                      window.location.hash = '#/bookings';
                    }}
                    className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
                  >
                    Manage Reservation Itinerary
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/10 transition-all"
                  >
                    Done
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
