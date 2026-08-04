import React from "react";
import { Booking } from "../types";
import { CheckCircle2, Copy, Compass, ClipboardCheck, ExternalLink } from "lucide-react";
import { useLanguageCurrency } from "../LanguageCurrencyContext";

interface BookingSuccessProps {
  booking: Booking;
  onNavigateToTrips: () => void;
  onNavigateToCheckStatus: (code: string, email: string) => void;
}

export default function BookingSuccess({ booking, onNavigateToTrips, onNavigateToCheckStatus }: BookingSuccessProps) {
  const [copied, setCopied] = React.useState(false);
  const { t, formatPrice } = useLanguageCurrency();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(booking.bookingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden p-8 sm:p-10 space-y-8 my-8 text-center bg-card-bg">
      {/* Visual Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center justify-center p-3.5 bg-emerald-50 text-[#315B4F] rounded-full ring-8 ring-emerald-50/50">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-gray-950">
          {t("Booking Submitted Successfully!")}
        </h1>
        <p className="text-sm text-gray-500 font-sans max-w-sm mx-auto">
          {t("We have securely locked your seats. The Smart Journey travel admin team is currently validating your payment.")}
        </p>
      </div>

      {/* Booking Code Card */}
      <div className="bg-[#315B4F]/5 rounded-2xl p-6 border border-[#315B4F]/10 space-y-4">
        <div className="space-y-1">
          <span className="text-[10px] text-gray-400 font-mono tracking-wider block uppercase">{t("Your Exclusive Booking Code")}</span>
          <div className="flex items-center justify-center space-x-2.5">
            <span className="text-2xl sm:text-3xl font-mono font-black text-[#315B4F] tracking-wider select-all">
              {booking.bookingCode}
            </span>
            <button
              id="copy-code-success-btn"
              onClick={copyToClipboard}
              title="Copy to clipboard"
              className={`p-1 px-2.5 rounded-lg text-xs font-bold cursor-pointer transition-colors border ${
                copied 
                  ? "bg-emerald-600 border-emerald-600 text-white" 
                  : "bg-white border-[#315B4F]/20 text-[#315B4F] hover:bg-[#315B4F] hover:text-white"
              }`}
            >
              <Copy className="w-3.5 h-3.5 inline mr-1" />
              {copied ? t("Copied!") : t("Copy")}
            </button>
          </div>
        </div>

        {/* Ledger */}
        <div className="border-t border-emerald-99/10 pt-4 grid grid-cols-2 gap-y-3.5 gap-x-6 text-left text-xs sm:text-sm">
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono">{t("Primary Traveler")}</span>
            <span className="font-semibold text-gray-800">{booking.fullName}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono">{t("Destination Package")}</span>
            <span className="font-semibold text-gray-800 truncate block max-w-[200px]">{t(booking.tripTitle)}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono">{t("Departure Date")}</span>
            <span className="font-semibold text-gray-800">{booking.departureDate}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-400 block uppercase font-mono">{t("Seats Reserved")}</span>
            <span className="font-semibold text-gray-800">{booking.participantsCount} {t("Persons")}</span>
          </div>
          <div className="col-span-2 pt-2 border-t border-emerald-900/10 flex justify-between items-end">
            <span className="text-xs uppercase text-gray-400 font-semibold font-mono">{t("Total Net Cost")}</span>
            <span className="text-base font-display font-bold text-[#315B4F]">{formatPrice(booking.totalPrice)}</span>
          </div>
        </div>
      </div>



      {/* Redirect buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
          id="btn-success-explore"
          onClick={onNavigateToTrips}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#315B4F]" />
          <span>{t("Exit to Trip Explorer")}</span>
        </button>

        <button
          id="btn-success-check-status"
          onClick={() => onNavigateToCheckStatus(booking.bookingCode, booking.email)}
          className="flex-1 inline-flex items-center justify-center space-x-1.5 bg-[#315B4F] hover:bg-[#1f3a32] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all cursor-pointer shadow-md"
        >
          <span>{t("Monitor Status Live")}</span>
          <ExternalLink className="w-4 h-4 text-[#D6B16D]" />
        </button>
      </div>
    </div>
  );
}
