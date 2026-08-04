import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { TOURS } from '../data';
import { 
  ArrowLeft, Calendar, Clock, Check, X, ChevronDown, ChevronUp, Star, MapPin, 
  Users, Car, Plane, Route, ShieldCheck, Info, Compass, Gift, AlertTriangle, ArrowRight,
  Coffee, Sunrise, Utensils, Bed, Sparkles, Lock, Unlock, Maximize2, Eye, Minimize2, ChevronLeft, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';
import { motion, AnimatePresence } from 'motion/react';
import CustomerReviewsSection from '../components/CustomerReviewsSection';

interface TourDetailViewProps {
  tourId: string;
  onBack: () => void;
}

// Activity data schema
interface ActivityItem {
  time: string;
  title: string;
  desc: string;
  iconType: 'pickup' | 'jeep' | 'sunrise' | 'trek' | 'food' | 'volcano' | 'waterfall' | 'rest' | 'hotel' | 'transfer' | 'city' | 'beach' | 'boat';
}

interface DayItinerary {
  dayNum: number;
  dayTitle: string;
  activities: ActivityItem[];
}

// Structured hourly itineraries for all tours to satisfy "itinerary per hari, jam ini jam ini jam ini"
const COMPREHENSIVE_ITINERARIES: Record<string, DayItinerary[]> = {
  'bromo': [
    {
      dayNum: 1,
      dayTitle: 'Midnight Departure & Sunrise Celebration',
      activities: [
        { time: '00:00 - 02:30', title: 'Midnight Hotel Pick Up', desc: 'Penjemputan dengan armada MPV ber-AC premium langsung dari akomodasi Anda di Surabaya atau Malang (Hotel, Stasiun, atau Bandara). Pemandu dan driver kami siap melayani perjalanan malam Anda.', iconType: 'pickup' },
        { time: '02:30 - 03:30', title: 'Jeep Land Cruiser Transfer', desc: 'Tiba di rest area transit Tosari atau Cemoro Lawang. Berpindah ke kendaraan ikonik Toyota Land Cruiser 4x4 off-road tangguh untuk medan pasir ekstrem.', iconType: 'jeep' },
        { time: '03:30 - 04:30', title: 'Ascent to Penanjakan Peak', desc: 'Perjalanan mendaki menyusuri tebing pegunungan yang berkabut tebal menuju titik pandang sunrise tertinggi di Gunung Penanjakan.', iconType: 'transfer' },
        { time: '04:30 - 06:00', title: 'Golden Bromo Sunrise Spectacular', desc: 'Menikmati teh manis atau kopi hitam hangat khas Tengger sembari menyaksikan detik-detik terbitnya matahari keemasan yang menyinari seluruh kaldera Gunung Bromo, Gunung Batok, dan latar belakang Gunung Semeru yang megah.', iconType: 'sunrise' },
        { time: '06:00 - 08:00', title: 'Safari Cruise at Sea of Sand', desc: 'Jeep menuruni lereng curam melintasi Lautan Pasir vulkanik yang mistis. Berhenti sejenak untuk sesi pemotretan estetik bertema safari bersama Jeep Anda.', iconType: 'jeep' },
        { time: '08:00 - 09:30', title: 'Volcanic Crater Rim Trekking', desc: 'Berjalan kaki santai atau menunggang kuda poni lokal melintasi pasir berbisik, lalu menaiki 250 anak tangga beton kokoh hingga berdiri tepat di bibir kawah aktif Bromo yang bergemuruh.', iconType: 'volcano' },
        { time: '09:30 - 11:00', title: 'Hot Javanese Breakfast & Clean Up', desc: 'Kembali ke transit lodge untuk sarapan prasmanan hidangan lokal yang hangat khas pegunungan, mandi air panas, bersantai sejenak dan bersih-bersih diri.', iconType: 'food' },
        { time: '11:00 - 13:30', title: 'Comfortable Return Transfer', desc: 'Perjalanan pulang kembali menuju Kota Surabaya atau Malang dengan kenyamanan pendingin AC penuh dan pengantaran tepat di lokasi awal Anda.', iconType: 'transfer' }
      ]
    }
  ],
  'ijen': [
    {
      dayNum: 1,
      dayTitle: 'Midnight Sulfur Flame Expedition',
      activities: [
        { time: '00:00 - 01:30', title: 'Banyuwangi Hotel Pick Up', desc: 'Penjemputan malam hari dari hotel Anda di Kota Banyuwangi atau Pelabuhan Feri Ketapang menggunakan mobil privat ber-AC.', iconType: 'pickup' },
        { time: '01:30 - 02:00', title: 'Paltuding Base Camp Preparation', desc: 'Tiba di gerbang masuk utama Paltuding (Cagar Alam Ijen). Pendaftaran tiket masuk, pembagian masker gas respirator steril profesional, dan kacamata pelindung, dilanjutkan dengan pengarahan oleh local ranger.', iconType: 'rest' },
        { time: '02:00 - 03:45', title: 'Night Trekking Up Mt. Ijen', desc: 'Melakukan pendakian malam sepanjang 3 kilometer menyusuri jalur setapak tanah berpasir berundak di bawah naungan rindangnya pohon pinus.', iconType: 'trek' },
        { time: '03:45 - 05:15', title: 'Electric Blue Fire Close-Up', desc: 'Turun ke dasar kawah aktif yang terjal bersama ranger berpengalaman untuk melihat fenomena alam langka tiada duanya di dunia: semburan gas belerang cair berkobar biru menyala elektrik yang magis.', iconType: 'volcano' },
        { time: '05:15 - 07:00', title: 'Turquoise Lake & Sunrise view', desc: 'Mendaki kembali ke bibir kawah saat fajar menyingsing untuk menyaksikan matahari terbit menyinari keindahan Danau Kawah Asam paling korosif di dunia berwarna hijau toska yang spektakuler.', iconType: 'sunrise' },
        { time: '07:00 - 08:30', title: 'Descent & Sulfur Miners Meet', desc: 'Trekking santai turun kembali menuju pos Paltuding sembari bertegur sapa dengan para penambang belerang tradisional yang perkasa memikul keranjang belerang hingga 80 kilogram.', iconType: 'trek' },
        { time: '08:30 - 10:00', title: 'Warm Local Breakfast', desc: 'Menikmati sarapan prasmanan nasi hangat khas Banyuwangi, gorengan renyah, teh manis hangat, atau secangkir seduhan kopi Arabika kawah Ijen.', iconType: 'food' },
        { time: '10:00 - 11:30', title: 'Safe Return Drop Off', desc: 'Perjalanan darat mengantar Anda kembali menuju stasiun, bandara, pelabuhan, atau hotel Anda di Banyuwangi dengan selamat.', iconType: 'transfer' }
      ]
    }
  ],
  'tumpak-sewu': [
    {
      dayNum: 1,
      dayTitle: 'Ultimate Canyon Waterfall Adventure',
      activities: [
        { time: '06:30 - 09:00', title: 'Morning Scenic Transfer', desc: 'Penjemputan pagi hari dari hotel Anda di Kota Malang (atau 05:00 AM jika dari Surabaya) melintasi rute perbukitan hijau perkebunan buah salak.', iconType: 'pickup' },
        { time: '09:00 - 09:30', title: 'Upper Viewpoint Panorama', desc: 'Tiba di gerbang Tumpak Sewu. Menikmati panorama memukau dari tepi tebing atas, memandang aliran air terjun melingkar 180 derajat menyerupai tirai raksasa dengan latar megah Gunung Semeru.', iconType: 'sunrise' },
        { time: '09:30 - 10:15', title: 'Thrilling Canyon Floor Descent', desc: 'Mulai turun menyusuri tebing jurang yang dikelilingi bambu pengaman, tangga semen kokoh, dan jembatan penyeberangan air dipandu ranger lokal berlisensi.', iconType: 'trek' },
        { time: '10:15 - 11:30', title: 'Base of Tumpak Sewu', desc: 'Berdiri tepat di bawah kaki air terjun "Seribu Air", merasakan hempasan kabut air dingin berenergi alami yang sangat segar di dasar ngarai hijau subur.', iconType: 'waterfall' },
        { time: '11:30 - 13:00', title: 'Goa Tetes Cave Exploring', desc: 'Trekking menyusuri sungai jernih setinggi lutut menuju Goa Tetes, labirin kawah gua kapur bertingkat di mana air menetes mengalir indah merembes dari stalaktit.', iconType: 'trek' },
        { time: '13:00 - 14:30', title: 'Local Feast & Shower', desc: 'Mendaki kembali ke gerbang atas. Mandi bilas air hangat, berganti pakaian kering, dan menikmati makan siang nasi timbel lezat khas masakan tradisional pedesaan.', iconType: 'food' },
        { time: '14:30 - 17:00', title: 'Malang or Surabaya Drop Off', desc: 'Perjalanan kembali dengan mobil privat ber-AC menuju titik penjemputan Anda semula di Kota Malang atau Surabaya.', iconType: 'transfer' }
      ]
    }
  ],
  'malang-city': [
    {
      dayNum: 1,
      dayTitle: 'Malang Heritage Walks & Alpine Batu Apple picking',
      activities: [
        { time: '08:30 - 09:00', title: 'Hotel Lobby Pick Up', desc: 'Dijemput oleh pemandu wisata profesional berbahasa Inggris/Indonesia kami di lobi hotel tempat Anda menginap di Malang.', iconType: 'pickup' },
        { time: '09:00 - 10:30', title: 'Jodipan Colorful Village', desc: 'Jalan-jalan menyusuri Kampung Warna-Warni Jodipan yang ikonis, melewati mural artistik, jembatan kaca spektakuler, dan spot foto tiga dimensi kreatif.', iconType: 'city' },
        { time: '10:30 - 12:00', title: 'Dutch Colonial Heritage Cruise', desc: 'Menjelajahi kawasan megah Jalan Ijen Boulevard, tugu bundaran balai kota peninggalan Belanda, gereja katolik kuno, dan pasar burung tradisional.', iconType: 'city' },
        { time: '12:00 - 13:30', title: 'Boutique Colonial Dining', desc: 'Makan siang berkelas di restoran bersejarah bergaya kolonial peninggalan era abad pertengahan dengan menu kuliner nusantara premium.', iconType: 'food' },
        { time: '13:30 - 14:30', title: 'Ascending to Batu Highlands', desc: 'Perjalanan menanjak yang sejuk melintasi lereng gunung menuju Kota Wisata Batu di ketinggian 1.000 mdpl.', iconType: 'transfer' },
        { time: '14:30 - 16:00', title: 'Interactive Apple Orchard picking', desc: 'Memasuki perkebunan apel organik lokal, belajar budidaya apel, dan memetik buah apel jenis Manalagi yang manis renyah langsung dari dahan pohon sepuasnya.', iconType: 'beach' },
        { time: '16:00 - 17:30', title: 'Coban Rondo Waterfall & Labirin', desc: 'Melihat air terjun legenda Coban Rondo yang tersembunyi di rimbunnya hutan pinus, lalu mencoba tantangan labirin tanaman hijau di area taman bermain.', iconType: 'waterfall' },
        { time: '17:30 - 18:30', title: 'Return to Malang Hotel', desc: 'Perjalanan kembali menuju Kota Malang dan pengantaran aman langsung di hotel akomodasi Anda.', iconType: 'transfer' }
      ]
    }
  ],
  'bromo-madakaripura-2d': [
    {
      dayNum: 1,
      dayTitle: 'Madakaripura Emperor Falls to Bromo Slopes',
      activities: [
        { time: '08:00 - 11:00', title: 'Surabaya/Malang Departure', desc: 'Penjemputan premium dari titik pilihan Anda, dilanjutkan perjalanan tol ber-AC menuju Probolinggo.', iconType: 'pickup' },
        { time: '11:00 - 13:30', title: 'Local Javanese Lunch & Transit', desc: 'Menikmati makan siang hidangan segar lokal, lalu berpindah kendaraan ojek lokal berlisensi menuju gerbang ngarai Madakaripura.', iconType: 'food' },
        { time: '13:30 - 16:00', title: 'Madakaripura Trekking Expedition', desc: 'Trekking menyusuri tebing vertikal berlumut yang membumbung tinggi 200 meter, melintasi gerimis air terjun abadi tempat pertapaan patih legendaris Gajah Mada.', iconType: 'waterfall' },
        { time: '16:00 - 17:30', title: 'Bromo Highland Mountain Drive', desc: 'Perjalanan menanjak seru menyusuri lereng vulkanik menuju desa Cemoro Lawang di bibir kaldera Bromo.', iconType: 'transfer' },
        { time: '17:30 - 20:00', title: 'Mountain Resort Check-In & Dinner', desc: 'Check-in di resor/lodge bintang premium pilihan Anda, santap malam sup hangat di tengah udara sejuk pegunungan (10-15°C), lalu istirahat awal.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 2,
      dayTitle: 'Bromo Volcanic Sunrise & Rim Conquest',
      activities: [
        { time: '03:00 - 04:30', title: 'Astronomic Sunrise Jeep Cruise', desc: 'Bangun pagi buta, dijemput langsung oleh Jeep Land Cruiser 4x4 melintasi Lautan Pasir yang gelap pekat menuju puncak Bukit Penanjakan.', iconType: 'jeep' },
        { time: '04:30 - 06:00', title: 'Witnessing Bromo Sea of Clouds', desc: 'Menikmati teh manis atau cokelat hangat sembari memandang matahari terbit keemasan yang perlahan membelah kabut awan di atas kaldera Tengger.', iconType: 'sunrise' },
        { time: '06:00 - 08:30', title: 'Conquering the Active Crater Rim', desc: 'Jeep menyeberangi Lautan Pasir vulkanik. Berjalan kaki menanjak atau naik kuda, lalu menaiki anak tangga kawah untuk melihat langsung kawah Bromo yang mengepulkan asap belerang putih tebal.', iconType: 'volcano' },
        { time: '08:30 - 10:30', title: 'Buffet Breakfast & Leisure', desc: 'Kembali ke hotel resor untuk mandi air hangat yang menyegarkan, menikmati sarapan prasmanan lengkap, bersantai di teras kebun, lalu proses check-out.', iconType: 'food' },
        { time: '10:30 - 14:00', title: 'Scenic Return Transfer', desc: 'Perjalanan pulang kembali menyusuri pemandangan lereng gunung menuju Surabaya atau Malang (Bandara, Stasiun, atau Hotel).', iconType: 'transfer' }
      ]
    }
  ],
  'volcano-combo-3d': [
    {
      dayNum: 1,
      dayTitle: 'Airport Pick-Up, Malang Heritage, & Travel to Tumpak Sewu',
      activities: [
        { time: '14:00 - 18:00', title: 'Airport Pick-Up & Private Transfer', desc: 'Penjemputan privat premium langsung dari Bandara/Stasiun di Surabaya atau Malang menggunakan MPV AC premium, perjalanan menuju kota Malang.', iconType: 'pickup' },
        { time: '18:00 - 19:00', title: 'Visit Malang City Heritage', desc: 'Mengunjungi pusat bersejarah kota Malang, berjalan santai menikmati keindahan Alun-Alun dan suasana kolonial yang hangat.', iconType: 'city' },
        { time: '19:00 - 21:00', title: 'Travel Directly to Tumpak Sewu', desc: 'Melanjutkan perjalanan langsung menuju kawasan Tumpak Sewu melintasi jalan pegunungan yang asri. Tiba dan check-in di hotel/homestay sekitar Tumpak Sewu.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 2,
      dayTitle: 'Air Terjun Tetes, Tumpak Sewu Waterfall, & Transfer to Bromo',
      activities: [
        { time: '05:00 - 06:00', title: 'Depart to Air Terjun Tetes', desc: 'Berangkat pagi hari saat kabut masih menyelimuti ngarai untuk mendapatkan udara terbersih dan momen terindah.', iconType: 'transfer' },
        { time: '06:00 - 08:30', title: 'Activities at Air Terjun Tetes', desc: 'Menjelajahi keindahan tersembunyi Air Terjun Tetes, labirin kawah gua kapur dengan rembesan air yang berkilau nan menyegarkan.', iconType: 'trek' },
        { time: '08:30 - 12:00', title: 'Tumpak Sewu Waterfall Canyon Expedition', desc: 'Berdiri di dasar ngarai megah Air Terjun Tumpak Sewu, menikmati pancaran air terjun melingkar "Seribu Air" yang spektakuler dari dekat.', iconType: 'waterfall' },
        { time: '12:00 - 13:00', title: 'Local Lunch & Clean Up', desc: 'Mandi bilas diri di homestay, bersiap-siap ganti pakaian, lalu menikmati hidangan makan siang tradisional pedesaan.', iconType: 'food' },
        { time: '13:00 - 17:00', title: 'Travel Directly towards Bromo', desc: 'Melakukan perjalanan darat overland ber-AC menyusuri lereng perbukitan pasir Tengger langsung menuju Bromo.', iconType: 'transfer' },
        { time: '17:00 - 19:00', title: 'Check In Hotel around Bromo', desc: 'Tiba di desa Cemoro Lawang, check-in di resor butik/lodge pegunungan pilihan Anda, istirahat dan makan malam hangat.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 3,
      dayTitle: 'Bromo Golden Sunrise Safari & Travel to Banyuwangi (Ijen)',
      activities: [
        { time: '03:00 - 06:00', title: 'Sunrise Penanjakan Jeep Safari', desc: 'Safari Jeep Land Cruiser 4x4 off-road mendaki puncak Penanjakan menikmati keindahan Golden Sunrise Bromo di atas samudera awan.', iconType: 'jeep' },
        { time: '06:00 - 08:30', title: 'Hike to Bromo Active Crater Rim', desc: 'Menyeberangi Lautan Pasir vulkanik Bromo, mendaki 250 anak tangga menuju bibir kawah aktif yang bergemuruh mengeluarkan asap belerang putih megah.', iconType: 'volcano' },
        { time: '08:30 - 10:00', title: 'Buffet Breakfast & Check-Out', desc: 'Kembali ke hotel resor menikmati sarapan prasmanan hangat yang lezat, mandi air panas menyegarkan, berkemas, lalu check-out.', iconType: 'food' },
        { time: '10:00 - 16:00', title: 'Travel Directly to Banyuwangi (Ijen)', desc: 'Perjalanan overland ber-AC menyisir pesisir pantai utara Jawa langsung menuju ujung timur Banyuwangi.', iconType: 'transfer' },
        { time: '16:00 - 19:00', title: 'Check In Hotel around Ijen', desc: 'Check-in di resort tropis tepi pantai atau lereng gunung di Banyuwangi, makan malam seafood Selat Bali segar, tidur awal bersiap daki malam.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 4,
      dayTitle: 'Ijen Midnight Blue Fire Tour & Farewell Drop-Off',
      activities: [
        { time: '01:00 - 02:00', title: 'Midnight Ijen Forest Departure', desc: 'Penjemputan malam dari lobi resor Anda, berkendara melintasi hutan hujan menuju pos Paltuding kawah Ijen.', iconType: 'pickup' },
        { time: '02:00 - 03:45', title: 'Midnight Ascent to Ijen Ridge', desc: 'Trekking malam sejauh 3 km dipandu ranger lokal menanjaki jalur setapak tanah berpasir kawah Ijen di bawah gemintang langit.', iconType: 'trek' },
        { time: '03:45 - 05:30', title: 'Mystical Blue Fire & Acidic Lake', desc: 'Turun ke dasar kawah menyaksikan fenomena langka dunia Electric Blue Fire, dilanjutkan melihat danau asam toska berkabut indah.', iconType: 'volcano' },
        { time: '05:30 - 08:00', title: 'Sunrise View & Descent', desc: 'Menikmati fajar emas kawah Ijen dari puncak dinding kawah, melihat aktivitas penambang belerang perkasa, lalu berjalan turun kembali ke Paltuding.', iconType: 'sunrise' },
        { time: '08:00 - 10:30', title: 'Breakfast & Clean-Up at Resort', desc: 'Sarapan pagi hangat, kembali ke resort Anda untuk mandi bilas bersih diri, bersantai sejenak, berkemas barang, dan check-out.', iconType: 'food' },
        { time: '10:30 - 12:00', title: 'VIP Drop-Off to Bali Ferry or Airport', desc: 'Pengantaran privat VIP menuju pelabuhan Ketapang (siap naik feri penyeberangan ke Bali) atau stasiun/bandara Banyuwangi.', iconType: 'transfer' }
      ]
    }
  ],
  'semeru-trekking-4d': [
    {
      dayNum: 1,
      dayTitle: 'Ascent to the Misty Alpine Lake Ranu Kumbolo',
      activities: [
        { time: '08:00 - 10:30', title: 'Malang to Ranupani Village Drive', desc: 'Dijemput dari hotel Anda di Malang, berkendara melintasi lereng perkebunan menuju Ranupani, gerbang pendakian resmi Gunung Semeru (2.100 mdpl).', iconType: 'pickup' },
        { time: '10:30 - 11:30', title: 'Medical Check & Safety Briefing', desc: 'Pemeriksaan kesehatan wajib (tekanan darah, detak jantung) oleh tim medis TNBTS, registrasi berkas pendakian, dan pengarahan konservasi alam.', iconType: 'rest' },
        { time: '11:30 - 15:30', title: 'Trekking through Pine Forests', desc: 'Mulai mendaki sejauh 10 km melewati jalur tanah di bawah naungan lebatnya kanopi hutan pinus tropis basah yang asri.', iconType: 'trek' },
        { time: '15:30 - 18:00', title: 'Arrival at Ranu Kumbolo Lake', desc: 'Tiba di Danau Ranu Kumbolo yang berhawa dingin sejuk (2.400 mdpl). Tim porter profesional kami mendirikan tenda dome eksklusif dan menyajikan teh hangat.', iconType: 'hotel' },
        { time: '18:00 - 20:00', title: 'Milky Way Witness & Camping Feast', desc: 'Menikmati santap malam hangat bergizi tinggi racikan tim koki porter kami di bawah kubah langit bertabur miliaran bintang galaksi bima sakti (Milky Way).', iconType: 'rest' }
      ]
    },
    {
      dayNum: 2,
      dayTitle: 'Oro-Oro Ombo Lavender Fields to Kalimati High Camp',
      activities: [
        { time: '07:00 - 09:00', title: 'Sunrise over Misty Lake', desc: 'Bangun pagi menyaksikan keindahan matahari terbit legendaris di sela-sela perbukitan danau Ranu Kumbolo yang menguapkan kabut tebal mistis.', iconType: 'sunrise' },
        { time: '09:00 - 13:00', title: 'Tanjakan Cinta & Oro-Oro Ombo fields', desc: 'Mendaki tebing Tanjakan Cinta yang legendaris, lalu turun melintasi padang bunga lavender ungu Oro-Oro Ombo yang membentang luas menakjubkan.', iconType: 'trek' },
        { time: '13:00 - 15:00', title: 'Arrival at Kalimati High Camp', desc: 'Tiba di pos perkemahan Kalimati (2.700 mdpl) tepat di bawah kaki kubah pasir kerucut Gunung Semeru. Makan siang hangat disajikan oleh tim koki.', iconType: 'food' },
        { time: '15:00 - 20:00', title: 'Summit Preparation & Rest', desc: 'Pengecekan perlengkapan headlamp, windbreaker, dan tracking pole. Santap malam karbohidrat tinggi lebih awal untuk istirahat tidur persiapan pendakian puncak.', iconType: 'rest' }
      ]
    },
    {
      dayNum: 3,
      dayTitle: 'Java Highest Mahameru Summit 3,676m to Bromo Resort',
      activities: [
        { time: '23:30 - 00:00', title: 'Midnight Wake Up & Tea', desc: 'Bangun tengah malam, menyantap bubur hangat atau cokelat panas manis berenergi tinggi untuk melawan hawa menusuk tulang.', iconType: 'rest' },
        { time: '00:00 - 05:00', title: 'Extreme Sandy Summit Push', desc: 'Perjuangan mendaki medan pasir lepas, kerikil vulkanik curam dan dingin yang sangat menantang mental hingga mencapai bibir kepunden Mahameru.', iconType: 'trek' },
        { time: '05:00 - 07:00', title: 'Mahameru Summit Conquest', desc: 'Berdiri bangga di Puncak Mahameru 3.676 mdpl, titik tertinggi di tanah Jawa. Menyaksikan kepulan abu Jonggring Saloko berhembus teratur di atas samudera awan fajar.', iconType: 'volcano' },
        { time: '07:00 - 10:00', title: 'Sand Sliding descent', desc: 'Meluncur turun dengan teknik berselancar di atas pasir vulkanis kembali ke Kalimati camp untuk menikmati sarapan pagi kedua yang lezat.', iconType: 'trek' },
        { time: '10:00 - 14:00', title: 'Ranupani Return Trek', desc: 'Trekking turun kembali melintasi padang rumput savana menuju desa Ranupani, mandi bersih, berganti pakaian santai.', iconType: 'trek' },
        { time: '14:00 - 19:00', title: 'Transfer to Luxury Bromo Lodge', desc: 'Armada Jeep 4x4 menjemput dan mengantar Anda menyusuri lereng perbukitan pasir menuju resor butik di Bromo. Istirahat total dan makan malam selebrasi.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 4,
      dayTitle: 'Bromo Caldera Jeep Safari & Return Journey',
      activities: [
        { time: '03:30 - 06:00', title: 'Lazy Sunrise View', desc: 'Menikmati pemandangan matahari terbit lereng pegunungan Tengger langsung dari kebun resor Anda dengan santai tanpa kelelahan.', iconType: 'sunrise' },
        { time: '06:00 - 08:30', title: 'Jeep Safari at Pasir Berbisik', desc: 'Menaiki Jeep 4x4 melintasi padang pasir Bromo, berfoto santai di Bukit Teletubbies dan padang savana hijau yang indah.', iconType: 'jeep' },
        { time: '08:30 - 11:00', title: 'Breakfast Buffet & Check Out', desc: 'Menikmati sarapan prasmanan hotel yang berlimpah khas Barat-Nusantara, berkemas barang bawaan dan check-out dari resort.', iconType: 'food' },
        { time: '11:00 - 14:00', title: 'Malang / Surabaya Departure Drop Off', desc: 'Perjalanan kembali ber-AC dingin menuju stasiun, bandara, atau hotel di Surabaya atau Malang untuk penerbangan pulang ke rumah.', iconType: 'transfer' }
      ]
    }
  ],
  'east-java-overland-5d': [
    {
      dayNum: 1,
      dayTitle: 'Malang Colonial Town Heritage Explorer',
      activities: [
        { time: '09:00 - 12:00', title: 'Airport Pickup & Heritage Walk', desc: 'Penjemputan premium di Surabaya/Malang, berkendara ke pusat bersejarah kolonial Kota Malang.', iconType: 'pickup' },
        { time: '12:00 - 14:00', title: 'Vintage Colonial Banquet', desc: 'Menikmati makan siang lezat di restoran legendaris bernuansa museum abad ke-19 dengan ragam kuliner khas nusantara.', iconType: 'food' },
        { time: '14:00 - 18:00', title: 'Jodipan Rainbow Village Explore', desc: 'Mengunjungi jembatan kaca dan lorong-lorong penuh mural Kampung Warna-Warni Jodipan, dilanjutkan check-in di hotel butik bergaya retro kolonial.', iconType: 'city' },
        { time: '18:00 - 20:00', title: 'Alun-Alun Culinary stroll', desc: 'Makan malam santai mencicipi jajanan tradisional khas di sekitar Alun-Alun kota Malang di bawah lampu sore yang hangat.', iconType: 'food' }
      ]
    },
    {
      dayNum: 2,
      dayTitle: 'Ascending to Bromo Volcanic Highland Village',
      activities: [
        { time: '08:00 - 11:30', title: 'Mountain Road Scenic Cruise', desc: 'Check-out hotel, melakukan perjalanan overland melintasi kebun buah dan pinus menuju desa Cemoro Lawang Bromo.', iconType: 'transfer' },
        { time: '11:30 - 13:30', title: 'Caldera Edge Ridge Lunch', desc: 'Makan siang sup iga hangat di kafe tepi tebing menghadap panorama kaldera Bromo yang berasap belerang putih megah.', iconType: 'food' },
        { time: '13:30 - 16:30', title: 'Tengger Highland Agricultural Walk', desc: 'Jalan santai menyusuri ladang perkebunan kubis, kentang, dan daun bawang suku Tengger yang berundak indah menawan.', iconType: 'trek' },
        { time: '16:30 - 19:00', title: 'Sunset over Caldera Ridge & Resort Check-In', desc: 'Menikmati sunset jingga keunguan di tepi tebing kaldera Bromo, check-in di resort pegunungan premium, makan malam hangat, lalu istirahat.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 3,
      dayTitle: 'Bromo Volcanic Safari to Tropical Banyuwangi Coast',
      activities: [
        { time: '03:00 - 08:00', title: 'Sunrise Penanjakan Jeep & Crater Trek', desc: 'Safari Jeep 4x4 menanjak puncak Penanjakan menikmati Golden Sunrise, melintasi pasir berbisik dan mendaki 250 anak tangga kawah aktif Bromo.', iconType: 'jeep' },
        { time: '08:00 - 10:30', title: 'Hot Buffet Breakfast', desc: 'Kembali ke hotel untuk menikmati sarapan prasmanan hangat pegunungan, mandi air panas menyegarkan, berkemas, dan check-out.', iconType: 'food' },
        { time: '10:30 - 17:00', title: 'Coastal Highway Overland Cruise', desc: 'Perjalanan panjang overland ber-AC melintasi jalan lintas pantai utara Jawa (pantura) menyisir laut jawa menuju ujung timur Banyuwangi.', iconType: 'transfer' },
        { time: '17:00 - 19:30', title: 'Tropical Beach Resort Check-In', desc: 'Tiba di Banyuwangi, check-in di resort tepi pantai premium, makan malam seafood grill segar Selat Bali, bersiap istirahat.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 4,
      dayTitle: 'Banyuwangi Red Island Surfers Sunset',
      activities: [
        { time: '09:00 - 14:00', title: 'Lazy Morning & Resort Pool Swim', desc: 'Tidur sepuasnya tanpa gangguan jam alarm, sarapan siang, bersantai di kolam renang infinity resort menghadap Selat Bali.', iconType: 'rest' },
        { time: '14:00 - 17:30', title: 'Red Island Beach Sunset Experience', desc: 'Perjalanan ke Pantai Pulau Merah, bersantai menikmati kelapa muda segar, berjalan melintasi pasir halus saat surut menuju bukit karang merah yang ikonis.', iconType: 'beach' },
        { time: '17:30 - 21:00', title: 'Beachside Seafood BBQ Feast', desc: 'Makan malam romantis BBQ ikan tangkapan nelayan lokal di tepi pantai bergaya jimbaran dengan kelapa muda segar, kembali ke resort tidur awal.', iconType: 'food' },
        { time: '23:30 - 00:30', title: 'Midnight Call for Ijen Hike', desc: 'Bangun tengah malam, meminum suplemen gizi ringan, bersiap di lobi dijemput untuk pendakian malam.', iconType: 'pickup' }
      ]
    },
    {
      dayNum: 5,
      dayTitle: 'Ijen Blue Fire Sunrise to Bali Ferry / Surabaya',
      activities: [
        { time: '01:00 - 07:00', title: 'Conquering Mount Ijen Crater', desc: 'Trekking malam Gunung Ijen, menyaksikan fenomena langka Api Biru kawah, mengagumi danau asam hijau toska spektakuler berbalut matahari terbit kawah.', iconType: 'volcano' },
        { time: '07:00 - 09:00', title: 'Transit Breakfast & Shower', desc: 'Menikmati teh hangat manis dan sarapan lokal di pos transit kawah, ganti baju bersih dan mandi bilas diri di hotel resor sebelum check-out.', iconType: 'food' },
        { time: '09:00 - 13:00', title: 'Farewell Drop Off to Bali / Airport', desc: 'Check-out dari resort, diantar privat menuju pelabuhan Ketapang (siap naik feri penyeberangan VIP ke Bali) atau Bandara Banyuwangi.', iconType: 'transfer' }
      ]
    }
  ],
  'grand-java-safari-8d': [
    {
      dayNum: 1,
      dayTitle: 'Yogyakarta Palace Heritage Welcome',
      activities: [
        { time: '09:00 - 13:00', title: 'Yogyakarta Airport Welcome', desc: 'Dijemput hangat di Bandara Yogyakarta (YIA) oleh pemandu kami, diantar menuju hotel warisan budaya (luxury heritage) bintang 5 untuk check-in.', iconType: 'pickup' },
        { time: '13:00 - 17:00', title: 'Sultan Palace & Water Castle Stroll', desc: 'Eksplorasi budaya mengunjungi kompleks istana Keraton Kasultanan Yogyakarta dan taman labirin kolam air Taman Sari peninggalan sultan.', iconType: 'city' },
        { time: '17:00 - 20:00', title: 'Royal Dinner & Ramayana Ballet', desc: 'Makan malam sajian khas masakan kerajaan Yogyakarta (Gudeg Royal), dilanjutkan menonton megahnya pentas tari legenda Ramayana Ballet.', iconType: 'food' }
      ]
    },
    {
      dayNum: 2,
      dayTitle: 'Magnificent Borobudur Sunrise & Prambanan Candi',
      activities: [
        { time: '04:00 - 08:00', title: 'Borobudur Sunrise Expedition', desc: 'Mengejar matahari terbit mistis di sela-sela stupa Candi Borobudur, candi Buddha terbesar di dunia berselimut kabut tebal lembah Menoreh.', iconType: 'sunrise' },
        { time: '08:00 - 12:00', title: 'Traditional Horse Cart village Ride', desc: 'Sarapan pedesaan eksklusif organik, berkeliling pedukuhan asri sekitar candi menaiki delman kuda tradisional, menyapa warga lokal.', iconType: 'beach' },
        { time: '12:00 - 16:00', title: 'Prambanan Candi Hindu Plains', desc: 'Mengunjungi candi Hindu menjulang tinggi Prambanan, mempelajari seni arsitektur kuno dan kisah legenda Roro Jonggrang melalui relief tebing candi.', iconType: 'city' },
        { time: '16:00 - 19:00', title: 'Traditional Javanese Spa', desc: 'Kembali ke hotel untuk relaksasi pijat spa herba khas keraton guna memulihkan stamina Anda sepanjang malam.', iconType: 'rest' }
      ]
    },
    {
      dayNum: 3,
      dayTitle: 'Scenic Train Ride to East Java Highlands',
      activities: [
        { time: '07:00 - 12:30', title: 'Yogyakarta to Malang Scenic Train', desc: 'Menaiki kereta api kelas eksekutif premium melewati hamparan sawah hijau berundak, sungai lebar, dan barisan pegunungan Jawa Tengah ke Jawa Timur.', iconType: 'transfer' },
        { time: '12:30 - 14:30', title: 'Malang Arrival & Bakso Feast', desc: 'Tiba di Malang, menikmati kuliner legendaris Bakso Malang kuah kaldu sapi gurih premium, dilanjutkan check-in hotel butik kolonial bersejarah.', iconType: 'food' },
        { time: '14:30 - 18:00', title: 'Colonial quarters Walking Tour', desc: 'Heritage walk dipandu local guide melintasi Ijen Boulevard, tugu balai kota berdesain kolonial Belanda, pasar bunga segar, dan alun-alun kota.', iconType: 'city' }
      ]
    },
    {
      dayNum: 4,
      dayTitle: 'Ascending to Bromo Highlands Adat Village',
      activities: [
        { time: '08:00 - 11:30', title: 'Bromo Slopes overland Drive', desc: 'Perjalanan ber-AC menyusuri lereng perbukitan pasir berselimut kebun sayur subur menuju desa Cemoro Lawang Bromo.', iconType: 'transfer' },
        { time: '11:30 - 13:30', title: 'Caldera View Buffet Lunch', desc: 'Check-in di resor pegunungan eksklusif, makan siang prasmanan lezat menghadap kaldera Bromo mengepul yang megah.', iconType: 'food' },
        { time: '13:30 - 17:00', title: 'Tengger Indigenous Adat village Walk', desc: 'Mengunjungi rumah adat suku Tengger, mengobrol santai seputar tradisi adat Hindu Tengger peninggalan Majapahit kuno.', iconType: 'trek' }
      ]
    },
    {
      dayNum: 5,
      dayTitle: 'Bromo Golden Sunrise to Kalibaru Plantation Lodge',
      activities: [
        { time: '03:00 - 08:00', title: 'Safari Jeep 4x4 & Active Crater Climb', desc: 'Jeep safari Penanjakan Sunrise, menembus pasir berbisik dan mendaki anak tangga menuju bibir kawah vulkanis Bromo yang bergemuruh aktif.', iconType: 'jeep' },
        { time: '08:00 - 11:00', title: 'Resort Buffet Breakfast', desc: 'Kembali ke hotel resor menikmati sarapan prasmanan pegunungan lezat, mandi bilas air panas menyegarkan, check-out dari hotel.', iconType: 'food' },
        { time: '11:00 - 17:00', title: 'Overland Cruise to Kalibaru Coffee Highlands', desc: 'Perjalanan overland ber-AC menyusuri lereng perbukitan karet dan kopi robusta menuju perkebunan dataran tinggi sejuk Kalibaru.', iconType: 'transfer' },
        { time: '17:00 - 20:00', title: 'Heritage Plantation Lodge Check-In', desc: 'Check-in di perkebunan butik bersejarah era Belanda, menyantap makan malam organik segar petik langsung dari perkebunan lodge.', iconType: 'hotel' }
      ]
    },
    {
      dayNum: 6,
      dayTitle: 'Spices Tour to Sukamade Wild Turtle Beach',
      activities: [
        { time: '08:00 - 11:00', title: 'Organic Spices Estate Tour', desc: 'Tur berpemandu berjalan kaki melihat kebun pala, lada, cengkeh, cokelat, kayu manis, dan melihat penyadapan gula aren kelapa tradisional.', iconType: 'trek' },
        { time: '11:00 - 16:00', title: '4x4 Jungle River Crossing Expedition', desc: 'Berpindah ke mobil Jeep 4x4 off-road tangguh, memulai ekspedisi liar melintasi sungai dangkal menembus belantara Taman Nasional Meru Betiri menuju Pantai Sukamade.', iconType: 'jeep' },
        { time: '16:00 - 19:00', title: 'Sukamade Rangers Lodge Check-In', desc: 'Tiba di pos wisma sederhana Sukamade, menikmati kopi lokal buatan ranger, istirahat memulihkan tubuh dari guncangan Jeep, makan malam seadanya khas rimbawan.', iconType: 'hotel' },
        { time: '19:30 - 23:30', title: 'Midnight Wild Turtle nesting', desc: 'Berjalan kaki sunyi menyusuri garis pantai gelap dipandu ranger balai konservasi melihat penyu hijau raksasa bertelur secara alami di pasir pantai.', iconType: 'beach' }
      ]
    },
    {
      dayNum: 7,
      dayTitle: 'Baby Hatchlings Ocean Release to Banyuwangi Villa',
      activities: [
        { time: '06:00 - 08:00', title: 'Baby Turtles Ocean Release', desc: 'Pelepasan puluhan anak penyu hijau kecil (tukik) berlarian riang menuju samudera lepas saat fajar keemasan menyingsing.', iconType: 'sunrise' },
        { time: '08:00 - 13:00', title: 'Returning Overland through Jungle', desc: 'Menembus hutan belantara kembali dengan Jeep 4x4 ke kota Banyuwangi, makan siang hidangan soto lokal yang hangat.', iconType: 'transfer' },
        { time: '13:00 - 17:00', title: 'Beachfront Seaside Villa Check-In', desc: 'Check-in di villa butik mewah tepi laut Selat Bali di Banyuwangi, bersantai menikmati layanan spa tubuh gratis atau berenang di kolam renang pantai.', iconType: 'hotel' },
        { time: '17:00 - 21:00', title: 'Farewell Coastal Seafood BBQ Grill', desc: 'Makan malam pesta perpisahan hidangan seafood bakar BBQ segar khas Banyuwangi dengan suguhan tarian tradisional Gandrung.', iconType: 'food' }
      ]
    },
    {
      dayNum: 8,
      dayTitle: 'Ijen Blue Fire Sunrise to Bali Ferry penyeberangan',
      activities: [
        { time: '01:00 - 07:00', title: 'Conquering Mount Ijen Crater', desc: 'Trekking malam Gunung Ijen melihat fenomena langka dunia Api Biru, mengagumi Danau Asam Hijau Toska, lalu turun kembali ke pos Paltuding.', iconType: 'volcano' },
        { time: '07:00 - 10:30', title: 'Villa Breakfast & Farewell', desc: 'Kembali ke villa pantai untuk sarapan penutup lezat, mandi bersih diri, berkemas barang bawaan dan check-out dari resort.', iconType: 'food' },
        { time: '10:30 - 12:00', title: 'VIP Bali Ferry Crossing', desc: 'Pengantaran privat VIP menuju pelabuhan Ketapang Banyuwangi, siap menyeberang VIP feri menuju Gilimanuk Pulau Bali dengan selamat.', iconType: 'transfer' }
      ]
    }
  ]
};

// Fallback rich details for other tours
const DEFAULT_RICH_DATA = {
  gallery: [
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80'
  ],
  includes: [
    'Private air-conditioned premium MPV with professional driver',
    'All-inclusive fuel, toll tickets, and parking fees',
    'Comprehensive national park admission tickets & permits',
    'Licensed local bilingual guide for full depth sharing',
    'Premium lunch and bottled mineral water replenishment'
  ],
  excludes: [
    'Personal purchases, souvenirs, and extra meals',
    'Personal travel insurance',
    'Optional gratuities/tips for the local service crew'
  ],
  whatToBring: [
    'Comfortable casual clothing and hiking shoes with good grip',
    'Warm jacket or layered clothing (temperatures can be cold)',
    'Waterproof dry-bag / protective case for cameras & phones',
    'High SPF sunscreen, sunglasses, and protective hat',
    'Personal identification cards and pocket cash'
  ],
  faqs: [
    { q: 'Bagaimana penyesuaian jadwal penjemputan?', a: 'Jadwal penjemputan sangat fleksibel dan dapat disesuaikan dengan waktu kedatangan pesawat atau kereta api Anda.' },
    { q: 'Apakah semua tiket masuk sudah termasuk?', a: 'Ya, seluruh harga kami all-inclusive. Anda tidak perlu membayar tiket masuk lagi di lokasi.' }
  ],
  advertiseText: 'Pesan sekarang dan dapatkan layanan penjemputan bandara privat gratis!',
  promoCode: 'EJAVAODYSSEY'
};

interface RichTourInfo {
  gallery: string[];
  includes: string[];
  excludes: string[];
  whatToBring: string[];
  faqs: { q: string; a: string }[];
  advertiseText: string;
  promoCode: string;
}

const TOUR_RICH_DATA: Record<string, RichTourInfo> = {
  'bromo': {
    gallery: [
      'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      'Private 4x4 open-top Bromo Jeep Safari',
      'Private AC premium MPV pickup from Surabaya/Malang',
      'All national park tickets and entrance permits',
      'Licensed English/Indonesian speaking Bromo guide',
      'Hot Javanese breakfast & bottled mineral water'
    ],
    excludes: [
      'Horse rental at Bromo sand sea (optional)',
      'Personal snacks, souvenirs, and gratuities',
      'Personal travel insurance'
    ],
    whatToBring: [
      'Warm jacket / windbreaker (Cold temperatures 8°C - 15°C)',
      'Comfortable walking shoes (Sneakers or trekking shoes with good grip)',
      'Face mask or scarf (To protect against dust and volcanic ash)',
      'Personal camera or fully-charged smartphone for the sunrise',
      'Small cash for horse rentals, warm drinks, and restrooms'
    ],
    faqs: [
      { q: 'Pukul berapa penjemputan Bromo dimulai?', a: 'Penjemputan dimulai pukul 00:00 AM (tengah malam) dari Surabaya atau Malang agar tiba tepat waktu untuk golden sunrise.' },
      { q: 'Apakah suhu di puncak Gunung Bromo sangat dingin?', a: 'Ya, suhu berkisar antara 8°C hingga 15°C. Kami sangat menyarankan membawa jaket tebal, sarung tangan, kupluk, dan sepatu trekking.' }
    ],
    advertiseText: 'Pesan Tur Midnight Bromo & Dapatkan Penjemputan VIP Gratis!',
    promoCode: 'BROMOSUNRISE'
  },
  'ijen': {
    gallery: [
      'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      'Sterilized respirator gas mask and safety goggles',
      'Private AC transport pickup in Banyuwangi city',
      'National park entry permit & local ranger escort',
      'Local coffee, tea, and warm Javanese breakfast',
      'All road taxes, parking, and gasoline'
    ],
    excludes: [
      'Trolley service to ascend (available at local fee)',
      'Personal tips for miners and local guide',
      'Personal travel insurance'
    ],
    whatToBring: [
      'Warm clothing (Mountain peak is windy and cold)',
      'Hiking shoes or solid sneakers with strong traction',
      'Original ID card or Passport (Mandatory registration)',
      'Small backpack or body-pack for water and personal items',
      'Energy bars/chocolate and thermos of warm water'
    ],
    faqs: [
      { q: 'Kapan waktu terbaik melihat Blue Fire?', a: 'Waktu terbaik adalah antara pukul 02:00 AM hingga 04:30 AM saat kawah masih sangat gelap.' },
      { q: 'Apakah anak-anak diperbolehkan ikut trekking Ijen?', a: 'Jalur pendakian Ijen cukup curam (sekitar 3 km menanjak). Anak di bawah 7 tahun atau lansia dengan asma/jantung tidak disarankan turun ke dasar kawah.' }
    ],
    advertiseText: 'Eksplorasi Ijen Blue Fire, Pesan Hari Ini Hemat 10%!',
    promoCode: 'IJENBLUE'
  },
  'tumpak-sewu': {
    gallery: [
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      'Licensed canyon floor trekking safety guide',
      'Private premium AC transport from Malang/Surabaya',
      'Waterproof backpack rental & safety gear',
      'Traditional village lunch & mineral water',
      'Admission tickets to Tumpak Sewu & Goa Tetes'
    ],
    excludes: [
      'Changing room shower fee (approx. Rp 5,000)',
      'Sandal/water shoe rentals (available on-site)',
      'Personal tips and expenses'
    ],
    whatToBring: [
      'Sturdy water shoes or mountain sandals with solid grip (no flip-flops)',
      'Waterproof phone pouch or dry bag to keep electronics dry',
      'Full change of clothes and a small towel for after the trek',
      'Lightweight raincoat or poncho for the waterfall mist',
      'Mosquito repellent / insect spray'
    ],
    faqs: [
      { q: 'Apakah jalurnya sangat basah dan licin?', a: 'Ya, trekking ke dasar ngarai melibatkan penyeberangan aliran air dan tangga bambu basah. Gunakan sepatu air/sandal gunung anti-selip.' },
      { q: 'Berapa lama durasi trekking Tumpak Sewu?', a: 'Trekking dasar ngarai hingga Goa Tetes membutuhkan waktu sekitar 3-4 jam pulang pergi.' }
    ],
    advertiseText: 'Pesan Tumpak Sewu Adventure, Gratis Air Mineral Unlimited!',
    promoCode: 'SEWUTREK'
  },
  'malang-city': {
    gallery: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      'Private premium AC MPV transport with driver',
      'All admission fees to Jodipan Rainbow Village & Coban Rondo',
      'Bilingual professional city tour guide',
      'Heritage lunch at a historic gourmet restaurant',
      'Organic Apple Orchard picking tickets (take home 1kg apples)'
    ],
    excludes: [
      'Personal shopping and souvenirs',
      'Extra food and beverages outside of set lunch',
      'Gratuities for driver and guide'
    ],
    whatToBring: [
      'Light, breathable, and comfortable casual clothing',
      'Good sunglasses, sunscreen, and a protective sun hat',
      'Comfortable walking shoes or flats for city walks',
      'Camera or smartphone for colorful village photos',
      'Pocket cash for souvenirs and organic hand-picked apples'
    ],
    faqs: [
      { q: 'Kapan musim panen apel di Batu?', a: 'Apel di Batu dipanen sepanjang tahun berkat sistem pertanian bergiliran. Anda dijamin bisa memetik apel kapan saja.' },
      { q: 'Apakah tur ini ramah keluarga dan balita?', a: 'Sangat ramah! Tur ini santai, minim jalan menanjak ekstrem, dan sangat disukai anak-anak maupun lansia.' }
    ],
    advertiseText: 'Tur Heritage Malang-Batu, Pilih Tanggal Anda Sekarang!',
    promoCode: 'MALANGHERITAGE'
  },
  'bromo-madakaripura-2d': {
    gallery: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      '1 Night stay at premium Bromo mountain lodge/resort',
      'Private 4x4 Jeep Land Cruiser safari ride',
      'Private premium AC transport for 2 days overland',
      'All entrance fees to Bromo & Madakaripura Waterfall',
      'Local safety guide for waterfall canyon hike & Bromo'
    ],
    excludes: [
      'Raincoat rentals for Madakaripura (approx. Rp 15,000)',
      'Horse ride at Bromo sand sea (optional)',
      'Personal dining and snacks outside breakfast & lunch'
    ],
    whatToBring: [
      'Warm jacket or thermal layers (for cold Bromo morning)',
      'Raincoat or waterproof jacket (essential for Madakaripura canyon mist)',
      'Change of dry clothing and a small microfiber towel',
      'Waterproof phone case and dry bag for your cameras',
      'Anti-slip water sandals or trekking shoes'
    ],
    faqs: [
      { q: 'Apakah hotel di Bromo memiliki air panas?', a: 'Ya, seluruh mitra hotel premium dan resor bintang kami di Cemoro Lawang menyediakan fasilitas shower air panas.' },
      { q: 'Seberapa basah rute air terjun Madakaripura?', a: 'Anda akan berjalan di sela-sela tebing kawah berair terjun tirai. Sangat disarankan membawa baju ganti, handuk kecil, dan kantong anti-air untuk ponsel Anda.' }
    ],
    advertiseText: 'Pesan Bromo-Madakaripura 2 Hari, Dapatkan Diskon Resor 15%!',
    promoCode: 'BROMO2DAY'
  },
  'volcano-combo-3d': {
    gallery: [
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      '2 Nights boutique resort stays (1N Bromo, 1N Banyuwangi)',
      'Private 4x4 Jeep Land Cruiser Bromo safari',
      'Sterilized gas masks, goggles, and safety lights for Ijen',
      'All park entrance fees (Bromo, Ijen, Tumpak Sewu)',
      'Private premium AC SUV transport with professional driver'
    ],
    excludes: [
      'Ferry ticket Banyuwangi to Bali (can be added dynamically)',
      'Personal tips for local guides, drivers, and miners',
      'Personal travel insurance'
    ],
    whatToBring: [
      'Thick winter jacket & gloves (highly recommended for sunrise summits)',
      'Trekking shoes or sneakers with strong grip for volcanic sands and slopes',
      'Water sandals and a dry bag for Tumpak Sewu canyon trekking',
      'Change of clothes for 3 days and simple personal toiletries',
      'Sufficient cash in IDR, personal medicine, and phone charger'
    ],
    faqs: [
      { q: 'Bagaimana penjemputan dan pengantaran akhir?', a: 'Kami menjemput di Malang/Surabaya pada Hari 1 dan mengantar Anda ke Banyuwangi, Pelabuhan Ketapang Bali, atau kembali ke Surabaya pada Hari 3.' },
      { q: 'Apakah stamina prima dibutuhkan untuk paket ini?', a: 'Ya, paket ini mencakup trekking ngarai, kawah vulkanik aktif, dan hiking malam hari berturut-turut. Direkomendasikan bagi peserta yang memiliki kondisi kesehatan bugar.' }
    ],
    advertiseText: 'Sambut Petualangan 3 Hari Vulkanis Terbaik Jawa Timur!',
    promoCode: 'VOLCANO3D'
  },
  'semeru-trekking-4d': {
    gallery: [
      'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      'Professional mountain guides & porter team to carry camping gear',
      'All premium camping equipment (tents, sleeping bags, mats)',
      'All-inclusive camping meals, warm coffee, and snacks',
      'All entry permits, hiking clearances, and medical check-ups',
      '1 Night boutique resort stay at Bromo after descent'
    ],
    excludes: [
      'Porters for personal bags (available on request at a fee)',
      'Personal trekking gear (hiking shoes, warm clothes, headlamp)',
      'Optional tips for guides and porter team'
    ],
    whatToBring: [
      'High-grade thermal jacket & thermal layers (temperatures can drop to -5°C)',
      'Ankle-support hiking boots and durable wool trekking socks',
      'Headlamp with extra replacement batteries (mandatory for midnight summit push)',
      'Warm fleece gloves, beanie hat, and a neck gaiter or scarf',
      'Personal 30L-50L backpack, trekking poles, and lip balm / hydration flask'
    ],
    faqs: [
      { q: 'Berapa batasan berat beban porter?', a: 'Porter kami membawakan perlengkapan kelompok (tenda, alat masak, logistik makanan). Untuk membawakan tas ransel pribadi, Anda dapat menyewa porter pribadi tambahan.' },
      { q: 'Apakah surat keterangan sehat wajib dilampirkan?', a: 'Ya, surat keterangan sehat resmi wajib dilampirkan. Tim kami akan mendampingi Anda saat pemeriksaan kesehatan langsung di Ranupani.' }
    ],
    advertiseText: 'Puncak Tertinggi Jawa Menanti Anda, Pesan Sekarang!',
    promoCode: 'SEMERUMAHAMERU'
  },
  'east-java-overland-5d': {
    gallery: [
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      '4 Nights boutique hotels/beach resort stays',
      'Private Jeep 4x4 Bromo Sunrise Tour',
      'Surfing lessons & board rentals at Red Island Beach',
      'Professional English-speaking driver & separate tour guide',
      'All entry fees (Malang Heritage, Bromo, Ijen, Red Island)'
    ],
    excludes: [
      'Personal meals and dinners not explicitly mentioned',
      'Personal souvenirs and shopping',
      'Gratuities for driver and tour guide'
    ],
    whatToBring: [
      'High-SPF sunscreen, sun hat, and swimwear/surf wear',
      'Warm jacket or thermal layers for midnight Bromo & Ijen climbs',
      'Solid hiking shoes and comfortable slippers/sandals',
      'Lightweight casual clothing for 5 days of travel',
      'Personal toiletries, skin care, and any required daily medication'
    ],
    faqs: [
      { q: 'Apakah ada waktu santai di pantai?', a: 'Tentu! Hari ke-4 didedikasikan penuh untuk bersantai, berjemur, dan berselancar di Pantai Red Island sebelum pendakian Ijen tengah malam.' },
      { q: 'Apakah rute penjemputan bisa disesuaikan?', a: 'Sangat bisa. Anda bisa meminta penjemputan di Surabaya dan pengantaran akhir di Bali.' }
    ],
    advertiseText: 'Overland Jawa Timur 5 Hari, All-Inclusive Terbaik!',
    promoCode: 'EJAVAGRAND'
  },
  'grand-java-safari-8d': {
    gallery: [
      'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80'
    ],
    includes: [
      '7 Nights luxury boutique hotel & eco-lodge stays',
      'Executive class train tickets (Yogyakarta to Malang)',
      'Private 4x4 Jeep off-road expedition to Sukamade Beach',
      'Borobudur, Prambanan, Bromo, & Ijen private entries',
      'Full-time private bilingual tour guide and premium SUV'
    ],
    excludes: [
      'Optional flight ticket Yogyakarta to Banyuwangi',
      'Personal dining and alcohol beverages',
      'Driver, guide, and forest ranger tipping'
    ],
    whatToBring: [
      'Complete travel wardrobe for 8 days (hot coastal beaches & cold volcano peaks)',
      'Reliable trekking boots or sneakers + lightweight sandals',
      'Quality insect repellent, high SPF sunscreen, and sunglasses',
      'Backpack, high-capacity powerbank, and protective dry bag',
      'Valid passport or original ID cards, plus local cash in IDR'
    ],
    faqs: [
      { q: 'Seberapa aman petualangan Sukamade?', a: 'Sangat aman! Seluruh perjalanan dipandu oleh ranger balai konservasi nasional berlisensi dan menggunakan Jeep 4x4 tangguh.' },
      { q: 'Apakah tiket penyeberangan feri ke Bali sudah termasuk?', a: 'Ya, kami menyediakan tiket feri VIP penyeberangan ke Bali beserta pengantaran langsung ke resort Anda di Bali.' }
    ],
    advertiseText: 'Grand Safari Jawa-Bali 8 Hari - Pengalaman Sekali Seumur Hidup!',
    promoCode: 'JAVABALISAFARI'
  }
};

export default function TourDetailView({ tourId, onBack }: TourDetailViewProps) {
  const { formatPrice, setPage, setSearchParams, searchParams, tours, schedules, bookings, serviceLimits } = useApp();
  const tour = tours.find(t => t.id === tourId);
  
  if (!tour) {
    return (
      <div className="pt-36 pb-24 text-center max-w-lg mx-auto space-y-4">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold">Tour Tidak Ditemukan</h3>
        <button onClick={onBack} className="text-amber-500 font-bold hover:underline">
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // Get rich structured day-by-day itineraries
  const daysData = (() => {
    const itineraryArray = tour.itinerary || [];
    const hasStructuredItems = itineraryArray.some(item => item.startsWith('Day ') && item.includes('|'));
    
    if (hasStructuredItems) {
      // Map to intermediate activity items
      const intermediateItems = itineraryArray.map((item, idx) => {
        if (item.startsWith('Day ') && item.includes('|')) {
          const parts = item.split('|').map(p => p.trim());
          const dayPart = parts[0];
          const time = parts[1] || '08:00';
          const title = parts[2] || '';
          const desc = parts[3] || '';
          
          const dayNumMatch = dayPart.match(/\d+/);
          const dayNum = dayNumMatch ? parseInt(dayNumMatch[0]) : 1;
          
          let dayTitle = '';
          if (dayPart.includes('-')) {
            dayTitle = dayPart.substring(dayPart.indexOf('-') + 1).trim();
          }
          
          return {
            day: dayNum,
            dayTitle: dayTitle || `Agenda Hari Ke-${dayNum}`,
            time,
            title,
            desc,
            iconType: (idx === 0 ? 'pickup' : idx === itineraryArray.length - 1 ? 'transfer' : 'trek') as any
          };
        } else {
          // Legacy format: "08:00 - Title, Description"
          const dividerIdx = item.indexOf('-');
          const time = dividerIdx !== -1 ? item.substring(0, dividerIdx).trim() : '08:00';
          const activity = dividerIdx !== -1 ? item.substring(dividerIdx + 1).trim() : item;
          return {
            day: 1,
            dayTitle: 'Full Day Expedition',
            time,
            title: activity.split(',')[0].trim(),
            desc: activity,
            iconType: (idx === 0 ? 'pickup' : idx === itineraryArray.length - 1 ? 'transfer' : 'trek') as any
          };
        }
      });

      // Group by Day
      const dayNums = (Array.from(new Set(intermediateItems.map(item => item.day))) as number[]).sort((a, b) => a - b);
      return dayNums.map(dayNum => {
        const itemsForDay = intermediateItems.filter(item => item.day === dayNum);
        const dayTitle = itemsForDay[0]?.dayTitle || `Agenda Hari Ke-${dayNum}`;
        return {
          dayNum,
          dayTitle,
          activities: itemsForDay.map(item => ({
            time: item.time,
            title: item.title,
            desc: item.desc,
            iconType: item.iconType
          }))
        };
      });
    }

    // Default to hardcoded comprehensive itineraries or map legacy format
    return COMPREHENSIVE_ITINERARIES[tour.id] || [
      {
        dayNum: 1,
        dayTitle: 'Full Day Expedition',
        activities: itineraryArray.map((item, idx) => {
          // Parse "06:30 AM - Activity description"
          const dividerIdx = item.indexOf('-');
          const time = dividerIdx !== -1 ? item.substring(0, dividerIdx).trim() : '08:00';
          const activity = dividerIdx !== -1 ? item.substring(dividerIdx + 1).trim() : item;
          return {
            time,
            title: activity.split(',')[0].trim(),
            desc: activity,
            iconType: (idx === 0 ? 'pickup' : idx === itineraryArray.length - 1 ? 'transfer' : 'trek') as any
          };
        })
      }
    ];
  })();

  const richDataRaw = TOUR_RICH_DATA[tour.id] || DEFAULT_RICH_DATA;
  const richData = {
    ...richDataRaw,
    includes: tour.includes && tour.includes.length > 0 ? tour.includes : (richDataRaw.includes || []),
    excludes: tour.excludes && tour.excludes.length > 0 ? tour.excludes : (richDataRaw.excludes || []),
    gallery: tour.gallery && tour.gallery.length > 0 ? tour.gallery : (richDataRaw.gallery || [tour.image]),
    whatToBring: tour.whatToBring && tour.whatToBring.length > 0 ? tour.whatToBring : (richDataRaw.whatToBring || [])
  };
  const [activeImage, setActiveImage] = useState<string>(tour.image);
  const [imageDisplayMode, setImageDisplayMode] = useState<'cover' | 'contain'>('cover');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAvailabilitySheetOpen, setIsAvailabilitySheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('01:00 AM');
  const [guestCount, setGuestCount] = useState<number>(2);
  const [selectedTierId, setSelectedTierId] = useState<'sharing' | 'private' | 'vip' | ''>('');
  
  // Tab control for the Day-by-Day structured itinerary
  const [selectedDayTab, setSelectedDayTab] = useState<number>(1);

  // Sync activeImage & Reset tabs if tour changes
  useEffect(() => {
    setActiveImage(tour.image);
    setSelectedDayTab(1);
    setSelectedTierId('');
    setSelectedDate('');
    setSelectedTime('01:00 AM');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tourId]);

  const packageTiers = [
    {
      id: 'sharing' as const,
      name: 'Paket A: Reguler (Sharing Group)',
      description: 'Bergabung dengan grup wisata lain. Transportasi jeep & transit sharing.',
      priceUSD: tour.startingPrice,
      priceIDR: tour.startingPriceIDR,
      features: [
        'Transportasi AC standard (shared)',
        'Jeep 4x4 Wisata (shared)',
        'Tiket masuk objek wisata standar',
        'Layanan guide lokal berlisensi',
        'Air mineral & snack standar'
      ]
    },
    {
      id: 'private' as const,
      name: 'Paket B: Privat Standar (Private Tour)',
      description: 'Transportasi privat khusus grup Anda sendiri. Jadwal lebih fleksibel.',
      priceUSD: Math.round(tour.startingPrice * 1.35),
      priceIDR: Math.round(tour.startingPriceIDR * 1.35),
      features: [
        'Transportasi AC Privat (Avanza/Innova)',
        'Jeep 4x4 Privat khusus grup Anda',
        'Tiket masuk bebas antrean (Fast-track)',
        'Guide lokal berpengalaman khusus',
        'Sarapan lokal & coffee break',
        'Dokumentasi foto standar'
      ]
    },
    {
      id: 'vip' as const,
      name: 'Paket C: Premium VIP (Luxury Experience)',
      description: 'Layanan mewah premium kelas utama dengan fasilitas terlengkap.',
      priceUSD: Math.round(tour.startingPrice * 1.8),
      priceIDR: Math.round(tour.startingPriceIDR * 1.8),
      features: [
        'Mobil Mewah Privat (Alphard / HiAce Premio)',
        'Jeep 4x4 Premium dengan dekorasi khusus',
        'Semua tiket masuk VIP & retribusi daerah',
        'Tour guide profesional bilingual',
        'Sarapan buffet hotel bintang / restoran premium',
        'Dokumentasi drone & video sinematik ter-edit',
        'Paket souvenir eksklusif SmartJourney'
      ]
    }
  ];

  const selectedTier = packageTiers.find(t => t.id === selectedTierId) || packageTiers[0];

  // Generate date list for interactive departure calendar
  const getCalendarDays = () => {
    const days = [];
    const totalDays = 31;
    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `2026-07-${String(i).padStart(2, '0')}`;
      
      // Check if date is manually blocked (blackout date)
      const isBlocked = (schedules || []).some(s => s.date === dateStr && s.type === 'blocked');
      
      // Check confirmed booking counts
      const confirmedCount = (bookings || []).filter(b => 
        b.details && 
        b.details.date === dateStr && 
        b.type === 'tour' &&
        (b.status === 'Confirmed' || b.status === 'Completed')
      ).length;
      
      const isFull = confirmedCount >= (serviceLimits?.tour ?? 5);
      const isAvailable = !isBlocked && !isFull;
      
      // Determine pricing multiplier (peak surcharge or weekend premium)
      const peakSch = (schedules || []).find(s => s.date === dateStr && s.type === 'peak');
      let priceMultiplier = 1.0;
      let note = '';
      
      if (peakSch) {
        priceMultiplier = peakSch.surcharge > 0 ? (1 + (peakSch.surcharge / 100)) : 1.15;
        note = peakSch.note || '';
      } else {
        // Weekend surcharge
        const dayOfWeek = new Date(dateStr).getDay();
        priceMultiplier = dayOfWeek === 0 || dayOfWeek === 6 ? 1.15 : 1.0;
      }

      days.push({
        dayNum: i,
        dateString: dateStr,
        isAvailable,
        isFull,
        priceMultiplier,
        note
      });
    }
    return days;
  };

  // Lightbox Image Navigation helpers
  const activeImageIndex = richData.gallery.indexOf(activeImage) !== -1 
    ? richData.gallery.indexOf(activeImage) 
    : 0;

  const handlePrevImage = () => {
    const prevIdx = (activeImageIndex - 1 + richData.gallery.length) % richData.gallery.length;
    setActiveImage(richData.gallery[prevIdx]);
  };

  const handleNextImage = () => {
    const nextIdx = (activeImageIndex + 1) % richData.gallery.length;
    setActiveImage(richData.gallery[nextIdx]);
  };

  const calendarDays = getCalendarDays();

  const handleBookNow = () => {
    setSearchParams({
      ...searchParams,
      date: selectedDate,
      guests: guestCount
    });
    setIsBookingOpen(true);
  };

  // Helper to render activity icons
  const renderActivityIcon = (type: string) => {
    switch (type) {
      case 'pickup':
        return <Car className="h-5 w-5 text-amber-600" />;
      case 'jeep':
        return <Car className="h-5 w-5 text-emerald-600 stroke-[2.5]" />;
      case 'sunrise':
        return <Sunrise className="h-5 w-5 text-amber-500" />;
      case 'trek':
        return <Compass className="h-5 w-5 text-blue-600" />;
      case 'food':
        return <Utensils className="h-5 w-5 text-amber-700" />;
      case 'volcano':
        return <Sparkles className="h-5 w-5 text-red-500" />;
      case 'waterfall':
        return <Sparkles className="h-5 w-5 text-teal-500" />;
      case 'hotel':
        return <Bed className="h-5 w-5 text-indigo-600" />;
      case 'city':
        return <MapPin className="h-5 w-5 text-purple-600" />;
      case 'beach':
        return <Sparkles className="h-5 w-5 text-yellow-500" />;
      case 'rest':
      default:
        return <Coffee className="h-5 w-5 text-neutral-600" />;
    }
  };

  return (
    <div className="bg-white text-neutral-850 min-h-screen pt-24 md:pt-28 lg:pt-32 pb-20">

      {/* Top Breadcrumb & Return Navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 hover:text-amber-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          <span>Kembali ke Semua Paket Wisata</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Layout: Grid for main visual contents and booking card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT 7 COLUMNS: Gallery, Description, Itinerary, Inclusions/Exclusions, Maps, FAQ */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* 1. Interactive Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-neutral-200 shadow-md bg-neutral-950 flex items-center justify-center group/gallery">
                {/* Blurred backdrop to fill background beautifully in Fit mode */}
                <img
                  src={activeImage}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-105 pointer-events-none transition-all duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Main Foreground Image */}
                <img
                  src={activeImage}
                  alt={tour.name}
                  onClick={() => setIsLightboxOpen(true)}
                  className={`transition-all duration-500 cursor-zoom-in hover:scale-[1.01] ${
                    imageDisplayMode === 'contain'
                      ? 'w-full h-full object-contain max-h-full max-w-full p-2.5 relative z-10'
                      : 'w-full h-full object-cover'
                  }`}
                  referrerPolicy="no-referrer"
                />

                {/* Category Tag */}
                <span className="absolute top-4 left-4 z-20 bg-neutral-900/85 backdrop-blur-md text-amber-500 text-[10px] font-mono font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-amber-500/30">
                  {tour.category}
                </span>

                {/* Controls Bar */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  {/* Mode Toggle Button */}
                  <button
                    type="button"
                    title={imageDisplayMode === 'contain' ? "Isi Penuh Layar (Fill Cover)" : "Suaikan Ukuran (Fit Contain)"}
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageDisplayMode(prev => prev === 'contain' ? 'cover' : 'contain');
                    }}
                    className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/85 hover:bg-neutral-900 text-white border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center justify-center"
                  >
                    {imageDisplayMode === 'contain' ? (
                      <Maximize2 className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Minimize2 className="h-4 w-4 text-amber-400" />
                    )}
                  </button>

                  {/* Lightbox Trigger */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsLightboxOpen(true);
                    }}
                    className="p-2 sm:p-2.5 rounded-xl bg-neutral-900/85 hover:bg-neutral-900 text-white border border-white/15 hover:border-white/30 backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center justify-center gap-1.5 text-xs font-bold"
                  >
                    <Eye className="h-4 w-4 text-amber-400" />
                    <span className="hidden sm:inline font-sans text-white text-[10px] tracking-wider uppercase font-black">Perbesar</span>
                  </button>
                </div>

                {/* Rating and Info Overlays */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
                  <div className="bg-neutral-900/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 border border-white/10 shadow">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="font-bold">{tour.rating}</span>
                    <span className="text-neutral-300">({tour.reviewCount} ulasan)</span>
                  </div>

                  <span className="hidden sm:inline-block bg-neutral-900/75 backdrop-blur-sm text-neutral-300 px-2.5 py-1 rounded-lg text-[9px] font-mono tracking-wide uppercase">
                    Klik gambar untuk layar penuh
                  </span>
                </div>
              </div>

              {/* clickable Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-3">
                {richData.gallery.map((img, i) => {
                  const isSelected = activeImage === img;
                  return (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-amber-500 scale-[0.98] ring-4 ring-amber-500/20' 
                          : 'border-transparent hover:border-neutral-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Gallery view ${i + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-amber-500/15 flex items-center justify-center">
                          <span className="bg-amber-500 text-neutral-950 text-[8px] font-black uppercase font-mono px-2 py-0.5 rounded shadow-sm">
                            Aktif
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Title, Overview, Highlights */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1.5 mb-2">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>East Java National Parks</span>
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-neutral-900 leading-tight">
                  {tour.name}
                </h1>
              </div>

              {/* Quick Spec Tags */}
              <div className="grid grid-cols-3 gap-3 border-t border-b border-neutral-100 py-4 text-center">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Duration</span>
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-extrabold text-neutral-800">
                    <Clock className="h-4 w-4 text-amber-500" />
                    <span>{tour.duration}</span>
                  </div>
                </div>
                <div className="space-y-1 border-l border-r border-neutral-100">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Group Type</span>
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-extrabold text-neutral-800">
                    <Users className="h-4 w-4 text-amber-500" />
                    <span>Private &amp; Share</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-neutral-400 block font-bold">Transport</span>
                  <div className="flex items-center justify-center gap-1 text-xs sm:text-sm font-extrabold text-neutral-800">
                    <Car className="h-4 w-4 text-amber-500" />
                    <span>4x4 Jeep &amp; SUV</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-neutral-900">Trip Overview</h3>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                  {tour.description} Nikmati kemudahan berwisata tanpa repot memikirkan transportasi, perizinan, dan pemandu lokal. SmartJourney memastikan setiap aspek petualangan Anda terorganisir secara mulus dengan armada penjemputan premium ber-AC dingin, sopir berpengalaman, dan pemandu lokal berlisensi.
                </p>
              </div>

              {/* Key Highlights */}
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-amber-700 flex items-center gap-2">
                  <Compass className="h-4 w-4" />
                  <span>Highlight Perjalanan</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {tour.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <div className="p-0.5 bg-emerald-500/15 text-emerald-600 rounded mt-0.5">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                      <span className="text-xs font-bold text-neutral-700 leading-tight">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NEW: Menu Paket & Pilihan Harga (Package Options) */}
              <div className="bg-neutral-50/50 border border-neutral-200/60 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-amber-600 block mb-1">PILIHAN AKOMODASI & LAYANAN</span>
                  <h3 className="text-xl font-black text-neutral-900">Pilih Menu Paket &amp; Harga Wisata</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Setiap paket kami dirancang khusus dengan layanan terpercaya. Klik untuk memilih paket yang sesuai dengan preferensi kenyamanan perjalanan Anda:
                  </p>
                </div>

                <div className="space-y-4">
                  {packageTiers.map((tier) => {
                    const isSelected = selectedTierId === tier.id;
                    return (
                      <div
                        key={tier.id}
                        id={`package-tier-${tier.id}`}
                        onClick={() => setSelectedTierId(tier.id)}
                        className={`border-2 rounded-2xl p-5 cursor-pointer transition-all flex flex-col md:flex-row gap-5 justify-between items-start md:items-center relative overflow-hidden ${
                          isSelected
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-xl scale-[1.01]'
                            : 'bg-white text-neutral-850 border-neutral-200 hover:border-neutral-300 hover:shadow-sm'
                        }`}
                      >
                        {/* Popular Badge for Private Standard */}
                        {tier.id === 'private' && (
                          <span className="absolute top-0 right-0 bg-amber-500 text-neutral-950 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl font-mono">
                            REKOMENDASI UTAMA
                          </span>
                        )}

                        <div className="space-y-3 flex-1 text-left">
                          <div className="flex items-center gap-2.5">
                            <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected ? 'border-amber-400 bg-amber-500 text-neutral-950' : 'border-neutral-300'
                            }`}>
                              {isSelected && <span className="h-2 w-2 rounded-full bg-neutral-950" />}
                            </span>
                            <h4 className="font-extrabold text-sm sm:text-base tracking-tight">{tier.name}</h4>
                          </div>
                          
                          <p className={`text-xs ${isSelected ? 'text-neutral-400' : 'text-neutral-500'} leading-relaxed`}>
                            {tier.description}
                          </p>
                          
                          {/* Features grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-dashed border-neutral-200/10">
                            {tier.features.map((feature, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2 text-[11px] leading-tight">
                                <Check className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                                <span className={isSelected ? 'text-neutral-300' : 'text-neutral-600'}>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="text-left md:text-right shrink-0 md:border-l border-neutral-200/10 md:pl-6 space-y-1 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-neutral-200/10 flex md:flex-col justify-between md:justify-center items-center md:items-end">
                          <div>
                            <span className={`text-[9px] uppercase font-mono block text-left md:text-right ${isSelected ? 'text-neutral-400' : 'text-neutral-400'}`}>Mulai Dari</span>
                            <div className="text-xl sm:text-2xl font-black text-amber-500">
                              {formatPrice(tier.priceUSD, tier.priceIDR)}
                            </div>
                            <span className={`text-[9px] block font-mono font-bold text-left md:text-right ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>/ Pax (Tamu)</span>
                          </div>
                          {isSelected && (
                            <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2 py-0.5 rounded font-mono font-bold uppercase mt-1"> terpilih </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. Daily Itinerary (Day-by-Day Interactive Tabs with Hourly Timeline) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-neutral-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <span>Rencana Perjalanan Detail</span>
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">Jadwal akurat per hari beserta aktivitas jam demi jam</p>
                </div>

                {/* Day Selectors */}
                {daysData.length > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {daysData.map((d) => (
                      <button
                        key={d.dayNum}
                        onClick={() => setSelectedDayTab(d.dayNum)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                          selectedDayTab === d.dayNum
                            ? 'bg-amber-500 text-neutral-950 shadow'
                            : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                        }`}
                      >
                        Hari {d.dayNum}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Render Selected Day Timeline */}
              {daysData.map((day) => {
                if (day.dayNum !== selectedDayTab) return null;
                return (
                  <div key={day.dayNum} className="space-y-6 animate-fade-in">
                    
                    {/* Day Title bar */}
                    <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl flex items-center gap-3">
                      <div className="bg-amber-500 text-neutral-950 font-mono font-black px-3 py-1 rounded-xl text-xs uppercase tracking-wider">
                        DAY 0{day.dayNum}
                      </div>
                      <span className="text-sm font-extrabold text-neutral-800 uppercase tracking-tight">
                        {day.dayTitle}
                      </span>
                    </div>

                    {/* Timeline List of Activities */}
                    <div className="relative border-l-2 border-amber-500/30 pl-6 space-y-8 ml-4">
                      {day.activities.map((act, actIdx) => (
                        <div key={actIdx} className="relative group">
                          {/* Circle pointer with custom icon */}
                          <div className="absolute -left-[37px] top-1 h-8 w-8 rounded-full bg-white border-2 border-amber-500 flex items-center justify-center shadow-sm z-10 transition-transform group-hover:scale-110">
                            {renderActivityIcon(act.iconType)}
                          </div>

                          <div className="space-y-1.5">
                            {/* Time badge */}
                            <span className="font-mono text-xs font-black text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/15">
                              {act.time}
                            </span>
                            
                            {/* Activity name */}
                            <h4 className="text-sm sm:text-base font-black text-neutral-900 pt-1 flex items-center gap-1.5">
                              <span>{act.title}</span>
                            </h4>

                            {/* Detailed explanation */}
                            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
                              {act.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* 4. Include & Exclude Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              {/* Inclusions */}
              <div className="border border-neutral-200/80 rounded-2xl p-6 space-y-4">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-emerald-600 flex items-center gap-2">
                  <Check className="h-4.5 w-4.5" />
                  <span>Harga Sudah Termasuk</span>
                </h4>
                <ul className="space-y-3">
                  {richData.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-neutral-600 leading-relaxed">
                      <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="border border-neutral-200/80 rounded-2xl p-6 space-y-4">
                <h4 className="font-extrabold text-sm uppercase tracking-wider text-red-500 flex items-center gap-2">
                  <X className="h-4.5 w-4.5" />
                  <span>Tidak Termasuk</span>
                </h4>
                <ul className="space-y-3">
                  {richData.excludes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-semibold text-neutral-600 leading-relaxed">
                      <X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What to Bring Section */}
            <div className="border border-neutral-200/80 rounded-2xl p-6 space-y-4 bg-amber-500/5">
              <h4 className="font-extrabold text-sm uppercase tracking-wider text-amber-600 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5" />
                <span>Perlengkapan yang Harus Dibawa (What to Bring)</span>
              </h4>
              <p className="text-xs text-neutral-500">Persiapkan barang-barang berikut agar perjalanan Anda berjalan lancar dan nyaman:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {(richData.whatToBring || []).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-neutral-600 leading-relaxed">
                    <div className="h-5 w-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>



            {/* 6. Collapse FAQ Accordions */}
            <div className="space-y-4">
              <h3 className="text-xl font-extrabold text-neutral-900">Pertanyaan yang Sering Diajukan (FAQ)</h3>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl bg-white overflow-hidden">
                {richData.faqs.map((item, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div key={idx} className="py-1">
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-neutral-800 hover:text-amber-600 transition-colors py-4 px-5 cursor-pointer"
                      >
                        <span>{item.q}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-amber-500" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
                      </button>
                      
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs sm:text-sm text-neutral-500 leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLUMNS: Departure Calendar & Sticky Secure Booking Widget */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* departure Calendar Selection Box replaced by clean "Check Availability" card */}
            <div className="bg-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-[10px] bg-amber-500 text-neutral-950 font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono inline-block">
                  PESAN SEKARANG
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">Cek Ketersediaan &amp; Harga Paket</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Pilih tanggal perjalanan Anda, jam keberangkatan, serta opsi Paket A, B, atau C untuk mendapatkan harga final akurat.
                </p>
              </div>

              {/* Price Starting Point */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
                <span className="text-[10px] text-neutral-500 font-mono font-bold block">HARGA MULAI DARI</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-amber-500">
                    {formatPrice(tour.startingPrice, tour.startingPriceIDR)}
                  </span>
                  <span className="text-xs text-neutral-400 font-bold">/ Pax (Tamu)</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold pt-1 border-t border-white/5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Garansi Layanan Terbaik &amp; Tanpa Biaya Tersembunyi</span>
                </div>
              </div>

              {/* Bullet Points */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <Check className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Layanan Penjemputan Fleksibel:</strong> Bandara, Hotel, atau Stasiun di Surabaya/Malang.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <Check className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Keberangkatan Dijamin:</strong> 100% berangkat sesuai tanggal konfirmasi Anda.</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-neutral-300">
                  <Check className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Pilihan Paket Eksklusif:</strong> Pilihan Paket A (Reguler), Paket B (Privat), atau Paket C (VIP Luxury).</span>
                </div>
              </div>

              {/* Call-to-Action button to launch Check Availability Drawer */}
              <button
                onClick={() => setIsAvailabilitySheetOpen(true)}
                className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Cek Ketersediaan (Check Availability)</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="text-center pt-1">
                <p className="text-[10px] text-neutral-500 font-bold font-mono">⚡ KONFIRMASI INSTAN &amp; AMAN</p>
              </div>
            </div>

            {/* Extra Auxiliary Transport Services links */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-3xl p-6 space-y-4">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-neutral-800">Layanan Ekstra SmartJourney</h4>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Butuh layanan penjemputan bandara atau rental mobil di kota asal? Hubungkan rencana perjalanan Anda sekarang juga.
              </p>
              
              <div className="space-y-2">
                <button
                  onClick={() => setPage('airport')}
                  className="w-full text-left bg-white hover:bg-neutral-100/50 border border-neutral-200 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-neutral-700 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Plane className="h-4.5 w-4.5 text-amber-500" />
                    <span>Airport Transfer Service (SUB / YIA)</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                </button>

                <button
                  onClick={() => setPage('taxi')}
                  className="w-full text-left bg-white hover:bg-neutral-100/50 border border-neutral-200 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-neutral-700 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Route className="h-4.5 w-4.5 text-amber-500" />
                    <span>Flat-Rate Intercity Executive Taxi</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                </button>

                <button
                  onClick={() => setPage('car-rental')}
                  className="w-full text-left bg-white hover:bg-neutral-100/50 border border-neutral-200 p-3 rounded-xl flex items-center justify-between text-xs font-bold text-neutral-700 transition-all cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Car className="h-4.5 w-4.5 text-amber-500" />
                    <span>Premium Car Rental with Private Tour Driver</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* 7. Similar Trips recommendations */}
        <div className="border-t border-neutral-200 mt-20 pt-16 space-y-8">
          <div>
            <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-600 block mb-1">Rekomendasi</span>
            <h3 className="text-2xl font-black text-neutral-900">Similar Trips (Tur yang Serupa)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tours.filter(t => t.id !== tour.id).slice(0, 3).map(simTour => (
              <div
                key={simTour.id}
                onClick={() => {
                  setSearchParams({ ...searchParams, selectedTourId: simTour.id });
                }}
                className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-neutral-300 transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={simTour.image}
                    alt={simTour.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-neutral-900/80 backdrop-blur-sm text-amber-500 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
                    {simTour.category}
                  </span>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                      {simTour.name}
                    </h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {simTour.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-[9px] text-neutral-400 block uppercase font-mono">From</span>
                      <span className="text-sm font-black text-amber-600">
                        {formatPrice(simTour.startingPrice, simTour.startingPriceIDR)}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                      <span>Detail</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <CustomerReviewsSection 
          serviceType="tour" 
          serviceId={tour.id} 
          serviceName={tour.name} 
        />
      </div>

      {/* checkout Modal Portal */}
      {isBookingOpen && (
        <CheckoutModal
          isOpen={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          serviceType="tour"
          serviceName={tour.name}
          basePriceUSD={selectedTier.priceUSD}
          basePriceIDR={selectedTier.priceIDR}
          initialDetails={{
            date: selectedDate,
            time: selectedTime,
            guests: guestCount,
            tourId: tour.id,
            packageTier: selectedTier.name,
            pickupLocation: 'Hotel Lobby / Airport Arrival'
          }}
        />
      )}

      {/* Availability & Booking Sheet Modal */}
      {isAvailabilitySheetOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          {/* Backdrop click to close */}
          <div className="fixed inset-0 cursor-default" onClick={() => setIsAvailabilitySheetOpen(false)} />

          <div className="relative bg-white text-neutral-850 rounded-3xl w-full max-w-5xl shadow-2xl z-10 flex flex-col overflow-hidden max-h-[90vh] md:max-h-[85vh] border border-neutral-200 animate-scale-up animate-fade-in">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-150 flex items-center justify-between bg-neutral-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-amber-500/10 rounded-xl text-amber-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-neutral-900 leading-tight">Cek Ketersediaan &amp; Konfigurasi Paket Tur</h3>
                  <p className="text-[10px] text-neutral-400 font-mono font-bold uppercase tracking-widest">Instant Booking Engine</p>
                </div>
              </div>
              <button
                onClick={() => setIsAvailabilitySheetOpen(false)}
                className="text-neutral-400 hover:text-neutral-800 bg-neutral-100 hover:bg-neutral-200 p-2 rounded-full transition-colors cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Unified Modal Body */}
            <div className="overflow-y-auto p-4 sm:p-5 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
              
              {/* LEFT COLUMN: Date Selector (Calendar Model) */}
              <div className="md:col-span-5 space-y-4 text-left pb-4 md:pb-0">
                
                {/* 1. Date Selection (Calendar) */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900 uppercase tracking-wider font-mono flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-black">1</span>
                    <span>Pilih Tanggal Perjalanan</span>
                  </h4>
                  
                  {/* Calendar box */}
                  <div className="bg-neutral-50 text-neutral-800 rounded-3xl p-4 sm:p-5 border border-neutral-200 shadow-sm space-y-3 text-left">
                    {/* Month Selector bar */}
                    <div className="flex items-center justify-between text-[11px] font-bold font-mono text-neutral-500 pb-1.5 border-b border-neutral-200">
                      <span className="text-neutral-400">&lt; JUN 2026</span>
                      <span className="text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">JULY 2026</span>
                      <span className="text-neutral-400 font-mono">AUG 2026 &gt;</span>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold">
                      {/* Weekday Labels */}
                      {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                        <span key={d} className="text-neutral-400 font-mono py-1">{d}</span>
                      ))}

                      {/* Empty spacers */}
                      {[...Array(3)].map((_, i) => (
                        <span key={`spacer-${i}`} className="py-2 opacity-0">.</span>
                      ))}

                      {/* Calendar Days */}
                      {calendarDays.map(day => {
                        const isSelected = selectedDate === day.dateString;
                        return (
                          <button
                            key={day.dateString}
                            disabled={!day.isAvailable}
                            onClick={() => {
                              setSelectedDate(day.dateString);
                            }}
                            className={`py-2 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer relative ${
                              day.isFull
                                ? 'opacity-50 cursor-not-allowed text-rose-500 bg-rose-50 border border-dashed border-rose-200'
                                : !day.isAvailable
                                ? 'opacity-20 cursor-not-allowed text-neutral-400 bg-neutral-100 line-through'
                                : isSelected
                                ? 'bg-amber-500 text-neutral-950 font-black shadow-md scale-105 border border-amber-600'
                                : 'bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 hover:border-neutral-300 shadow-sm'
                            }`}
                          >
                            <span className="text-xs">{day.dayNum}</span>
                            {day.isFull ? (
                              <span className="text-[7px] text-rose-500 font-mono font-extrabold tracking-tighter uppercase scale-90 leading-none">
                                Sold Out
                              </span>
                            ) : day.isAvailable ? (
                              <span className={`text-[8px] font-mono font-black ${isSelected ? 'text-neutral-950' : 'text-emerald-600'}`}>
                                {day.priceMultiplier > 1.0 ? '$$' : 'ok'}
                              </span>
                            ) : (
                              <span className="text-[7px] text-neutral-450 font-mono font-extrabold tracking-tighter uppercase scale-90 leading-none">
                                Closed
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend info */}
                  <div className="flex items-center justify-center gap-4 text-[9px] text-neutral-500 font-bold font-mono pt-1.5 border-t border-neutral-150">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" /> Terpilih
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-white border border-neutral-300 rounded-full" /> Tersedia
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-rose-50 border border-rose-200 rounded-full" /> Penuh
                    </span>
                  </div>
                </div>

                {/* Selected Date Indicator Banner */}
                {selectedDate && (
                  <div className="bg-amber-50 border border-amber-100 text-neutral-850 text-xs rounded-2xl p-3 flex items-center justify-between font-bold shadow-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-600 font-black" />
                      <span>Tanggal Terpilih: <strong className="text-amber-700 font-black">{selectedDate}</strong></span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedDate('');
                        setSelectedTierId('');
                      }}
                      className="text-[10px] text-amber-600 hover:text-amber-700 underline uppercase font-black"
                    >
                      Ubah
                    </button>
                  </div>
                )}

              </div>

              {/* RIGHT COLUMN: Package Selection (Package Type Model) */}
              <div className="md:col-span-7 space-y-4 text-left pt-4 md:pt-0 md:pl-6">
                
                {!selectedDate ? (
                  /* STEP 1 LOCK STATE: Prompt to choose Date first */
                  <div className="border-2 border-dashed border-neutral-200 rounded-3xl p-6 text-center flex flex-col items-center justify-center min-h-[300px] bg-neutral-50/50 space-y-3 animate-fade-in">
                    <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center animate-pulse">
                      <Lock className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs text-neutral-800 uppercase tracking-wider">PILIH TANGGAL TERLEBIH DAHULU</h4>
                      <p className="text-[11px] text-neutral-500 leading-relaxed max-w-xs mx-auto">
                        Silakan pilih <strong>Tanggal Keberangkatan</strong> di kalender sebelah kiri untuk memunculkan pilihan paket wisata.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* ACTIVE STATE: Packages appear with a nice entry animation */
                  <div className="space-y-4">
                    {/* Step Header */}
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-xs sm:text-sm text-neutral-900 uppercase tracking-wider font-mono flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center text-xs font-black">2</span>
                        <span>Pilih Tipe Paket Wisata</span>
                      </h4>
                      <p className="text-xs text-neutral-500">Pilih jenis paket yang sesuai dengan kebutuhan perjalanan Anda</p>
                    </div>

                    {/* Package Cards List */}
                    <div className="space-y-2.5">
                      {packageTiers.map(tier => {
                        const isSelected = selectedTierId === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTierId(tier.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                              isSelected
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-lg scale-[1.01]'
                                : 'bg-white text-neutral-850 border-neutral-200 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-3">
                              <div className="space-y-0.5 max-w-[75%]">
                                <div className="flex items-center gap-2">
                                  <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${
                                    isSelected ? 'border-amber-400 bg-amber-500 text-neutral-950' : 'border-neutral-300'
                                  }`}>
                                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-neutral-950" />}
                                  </span>
                                  <h5 className="font-extrabold text-xs sm:text-sm tracking-tight">{tier.name}</h5>
                                </div>
                                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-550'}`}>
                                  {tier.description}
                                </p>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="text-[9px] text-neutral-400 font-bold block leading-tight">Harga per Pax</span>
                                <span className="text-xs sm:text-sm font-black text-amber-500">
                                  {formatPrice(tier.priceUSD, tier.priceIDR)}
                                </span>
                              </div>
                            </div>

                            {/* Features list (Compact, shown ONLY when selected) */}
                            {isSelected && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-1 mt-3 pt-3 border-t border-dashed border-neutral-800 animate-fade-in">
                                {tier.features.slice(0, 4).map((feat, idx) => (
                                  <span 
                                    key={idx} 
                                    className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-300"
                                  >
                                    <Check className="h-3 w-3 text-amber-500 shrink-0" />
                                    <span className="truncate">{feat}</span>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Step 3: Pickup Time and Guest Selection (Rendered dynamically below chosen package) */}
                    {selectedTierId && (
                      <div className="space-y-4 pt-4 border-t border-neutral-100 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          
                          {/* Pick Up Time Selector */}
                          <div className="space-y-2">
                            <label className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-amber-500" />
                              <span>Jam Penjemputan</span>
                            </label>
                            <select
                              value={selectedTime}
                              onChange={(e) => setSelectedTime(e.target.value)}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-bold text-neutral-800 focus:outline-none focus:border-amber-500 cursor-pointer"
                            >
                              <option value="01:00 AM">01:00 AM (Sunrise Tour - Rekomendasi)</option>
                              <option value="04:00 AM">04:00 AM (Pagi Buta)</option>
                              <option value="08:00 AM">08:00 AM (Pagi Standar)</option>
                            </select>
                          </div>

                          {/* Guest Count Selector */}
                          <div className="space-y-2">
                            <label className="text-xs font-extrabold text-neutral-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                              <Users className="h-4 w-4 text-amber-500" />
                              <span>Jumlah Tamu / Pax</span>
                            </label>
                            <div className="bg-neutral-50 border border-neutral-200 p-1.5 rounded-xl flex items-center justify-between h-[42px]">
                              <button
                                type="button"
                                onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                                className="h-7 w-7 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-sm font-black transition-all flex items-center justify-center cursor-pointer"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-neutral-850">{guestCount} Pax</span>
                              <button
                                type="button"
                                onClick={() => setGuestCount(prev => Math.min(25, prev + 1))}
                                className="h-7 w-7 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-sm font-black transition-all flex items-center justify-center cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Booking Summary Card */}
                        <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-2.5 text-xs text-neutral-600 font-semibold">
                          <div className="flex justify-between items-center border-b border-dashed border-neutral-200 pb-2">
                            <span className="font-extrabold text-neutral-850 uppercase tracking-wider text-[10px]">Paket Terpilih:</span>
                            <span className="font-black text-neutral-900 text-xs">{selectedTier.name}</span>
                          </div>
                          <div className="flex justify-between font-mono text-[11px]">
                            <span>Harga Satuan:</span>
                            <strong className="text-neutral-850">
                              {formatPrice(selectedTier.priceUSD, selectedTier.priceIDR)}
                            </strong>
                          </div>
                          <div className="flex justify-between font-mono text-[11px]">
                            <span>Jadwal Keberangkatan:</span>
                            <strong className="text-neutral-850">{selectedDate} ({selectedTime})</strong>
                          </div>
                          <div className="flex justify-between font-mono text-[11px]">
                            <span>Jumlah Tamu:</span>
                            <strong className="text-neutral-850">{guestCount} Pax</strong>
                          </div>
                          <div className="flex justify-between items-baseline border-t border-dashed border-neutral-200 pt-2.5">
                            <span className="font-extrabold text-neutral-850 uppercase tracking-wider text-[10px]">Total Estimasi:</span>
                            <span className="text-base font-black text-amber-600">
                              {formatPrice(selectedTier.priceUSD * guestCount, selectedTier.priceIDR * guestCount)}
                            </span>
                          </div>
                        </div>

                        {/* Active PROCEED BUTTON */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsAvailabilitySheetOpen(false);
                            setIsBookingOpen(true);
                          }}
                          className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all hover:scale-[1.01] cursor-pointer"
                        >
                          <span>Proses Ke Pembayaran (Proceed to Checkout)</span>
                          <ArrowRight className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    )}

                    {!selectedTierId && (
                      /* Helper when date selected but package is not yet selected */
                      <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 text-center">
                        <p className="text-xs text-amber-800 font-bold">
                          👉 Silakan klik salah satu Paket di atas (Paket A, B, atau C) untuk melanjutkan pemesanan.
                        </p>
                      </div>
                    )}

                  </div>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

      {/* Sticky Floating Bottom Action Bar */}
      {!isAvailabilitySheetOpen && !isBookingOpen && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 z-40 shadow-2xl px-4 py-3 sm:px-6 flex items-center justify-between transition-all animate-fade-in">
          <div className="flex flex-col items-start text-left">
            <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest font-mono">Destinasi Pilihan</span>
            <span className="text-xs sm:text-sm font-black text-white truncate max-w-[120px] sm:max-w-xs">{tour.name}</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest font-mono block">Mulai Dari</span>
              <span className="text-sm font-black text-amber-500">{formatPrice(tour.startingPrice, tour.startingPriceIDR)}</span>
            </div>
            <button
              onClick={() => setIsAvailabilitySheetOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black px-4 py-2.5 sm:px-7 sm:py-3.5 rounded-xl text-[10px] sm:text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.03] cursor-pointer"
            >
              <span>Cek Ketersediaan</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-neutral-950/98 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in select-none">
          {/* Close Backdrop click */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setIsLightboxOpen(false)} />
          
          {/* Header Info & Close Button */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-[210] pointer-events-none">
            <div className="text-white text-left max-w-[70%]">
              <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest block">
                {tour.category} • Layar Penuh
              </span>
              <h4 className="text-sm sm:text-base font-black truncate text-neutral-100">{tour.name}</h4>
            </div>
            
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer pointer-events-auto border border-white/5 flex items-center justify-center"
              title="Tutup (ESC)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Central Image and Arrows */}
          <div className="relative max-w-5xl w-full h-[60vh] sm:h-[70vh] flex items-center justify-center z-[205]">
            {/* Left Nav Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevImage();
              }}
              className="absolute left-0 sm:-left-16 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer border border-white/5 flex items-center justify-center z-[210] hover:scale-110 active:scale-95"
              title="Foto Sebelumnya"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Image display container */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Blurred background backup to look lush and eliminate blank spaces */}
              <img
                src={activeImage}
                alt=""
                className="absolute max-w-full max-h-full object-contain blur-3xl opacity-35 scale-105 pointer-events-none transition-all duration-300"
                referrerPolicy="no-referrer"
              />
              <img
                src={activeImage}
                alt="Lightbox view"
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl relative z-10 transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right Nav Arrow */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextImage();
              }}
              className="absolute right-0 sm:-right-16 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer border border-white/5 flex items-center justify-center z-[210] hover:scale-110 active:scale-95"
              title="Foto Selanjutnya"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Thumbnails list inside lightbox */}
          <div className="relative z-[205] mt-6 sm:mt-8 max-w-md w-full flex flex-col items-center gap-3">
            <span className="text-[11px] font-mono font-bold text-neutral-400">
              Foto {activeImageIndex + 1} dari {richData.gallery.length}
            </span>
            <div className="flex gap-2 justify-center w-full overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-neutral-800">
              {richData.gallery.map((img, i) => {
                const isSelected = activeImage === img;
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative ${
                      isSelected ? 'border-amber-500 scale-[0.95]' : 'border-neutral-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
