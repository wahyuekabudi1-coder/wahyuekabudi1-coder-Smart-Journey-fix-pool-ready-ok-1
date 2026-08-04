import React from 'react';
import { 
  LayoutDashboard, ClipboardList, Layers, Truck, MapPin, Globe, 
  CheckSquare, Users, Briefcase, Calendar, Percent, CreditCard, 
  DollarSign, Settings, ChevronLeft, ChevronRight, LogOut 
} from 'lucide-react';

export type AdminTab = 
  | 'dashboard'
  | 'bookings' | 'tours' | 'rental' | 'taxi' | 'airport'
  | 'vehicles' | 'drivers' | 'guides' | 'customers'
  | 'pricing' | 'promo' | 'payments' | 'finance'
  | 'cms'
  | 'settings';

interface SidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  pendingBookingsCount: number;
  onExit: () => void;
  role?: 'central' | 'tour' | 'rental' | 'taxi' | 'airport';
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed, 
  pendingBookingsCount,
  onExit,
  role = 'central'
}: SidebarProps) {

  // Define full raw menu groups
  const rawMenuGroups = [
    {
      label: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard Analitik', icon: LayoutDashboard }
      ]
    },
    {
      label: 'OPERASI',
      items: [
        { id: 'bookings', label: 'Booking Center', icon: ClipboardList, badge: pendingBookingsCount > 0 ? pendingBookingsCount : undefined },
        { id: 'tours', label: 'Tour Management', icon: Layers },
        { id: 'rental', label: 'Car Rental', icon: Truck },
        { id: 'taxi', label: 'Taxi Service', icon: MapPin },
        { id: 'airport', label: 'Airport Transfer', icon: Globe }
      ]
    },
    {
      label: 'SUMBER DAYA',
      items: [
        { id: 'vehicles', label: 'Armada Mobil', icon: CheckSquare },
        { id: 'drivers', label: 'Database Supir', icon: Users },
        { id: 'guides', label: 'Pemandu Wisata', icon: Briefcase },
        { id: 'customers', label: 'Database Pelanggan', icon: Users }
      ]
    },
    {
      label: 'BISNIS & KEUANGAN',
      items: [
        { id: 'pricing', label: 'Kalender & Surcharge', icon: Calendar },
        { id: 'promo', label: 'Diskon & Promo', icon: Percent },
        { id: 'payments', label: 'Midtrans Webhook', icon: CreditCard },
        { id: 'finance', label: 'Arus Kas Ledger', icon: DollarSign }
      ]
    },
    {
      label: 'KONTEN',
      items: [
        { id: 'cms', label: 'Website CMS', icon: Globe }
      ]
    },
    {
      label: 'SISTEM',
      items: [
        { id: 'settings', label: 'Settings & RBAC', icon: Settings }
      ]
    }
  ];

  // Filter groups and items depending on active role context
  const menuGroups = rawMenuGroups.map(group => {
    const filteredItems = group.items.filter(item => {
      if (role === 'central') return true;

      // Rules for Sub-Admins
      if (role === 'tour') {
        const allowed = ['dashboard', 'bookings', 'tours', 'guides', 'customers', 'pricing'];
        return allowed.includes(item.id);
      }
      if (role === 'rental') {
        const allowed = ['dashboard', 'bookings', 'rental', 'vehicles', 'drivers', 'customers'];
        return allowed.includes(item.id);
      }
      if (role === 'taxi') {
        const allowed = ['dashboard', 'bookings', 'taxi', 'vehicles', 'drivers', 'customers'];
        return allowed.includes(item.id);
      }
      if (role === 'airport') {
        const allowed = ['dashboard', 'bookings', 'airport', 'vehicles', 'drivers', 'customers'];
        return allowed.includes(item.id);
      }
      return false;
    });

    return {
      ...group,
      items: filteredItems
    };
  }).filter(group => group.items.length > 0);

  // Dynamic Label & Badge for the lower-left profile section
  const profileDetails = {
    central: { name: 'Admin Pusat', roleName: 'Super Administrator', initial: 'AP' },
    tour: { name: 'Manajer Tur', roleName: 'Tour Coordinator', initial: 'MT' },
    rental: { name: 'Koord. Rental', roleName: 'Rental Dispatcher', initial: 'KR' },
    taxi: { name: 'Koord. Taksi', roleName: 'Taxi Dispatcher', initial: 'KT' },
    airport: { name: 'Staf Bandara', roleName: 'Airport Officer', initial: 'SB' }
  }[role] || { name: 'Staf Operasi', roleName: 'Staff', initial: 'SO' };

  return (
    <div 
      className={`bg-neutral-900 border-r border-neutral-800 text-neutral-100 min-h-screen flex flex-col justify-between transition-all duration-300 z-30 sticky top-0 ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex-grow overflow-y-auto no-scrollbar py-6 px-4 space-y-6">
        {/* Company Header Logo */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-5">
          {!collapsed ? (
            <div className="flex items-center gap-2.5 animate-fade-in">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 shadow-md">
                <Globe className="h-5 w-5 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-wider text-neutral-100 font-mono">SMART JOURNEY</h1>
                <span className="text-[9px] font-mono bg-amber-500/10 text-amber-400 font-extrabold px-1.5 py-0.5 rounded border border-amber-500/20">
                  SJOMS v1.0
                </span>
              </div>
            </div>
          ) : (
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-neutral-950 mx-auto shadow-md">
              <Globe className="h-5 w-5 stroke-[2.5]" />
            </div>
          )}

          {/* Collapse Button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white transition-all cursor-pointer"
          >
            {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label} className="space-y-1.5">
              {!collapsed && (
                <span className="text-[10px] font-extrabold text-neutral-500 uppercase tracking-widest px-2.5">
                  {group.label}
                </span>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                        isActive 
                          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold' 
                          : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40 border border-transparent'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-amber-500' : 'text-neutral-400'}`} />
                      
                      {!collapsed && (
                        <span className="truncate flex-grow text-left">
                          {item.label}
                        </span>
                      )}

                      {/* Notification Badges */}
                      {item.badge !== undefined && (
                        <span className={`h-5 min-w-5 px-1.5 text-[10px] font-black rounded-full flex items-center justify-center shrink-0 ${
                          collapsed ? 'absolute top-1 right-1' : ''
                        } bg-rose-500 text-white animate-pulse`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Profile Exit Area */}
      <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex flex-col gap-3">
        {!collapsed && (
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="h-9 w-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black font-mono text-xs">
              {profileDetails.initial}
            </div>
            <div className="min-w-0 flex-grow">
              <p className="text-xs font-extrabold text-neutral-200 truncate">{profileDetails.name}</p>
              <p className="text-[10px] font-semibold text-neutral-500 font-mono truncate">{profileDetails.roleName}</p>
            </div>
          </div>
        )}

        <button
          onClick={onExit}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900 text-neutral-400 hover:text-rose-400 transition-all text-xs font-bold cursor-pointer font-mono"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Pilih Layanan Lain</span>}
        </button>
      </div>
    </div>
  );
}
