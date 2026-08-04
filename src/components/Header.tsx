import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { Menu, X, ChevronDown, Calendar, Globe, Plane, Car, Route, Star, Compass, Handshake, Share2, Users } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function Header() {
  const { activePage, setPage, currency, setCurrency, bookings } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  // Monitor scroll to trigger header background blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: any) => {
    setPage(page);
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || activePage !== 'home'
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200/60 py-4'
          : 'bg-white/90 backdrop-blur-md shadow-sm border-b border-neutral-200/50 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <div
            id="brand-logo"
            onClick={() => handleNavigate('home')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            {!imageFailed ? (
              <img 
                src="/logo.png" 
                alt="Smart Journey Logo" 
                className="h-10 sm:h-11 w-auto max-w-[180px] object-contain group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageFailed(true)}
              />
            ) : (
              <div className="bg-amber-500 text-neutral-950 p-2 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Compass className="h-5 w-5 animate-spin-slow" />
              </div>
            )}
            <div>
              <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-amber-600 transition-colors duration-200">
                Smart<span className="text-amber-500"> Journey</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => handleNavigate('home')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activePage === 'home'
                  ? 'text-amber-600 bg-amber-500/10 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Home
            </button>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  ['tours', 'share-tour', 'airport', 'taxi', 'car-rental'].includes(activePage)
                    ? 'text-amber-600 bg-amber-500/10 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span>Service</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 overflow-hidden"
                  >
                     <button
                      onClick={() => handleNavigate('tours')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-neutral-700 hover:text-amber-600 hover:bg-amber-500/5 transition-colors"
                    >
                      <Compass className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold">
                          <span>Tour</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">Bromo, Ijen, Waterfalls</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavigate('share-tour')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-neutral-700 hover:text-amber-600 hover:bg-amber-500/5 transition-colors border-t border-neutral-100"
                    >
                      <Users className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-1.5">
                          <span>Share Tour</span>
                          <span className="text-[8px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Baru</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">Open Trip / Kuota Per Seat</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavigate('airport')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-neutral-700 hover:text-amber-600 hover:bg-amber-500/5 transition-colors"
                    >
                      <Plane className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-1.5">
                          <span>Airport transfer</span>
                          <span className="text-[8px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Soon</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">SUB, DPS, YIA, CGK</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavigate('taxi')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-neutral-700 hover:text-amber-600 hover:bg-amber-500/5 transition-colors"
                    >
                      <Route className="h-4 w-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-1.5">
                          <span>Taxi service</span>
                          <span className="text-[8px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Soon</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">Point-to-point flat fare</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleNavigate('car-rental')}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-left text-neutral-700 hover:text-amber-600 hover:bg-amber-500/5 transition-colors"
                    >
                      <Car className="h-4 w-4 text-amber-500" />
                      <div>
                        <div className="text-sm font-semibold flex items-center gap-1.5">
                          <span>Car rental</span>
                          <span className="text-[8px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Soon</span>
                        </div>
                        <div className="text-[10px] text-neutral-500">Hourly & daily car hire</div>
                      </div>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => handleNavigate('about')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activePage === 'about'
                  ? 'text-amber-600 bg-amber-500/10 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              About
            </button>
          </nav>

          {/* Currency Switcher & CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Currency Switcher */}
            <div className="flex items-center bg-neutral-100 border border-neutral-200 p-1 rounded-full">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                  currency === 'USD'
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('IDR')}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                  currency === 'IDR'
                    ? 'bg-amber-500 text-neutral-950 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                IDR (Rp)
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Quick Currency Button for Mobile */}
            <button
              onClick={() => setCurrency(currency === 'USD' ? 'IDR' : 'USD')}
              className="bg-neutral-100 border border-neutral-200 text-neutral-700 text-xs px-2.5 py-1.5 rounded-lg font-mono font-semibold"
            >
              {currency}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-neutral-600 hover:text-neutral-900 p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-b border-neutral-200 shadow-xl max-h-[calc(100vh-5rem)] overflow-y-auto"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              <button
                onClick={() => handleNavigate('home')}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-neutral-800 hover:bg-neutral-50 font-medium animate-fadeIn"
              >
                Home
              </button>

              <div className="border-t border-neutral-100 pt-2 my-2">
                <div className="px-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  Services
                </div>
                <button
                  onClick={() => handleNavigate('tours')}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-neutral-700 hover:bg-neutral-50 animate-fadeIn"
                >
                  <div className="flex items-center space-x-3">
                    <Compass className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Tour</span>
                  </div>
                </button>
                <button
                  onClick={() => handleNavigate('share-tour')}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-neutral-700 hover:bg-neutral-50 animate-fadeIn"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Share Tour</span>
                  </div>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Baru</span>
                </button>
                <button
                  onClick={() => handleNavigate('airport')}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-neutral-700 hover:bg-neutral-50 animate-fadeIn"
                >
                  <div className="flex items-center space-x-3">
                    <Plane className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Airport transfer</span>
                  </div>
                  <span className="text-[8px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Soon</span>
                </button>
                <button
                  onClick={() => handleNavigate('taxi')}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-neutral-700 hover:bg-neutral-50 animate-fadeIn"
                >
                  <div className="flex items-center space-x-3">
                    <Route className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Taxi service</span>
                  </div>
                  <span className="text-[8px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Soon</span>
                </button>
                <button
                  onClick={() => handleNavigate('car-rental')}
                  className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-neutral-700 hover:bg-neutral-50 animate-fadeIn"
                >
                  <div className="flex items-center space-x-3">
                    <Car className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Car rental</span>
                  </div>
                  <span className="text-[8px] bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded font-mono font-black uppercase tracking-wider">Soon</span>
                </button>
              </div>

              <button
                onClick={() => handleNavigate('about')}
                className="block w-full text-left px-4 py-2.5 rounded-xl text-neutral-800 hover:bg-neutral-50 font-medium"
              >
                About
              </button>

              {/* No more My Bookings or Book Private Tour buttons as requested */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
