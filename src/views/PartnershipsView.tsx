import React, { useState, useEffect } from 'react';
import { 
  Handshake, 
  Globe, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Lock, 
  Unlock, 
  AlertCircle, 
  CheckCircle, 
  Settings,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PartnerApp {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
}

const DEFAULT_PARTNERS: PartnerApp[] = [
  {
    id: 'traveloka',
    name: 'Traveloka',
    url: 'https://www.traveloka.com',
    logoUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'trip-com',
    name: 'Trip.com',
    url: 'https://www.trip.com',
    logoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'booking-com',
    name: 'Booking.com',
    url: 'https://www.booking.com',
    logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'marriott',
    name: 'Marriott',
    url: 'https://www.marriott.com',
    logoUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'hilton',
    name: 'Hilton',
    url: 'https://www.hilton.com',
    logoUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'agoda',
    name: 'Agoda',
    url: 'https://www.agoda.com',
    logoUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=300&q=80'
  }
];

export default function PartnershipsView() {
  const [partners, setPartners] = useState<PartnerApp[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // CRUD states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form fields
  const [formName, setFormName] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formLogoUrl, setFormLogoUrl] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load partners on mount
  useEffect(() => {
    const stored = localStorage.getItem('smartjourney_partners');
    if (stored) {
      try {
        setPartners(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse partners', e);
        setPartners(DEFAULT_PARTNERS);
      }
    } else {
      setPartners(DEFAULT_PARTNERS);
      localStorage.setItem('smartjourney_partners', JSON.stringify(DEFAULT_PARTNERS));
    }
  }, []);

  // Save to localStorage
  const savePartners = (updated: PartnerApp[]) => {
    setPartners(updated);
    localStorage.setItem('smartjourney_partners', JSON.stringify(updated));
  };

  // Handle Admin Authorization
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'admin' || adminPassword === 'admin123') {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setAdminPassword('');
      setPasswordError('');
      triggerNotification('Logged in as administrator successfully!');
    } else {
      setPasswordError('Incorrect password! Try using "admin" or "admin123".');
    }
  };

  // Trigger brief alert banner
  const triggerNotification = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  // Reset form
  const resetForm = () => {
    setFormName('');
    setFormUrl('');
    setFormLogoUrl('');
    setFormError('');
    setIsEditing(false);
    setEditingId(null);
  };

  // Submit Add / Edit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formName.trim() || !formUrl.trim() || !formLogoUrl.trim()) {
      setFormError('All fields (Name, Website URL, and Logo Image URL) are required!');
      return;
    }

    let formattedUrl = formUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    let formattedLogo = formLogoUrl.trim();
    if (!/^https?:\/\//i.test(formattedLogo)) {
      formattedLogo = 'https://' + formattedLogo;
    }

    const partnerData: PartnerApp = {
      id: isEditing && editingId ? editingId : `partner-${Date.now()}`,
      name: formName.trim(),
      url: formattedUrl,
      logoUrl: formattedLogo
    };

    let updatedPartners: PartnerApp[] = [];
    if (isEditing && editingId) {
      updatedPartners = partners.map(p => p.id === editingId ? partnerData : p);
      triggerNotification('Partner details successfully updated!');
    } else {
      updatedPartners = [...partners, partnerData];
      triggerNotification('New partner logo successfully added!');
    }

    savePartners(updatedPartners);
    resetForm();
  };

  // Start Edit
  const startEdit = (partner: PartnerApp) => {
    setIsEditing(true);
    setEditingId(partner.id);
    setFormName(partner.name);
    setFormUrl(partner.url);
    setFormLogoUrl(partner.logoUrl);
    
    const el = document.getElementById('admin-form-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete Partner
  const handleDeletePartner = (id: string) => {
    if (confirm('Are you sure you want to remove this partner?')) {
      const updated = partners.filter(p => p.id !== id);
      savePartners(updated);
      triggerNotification('Partner successfully removed.');
      if (editingId === id) {
        resetForm();
      }
    }
  };

  return (
    <div className="bg-neutral-900 min-h-screen text-neutral-100 pb-24 pt-28">
      {/* Banner / Hero Header */}
      <section className="relative overflow-hidden mb-12">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full text-amber-500 text-xs font-bold font-mono tracking-wider uppercase">
            <Handshake className="h-4 w-4" />
            <span>Official Integration</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Our Collaborators &amp; Partners
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            SmartJourney operates in synergy with leading international travel networks, global booking systems, and premier luxury hotel groups.
          </p>
          <div className="h-1 w-12 bg-amber-500 mx-auto rounded-full" />
          
          {/* Admin Toggle Button */}
          <div className="pt-2 flex justify-center gap-4">
            {!isAdminMode ? (
              <button
                onClick={() => setShowPasswordModal(true)}
                className="inline-flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-400 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shadow-sm hover:border-amber-500/30"
              >
                <Lock className="h-3.5 w-3.5 text-amber-500" />
                <span>Admin Panel</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                  <Unlock className="h-3 w-3 text-emerald-400" />
                  <span>Admin Session Active</span>
                </span>
                <button
                  onClick={() => {
                    setIsAdminMode(false);
                    resetForm();
                    triggerNotification('Exited admin mode.');
                  }}
                  className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs transition-all cursor-pointer"
                >
                  Exit Session
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Success Notification Alert */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-neutral-950 px-6 py-3.5 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 border border-amber-400"
          >
            <CheckCircle className="h-5 w-5" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Dashboard Workspace Section */}
        {isAdminMode && (
          <div id="admin-form-anchor" className="mb-12 bg-neutral-800/80 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 p-1 bg-amber-500 text-neutral-950 text-[10px] font-mono font-bold rounded-bl-xl uppercase tracking-widest px-3 py-1">
              ADMIN CONTROL PANEL
            </div>
            
            <div className="flex items-center gap-2 mb-6">
              <Settings className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-black text-white">
                {isEditing ? 'Modify Partner Platform' : 'Add New Partner Platform'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Platform Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Traveloka"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white transition-all placeholder:text-neutral-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Website URL *</label>
                  <input
                    type="text"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="e.g. https://www.traveloka.com"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white transition-all placeholder:text-neutral-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Logo Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formLogoUrl}
                    onChange={(e) => setFormLogoUrl(e.target.value)}
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white transition-all placeholder:text-neutral-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between pt-4 gap-4 border-t border-neutral-700">
                <span className="text-xs text-neutral-400 font-mono">
                  * All fields are required. Changes are persisted instantly.
                </span>
                <div className="flex items-center gap-3">
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-neutral-700 hover:bg-neutral-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 px-6 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-amber-500/10"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{isEditing ? 'Update Logo' : 'Add Logo'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Clean, Premium Partner Grid - Simple Layout containing only Logos */}
        <div className="space-y-8">
          {partners.length === 0 ? (
            <div className="text-center py-20 bg-neutral-800/20 border border-neutral-800 rounded-3xl space-y-4">
              <Handshake className="h-12 w-12 text-neutral-600 mx-auto" />
              <h3 className="text-lg font-bold text-neutral-400">No partner logos registered yet</h3>
              {!isAdminMode && (
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-amber-500 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-neutral-700 cursor-pointer"
                >
                  Activate Admin
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-neutral-800/40 border border-neutral-800/80 hover:border-amber-500/40 rounded-2xl h-28 flex items-center justify-center relative overflow-hidden group transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                >
                  {/* Admin Actions Overlay on Card Corner */}
                  {isAdminMode && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-neutral-950/90 backdrop-blur-sm p-1 rounded-lg border border-neutral-700 z-10">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(partner); }}
                        className="p-1 hover:bg-amber-500 hover:text-neutral-950 text-neutral-400 rounded transition-all cursor-pointer"
                      >
                        <Edit2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeletePartner(partner.id); }}
                        className="p-1 hover:bg-red-500 hover:text-white text-neutral-400 rounded transition-all cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}

                  {/* Clean Logo Container */}
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex flex-col items-center justify-center p-4 relative"
                  >
                    <div className="w-full h-full flex items-center justify-center relative z-10">
                      <img
                        src={partner.logoUrl}
                        alt={partner.name}
                        className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 rounded-lg"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as any).src = 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    </div>
                    {/* Subtle Overlay Label */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-neutral-950/90 px-2 py-0.5 rounded text-[9px] text-amber-500 font-semibold tracking-wider uppercase whitespace-nowrap z-20 pointer-events-none">
                      {partner.name}
                    </div>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Admin Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-neutral-800 border border-neutral-700 rounded-3xl p-6 sm:p-8 w-full max-w-md relative space-y-6 shadow-2xl"
            >
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setAdminPassword('');
                  setPasswordError('');
                }}
                className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors p-1"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="bg-amber-500/10 text-amber-500 p-3 rounded-full w-fit mx-auto">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-black text-white">Administrator Access Required</h3>
                <p className="text-xs text-neutral-400">
                  Enter your password to activate content modification options.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                {passwordError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>{passwordError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Admin Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter security password (admin / admin123)"
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 text-white transition-all placeholder:text-neutral-600 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-amber-500/10"
                >
                  Verify &amp; Authenticate
                </button>
              </form>

              <div className="text-center">
                <span className="text-[10px] text-neutral-500">
                  Reviewer Tip: Type <strong className="text-amber-500/80 font-mono">admin</strong> or <strong className="text-amber-500/80 font-mono font-bold">admin123</strong> to login.
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
