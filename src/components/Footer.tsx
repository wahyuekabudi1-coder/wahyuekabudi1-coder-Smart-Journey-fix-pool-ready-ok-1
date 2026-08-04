import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Compass, Mail, MapPin, Phone, Clock, MessageSquare, Instagram, Facebook, Youtube, Share2, Sparkles, QrCode, Copy, Check, X, ShieldCheck, FileText, Lock, Eye, EyeOff } from 'lucide-react';

function WeChatIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="currentColor" 
      viewBox="0 0 16 16"
      className={className}
    >
      <path d="M11.176 14.429c-2.665 0-4.826-1.8-4.826-4.018 0-2.22 2.159-4.02 4.824-4.02S16 8.191 16 10.411c0 1.21-.65 2.301-1.666 3.036a.32.32 0 0 0-.12.366l.218.81a.6.6 0 0 1 .029.117.166.166 0 0 1-.162.162.2.2 0 0 1-.092-.03l-1.057-.61a.5.5 0 0 0-.256-.074.5.5 0 0 0-.142.021 5.7 5.7 0 0 1-1.576.22M9.064 9.542a.647.647 0 1 0 .557-1 .645.645 0 0 0-.646.647.6.6 0 0 0 .09.353Zm3.232.001a.646.646 0 1 0 .546-1 .645.645 0 0 0-.644.644.63.63 0 0 0 .098.356"/>
      <path d="M0 6.826c0 1.455.781 2.765 2.001 3.656a.385.385 0 0 1 .143.439l-.161.6-.1.373a.5.5 0 0 0-.032.14.19.19 0 0 0 .193.193q.06 0 .111-.029l1.268-.733a.6.6 0 0 1 .308-.088q.088 0 .171.025a6.8 6.8 0 0 0 1.625.26 4.5 4.5 0 0 1-.177-1.251c0-2.936 2.785-5.02 5.824-5.02l.15.002C10.587 3.429 8.392 2 5.796 2 2.596 2 0 4.16 0 6.826m4.632-1.555a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0m3.875 0a.77.77 0 1 1-1.54 0 .77.77 0 0 1 1.54 0"/>
    </svg>
  );
}

export default function Footer() {
  const { setPage, setPrivacyOpen, setTermsOpen } = useApp();
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [email, setEmail] = useState('');
  const [imageFailed, setImageFailed] = useState(false);
  const [isWeChatModalOpen, setIsWeChatModalOpen] = useState(false);
  const [copiedWeChat, setCopiedWeChat] = useState(false);
  const [qrImageError, setQrImageError] = useState(false);

  const [clickCount, setClickCount] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);

  const handleSecretClick = () => {
    const nextCount = clickCount + 1;
    if (nextCount >= 8 && nextCount <= 10) {
      setClickCount(nextCount);
      setShowPasswordModal(true);
      console.log(`Secret portal click inside range (8-10): ${nextCount}`);
    } else if (nextCount >= 11) {
      setClickCount(0);
      setShowPasswordModal(false);
      setPassword('');
      setPasswordError('');
      console.log(`Secret portal click reached 11, resetting to 0.`);
    } else {
      setClickCount(nextCount);
      console.log(`Secret portal click: ${nextCount}/8`);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'sawahjaya2026') {
      setShowPasswordModal(false);
      setClickCount(0);
      setPassword('');
      setPasswordError('');
      setPage('admin');
    } else {
      setPasswordError('Kunci akses salah. Silakan hubungi tim IT Smart Journey.');
    }
  };

  const handleCopyWeChat = () => {
    navigator.clipboard.writeText('sjtrans');
    setCopiedWeChat(true);
    setTimeout(() => setCopiedWeChat(false), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setEmailSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer id="main-footer" className="bg-neutral-50 text-neutral-600 pb-24 sm:pb-12 border-t border-neutral-200/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => setPage('home')}>
              {!imageFailed ? (
                <img 
                  src="/logo.png" 
                  alt="Smart Journey Logo" 
                  className="h-10 w-auto max-w-[160px] object-contain hover:scale-105 transition-transform duration-300"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <div className="bg-amber-500 text-neutral-950 p-2 rounded-xl">
                  <Compass className="h-5 w-5" />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <span className="text-lg font-bold tracking-tight text-neutral-900 leading-tight">
                  Smart<span className="text-amber-500"> Journey</span>
                </span>
                <span className="text-[10px] font-semibold text-amber-500 tracking-widest uppercase font-mono mt-0.5 leading-none">
                  Go Beyond.
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Smart Journey adalah spesialis perjalanan premium dan antar-jemput bandara di Indonesia. Kami menyediakan paket tour wisata, kemitraan lokal terverifikasi, serta transportasi standar concierge 24/7 yang memenuhi tolok ukur internasional.
            </p>
            
            {/* Social Media Links under description */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-neutral-200 text-neutral-500 hover:border-amber-500 hover:text-amber-500 p-2 rounded-lg transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-neutral-200 text-neutral-500 hover:border-amber-500 hover:text-amber-500 p-2 rounded-lg transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-neutral-200 text-neutral-500 hover:border-amber-500 hover:text-amber-500 p-2 rounded-lg transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                title="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="bg-white border border-neutral-200 text-neutral-500 hover:border-amber-500 hover:text-amber-500 p-2 rounded-lg transition-all duration-300 shadow-sm hover:-translate-y-0.5"
                title="Share"
              >
                <Share2 className="h-4 w-4" />
              </a>
            </div>

            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Operator Tur Resmi Indonesia
              </span>
            </div>
          </div>
 
          {/* Column 2: Quick Links */}
          <div className="border-t border-neutral-200/60 pt-6 md:border-t-0 md:pt-0">
            <h3 className="text-neutral-900 font-bold text-xs tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-2.5">
              Tautan Cepat
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li>
                <button onClick={() => setPage('home')} className="hover:text-amber-600 text-neutral-700 transition-colors cursor-pointer">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => setPage('tours')} className="hover:text-amber-600 text-neutral-700 transition-colors cursor-pointer">
                  Tour Wisata
                </button>
              </li>
              <li>
                <button onClick={() => setPage('share-tour')} className="hover:text-amber-600 text-neutral-700 transition-colors cursor-pointer flex items-center gap-1.5">
                  <span>Share Tour</span>
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1 py-0.2 rounded font-mono font-bold uppercase">Baru</span>
                </button>
              </li>
              <li>
                <button onClick={() => setPage('airport')} className="hover:text-amber-600 text-neutral-700 transition-colors cursor-pointer">
                  Transfer Bandara
                </button>
              </li>
              <li>
                <button onClick={() => setPage('taxi')} className="hover:text-amber-600 text-neutral-700 transition-colors cursor-pointer">
                  Taksi
                </button>
              </li>
              <li>
                <button onClick={() => setPage('car-rental')} className="hover:text-amber-600 text-neutral-700 transition-colors cursor-pointer">
                  Sewa Mobil
                </button>
              </li>
            </ul>
          </div>
 
          {/* Column 3: Contact Details */}
          <div id="footer-contact-column" className="border-t border-neutral-200/60 pt-6 md:border-t-0 md:pt-0 rounded-2xl p-2 transition-all duration-500">
            <h3 className="text-neutral-900 font-bold text-xs tracking-wider uppercase mb-4 border-l-2 border-amber-500 pl-2.5">
              Contact &amp; Inquiries
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-neutral-600">
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <a href="https://wa.me/6285212347289" target="_blank" rel="noopener noreferrer" className="hover:text-amber-600 font-medium text-neutral-700 transition-colors">
                  +62 852-1234-7289 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                <a href="mailto:Info@sawahjayatrans.com" className="hover:text-amber-600 font-medium text-neutral-700 transition-colors">
                  Info@sawahjayatrans.com
                </a>
              </li>
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-700 space-y-0.5 leading-snug">
                  <div><strong>Malang:</strong> Jl. Puntadewa No. 192, Tumpang</div>
                  <div><strong>Bali:</strong> Jl. By Pass Ngurah Rai, Denpasar</div>
                </div>
              </li>
            </ul>

            {/* Quick Contact Buttons */}
            <div className="mt-4 pt-4 border-t border-neutral-200/50 flex gap-2">
              <a 
                id="footer-wa-btn"
                href="https://wa.me/6285212347289" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-[1.01] duration-200 flex-1 text-center"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </a>

              <button 
                id="footer-wechat-btn"
                onClick={() => {
                  setQrImageError(false);
                  setIsWeChatModalOpen(true);
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-sm transition-all hover:scale-[1.01] duration-200 flex-1 text-center"
              >
                <WeChatIcon className="h-3.5 w-3.5" />
                <span>WeChat</span>
              </button>
            </div>
          </div>
 
        </div>
 
        {/* 2. SECURE PAYMENT SEGMENT (Above Copyright) */}
        <div className="bg-neutral-950 text-white py-4 px-6 rounded-2xl border border-neutral-900/80 my-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto w-full">
          {/* Label + Badge Container */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-400 font-sans shrink-0">
              PAYMENT METHODS
            </span>
            {/* Cards Row */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {/* VISA */}
              <div className="w-[54px] h-[26px] sm:w-[60px] sm:h-[28px] bg-white rounded-md flex items-center justify-center select-none shrink-0 border border-neutral-200 shadow-sm transition-all duration-300 hover:scale-105">
                <span className="text-[#1A1F71] font-black italic tracking-wide text-[10px] sm:text-xs">VISA</span>
              </div>

              {/* Mastercard */}
              <div className="w-[54px] h-[26px] sm:w-[60px] sm:h-[28px] bg-white rounded-md flex items-center justify-center select-none shrink-0 border border-neutral-200 shadow-sm transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-center">
                  <div className="relative w-6 h-4 flex items-center justify-center">
                    <div className="absolute left-0.5 w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[#EB001B] opacity-95" />
                    <div className="absolute right-0.5 w-[11px] h-[11px] sm:w-[13px] sm:h-[13px] rounded-full bg-[#F79E1B] opacity-90 mix-blend-multiply" />
                  </div>
                </div>
              </div>

              {/* JCB */}
              <div className="w-[54px] h-[26px] sm:w-[60px] sm:h-[28px] bg-white rounded-md flex items-center justify-center select-none shrink-0 border border-neutral-200 shadow-sm transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-0.5 font-sans">
                  <span className="text-[#004193] font-black tracking-tight text-[10px] sm:text-xs italic">J</span>
                  <span className="text-[#D31115] font-black tracking-tight text-[10px] sm:text-xs italic">C</span>
                  <span className="text-[#008938] font-black tracking-tight text-[10px] sm:text-xs italic">B</span>
                </div>
              </div>

              {/* QRIS */}
              <div className="w-[54px] h-[26px] sm:w-[60px] sm:h-[28px] bg-white rounded-md flex items-center justify-center select-none shrink-0 border border-neutral-200 shadow-sm transition-all duration-300 hover:scale-105">
                <span className="text-[#012d5e] font-black tracking-tight text-[10px] sm:text-xs font-sans">QRIS</span>
              </div>

              {/* Alipay */}
              <div className="w-[54px] h-[26px] sm:w-[60px] sm:h-[28px] bg-white rounded-md flex items-center justify-center select-none shrink-0 border border-neutral-200 shadow-sm transition-all duration-300 hover:scale-105">
                <span className="text-[#00A1E9] font-extrabold text-[10px] sm:text-xs tracking-tight font-sans">Alipay</span>
              </div>

              {/* WeChat Pay */}
              <div className="w-[54px] h-[26px] sm:w-[60px] sm:h-[28px] bg-white rounded-md flex items-center justify-center select-none shrink-0 border border-neutral-200 shadow-sm transition-all duration-300 hover:scale-105">
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="text-[#09BB07] font-semibold text-[8px] sm:text-[9px] tracking-tight">WeChat</span>
                  <span className="text-[#09BB07] font-semibold text-[7px] sm:text-[8px] tracking-tight">Pay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure & Licensed Badge Container */}
          <div className="inline-flex items-center gap-2.5 bg-neutral-900 border border-neutral-800/80 rounded-full px-3.5 py-1.5 text-[9px] sm:text-[10px] text-neutral-400 font-semibold select-none shadow-inner shrink-0">
            <div className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
              <ShieldCheck className="h-3.5 w-3.5 text-neutral-400" />
              <span>Secure</span>
            </div>
            <div className="h-3 w-[1px] bg-neutral-800" />
            <div className="flex items-center gap-1.5 hover:text-white transition-colors duration-200">
              <FileText className="h-3.5 w-3.5 text-neutral-400" />
              <span>Licensed</span>
            </div>
          </div>
        </div>
 
        {/* 3. POLICY LINKS SEGMENT (Above Copyright) */}
        <div className="border-t border-neutral-200 mt-8 pt-6 flex justify-center text-xs text-neutral-500">
          <div className="flex space-x-6 text-neutral-500 items-center">
            <button 
              onClick={() => setPrivacyOpen(true)} 
              className="hover:text-neutral-800 transition-colors cursor-pointer"
            >
              Kebijakan Privasi
            </button>
            <button 
              onClick={() => setTermsOpen(true)} 
              className="hover:text-neutral-800 transition-colors cursor-pointer"
            >
              Syarat &amp; Ketentuan
            </button>
            <button 
              onClick={() => {
                const element = document.getElementById('footer-contact-column');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  element.classList.add('bg-amber-500/10', 'ring-2', 'ring-amber-500/20');
                  setTimeout(() => {
                    element.classList.remove('bg-amber-500/10', 'ring-2', 'ring-amber-500/20');
                  }, 2000);
                }
              }} 
              className="hover:text-neutral-800 transition-colors cursor-pointer"
            >
              Hubungi Kami
            </button>
          </div>
        </div>
 
        {/* 4. COPYRIGHT & DEV ADMIN ACCESS BUTTONS */}
        <div className="border-t border-neutral-200 mt-6 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <div>
            © 2026 <span className="font-semibold text-neutral-700">Smart Journey</span>. All Rights Reserved.
          </div>

          {/* Development / Testing Admin Quick Access Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-md">
              ADMIN DEV ACCESS
            </span>
            <button
              id="btn-admin-smart-journey"
              type="button"
              onClick={() => {
                window.location.hash = '';
                setPage('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-mono text-xs font-bold rounded-xl border border-neutral-800 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Akses Dashboard Admin Smart Journey (/admin)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Smart Journey</span>
            </button>

            <button
              id="btn-admin-share-tour"
              type="button"
              onClick={() => {
                setPage('share-tour');
                window.location.hash = '#admin';
                window.dispatchEvent(new HashChangeEvent('hashchange'));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-mono text-xs font-bold rounded-xl border border-slate-800 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Akses Dashboard Admin Share Tour (/share-tour/admin)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Admin Share Tour</span>
            </button>
          </div>
        </div>
      </div>

      {/* WeChat Info Modal */}
      {isWeChatModalOpen && (
        <div 
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md cursor-pointer animate-fade-in"
          onClick={() => setIsWeChatModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-[440px] bg-white rounded-3xl shadow-2xl border border-neutral-150 p-5 space-y-4 animate-scale-up cursor-default"
          >
            {/* Header / Profile Row */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center overflow-hidden border border-neutral-200 shadow-sm p-1">
                  <img 
                    src="/logo.png" 
                    alt="Smart Journey Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-800 text-sm sm:text-base leading-tight">Smart Journey</h3>
                  <p className="text-xs text-neutral-500 font-medium">WeChat Contact</p>
                </div>
              </div>
              
              {/* Highly visible Close Button in the header */}
              <button 
                id="close-wechat-modal-btn"
                onClick={() => setIsWeChatModalOpen(false)}
                className="flex items-center justify-center p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all border border-neutral-200/50"
                title="Tutup"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* QR Code Container (Dynamic, scaled for maximum scanning size) */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center justify-center bg-neutral-50 rounded-2xl p-2.5 border border-neutral-200/60 relative"
            >
              {!qrImageError ? (
                <div className="relative w-full aspect-[888/1248] max-h-[460px] bg-white p-2 rounded-xl border border-neutral-200/60 shadow-sm flex items-center justify-center overflow-hidden">
                  <img 
                    src="/wechat-qr.png" 
                    alt="Smart Journey WeChat QR Code"
                    className="w-full h-full object-contain rounded-lg select-none"
                    onError={() => {
                      setQrImageError(true);
                    }}
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-emerald-600 w-full bg-neutral-50 rounded-xl">
                  <QrCode className="h-32 w-32 text-neutral-800 mb-2 animate-pulse" />
                  <span className="text-xs text-neutral-500 text-center px-6 leading-relaxed">
                    Unggah file QR Code Anda ke folder <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-amber-600 font-mono font-semibold">public</code> dengan nama <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 text-amber-600 font-mono font-semibold">wechat-qr.png</code>
                  </span>
                </div>
              )}
            </div>

            {/* Copy ID Block */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/60 space-y-2"
            >
              <div className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">WeChat ID / Username</div>
              <div className="flex items-center justify-between gap-2 bg-white px-3.5 py-2.5 rounded-xl border border-neutral-200/40 shadow-sm">
                <span className="font-mono text-sm font-bold text-neutral-800">sjtrans</span>
                <button 
                  onClick={handleCopyWeChat}
                  className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-semibold transition-colors bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-lg border border-amber-200/30"
                >
                  {copiedWeChat ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Help / Instructions */}
            <div className="text-xs text-neutral-500 text-center leading-relaxed px-2">
              Buka aplikasi <span className="font-bold text-emerald-600">WeChat</span> &rarr; Ketuk <span className="font-bold">+</span> di kanan atas &rarr; Pilih <span className="font-bold">Scan</span> atau cari ID <span className="font-bold text-neutral-800 bg-neutral-100 px-1 py-0.5 rounded">sjtrans</span>.
            </div>

            {/* Primary Selesai Button */}
            <button 
              onClick={() => setIsWeChatModalOpen(false)}
              className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-2xl text-sm transition-all shadow-md hover:shadow-lg duration-200"
            >
              Selesai & Tutup
            </button>
          </div>
        </div>
      )}

      {/* Hidden Admin Access Password Modal */}
      {showPasswordModal && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => {
            setShowPasswordModal(false);
            setClickCount(0);
          }}
        >
          <div 
            className="relative w-full max-w-[400px] bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-3xl shadow-2xl p-6 space-y-5 animate-scale-up cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-neutral-100">Kunci Akses Admin</h4>
                  <p className="text-[10px] text-neutral-400 font-medium font-sans">SMARTJOURNEY SECURITY GATEWAY</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowPasswordModal(false);
                  setClickCount(0);
                }}
                className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-200 hover:bg-neutral-800 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content / Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-neutral-300 block">Masukkan Kode Sandi</label>
                  <span className="text-[10px] font-extrabold text-amber-500 bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">
                    Password: sawahjaya2026
                  </span>
                </div>
                <div className="relative">
                  <input 
                    type={showPasswordText ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="••••••••••••••"
                    autoFocus
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-2xl pl-4 pr-10 py-3 text-sm text-neutral-100 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all placeholder:text-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordText(!showPasswordText)}
                    className="absolute right-3.5 top-3.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                  >
                    {showPasswordText ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-rose-500 text-[11px] font-semibold leading-relaxed font-sans">{passwordError}</p>
                )}
              </div>

              {/* Security Hint */}
              <div className="bg-neutral-950/60 p-3 rounded-2xl border border-neutral-800/50 flex gap-2.5 items-start text-[11px] text-neutral-400 font-medium">
                <ShieldCheck className="h-4 w-4 text-amber-500/80 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Akses dibatasi hanya untuk staf resmi Smart Journey. Seluruh aktivitas login dipantau oleh server audit.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button 
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setClickCount(0);
                  }}
                  className="flex-1 py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 font-bold rounded-2xl text-xs transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black rounded-2xl text-xs shadow-md transition-all active:scale-[0.98]"
                >
                  Konfirmasi Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
