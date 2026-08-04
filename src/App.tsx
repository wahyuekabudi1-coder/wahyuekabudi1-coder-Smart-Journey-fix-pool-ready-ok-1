/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import PrivacyModal from './components/PrivacyModal';
import TermsModal from './components/TermsModal';
import HomeView from './views/HomeView';
import ToursView from './views/ToursView';
import AirportTransferView from './views/AirportTransferView';
import TaxiView from './views/TaxiView';
import PartnershipsView from './views/PartnershipsView';
import BookingsView from './views/BookingsView';
import CarRentalView from './views/CarRentalView';
import AboutView from './views/AboutView';
import MidtransPayView from './views/MidtransPayView';
import AdminView from './views/AdminView';
import ShareTourView from './views/ShareTourView';
import { motion, AnimatePresence } from 'motion/react';

function AppContent() {
  const { activePage } = useApp();

  // Render the appropriate view based on active page
  const renderView = () => {
    switch (activePage) {
      case 'home':
        return <HomeView />;
      case 'tours':
        return <ToursView />;
      case 'share-tour':
        return <ShareTourView />;
      case 'airport':
        return <AirportTransferView />;
      case 'taxi':
        return <TaxiView />;
      case 'car-rental':
        return <CarRentalView />;
      case 'about':
        return <AboutView />;
      case 'partnerships':
        return <PartnershipsView />;
      case 'bookings':
        return <BookingsView />;
      case 'midtrans-pay':
        return <MidtransPayView />;
      case 'admin':
        return <AdminView />;
      default:
        return <HomeView />;
    }
  };

  if (activePage === 'midtrans-pay' || activePage === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
        <main className="grow">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Sticky Premium Header */}
      <Header />

      {/* Main Dynamic View Content Container */}
      <main className="grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating 24/7 WhatsApp help-desk */}
      <FloatingWhatsApp />

      {/* Global Privacy Policy Modal */}
      <PrivacyModal />

      {/* Global Terms and Conditions Modal */}
      <TermsModal />

      {/* Sticky 4-Column Footer */}
      <Footer />
      
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
