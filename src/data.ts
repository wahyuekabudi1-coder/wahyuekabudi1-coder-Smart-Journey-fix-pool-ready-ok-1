import { Tour, Vehicle, Review } from './types';

export const TOURS: Tour[] = [
  {
    id: 'bromo',
    name: 'Mount Bromo Midnight Sunrise Tour',
    description: 'Witness the iconic otherworldly sunrise over Mount Bromo, scale the volcanic crater, and explore the vast sea of sand in an open-top 4x4 Jeep.',
    duration: '1 Day (12-14 Hours)',
    startingPrice: 49,
    startingPriceIDR: 750000,
    rating: 4.9,
    reviewCount: 184,
    image: 'https://images.unsplash.com/photo-1604999333679-b86d54738315?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Penanjakan Golden Sunrise Viewpoint',
      '4x4 Jeep driving through Sea of Sand',
      'Scale Bromo volcanic crater rim',
      'Luhur Poten Hindu Temple',
      'Professional English-speaking local guide'
    ],
    itinerary: [
      '00:00 AM - Pickup from Surabaya or Malang (Hotel/Airport/Station)',
      '02:30 AM - Arrive at Tosari/Cemoro Lawang transit point, transfer to 4x4 Jeep',
      '03:30 AM - Arrive at Mount Penanjakan peak; hot coffee/tea and view sunrise',
      '06:00 AM - Descent to Bromo Sea of Sand, short walk or horse ride to crater',
      '08:00 AM - Return to Jeep, transfer back to transit point for breakfast',
      '10:30 AM - Depart back to your drop-off city',
      '01:00 PM - Arrive back in Surabaya or Malang'
    ],
    category: 'Adventure'
  },
  {
    id: 'ijen',
    name: 'Ijen Crater Blue Fire Expedition',
    description: 'Embark on a midnight trek into the active volcanic crater of Mount Ijen to witness the rare natural phenomenon of the Electric Blue Fire.',
    duration: '1 Day (14-16 Hours)',
    startingPrice: 59,
    startingPriceIDR: 900000,
    rating: 4.8,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Rare Electric Blue Fire phenomenon',
      'World’s largest highly acidic crater lake',
      'Stunning sunrise view from the ridge',
      'Meet the traditional sulfur miners',
      'Gas mask and safety gear included'
    ],
    itinerary: [
      '00:00 AM - Pickup from Banyuwangi or Bondowoso',
      '01:30 AM - Arrive at Paltuding base camp; safety brief & safety gear distribution',
      '02:00 AM - Begin trekking up Mount Ijen (approx. 3 km, 1.5 - 2 hours)',
      '03:45 AM - Descend into the crater to witness the mystical Blue Fire close-up',
      '05:15 AM - Ascend to the crater rim to enjoy the sunrise over the turquoise lake',
      '07:00 AM - Walk down to Paltuding camp, transfer for local breakfast',
      '10:00 AM - Return transfer to your hotel or port'
    ],
    category: 'Nature'
  },
  {
    id: 'tumpak-sewu',
    name: 'Tumpak Sewu Thousand Waterfalls Adventure',
    description: 'Explore Indonesia’s most spectacular semi-circular canyon waterfall, surrounded by lush tropical rainforests at the base of Mount Semeru.',
    duration: '1 Day (10-12 Hours)',
    startingPrice: 45,
    startingPriceIDR: 700000,
    rating: 4.9,
    reviewCount: 96,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Panoramic view from Tumpak Sewu cliff edge',
      'Canyon floor hike through pristine rivers',
      'Visit Goa Tetes cave & waterfall complex',
      'Breathtaking views of Mount Semeru active volcano',
      'All safety equipment and local ranger'
    ],
    itinerary: [
      '06:30 AM - Pickup from Malang (or 05:00 AM from Surabaya)',
      '09:00 AM - Arrive at Tumpak Sewu Entrance, take in the breathtaking panorama from the cliff view point',
      '09:30 AM - Begin safety-guided descent down the cliff path to the canyon floor',
      '10:15 AM - Feel the misty spray at the foot of the magnificent "Thousand Waterfalls"',
      '11:30 AM - Trek upstream to Goa Tetes, a multi-tiered cave waterfall system',
      '01:00 PM - Climb back to the top for local lunch and shower',
      '03:00 PM - Transfer back to Malang or Surabaya'
    ],
    category: 'Adventure'
  },
  {
    id: 'malang-city',
    name: 'Malang & Batu Premium Heritage Tour',
    description: 'Discover the charming Dutch colonial architecture of Malang, visit traditional colorful villages, and experience the cool mountain air of Batu.',
    duration: '1 Day (8-10 Hours)',
    startingPrice: 39,
    startingPriceIDR: 600000,
    rating: 4.7,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Jodipan Colorful Village (Kampung Warna-Warni)',
      'Historic Dutch Colonial Heritage Area',
      'Apple picking in the orchards of Batu',
      'Premium Indonesian culinary tastings',
      'Private air-conditioned vehicle all day'
    ],
    itinerary: [
      '08:30 AM - Pickup from your Malang hotel',
      '09:00 AM - Guided walk through Jodipan Colorful Village',
      '10:30 AM - Scenic drive through Ijen Boulevard, Malang Cathedral, and Town Hall',
      '12:00 PM - Authentic Javanese lunch at a historic premium colonial eatery',
      '01:30 PM - Drive to the mountain resort town of Batu',
      '02:00 PM - Fun fresh apple picking at a local organic orchard',
      '04:00 PM - Visit Coban Rondo waterfall and enjoy the mountain scenery',
      '06:00 PM - Drop-off back to your Malang hotel'
    ],
    category: 'City'
  },
  {
    id: 'bromo-madakaripura-2d',
    name: '2-Day Bromo & Madakaripura Waterfall Explorer',
    description: 'Witness the iconic Bromo sunrise combined with a premium trek inside Madakaripura, Java\'s tallest canyon waterfall system. Stay at a premium mountain lodge.',
    duration: '2 Days (2D1N)',
    startingPrice: 125,
    startingPriceIDR: 1900000,
    rating: 4.9,
    reviewCount: 88,
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Mount Bromo golden caldera sunrise',
      'Mossy towering canyons of Madakaripura Waterfall',
      'Luxury mountain resort overnight stay',
      'Private 4x4 custom open-air Jeep ride',
      'Premium Javanese lunch and private guide'
    ],
    itinerary: [
      'Day 1 - morning pickup from Surabaya/Malang, scenic drive & private trek to the magical Madakaripura Waterfall canyon. Check in at premium mountain lodge.',
      'Day 2 - 03:00 AM 4x4 Jeep ride to Penanjakan Peak for sunrise. Scale Bromo crater rim, explore Sea of Sand, and transfer back to Surabaya/Malang in the afternoon.'
    ],
    category: 'Adventure'
  },
  {
    id: 'volcano-combo-3d',
    name: '4-Day Ultimate East Java Volcanoes Combo',
    description: 'The definitive volcanic safari. Visit Malang, hike Tumpak Sewu & Air Terjun Tetes, witness the otherworldly sunrise over Mount Bromo, and trek Mount Ijen to see the rare Electric Blue Fire.',
    duration: '4 Days (4D3N)',
    startingPrice: 249,
    startingPriceIDR: 3750000,
    rating: 4.95,
    reviewCount: 165,
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Visit historic Malang city and colonial landmarks',
      'Trek Air Terjun Tetes & Tumpak Sewu Thousand Waterfalls',
      'Mount Bromo golden sunrise 4x4 Jeep safari',
      'Rare Electric Blue Fire & Acidic Turquoise Lake in Ijen',
      '3 Nights premium accommodations & fully private transport'
    ],
    itinerary: [
      'Day 1 - 14:00 Airport pickup, 18:00 visit Malang city, 19:00 travel directly to Tumpak Sewu and check-in to your hotel.',
      'Day 2 - 05:00 Depart to Air Terjun Tetes, explore Tetes and Tumpak Sewu waterfalls, travel directly towards Bromo and check-in to your hotel near Bromo.',
      'Day 3 - 03:00 Bromo 4x4 Jeep sunrise safari & active crater hike. Hot buffet breakfast, then scenic drive directly towards Mount Ijen. Check-in around Banyuwangi/Ijen.',
      'Day 4 - 01:00 Midnight hike to Mount Ijen Crater, see Blue Fire & Acidic Lake. Sunrise view, breakfast, and drop-off to Banyuwangi, Bali Ferry, or back to Surabaya.'
    ],
    category: 'Nature'
  },
  {
    id: 'semeru-trekking-4d',
    name: '4-Day Semeru Summit & Bromo Safari Peak',
    description: 'A challenge for active hikers. Trek up Mount Semeru (3,676m), Java\'s highest and most active volcanic summit, passing misty alpine lakes, followed by a Bromo caldera celebration.',
    duration: '4 Days (4D3N)',
    startingPrice: 285,
    startingPriceIDR: 4400000,
    rating: 4.92,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Summit Java\'s highest point (Mahameru 3,676m)',
      'Overnight camping at the stunning Ranu Kumbolo lake',
      'Witness continuous safe puffing ash eruptions from Semeru peak',
      'Bromo active crater walk & Sea of Sand 4x4 safari',
      'Experienced mountain rangers and porter team'
    ],
    itinerary: [
      'Day 1 - Transfer from Malang to Ranupani mountain village. Begin peaceful trek through pine forest to camp at Ranu Kumbolo alpine lake. Starry sky camping.',
      'Day 2 - Trek through Love Slope and lavender valleys to Kalimati high camp. Rest and prepare for the midnight summit hike.',
      'Day 3 - Midnight push to Mahameru Summit (3,676m). Enjoy a magnificent sunrise above the clouds. Descend to Ranupani and transfer to Bromo hotel.',
      'Day 4 - Mount Bromo Jeep safari and crater rim trek. Return scenic overland drive to Malang or Surabaya.'
    ],
    category: 'Adventure'
  },
  {
    id: 'east-java-overland-5d',
    name: '5-Day East Java Overland Cultural Scenic Odyssey',
    description: 'Experience East Java\'s volcanic wonders combined with cultural heritage. Explore Malang colonial town, Bromo caldera, Ijen blue fire, and enjoy a premium beach sunset on Banyuwangi\'s Red Island.',
    duration: '5 Days (5D4N)',
    startingPrice: 349,
    startingPriceIDR: 5300000,
    rating: 4.88,
    reviewCount: 42,
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Explore colonial heritage & colourful villages in Malang',
      'Bromo sunrise & active crater trek',
      'Midnight hike to Ijen Crater Blue Fire',
      'Beautiful sunset and surfing lesson at Red Island Beach',
      'All boutique hotel stays and private premium vehicle'
    ],
    itinerary: [
      'Day 1 - Pick up and historical heritage stroll in Malang. Stay at colonial estate.',
      'Day 2 - Morning drive to Bromo. Check in, afternoon sunset walk around the caldera ridge.',
      'Day 3 - Ultimate Bromo Jeep sunrise tour. Long beautiful drive to Banyuwangi beach resort.',
      'Day 4 - Rest and sunbathe at Red Island Beach, enjoy premium beachside dinner. Late night departure for Ijen.',
      'Day 5 - Deep crater trek inside Mount Ijen. View turquoise acid lake, transfer to Banyuwangi Airport or Ferry Terminal.'
    ],
    category: 'Culture'
  },
  {
    id: 'grand-java-safari-8d',
    name: '8-Day Great Javan Overland Grand Safari',
    description: 'Our most comprehensive grand tour. Traverse Java from cultural capital Yogyakarta (Borobudur & Prambanan) across majestic volcanoes of Bromo and Ijen, ending in the wild untamed rainforests of Meru Betiri National Park.',
    duration: '8 Days (8D7N)',
    startingPrice: 599,
    startingPriceIDR: 9200000,
    rating: 4.96,
    reviewCount: 37,
    image: 'https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Visit Borobudur Buddhist temple & Prambanan Hindu complex',
      'Cultural royal city heritage tour in Yogyakarta',
      'Bromo golden hour caldera Jeep safari',
      'Ijen sulfur crater and magical Blue Fire',
      'Off-road jungle drive to Sukamade Beach green turtle nesting ground',
      'Top-tier boutique hotels and all-inclusive premium private SUV'
    ],
    itinerary: [
      'Day 1 - Arrival in Yogyakarta. Welcome dinner and classic Javanese dance performance. Stay at luxury heritage hotel.',
      'Day 2 - Sunrise at Borobudur, explore Prambanan plains, and traditional silver workshops.',
      'Day 3 - Executive train journey from Yogyakarta to Malang. Heritage evening tour in Malang.',
      'Day 4 - Travel to Bromo, check in at mountain resort. Caldera ridge walk.',
      'Day 5 - Famous Bromo Jeep sunrise, trek the volcanic rim. Cross-country drive to Kalibaru Highland plantation estate.',
      'Day 6 - Plantation tour, then off-road 4x4 jungle expedition to Sukamade beach. Watch green sea turtles lay eggs at midnight under ranger guidance.',
      'Day 7 - Release baby turtle hatchlings into the ocean. Travel to Banyuwangi, check in at premium seaside villa.',
      'Day 8 - Mount Ijen Crater Blue Fire hike. Enjoy final sunrise over the Bali Strait, transfer to Banyuwangi airport or Bali ferry.'
    ],
    category: 'Culture'
  }
];

export const VEHICLES: Vehicle[] = [
  {
    id: 'avanza',
    name: 'Toyota Avanza',
    category: 'Standard',
    passengers: 5,
    luggage: 2,
    hasAC: true,
    pricePerDay: 40,
    pricePerDayIDR: 600000,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', // silver MPV representational
    description: 'The absolute classic Indonesian family car. Compact yet highly functional, economical, and perfectly sized for urban streets or winding mountain roads.',
    features: ['Comfortable seating', 'Dual SRS Airbags', 'Bluetooth Audio System', 'Excellent fuel efficiency'],
    } as Vehicle,
  {
    id: 'innova',
    name: 'Toyota Innova Reborn',
    category: 'Premium',
    passengers: 7,
    luggage: 4,
    hasAC: true,
    pricePerDay: 60,
    pricePerDayIDR: 900000,
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', // Premium family ride
    description: 'Highly preferred for corporate business, long family trips, and executive airport transfers. Offers superior cabin insulation, plush seats, and high safety standards.',
    features: ['Plush Captain Seats', 'Ambience Light Control', 'Triple Zone Climate Control', 'Extra Luggage Capacity'],
  } as Vehicle,
  {
    id: 'hiace-commuter',
    name: 'Toyota Hiace Commuter',
    category: 'Family',
    passengers: 15,
    luggage: 6,
    hasAC: true,
    pricePerDay: 85,
    pricePerDayIDR: 1300000,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', // clean shuttle/passenger van
    description: 'Perfect for mid-sized travel groups, corporate outings, and extended family gatherings. Sturdy, comfortable, and reliable.',
    features: ['15 Ergonomic Passenger Seats', 'High Ceiling Air Venting', 'Underseat luggage space', 'Reclining mechanism'],
  } as Vehicle,
  {
    id: 'hiace-premio',
    name: 'Toyota Hiace Premio',
    category: 'Van',
    passengers: 11,
    luggage: 8,
    hasAC: true,
    pricePerDay: 110,
    pricePerDayIDR: 1700000,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', // luxury commercial van
    description: 'The pinnacle of luxury group transportation in Indonesia. Generous legroom, premium semi-leather individual seats, and advanced suspension for an ultra-smooth journey.',
    features: ['11 Premium Semi-Leather Seats', 'USB ports for every passenger', 'Luxury cabin acoustic damping', 'VSC & Hill Start Assist'],
  } as Vehicle
];

export const REVIEWS: Review[] = [
  {
    id: 'rev1',
    name: '陈秀兰',
    country: 'China',
    rating: 5,
    text: '在微信客服预定的，回复特别快。司机阿古斯很早就来酒店接我们了，开车的技术非常稳，半夜开山路也完全不用担心。布罗莫火山的日出真的绝美！阿古斯还帮我们拍了特别好看的吉普车合影，满分推荐！',
    date: 'May 12, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev2',
    name: '林梓轩',
    country: 'China',
    rating: 5,
    text: '这次的宜珍火山之旅太震撼了，蓝火真的很神奇，虽然爬山有点累。司机的服务很棒，全程带着笑，车里空调很凉快，卫生也做得很好。性价比很高，没有任何隐形消费，很实在的旅行社。',
    date: 'June 25, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev3',
    name: '张伟',
    country: 'China',
    rating: 5,
    text: '从泗水机场接机到布罗莫火山，整个行程安排得非常好。司机托米不仅开车稳当，还会讲一点中文。车子非常干净，是在这里订的Innova，坐着特别舒服，长途坐车也不会觉得累，很赞！',
    date: 'June 10, 2026',
    avatar: '',
    serviceType: 'airport',
    status: 'approved'
  },
  {
    id: 'rev4',
    name: 'Thomas Miller',
    country: 'Germany',
    rating: 5,
    text: 'Perfect service. Booked the midnight Bromo sunrise tour and was blown away. Driver Agus was punctually waiting at our Malang hotel at 11:50 PM. Clean 4x4 Jeep and a safe driver on those winding roads. Zero issues, highly recommended!',
    date: 'May 28, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev5',
    name: '王芳',
    country: 'China',
    rating: 5,
    text: '推荐他们家的包车服务，司机的态度特别诚恳，一路上跟我们聊天，介绍了很多当地好吃的餐厅。车里每天都有准备矿泉水。遇到堵车也会耐心地跟我们解释，让人很安心。',
    date: 'July 01, 2026',
    avatar: '',
    serviceType: 'rental',
    status: 'approved'
  },
  {
    id: 'rev6',
    name: '刘洋',
    country: 'China',
    rating: 5,
    text: '我们在泗水玩了三天，全靠这家公司的包车，车型是Innova Reborn，非常平稳，老人坐着也觉得很舒服。去布罗莫的时候司机对时间把握得特别准，让我们占到了最好的观景位置！',
    date: 'May 18, 2026',
    avatar: '',
    serviceType: 'rental',
    status: 'approved'
  },
  {
    id: 'rev7',
    name: '黄丽丽',
    country: 'China',
    rating: 5,
    text: '非常满意的火山徒步。虽然深夜登山是个挑战，但是司机和向导都非常专业和细心。向导一路上搀扶着体力稍差的朋友，还贴心地准备了防毒面罩 and 头灯，真的很贴心，必须给五星好评！',
    date: 'April 05, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev8',
    name: '赵敏',
    country: 'China',
    rating: 5,
    text: '之前看网上的攻略还担心上山会冷或者不安全，联系了这家的客服，解答得非常有耐心。吉普车司机驾驶技术一流，带我们去的拍照点人也比较少，拍出了大片的感觉。一次完美的旅行体验！',
    date: 'June 29, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev9',
    name: 'Charlotte Evans',
    country: 'United Kingdom',
    rating: 5,
    text: 'Super reliable team! We used their airport transfer to Malang, then did the Tumpak Sewu falls trip. Best choice we made. Driver was friendly, had great local food recs, and drove really smoothly. Price was very fair compared to others.',
    date: 'June 22, 2026',
    avatar: '',
    serviceType: 'airport',
    status: 'approved'
  },
  {
    id: 'rev10',
    name: '许静',
    country: 'China',
    rating: 5,
    text: '服务真的没话说，从泗水包车去外南梦，路程虽然很长，但是司机开得很稳，车里很干净，没有任何异味。中途我们想去咖啡馆 and 便利店，司机也很热心地带我们去，极力推荐给来东爪哇的朋友们！',
    date: 'June 03, 2026',
    avatar: '',
    serviceType: 'taxi',
    status: 'approved'
  },
  {
    id: 'rev11',
    name: '周杰',
    country: 'Taiwan',
    rating: 5,
    text: '布罗莫真的很美，这次选的旅行社很靠谱，车况非常好，司机大哥人特别老实、话不多但很细心，几点出发几点到都安排得妥妥当当。行程中没有任何推销或者带去购物店的行为，非常纯粹的游玩。',
    date: 'April 19, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev12',
    name: '李娜',
    country: 'China',
    rating: 5,
    text: '真的超级划算！我们在宜珍看蓝火，司机在山下一直等我们到早上，下山后还带我们去吃到了正宗的爪哇早餐，特别美味。车子很新，减震做得很好，开山路没有觉得很晕。',
    date: 'May 09, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev13',
    name: 'Aditya Wijaya',
    country: 'Indonesia',
    rating: 5,
    text: 'Sewa Hiace Premio buat rombongan keluarga besar kemarin puas banget. Drivernya Mas Hendra top markotop, ramah dan tahu jalan tikus pas macet di Batu. Unitnya beneran bersih, wangi, AC dingin nyess. Recommended parah buat liburan keluarga!',
    date: 'July 04, 2026',
    avatar: '',
    serviceType: 'rental',
    status: 'approved'
  },
  {
    id: 'rev14',
    name: '郭涛',
    country: 'China',
    rating: 5,
    text: '在网上下单的，行程前一天就有微信客服 and 司机主动联系我，确认上门接送时间和地点，服务态度真的是一流。吉普车司机的车技也是绝了，在沙海里开得飞起，太刺激了！',
    date: 'May 30, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev15',
    name: '梁超',
    country: 'China',
    rating: 5,
    text: '带父母出来玩的，最看重的是安全 and 舒适度。这家的Innova车况好，空间宽敞，司机师傅很沉稳，一路上提醒我们山路颠簸，还细心准备了防寒毛毯。爸妈都对这位司机赞不绝口。',
    date: 'April 30, 2026',
    avatar: '',
    serviceType: 'rental',
    status: 'approved'
  },
  {
    id: 'rev16',
    name: '曾子墨',
    country: 'Hong Kong',
    rating: 5,
    text: '去天崩瀑布（Tumpak Sewu）的行程很完美，向导阿迪带我们走悬崖泥路时非常有安全感，路过水流急的地方都一个一个拉我们过去。服务非常走心，下次来印尼还会找他们家订行程。',
    date: 'March 15, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev17',
    name: 'Hans Baker',
    country: 'Netherlands',
    rating: 5,
    text: 'Highly recommend! Booked an airport transfer from Surabaya and ended up taking a tour with them to Mount Bromo. The communication on WhatsApp was superb. The vehicles are extremely clean and high quality. Great English from the driver too.',
    date: 'June 14, 2026',
    avatar: '',
    serviceType: 'airport',
    status: 'approved'
  },
  {
    id: 'rev18',
    name: '郑宇',
    country: 'China',
    rating: 5,
    text: '性价比真的高，比我们在酒店前台问的价格要划算很多，而且车况要好得多。司机的服务很有礼貌，每次开门都会帮忙提行李。一路上也没有多余的话打扰我们休息，很专业的租车服务。',
    date: 'June 18, 2026',
    avatar: '',
    serviceType: 'rental',
    status: 'approved'
  },
  {
    id: 'rev19',
    name: '孙艳',
    country: 'China',
    rating: 5,
    text: '客服真的特别赞，半夜两点因为接送时间临时有变联系他们，都秒回 and 帮我们调整了司机的安排。司机第二天早上依然按时到达，车子开得非常平稳，真的是超级省心的服务！',
    date: 'April 22, 2026',
    avatar: '',
    serviceType: 'taxi',
    status: 'approved'
  },
  {
    id: 'rev20',
    name: '高鹏',
    country: 'China',
    rating: 5,
    text: '第一次到印尼自由行，幸好订了这家的包车。泗水到外南梦一路上路况很复杂，多亏了司机高超的驾驶技术，省心省力。而且全程没有任何套路 and 隐藏费用，价格透明。必须给一个大大的赞！',
    date: 'July 03, 2026',
    avatar: '',
    serviceType: 'taxi',
    status: 'approved'
  },
  {
    id: 'rev21',
    name: 'David Peterson',
    country: 'United States',
    rating: 5,
    text: 'Awesome experience. Outstanding value, super comfortable Toyota Innova, and excellent timing. Sunrise on Penanjakan was spectacular. Our driver Agus took amazing photos of us. If you want a trouble-free vacation in East Java, book with these guys.',
    date: 'June 08, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev22',
    name: '谢雨婷',
    country: 'China',
    rating: 5,
    text: '宜珍徒步真的很震撼，不虚此行。司机和本地向导人都巨好，向导一路上很幽默，帮我们拿背包，还告诉我们下山走哪里最稳。防毒面具很干净，没有什么异味，推荐预定！',
    date: 'May 22, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  },
  {
    id: 'rev23',
    name: '蔡明',
    country: 'China',
    rating: 5,
    text: '我们是6个人租了一辆Hiace，空间大，行李也完全放得下，空调很足。司机大叔特别开朗，给我们一路上讲了很多爪哇的历史文化，还帮我们买到了便宜的当地水果，非常愉快的体验。',
    date: 'May 14, 2026',
    avatar: '',
    serviceType: 'rental',
    status: 'approved'
  },
  {
    id: 'rev24',
    name: 'Chloe Taylor',
    country: 'Australia',
    rating: 5,
    text: 'The tour was incredible. Ijen blue fire hike was physically demanding but completely worth it with our caring guide. SmartJourney made the whole booking experience simple on WhatsApp. Zero stress. The driver was so gentle on the road.',
    date: 'July 05, 2026',
    avatar: '',
    serviceType: 'tour',
    status: 'approved'
  }
];

export const FAQS = [
  {
    question: 'Are your prices all-inclusive or are there hidden fees?',
    answer: 'All our prices are 100% transparent. Tour bookings include vehicle, professional driver, fuel, toll fees, parking, entry tickets as specified, and safety gear. Car rentals can be selected with or without driver/fuel so you choose exactly what you need.'
  },
  {
    question: 'Do your drivers speak English?',
    answer: 'Yes! SmartJourney prides itself on utilizing tourist-certified, English-speaking professional drivers who understand international standards of customer care, local road safety, and hospitality.'
  },
  {
    question: 'How do I pay and confirm my reservation?',
    answer: 'You can submit your booking request online through our widgets. You will receive an instant digital invoice and a verification message via Email and WhatsApp. Payment can be secured via Credit Card, PayPal, or local bank transfer (QRIS, Bank Mandiri/BCA).'
  },
  {
    question: 'What is your cancellation and rescheduling policy?',
    answer: 'We provide 100% free cancellations and flexible date rescheduling up to 24 hours prior to your scheduled pickup time. No questions asked.'
  },
  {
    question: 'How far in advance should I book my tour or transfer?',
    answer: 'We highly recommend booking at least 48 hours in advance, especially for popular tours like Mount Bromo and Ijen Crater, which require securing Jeep allocations and local national park conservation tickets.'
  }
];

export const AIRPORTS = [
  { code: 'SUB', name: 'Juanda International Airport (Surabaya)' },
  { code: 'DPS', name: 'Ngurah Rai International Airport (Bali)' },
  { code: 'YIA', name: 'Yogyakarta International Airport (Yogyakarta)' },
  { code: 'CGK', name: 'Soekarno-Hatta International Airport (Jakarta)' }
];

export const CITIES = [
  'Surabaya',
  'Malang',
  'Batu',
  'Banyuwangi',
  'Probolinggo (Bromo)',
  'Yogyakarta',
  'Denpasar (Bali)',
  'Jakarta'
];
