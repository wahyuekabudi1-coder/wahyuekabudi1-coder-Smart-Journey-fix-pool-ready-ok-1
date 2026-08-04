import React from "react";
import { Compass, Languages, Coins } from "lucide-react";
import { useLanguageCurrency } from "../LanguageCurrencyContext";
import SawahJayaLogo from "./SawahJayaLogo";

interface CustomerHeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  isAdminLoggedIn: boolean;
}

export default function CustomerHeader({ currentView, onNavigate, isAdminLoggedIn }: CustomerHeaderProps) {
  const { language, setLanguage, currency, setCurrency, t } = useLanguageCurrency();

  return (
    <header className="sticky top-0 z-50 bg-[#315B4F] text-white shadow-md border-b border-[#24453c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            onClick={() => onNavigate("trips")} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="bg-[#D6B16D] p-1.5 rounded-xl transition-transform duration-300 group-hover:scale-110 flex items-center justify-center w-9 h-9">
              {/* Sawah Jaya Custom S Logo */}
              <SawahJayaLogo size={24} color="#315B4F" />
            </div>
            <div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white block uppercase">
                {t("SMART_JOURNEY") === "SMART_JOURNEY" ? "SMART JOURNEY" : t("SMART JOURNEY")}
              </span>
            </div>
          </div>
 
          {/* Controls & Nav */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher Button (English & Chinese) */}
            <div className="flex items-center bg-[#25463c] border border-[#2b5145] rounded-xl p-1" id="lang-switcher">
              <button
                title="English"
                onClick={() => setLanguage("en")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight uppercase transition-all duration-150 cursor-pointer ${
                  language === "en"
                    ? "bg-[#D6B16D] text-[#315B4F] shadow-sm font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                title="中文"
                onClick={() => setLanguage("zh")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                  language === "zh"
                    ? "bg-[#D6B16D] text-[#315B4F] shadow-sm font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                中文
              </button>
            </div>

            {/* Currency Selector (Rupiah, Yuan & Dollar) */}
            <div className="flex items-center bg-[#25463c] border border-[#2b5145] rounded-xl p-1" id="curr-switcher">
              <button
                title="Rupiah (IDR)"
                onClick={() => setCurrency("IDR")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                  currency === "IDR"
                    ? "bg-[#D6B16D] text-[#315B4F] shadow-sm font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                Rp
              </button>
              <button
                title="Yuan (CNY)"
                onClick={() => setCurrency("CNY")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                  currency === "CNY"
                    ? "bg-[#D6B16D] text-[#315B4F] shadow-sm font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                ¥
              </button>
              <button
                title="Dollar (USD)"
                onClick={() => setCurrency("USD")}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold tracking-tight transition-all duration-150 cursor-pointer ${
                  currency === "USD"
                    ? "bg-[#D6B16D] text-[#315B4F] shadow-sm font-semibold"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                $
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
