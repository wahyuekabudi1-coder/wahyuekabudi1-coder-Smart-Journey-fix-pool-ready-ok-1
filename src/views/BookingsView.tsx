import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { 
  Calendar, 
  Trash2, 
  MessageSquare, 
  Compass, 
  AlertCircle, 
  RefreshCw, 
  CreditCard, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  QrCode, 
  Wallet, 
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Declare global window interface for Midtrans Snap API
declare global {
  interface Window {
    snap: any;
  }
}

export default function BookingsView() {
  const { bookings, formatPrice, setPage } = useApp();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [localBookings, setLocalBookings] = useState(bookings);

  // Midtrans configuration states
  const [midtransConfig, setMidtransConfig] = useState<{
    isConfigured: boolean;
    clientKey: string;
    isProduction: boolean;
    message: string;
  } | null>(null);

  const [paymentLoadingId, setPaymentLoadingId] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Sync state if bookings change in context
  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  // Sync state reactively to localStorage events (e.g. completed payment in another tab)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'smartjourney_bookings') {
        try {
          const parsed = JSON.parse(e.newValue || '[]');
          setLocalBookings(parsed);
        } catch (err) {
          console.error('Failed to parse storage update:', err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch Midtrans Config and dynamically load Snap JS on mount
  useEffect(() => {
    fetch('/api/midtrans/config')
      .then(res => res.json())
      .then(data => {
        setMidtransConfig(data);
        
        // Dynamically append snap.js script tag matching sandbox or production
        const scriptSrc = data.isProduction
          ? 'https://app.midtrans.com/snap/snap.js'
          : 'https://app.sandbox.midtrans.com/snap/snap.js';
        
        const scriptId = 'midtrans-snap-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;
        
        if (!script) {
          script = document.createElement('script');
          script.id = scriptId;
          script.src = scriptSrc;
          script.type = 'text/javascript';
          if (data.clientKey) {
            script.setAttribute('data-client-key', data.clientKey);
          }
          document.body.appendChild(script);
        }
      })
      .catch(err => {
        console.error('Failed to load Midtrans config from server:', err);
        // Fallback placeholder config if server API is not reachable
        setMidtransConfig({
          isConfigured: false,
          clientKey: '',
          isProduction: false,
          message: 'Failed to establish API connection.'
        });
      });
  }, []);

  const handleCancelBooking = (id: string) => {
    const updated = localBookings.filter(b => b.id !== id);
    setLocalBookings(updated);
    localStorage.setItem('smartjourney_bookings', JSON.stringify(updated));
    setCancellingId(null);
    window.location.reload(); // Simple refresh to sync state cleanly
  };

  const handleChatSupport = (booking: any) => {
    const text = `Hi SmartJourney Support, I have an active reservation (ID: ${booking.id}) for the "${booking.serviceName}" scheduled on ${booking.details.date}. I'd like to ask a question regarding my trip details!`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6285212347289?text=${encoded}`, '_blank', 'noreferrer,noopener');
  };

  const updateBookingPaymentStatus = (id: string, status: 'Paid' | 'Pending' | 'Unpaid') => {
    const updated = localBookings.map(b => {
      if (b.id === id) {
        return { ...b, paymentStatus: status };
      }
      return b;
    });
    setLocalBookings(updated);
    localStorage.setItem('smartjourney_bookings', JSON.stringify(updated));
  };

  // Triggered when paying with Midtrans
  const handlePayWithMidtrans = async (booking: any) => {
    setPaymentLoadingId(booking.id);
    try {
      // Create a Midtrans Snap transaction token via our fullstack Express endpoint
      const response = await fetch('/api/midtrans/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: booking.id,
          amount: booking.totalPriceIDR,
          customerName: booking.customerName || 'Alex Carter',
          customerEmail: booking.customerEmail || 'sawahjayatrans@gmail.com',
          customerPhone: booking.customerPhone || '085212347289',
          serviceName: booking.serviceName
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        let errMsg = 'Gagal memproses pembayaran ke Midtrans.';
        if (errData.details) {
          try {
            const parsedDetails = JSON.parse(errData.details);
            if (parsedDetails.error_messages && parsedDetails.error_messages.length > 0) {
              errMsg = `Midtrans Error: ${parsedDetails.error_messages.join(', ')}`;
            }
          } catch (e) {
            errMsg = `Midtrans Error: ${errData.details}`;
          }
        } else if (errData.error) {
          errMsg = errData.error;
        }
        throw new Error(errMsg);
      }

      const data = await response.json();

      // Launch standard checkout redirect behavior
      if (data.redirect_url) {
        // If it's the demo mode or a real transaction redirect, open in a new tab!
        window.open(data.redirect_url, '_blank', 'noopener,noreferrer');
      } else if (data.token && window.snap) {
        // Real Snap popup fallback if redirect_url is not returned
        window.snap.pay(data.token, {
          onSuccess: function (result: any) {
            console.log('payment success!', result);
            updateBookingPaymentStatus(booking.id, 'Paid');
          },
          onPending: function (result: any) {
            console.log('payment pending!', result);
            updateBookingPaymentStatus(booking.id, 'Pending');
          },
          onError: function (result: any) {
            console.error('payment error!', result);
            alert('Pembayaran gagal atau dibatalkan. Silakan coba lagi.');
          }
        });
      } else {
        throw new Error('No valid token or redirection URL found.');
      }
    } catch (err: any) {
      console.error('Midtrans Snap payment trigger failed:', err);
      alert(err.message || 'Gagal memproses pembayaran ke Midtrans. Silakan coba lagi.');
    } finally {
      setPaymentLoadingId(null);
    }
  };

  return (
    <div id="bookings-view" className="bg-neutral-950 text-white min-h-screen pt-32 pb-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner: Config Status or Demo Alert */}
        {midtransConfig && !midtransConfig.isConfigured && !bannerDismissed && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex items-start justify-between gap-4"
          >
            <div className="flex gap-3">
              <Info className="h-5.5 w-5.5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-amber-400 font-sans">Payment Integration Mode: Demo Simulator Active</h4>
                <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                  Midtrans Sandbox keys are currently not set in your environment variables. 
                  We have built a gorgeous, interactive <strong>Midtrans Snap Simulator</strong> so you can test the exact end-to-end booking, payment checkout, and reservation updates right here!
                </p>
                <div className="pt-2 text-[10px] text-neutral-400 font-mono">
                  To connect real transactions, add <code className="bg-white/5 px-1 py-0.5 rounded text-amber-200">MIDTRANS_SERVER_KEY</code> and <code className="bg-white/5 px-1 py-0.5 rounded text-amber-200">VITE_MIDTRANS_CLIENT_KEY</code> in Settings.
                </div>
              </div>
            </div>
            <button 
              onClick={() => setBannerDismissed(true)}
              className="text-neutral-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}

        {/* Header Intro */}
        <div className="text-center space-y-3">
          <span className="inline-flex items-center space-x-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1 rounded-full text-xs font-semibold font-mono uppercase tracking-widest">
            <Calendar className="h-3.5 w-3.5" />
            <span>Passenger Reservation Center</span>
          </span>
          <h1 className="text-3xl sm:text-4.5xl font-black">Your Booking Portal</h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Review and manage your active executive transfers, point-to-point taxis, and guided private tours around East Java.
          </p>
        </div>

        {/* Boarding Tickets Listing */}
        {localBookings.length === 0 ? (
          /* Empty State */
          <div className="bg-neutral-900 border border-white/5 rounded-3xl p-12 text-center space-y-6 max-w-md mx-auto">
            <div className="p-4 bg-white/5 border border-white/10 rounded-full w-fit mx-auto text-neutral-400">
              <Compass className="h-8 w-8 animate-spin-slow" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-lg text-white">No Active Reservations</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                You haven't booked any private transportation or tours yet. Explore our premium packages to begin!
              </p>
            </div>
            <button
              onClick={() => { setPage('tours'); }}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
            >
              Browse Tour Packages
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {localBookings.map((booking) => {
              const isPaid = booking.paymentStatus === 'Paid';
              const isPending = booking.paymentStatus === 'Pending';
              
              return (
                <div
                  key={booking.id}
                  className="relative bg-neutral-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-12"
                >
                  {/* Boarding pass circular ticket cuts (left and right for desktop) */}
                  <div className="hidden md:block absolute left-[75%] top-0 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-950 rounded-full border border-white/10 z-10" />
                  <div className="hidden md:block absolute left-[75%] bottom-0 -translate-x-1/2 translate-y-1/2 w-6 h-6 bg-neutral-950 rounded-full border border-white/10 z-10" />

                  {/* Left Section - Ride/Tour specifications (Col 9) */}
                  <div className="p-6 md:p-8 md:col-span-9 space-y-6">
                    
                    {/* Top line ID & category */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-neutral-950 font-mono uppercase bg-amber-500 px-2.5 py-0.5 rounded-full">
                          {booking.type}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          Booking ID: <strong className="text-white">{booking.id}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* System Status */}
                        <span className="inline-flex items-center gap-1.5 bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Main Service Description */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                        {booking.serviceName}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-amber-500" />
                        <span>Scheduled Departure: <strong className="text-neutral-200">{booking.details.date} {booking.details.time ? `at ${booking.details.time}` : ''}</strong></span>
                      </p>
                    </div>

                    {/* Flight/Address details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white/5 p-4 rounded-2xl">
                      {booking.details.pickupLocation && (
                        <div>
                          <span className="text-neutral-500 font-mono text-[9px] block uppercase tracking-wider">Pickup Point</span>
                          <span className="text-white font-medium line-clamp-2">{booking.details.pickupLocation}</span>
                        </div>
                      )}
                      {booking.details.destination && (
                        <div>
                          <span className="text-neutral-500 font-mono text-[9px] block uppercase tracking-wider">Destination</span>
                          <span className="text-white font-medium line-clamp-2">{booking.details.destination}</span>
                        </div>
                      )}
                      {booking.details.vehicleName && (
                        <div>
                          <span className="text-neutral-500 font-mono text-[9px] block uppercase tracking-wider">Assigned Vehicle Class</span>
                          <span className="text-white font-medium">{booking.details.vehicleName}</span>
                        </div>
                      )}
                      {booking.details.flightNumber && booking.details.flightNumber !== 'N/A' && (
                        <div>
                          <span className="text-neutral-500 font-mono text-[9px] block uppercase tracking-wider">Flight Number</span>
                          <span className="text-amber-400 font-mono font-bold uppercase">{booking.details.flightNumber}</span>
                        </div>
                      )}
                      {booking.details.guests && (
                        <div>
                          <span className="text-neutral-500 font-mono text-[9px] block uppercase tracking-wider">Group Size</span>
                          <span className="text-white font-medium">{booking.details.guests} Passengers</span>
                        </div>
                      )}
                      {booking.details.days && (
                        <div>
                          <span className="text-neutral-500 font-mono text-[9px] block uppercase tracking-wider">Rental Duration</span>
                          <span className="text-white font-medium">{booking.details.days} Days</span>
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-2 flex flex-wrap gap-3 items-center">
                      <button
                        onClick={() => handleChatSupport(booking)}
                        className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>WhatsApp Coordinator</span>
                      </button>
                      
                      {/* Midtrans Online Checkout Action */}
                      {!isPaid && !isPending && (
                        <button
                          onClick={() => handlePayWithMidtrans(booking)}
                          disabled={paymentLoadingId === booking.id}
                          className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                        >
                          {paymentLoadingId === booking.id ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Membuat Token...</span>
                            </>
                          ) : (
                            <>
                              <CreditCard className="h-3.5 w-3.5" />
                              <span>Bayar Sekarang (Midtrans)</span>
                            </>
                          )}
                        </button>
                      )}

                      {isPaid && (
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-xl text-xs font-bold">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Lunas (Terverifikasi Midtrans)</span>
                        </span>
                      )}

                      {isPending && (
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-xl text-xs font-bold">
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Menunggu Pembayaran</span>
                          </span>
                          <button
                            onClick={() => handlePayWithMidtrans(booking)}
                            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs px-3 py-2 rounded-xl font-medium"
                          >
                            Ulangi
                          </button>
                        </div>
                      )}
                      
                      {/* Cancel Booking Ticket */}
                      {!isPaid && (
                        cancellingId === booking.id ? (
                          <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/20 p-2 rounded-xl">
                            <span className="text-[10px] text-rose-400 font-bold px-1 uppercase tracking-wider">Are you sure?</span>
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="bg-rose-500 hover:bg-rose-400 text-neutral-950 font-bold px-3 py-1.5 rounded-lg text-[10px]"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setCancellingId(null)}
                              className="bg-white/5 hover:bg-white/10 text-neutral-300 font-semibold px-2.5 py-1.5 rounded-lg text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancellingId(booking.id)}
                            className="bg-white/5 border border-white/10 hover:border-rose-500/30 text-neutral-400 hover:text-rose-400 font-medium px-4 py-2.5 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Withdraw Ticket</span>
                          </button>
                        )
                      )}
                    </div>

                  </div>

                  {/* Right Section - Boarding Ticket QR Code Display (Col 3) */}
                  <div className="p-6 md:p-8 md:col-span-3 bg-neutral-950 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-white/10 md:border-dashed text-center space-y-4">
                    
                    {/* Mock Barcode / QR Styling */}
                    <div className="bg-white p-3.5 rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300">
                      <div className="grid grid-cols-5 gap-1 w-24 h-24">
                        {/* Generates a stylized high-fidelity QR look-alike grid */}
                        {[...Array(25)].map((_, idx) => {
                          const isFilled = (idx % 2 === 0 && idx % 3 !== 0) || idx === 0 || idx === 4 || idx === 20 || idx === 24;
                          return (
                            <div
                              key={idx}
                              className={`rounded-sm ${isFilled ? (isPaid ? 'bg-emerald-600' : 'bg-neutral-950') : 'bg-transparent'}`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] text-neutral-500 block uppercase font-mono tracking-wider">TICKET PRICE</span>
                      <span className="text-lg font-black text-amber-400 block leading-tight">
                        {formatPrice(booking.totalPrice, booking.totalPriceIDR)}
                      </span>
                      
                      {/* Interactive payment badge under price */}
                      <span className={`inline-block text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-md mt-1 border ${
                        isPaid 
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                          : isPending 
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {isPaid ? 'Payment: LUNAS' : isPending ? 'Payment: PENDING' : 'Payment: UNPAID'}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })}

            <div className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-neutral-400 space-y-1">
                <p className="font-bold text-white">Informasi Pembayaran Midtrans</p>
                <p className="leading-relaxed">
                  Kami menyediakan integrasi pembayaran aman dengan gerbang pembayaran Midtrans. Anda dapat memilih metode pembayaran instan seperti Gopay/QRIS, transfer Bank Virtual Account, atau Kartu Kredit. Setelah pembayaran lunas, kode QR tiket Anda akan diverifikasi secara otomatis dan status pemesanan Anda berubah menjadi LUNAS.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
