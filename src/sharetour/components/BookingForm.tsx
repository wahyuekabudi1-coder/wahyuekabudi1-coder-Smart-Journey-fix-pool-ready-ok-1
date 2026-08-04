import React, { useState } from "react";
import { Trip, Batch, Booking } from "../types";
import { ChevronLeft, Sparkles, ShieldCheck, Send, MapPin, Clock } from "lucide-react";
import { createBooking } from "../api";
import { useLanguageCurrency } from "../LanguageCurrencyContext";

interface BookingFormProps {
  trip: Trip;
  batch: Batch;
  onBack: () => void;
  onSuccess: (booking: Booking) => void;
}

export default function BookingForm({ trip, batch, onBack, onSuccess }: BookingFormProps) {
  const { t, formatPrice, language } = useLanguageCurrency();

  // 8 Specific fields requested in Indonesian / English matching the specs
  const [name, setName] = useState(""); // 1. Nama Lengkap (Hanzi / sesuai paspor)
  const [englishName, setEnglishName] = useState(""); // 2. Nama Inggris (Pinyin / Sesuai paspor)
  const [weChatId, setWeChatId] = useState(""); // 3. ID WeChat
  const [xiaoHongShuId, setXiaoHongShuId] = useState(""); // 4. ID XiaoHongShu / Red ID
  const [city, setCity] = useState(""); // 5. Kota Tinggal Saat Ini
  const [whatsapp, setWhatsapp] = useState(""); // 6. No WhatsApp (Aktif)
  const [email, setEmail] = useState(""); // 7. Email
  const [flightNumber, setFlightNumber] = useState(""); // 8. No Penerbangan (Flight Number kedatangan)

  // Participants Counter (Max is 12)
  const [numParticipants, setNumParticipants] = useState(1);
  const [companionNames, setCompanionNames] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatDate = (dateStr: string) => {
    if (language === "zh") {
      const d = new Date(dateStr);
      return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  // Adjust companion arrays dynamically (Max 12, and restricted by availableSeats)
  const handleParticipantsChange = (val: number) => {
    const allowedMax = Math.min(12, batch.availableSeats);
    const count = Math.max(1, Math.min(val, allowedMax));
    setNumParticipants(count);
    
    const companionsDiff = count - 1;
    if (companionsDiff > companionNames.length) {
      const added = Array(companionsDiff - companionNames.length).fill("");
      setCompanionNames([...companionNames, ...added]);
    } else if (companionsDiff < companionNames.length) {
      setCompanionNames(companionNames.slice(0, companionsDiff));
    }
  };

  const handleCompanionNameChange = (index: number, val: string) => {
    const updated = [...companionNames];
    updated[index] = val;
    setCompanionNames(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !englishName || !email || !city || !weChatId || !xiaoHongShuId) {
      setErrorMsg(t("Please fill in all mandatory fields (Full Name, English Name, WeChat ID, XiaoHongShu ID, City, and Email). WhatsApp and Flight Number are optional."));
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const participantsList = [name];
    companionNames.forEach((n) => {
      if (n.trim()) participantsList.push(n.trim());
    });

    const calculatedTotalPrice = numParticipants * batch.price;

    try {
      const payload = {
        tripId: trip.id,
        batchId: batch.id,
        // Main Booking details map to types parameters
        fullName: name.trim(),
        email: email.toLowerCase().trim(),
        phone: whatsapp.trim(),
        participantsCount: numParticipants,
        participantsNames: participantsList,
        proofOfPayment: "NOT_APPLICABLE_SLEEK_THEME", // Explicitly bypass payment info on user checkout
        totalPrice: calculatedTotalPrice,
        // Specific detailed fields nested within participantData
        participantData: {
          name: name.trim(),
          englishName: englishName.trim(),
          weChatId: weChatId.trim(),
          xiaoHongShuId: xiaoHongShuId.trim(),
          city: city.trim(),
          whatsapp: whatsapp.trim(),
          email: email.toLowerCase().trim(),
          flightNumber: flightNumber ? flightNumber.toUpperCase().trim() : ""
        },
        adminNotes: ""
      };

      const result = await createBooking(payload);
      onSuccess(result);
    } catch (e: any) {
      setErrorMsg(e.message || t("Failed to submit booking registration. Please verify connection and try again."));
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = numParticipants * batch.price;

  return (
    <div className="space-y-8 pb-16 animate-fade-in" id="booking-registration-module">
      {/* Back to information link */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-gray-500 hover:text-[#315B4F] text-sm font-semibold transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5 text-[#315B4F]" />
        <span>{t("Cancel & Back to Trip Details")}</span>
      </button>

      {/* Grid: Left column is reservation brief, Right is core input */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Booking Brief */}
        <div className="space-y-6">
          <div className="bg-[#315B4F] text-white rounded-3xl p-6 shadow-md relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 w-40 h-40 rounded-full bg-white/5 pointer-events-none"></div>
            <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-[#D6B16D]/10 pointer-events-none"></div>

            <div className="relative space-y-4">
              <span className="text-[10px] text-[#D6B16D] font-mono tracking-widest uppercase font-bold">
                {t("Trip Registration")}
              </span>
              <div className="space-y-1">
                <h1 className="font-display font-black text-lg leading-tight text-white drop-shadow-sm">
                  {t(trip.title)}
                </h1>
                <p className="text-xs text-emerald-100 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#D6B16D]" />
                  <span>{t(trip.location)}</span>
                </p>
              </div>

              <div className="border-t border-white/10 pt-4 flex items-center justify-between text-xs text-emerald-200">
                <span>{t("Selected Schedule")}</span>
                <span className="font-bold text-white">{formatDate(batch.departureDate)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-emerald-200">
                <span>{t("Duration")}</span>
                <span className="font-bold text-white">{t(trip.duration)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400">
              {t("Pricing Details")}
            </h2>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex justify-between items-center text-gray-500">
                <span>{t("Trip Rate per Person")}</span>
                <span className="font-bold text-gray-800">{formatPrice(batch.price)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-500">
                <span>{t("Total Registering Seats")}</span>
                <span className="font-bold text-[#315B4F] bg-emerald-50 px-2 py-0.5 rounded">
                  {numParticipants} {t(numParticipants > 1 ? "Travelers" : "Traveler")}
                </span>
              </div>
              <div className="border-t border-gray-150 pt-3 flex justify-between items-end">
                <span className="font-bold text-gray-700">{t("Subtotal Fee Due")}</span>
                <span className="font-display font-black text-lg text-[#315B4F]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/45 rounded-2xl p-4 text-[11px] text-amber-800 leading-relaxed space-y-1.5 font-sans">
              <div className="font-bold flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>{t("Information-First Flow")}</span>
              </div>
              <p>
                {t("Smart Journey handles payment processing offline. Form input is direct; your placement is locked based on registration details below.")}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Participant Form Input */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-md space-y-8">
            <div className="border-b border-gray-100 pb-4 space-y-1">
              <h2 className="text-lg font-display font-extrabold text-gray-900">
                {t("Traveler Profile Registration")}
              </h2>
              <p className="text-xs text-gray-400">{t("Please provide precise passenger credentials of the primary booker matching your travel files.")}</p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 text-rose-800 p-4 rounded-xl text-xs border border-rose-100 flex items-start space-x-2.5">
                <span className="font-bold">{t("Error")}:</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Traveler inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Field 1: Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  1. {t("Nama Lengkap")} <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("Hanzi atau sesuai paspor (e.g. 陈智华 / Tony Tan)")}</span>
                </label>
                <input
                  id="book-fullName"
                  type="text"
                  required
                  placeholder={t("Nama Lengkap / Full Name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>

              {/* Field 2: Nama Inggris (Pinyin / Sesuai paspor) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  2. {t("English Name")} <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("English name matching passport (e.g. CHEN ZHIHUA / TONY TAN)")}</span>
                </label>
                <input
                  id="book-englishName"
                  type="text"
                  required
                  placeholder={t("English Name / Pinyin")}
                  value={englishName}
                  onChange={(e) => setEnglishName(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>

              {/* Field 3: ID WeChat */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  3. {t("WeChat ID")} <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("Masukkan ID WeChat Anda (e.g. tony_wx)")}</span>
                </label>
                <input
                  id="book-weChatId"
                  type="text"
                  required
                  placeholder={t("ID WeChat (Wajib)")}
                  value={weChatId}
                  onChange={(e) => setWeChatId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>

              {/* Field 4: ID XiaoHongShu */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  4. {t("XiaoHongShu ID (Red ID)")} <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("Masukkan ID XiaoHongShu / Red ID Anda (e.g. user_red)")}</span>
                </label>
                <input
                  id="book-redId"
                  type="text"
                  required
                  placeholder={t("ID XiaoHongShu (Wajib)")}
                  value={xiaoHongShuId}
                  onChange={(e) => setXiaoHongShuId(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>

              {/* Field 5: Kota Tinggal Saat Ini */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  5. {t("Kota Tinggal Saat Ini")} <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("Your current city of residence (e.g. Jakarta / Shanghai)")}</span>
                </label>
                <input
                  id="book-city"
                  type="text"
                  required
                  placeholder={t("City / Kota Tinggal")}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>

              {/* Field 6: No WhatsApp (Aktif) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  6. {t("No WhatsApp (Aktif)")} <span className="text-xs text-gray-400 font-normal">({t("Optional")})</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("Active WhatsApp with count code (e.g. +62 812-3456-7890)")}</span>
                </label>
                <input
                  id="book-whatsapp"
                  type="tel"
                  placeholder={t("WhatsApp Number")}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>

              {/* Field 7: Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  7. {t("Email Address")} <span className="text-rose-500">*</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("Primary contact email (e.g. traveller@example.com)")}</span>
                </label>
                <input
                  id="book-email"
                  type="email"
                  required
                  placeholder={t("Email Address")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>

              {/* Field 8: No Penerbangan (Flight Number kedatangan) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 block">
                  8. {t("Nomor Penerbangan")} <span className="text-xs text-gray-400 font-normal">({t("Optional")})</span>
                  <span className="text-[10px] text-gray-400 font-normal block">{t("Arrival Flight Number (e.g. SQ956 or GA412)")}</span>
                </label>
                <input
                  id="book-flightNumber"
                  type="text"
                  placeholder={t("Arrival Flight (e.g. SQ956)")}
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#315B4F]/50 focus:border-[#315B4F]"
                />
              </div>
            </div>

            {/* Participants Count */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-700 block">{t("Total Booking Seats (Max 12)")}</span>
                  <p className="text-[11px] text-[#315B4F] font-semibold">{t("Maximum 12 participants can be mapped to a single checkout lock.")}</p>
                </div>
                
                <div className="flex items-center space-x-3 bg-gray-50 px-3 py-1.5 rounded-2xl border border-gray-200 w-fit self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleParticipantsChange(numParticipants - 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-black cursor-pointer shadow-sm select-none"
                  >
                    -
                  </button>
                  <span className="text-sm font-mono font-bold text-gray-800 text-center w-24">
                    {numParticipants} {t(numParticipants > 1 ? "Travelers" : "Traveler")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleParticipantsChange(numParticipants + 1)}
                    className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 flex items-center justify-center font-black cursor-pointer shadow-sm select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Dynamic companion entries */}
              {numParticipants > 1 && (
                <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 animate-fade-in">
                  <span className="text-xs font-bold text-gray-700 block">{t("Additional Companion Full Names")}</span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {companionNames.map((cName, cIdx) => (
                      <div key={cIdx} className="space-y-1">
                        <label className="text-[10px] text-gray-400 font-mono font-bold uppercase">{t("Companion")} #{cIdx + 2} {t("Name")}</label>
                        <input
                          id={`companion-${cIdx}`}
                          type="text"
                          required
                          placeholder={`${t("Full Name of Traveler")} ${cIdx + 2}`}
                          value={cName}
                          onChange={(e) => handleCompanionNameChange(cIdx, e.target.value)}
                          className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#315B4F]"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submission Block */}
            <div className="pt-6 border-t border-gray-100">
              <button
                id="btn-submit-booking-form"
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl text-white font-display font-bold text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center space-x-2 ${
                  loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-[#315B4F] hover:bg-[#1f3a32] cursor-pointer"
                }`}
              >
                <Send className="w-4 h-4 text-[#D6B16D]" />
                <span>
                  {loading ? t("Registering Locked Quota...") : `${t("Submit Registration Request")} (${formatPrice(totalPrice)})`}
                </span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
