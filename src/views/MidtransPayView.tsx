import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  QrCode, 
  CreditCard, 
  Building, 
  ShoppingBag, 
  CheckCircle2, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  ChevronRight,
  Clock,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';

export default function MidtransPayView() {
  // Query parameters parsed from hash
  const [params, setParams] = useState({
    id: '',
    amount: 0,
    service: 'Executive Private Transfer',
    name: 'Guest Customer',
    email: 'customer@example.com',
    phone: '085212347289'
  });

  const [activeTab, setActiveTab] = useState<'qris' | 'va' | 'card' | 'store'>('qris');
  const [selectedBank, setSelectedBank] = useState<'bca' | 'mandiri' | 'bni' | 'bri'>('bca');
  const [copiedText, setCopiedText] = useState(false);
  
  // Checkout flow state: 'checkout' -> 'processing' -> 'success'
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'processing' | 'success'>('checkout');

  // Parse hash query parameters on mount
  useEffect(() => {
    const parseHashParams = () => {
      const hash = window.location.hash;
      const questionIndex = hash.indexOf('?');
      if (questionIndex !== -1) {
        const queryStr = hash.substring(questionIndex + 1);
        const searchParams = new URLSearchParams(queryStr);
        
        setParams({
          id: searchParams.get('id') || `SJ-${Math.floor(1000 + Math.random() * 9000)}`,
          amount: Number(searchParams.get('amount')) || 1500000,
          service: searchParams.get('service') || 'Premium Tour & Travel',
          name: searchParams.get('name') || 'Guest Customer',
          email: searchParams.get('email') || 'customer@example.com',
          phone: searchParams.get('phone') || '085212347289'
        });
      }
    };

    parseHashParams();
    // Watch hash change
    window.addEventListener('hashchange', parseHashParams);
    return () => window.removeEventListener('hashchange', parseHashParams);
  }, []);

  // Format IDR currency nicely
  const formatIDR = (num: number) => {
    return 'IDR ' + num.toLocaleString('id-ID');
  };

  // Generate simulated VA or payment code
  const getVANumber = () => {
    switch (selectedBank) {
      case 'bca': return '13909' + params.id.replace(/\D/g, '') + '120';
      case 'mandiri': return '11900' + params.id.replace(/\D/g, '') + '894';
      case 'bni': return '8277' + params.id.replace(/\D/g, '') + '032';
      case 'bri': return '1280' + params.id.replace(/\D/g, '') + '761';
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const processPayment = () => {
    setPaymentStep('processing');
    
    // Simulate connection delay (2.5 seconds)
    setTimeout(() => {
      // 1. Write the payment status update directly to localStorage
      try {
        const stored = localStorage.getItem('smartjourney_bookings');
        if (stored) {
          const bookings = JSON.parse(stored);
          const updated = bookings.map((b: any) => {
            // Check if booking ID matches
            if (b.id === params.id || b.id.replace(/\D/g, '') === params.id.replace(/\D/g, '')) {
              return { ...b, paymentStatus: 'Paid' };
            }
            return b;
          });
          localStorage.setItem('smartjourney_bookings', JSON.stringify(updated));
          console.log(`Payment simulation successful! Updated status for booking ID: ${params.id}`);
        }
      } catch (err) {
        console.error('Failed to update localStorage in simulation:', err);
      }

      setPaymentStep('success');
    }, 2500);
  };

  const handleReturnToMerchant = () => {
    // Attempt to close this tab. If opened via window.open, this works beautifully.
    // If not, redirect back to the bookings portal.
    window.location.hash = '#/bookings';
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen py-10 px-4 font-sans flex items-center justify-center">
      
      {/* Container Card */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden flex flex-col md:grid md:grid-cols-12 min-h-[600px]">
        
        {/* Left Column (Menu selection) - 5 Cols */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 md:col-span-5 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
          <div className="space-y-8">
            
            {/* Midtrans Header branding */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="bg-sky-500 h-7 w-7 rounded-full flex items-center justify-center text-xs font-black text-white">
                  M
                </div>
                <div>
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-slate-100 flex items-center gap-1">
                    <span>midtrans</span>
                    <span className="text-[9px] bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1.5 py-0.2 rounded font-mono">SANDBOX</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono tracking-tight">Official Secure Redirection Port</p>
                </div>
              </div>
            </div>

            {/* Merchant / Store Information */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3.5">
              <div>
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">Merchant</span>
                <span className="text-sm font-extrabold text-white">Smart Journey</span>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">Service Requested</span>
                <span className="text-xs font-semibold text-slate-300 line-clamp-2 mt-0.5">{params.service}</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">Booking ID / Order</span>
                  <strong className="text-xs font-mono text-white mt-0.5">{params.id}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-widest block">Total Payable</span>
                  <span className="text-base font-black text-amber-400 block font-mono">{formatIDR(params.amount)}</span>
                </div>
              </div>
            </div>

            {/* Simulated Payment Method Selection (Active Checkout step only) */}
            {paymentStep === 'checkout' && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-extrabold text-slate-400 font-mono uppercase tracking-widest block px-1">Payment Options</span>
                
                {/* QRIS */}
                <button
                  onClick={() => setActiveTab('qris')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                    activeTab === 'qris' 
                      ? 'bg-sky-500/10 border-sky-500 text-sky-400' 
                      : 'bg-transparent border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <QrCode className="h-4 w-4" />
                    <span className="text-xs font-bold">GoPay / QRIS (Instant)</span>
                  </div>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </button>

                {/* Virtual Account */}
                <button
                  onClick={() => setActiveTab('va')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                    activeTab === 'va' 
                      ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                      : 'bg-transparent border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4" />
                    <span className="text-xs font-bold">Virtual Account (Bank VA)</span>
                  </div>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </button>

                {/* Credit Card */}
                <button
                  onClick={() => setActiveTab('card')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                    activeTab === 'card' 
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                      : 'bg-transparent border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-4 w-4" />
                    <span className="text-xs font-bold">Credit / Debit Card</span>
                  </div>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </button>

                {/* Indomaret Store */}
                <button
                  onClick={() => setActiveTab('store')}
                  className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                    activeTab === 'store' 
                      ? 'bg-amber-500/10 border-amber-500 text-amber-400' 
                      : 'bg-transparent border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-4 w-4" />
                    <span className="text-xs font-bold">Alfamart / Indomaret</span>
                  </div>
                  <ChevronRight className="h-3 w-3 opacity-60" />
                </button>
              </div>
            )}

          </div>

          {/* Secure lock seal footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Secure 3D-Authenticated Gateway</span>
          </div>

        </div>

        {/* Right Column (Dynamic details matching selections) - 7 Cols */}
        <div className="p-6 sm:p-8 md:col-span-7 flex flex-col justify-between bg-white">
          
          {/* Main Workspace matching active payment state */}
          <div className="grow flex flex-col justify-center">

            {/* 1. CHECKOUT SELECTION AND FILL-IN DETAILS */}
            {paymentStep === 'checkout' && (
              <div className="space-y-6">
                
                {/* Top header introduction */}
                <div>
                  <h4 className="font-extrabold text-sm text-slate-500 font-mono uppercase tracking-wider">Midtrans Redirection</h4>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Complete Your Payment</h2>
                  <p className="text-xs text-slate-500 mt-1">Select a secure payment method and initiate verification simulation.</p>
                </div>

                {/* Sub-Panel: QRIS */}
                {activeTab === 'qris' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      
                      {/* High fidelity looking barcode/QRIS */}
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex-shrink-0">
                        <div className="grid grid-cols-6 gap-1 w-28 h-28">
                          {[...Array(36)].map((_, i) => {
                            const isEdge = i < 6 || i % 6 === 0 || i % 6 === 5 || i >= 30;
                            const isInnerPattern = (i % 3 === 0 && i % 4 !== 0) || i === 8 || i === 15 || i === 22 || i === 27;
                            return (
                              <div 
                                key={i} 
                                className={`rounded-sm ${isEdge || isInnerPattern ? 'bg-slate-900' : 'bg-transparent'}`} 
                              />
                            );
                          })}
                        </div>
                        <div className="text-[8px] text-center font-bold font-mono tracking-widest text-slate-500 mt-2">
                          QRIS CO-BRAND
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-2 text-center sm:text-left">
                        <span className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono">
                          GoPay / ShopeePay / QRIS
                        </span>
                        <h4 className="text-xs font-black text-slate-800">Scan QRIS to Settle Instantly</h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Scan the dynamic code using your digital wallet app (GoPay, OVO, ShopeePay, LinkAja) or any bank mobile app.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sub-Panel: Virtual Account */}
                {activeTab === 'va' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {/* Bank Selection Toggles */}
                    <div className="grid grid-cols-4 gap-2">
                      {(['bca', 'mandiri', 'bni', 'bri'] as const).map((bank) => (
                        <button
                          key={bank}
                          onClick={() => setSelectedBank(bank)}
                          className={`p-3.5 rounded-xl border-2 text-center font-bold text-xs uppercase tracking-wider transition-all ${
                            selectedBank === bank 
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-extrabold shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {bank}
                        </button>
                      ))}
                    </div>

                    {/* Virtual Account display card */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-wide text-[9px] font-mono">
                          {selectedBank} Virtual Account Billing Code
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                          No Admin Fees
                        </span>
                      </div>
                      
                      {/* Number Copy Block */}
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                        <code className="text-sm font-bold font-mono tracking-wider text-slate-800">
                          {getVANumber()}
                        </code>
                        <button
                          onClick={() => handleCopyCode(getVANumber())}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1 text-[10px] font-bold"
                        >
                          {copiedText ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold font-mono">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span className="font-mono">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 space-y-1.5 leading-relaxed pt-1.5">
                        <p className="font-bold text-slate-600">Simulasi Pembayaran:</p>
                        <p>1. Salin kode Virtual Account di atas.</p>
                        <p>2. Tekan tombol "Bayar Sekarang" di bawah untuk memproses verifikasi simulasi transaksi.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Sub-Panel: Credit Card */}
                {activeTab === 'card' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3.5">
                      <span className="text-[9px] font-extrabold text-slate-500 font-mono uppercase tracking-widest block">Simulated Card Credentials</span>
                      
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-3 gap-3">
                          <div className="col-span-2">
                            <label className="text-[9px] font-extrabold text-slate-500 font-mono uppercase tracking-wider block mb-1">Card Number</label>
                            <input 
                              type="text" 
                              disabled 
                              value="4111 1111 1111 1111" 
                              className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 font-bold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] font-extrabold text-slate-500 font-mono uppercase tracking-wider block mb-1">CVV</label>
                            <input 
                              type="text" 
                              disabled 
                              value="123" 
                              className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-mono text-slate-800 font-bold text-center focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[9px] font-extrabold text-slate-500 font-mono uppercase tracking-wider block mb-1">Cardholder Name</label>
                          <input 
                            type="text" 
                            disabled 
                            value={params.name} 
                            className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-800 font-bold focus:outline-none"
                          />
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-400 leading-relaxed pt-1 font-mono">
                        Security verification uses standard 3D-Secure credentials. Sandbox bypasses OTP validation automatically.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Sub-Panel: Retail Store */}
                {activeTab === 'store' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 space-y-3.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-wide text-[9px] font-mono">Convenience Store Billing Code</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                          Alfamart / Indomaret
                        </span>
                      </div>

                      {/* Code block */}
                      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200">
                        <code className="text-sm font-bold font-mono tracking-wider text-slate-800">
                          SMART-PAY-{params.id.replace(/\D/g, '') || '9823'}
                        </code>
                        <button
                          onClick={() => handleCopyCode(`SMART-PAY-${params.id.replace(/\D/g, '') || '9823'}`)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all flex items-center gap-1 text-[10px] font-bold"
                        >
                          {copiedText ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600 font-semibold font-mono">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span className="font-mono">Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-[10px] text-slate-400 space-y-1.5 leading-relaxed pt-1">
                        <p className="font-bold text-slate-600">Instruksi Pembayaran:</p>
                        <p>1. Beritahukan kasir Indomaret/Alfamart untuk membayar ke merchant "SmartJourney".</p>
                        <p>2. Berikan kode pembayaran di atas ke kasir untuk ditransaksikan.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Customer Details info block */}
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2 border border-slate-200/50">
                  <span className="text-[9px] font-extrabold text-slate-500 font-mono uppercase tracking-wider block">Customer Details</span>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                    <div>
                      <span className="text-slate-400 block font-mono">Name</span>
                      <strong className="text-slate-700">{params.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-mono">Phone</span>
                      <strong className="text-slate-700">{params.phone}</strong>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 block font-mono">Email Address</span>
                      <strong className="text-slate-700">{params.email}</strong>
                    </div>
                  </div>
                </div>

                {/* Primary pay trigger */}
                <button
                  onClick={processPayment}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl text-xs sm:text-sm transition-all shadow-lg active:scale-[0.99] uppercase tracking-wider font-mono flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>Bayar Sekarang (Simulasi Midtrans)</span>
                </button>

              </div>
            )}

            {/* 2. PROCESSING LOADING SCREEN */}
            {paymentStep === 'processing' && (
              <div className="text-center space-y-6 py-12">
                <div className="relative h-20 w-20 mx-auto flex items-center justify-center">
                  <span className="absolute inset-0 rounded-full border-4 border-slate-100 animate-pulse" />
                  <RefreshCw className="h-10 w-10 text-sky-500 animate-spin" />
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-extrabold text-base text-slate-800 animate-pulse uppercase tracking-wider font-mono text-xs">Menghubungkan Midtrans...</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Sedang memproses pembayaran secara aman. Sistem sedang mendeteksi dana masuk dan memperbarui database Smart Journey...
                  </p>
                </div>
              </div>
            )}

            {/* 3. SUCCESS / RECEIPT GENERATED SCREEN */}
            {paymentStep === 'success' && (
              <div className="space-y-6 py-6 text-center sm:text-left">
                
                {/* Check icon centered */}
                <div className="text-center space-y-3">
                  <div className="h-16 w-16 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                      Settlement Success
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">Pembayaran Sukses!</h3>
                    <p className="text-xs text-slate-500">Transaksi Anda telah berhasil diproses oleh gerbang pembayaran Midtrans.</p>
                  </div>
                </div>

                {/* Detailed Receipt layout */}
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3 max-w-md mx-auto text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Merchant</span>
                    <strong className="text-slate-800 font-extrabold">Smart Journey</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Booking ID / Order No.</span>
                    <strong className="text-slate-800 font-mono">{params.id}</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Metode Pembayaran</span>
                    <strong className="text-slate-800 uppercase font-bold">{activeTab} (Simulasi Sandbox)</strong>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-mono">Status</span>
                    <strong className="text-emerald-600 font-black uppercase font-mono">SETTLEMENT (Lunas)</strong>
                  </div>
                  
                  <div className="h-px bg-slate-200" />
                  
                  <div className="flex justify-between items-center text-sm font-extrabold">
                    <span className="text-slate-800">Jumlah Dibayar</span>
                    <strong className="text-slate-950 font-mono text-base font-black">{formatIDR(params.amount)}</strong>
                  </div>
                </div>

                {/* Back button */}
                <div className="max-w-md mx-auto pt-4">
                  <button
                    onClick={handleReturnToMerchant}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-1.5 uppercase font-mono tracking-wider active:scale-[0.99]"
                  >
                    <span>Selesai & Kembali ke Portal</span>
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Secure padlock details on the bottom */}
          {paymentStep === 'checkout' && (
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                <span>Timer Sesi: <strong className="text-slate-600">23 jam 59 menit</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <span>Secure PCI-DSS Level 1 Compliant</span>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
