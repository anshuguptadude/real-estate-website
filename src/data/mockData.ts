import { Property, Project, Neighborhood } from '../types';

export const AGRA_LOCALITIES = [
  'All Localities',
  'Fatehabad Road',
  'Dayalbagh',
  'Tajganj (Taj Corridor)',
  'Shastripuram',
  'Sanjay Place',
  'Sikandra',
  'Shamshabad Road',
  'Kamla Nagar',
  'Vibhav Nagar',
  'Civil Lines'
];

export const PROPERTY_TYPES = [
  'All',
  'Luxury Villa',
  'Penthouse',
  'Heritage Haveli',
  'Apartment',
  'Gated Township Plot',
  'Commercial / Retail'
];

export const PROPERTIES_DATA: Property[] = [
  {
    id: 'prop-harish-nagar-89',
    title: '89, Harish Nagar Independent House',
    tagline: 'Prime Independent Residence on Sikandra-Bodla Road, Agra (112 Sq. Yds)',
    propertyType: 'Independent House',
    listingType: 'Sale',
    price: 11000000,
    priceDisplay: '₹1.10 Cr',
    pricePerSqFt: 10913,
    location: 'Sikandra-Bodla Road, Agra',
    locality: 'Sikandra',
    address: '89, Harish Nagar, Sikandra Bodla Road, Agra',
    bedrooms: 3,
    bathrooms: 2,
    balconies: 1,
    superAreaSqFt: 1008,
    carpetAreaSqFt: 880,
    furnishing: 'Semi-Furnished',
    facing: 'North-East (Vastu)',
    reraId: 'N/A',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Independent Registry Verified',
    verificationNumber: '',
    status: 'published',
    isApproved: true,
    isUserListing: true,
    ownerId: 'shrey123@gmail.com',
    ownerName: 'Shrey Gupta',
    ownerContact: '+91 91490 79913',
    images: [
      '/properties/harish_nagar_4.jpg',
      '/properties/harish_nagar_1.jpg',
      '/properties/harish_nagar_3.jpg',
      '/properties/harish_nagar_2.jpg',
      '/properties/harish_nagar_5.jpg'
    ],
    coverImage: '/properties/harish_nagar_4.jpg',
    description: 'Well-appointed independent residential property located at 89, Harish Nagar on Sikandra-Bodla Road, Agra. Spanning a plot area of 112 sq. yards with spacious rooms, private temple courtyard, modern modular fittings, and excellent road connectivity.',
    highlights: [
      'Plot Area: 112 Sq. Yards (1,008 Sq. Ft)',
      'Prime Location on Sikandra-Bodla Road',
      'Private Temple Courtyard & Open Courtyard Area',
      'Spacious Living Room & Built-in Storage Wardrobes'
    ],
    amenities: [
      '24/7 Water Supply',
      'Private Temple',
      'Storage Wardrobes',
      'Modular Kitchen Cabinets',
      'Courtyard',
      'Covered Parking'
    ],
    landmarks: [
      { name: 'Sikandra-Bodla Main Road', distance: '200 m', travelTime: '1 min' },
      { name: 'Sikandra Monument', distance: '2.5 km', travelTime: '6 mins' },
      { name: 'NH-19 Highway', distance: '3.2 km', travelTime: '8 mins' }
    ],
    agent: {
      name: 'Shrey Gupta',
      role: 'Managing Partner',
      phone: '+91 91490 79913',
      email: 'shrey123@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: 'Agra Prime Property Advisory'
    },
    yearBuilt: 2022,
    parkingSpots: 1,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.2023, lng: 77.9472 }
  }
];

export const NEIGHBORHOODS_DATA: Neighborhood[] = [
  {
    id: 'n-1',
    name: 'Fatehabad Road Corridor',
    tagline: "Agra's Most Prestigious Luxury & Hospitality Boulevard",
    avgPriceSqFt: '₹9,500 - ₹14,000 / sq.ft',
    totalListings: 42,
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    description: 'Home to 5-star international hotels (ITC Mughal, Oberoi Amarvilas, Taj View), high-end fine dining, and gated residential estates. Enjoys fast connectivity to the Taj Mahal and Agra-Lucknow Expressway.',
    keyFeatures: ['Metro Line 1 Corridor', 'Direct Taj Monument Access', 'High Capital Appreciation', 'Premium International Hospitality Zone'],
    highlights: 'Highest rental yield and international appeal in Agra'
  },
  {
    id: 'n-2',
    name: 'Dayalbagh Riverfront',
    tagline: 'Serene Green Enclave with Pristine Air & Educational Legacy',
    avgPriceSqFt: '₹7,000 - ₹10,500 / sq.ft',
    totalListings: 35,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Known for its quiet, pollution-free atmosphere, lush tree-lined streets, and river Yamuna views. Highly preferred by academics, doctors, and established business families.',
    keyFeatures: ['Yamuna Promenade', 'Renowned Educational Institutions', 'Low Density Living', 'Peaceful Community Vibe'],
    highlights: 'Top choice for luxury independent villas & plotted estates'
  },
  {
    id: 'n-3',
    name: 'Shastripuram & Sikandra',
    tagline: 'Modern High-Rise Townships & Highway Connectivity',
    avgPriceSqFt: '₹5,500 - ₹8,000 / sq.ft',
    totalListings: 68,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: 'Agra’s fastest-growing residential hub featuring modern gated high-rises, clubhouse amenities, top CBSE schools, and instantaneous access to the Delhi-Agra Highway (NH-19).',
    keyFeatures: ['Gated High-Rise Communities', 'Direct NH-19 Highway Access', 'Modern Shopping Malls', 'Excellent Social Infrastructure'],
    highlights: 'Best value for 3 & 4 BHK modern gated apartments'
  },
  {
    id: 'n-4',
    name: 'Tajganj Heritage District',
    tagline: 'Historic Charm & Tourism Golden Mile',
    avgPriceSqFt: '₹8,500 - ₹13,000 / sq.ft',
    totalListings: 21,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    description: 'A culturally rich district offering restored heritage havelis, luxury boutique hotels, and artisanal shopping near the Taj Nature Walk.',
    keyFeatures: ['Walk to Taj Mahal', 'Heritage Haveli Properties', 'Boutique Hotel Clearances', 'Artisanal Craft Hub'],
    highlights: 'Unmatched heritage character & tourism prestige'
  },
  {
    id: 'n-5',
    name: 'Sanjay Place Financial Center',
    tagline: 'Central Business District & Commercial Core',
    avgPriceSqFt: '₹12,000 - ₹20,000 / sq.ft',
    totalListings: 29,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    description: 'The epicenter of commercial activity in Agra housing major banks, corporate offices, judicial chambers, and high street luxury retail showrooms.',
    keyFeatures: ['Agra Metro CBD Station', 'Banking & Corporate Towers', 'High Street Retail Hub', 'Central City Location'],
    highlights: 'Highest commercial footfalls and corporate leases'
  },
  {
    id: 'n-6',
    name: 'Shamshabad Expressway Corridor',
    tagline: 'Upcoming Eco-Luxury & Farmhouse Boulevard',
    avgPriceSqFt: '₹4,500 - ₹7,000 / sq.ft',
    totalListings: 45,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    description: 'Agra’s major expansion vector connecting to the Inner Ring Road and Lucknow Expressway with sprawling farmhouse estates and gated eco-villas.',
    keyFeatures: ['Expansive Green Acreages', 'Direct Inner Ring Road Access', 'Rapid Future Appreciation', 'Gated Villa Townships'],
    highlights: 'Prime for long-term land investment and farmhouses'
  }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-1',
    name: 'The Royal Palms Taj Enclave',
    developer: 'Royal Agra Heritage Developers',
    locality: 'Fatehabad Road Prime Strip, Agra',
    priceStarting: '₹2.45 Cr onwards',
    units: '48 Limited Edition Sky Villas & Penthouses',
    status: 'Under Construction',
    possessionDate: 'December 2025',
    reraNumber: 'UPRERAAGT2023/9812',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'A crown jewel of Agra’s luxury skyline offering 48 ultra-spacious sky mansions with private cantilevered plunge pools, dedicated butler service, double-height living spaces, and sweeping monument skyline vistas.',
    highlights: [
      'Rooftop Sky Lounge with 360-degree Taj Mahal views',
      'Private temperature-regulated infinity plunge pool in each residence',
      'Concierge by world-renowned luxury hospitality management',
      'Mughal courtyard inspired water architecture & tropical landscaping'
    ],
    totalArea: '4.5 Acres Gated Estate',
    unitConfigurations: ['3 BHK Sky Villa (2,800 sq.ft)', '4 BHK Sky Mansion (3,900 sq.ft)', '5 BHK Imperial Penthouse (5,600 sq.ft)']
  },
  {
    id: 'proj-2',
    name: 'Yamuna Greens Riverfront Residences',
    developer: 'Vedic Infra Agra',
    locality: 'Dayalbagh Riverside, Agra',
    priceStarting: '₹1.65 Cr onwards',
    units: '120 Luxury Gated Apartments',
    status: 'Ready to Move',
    possessionDate: 'Immediate Possession',
    reraNumber: 'UPRERAAGT2022/4412',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Eco-conscious riverside community situated along the tranquil banks of Dayalbagh. Features 70% open landscaped greens, solar water heating, organic farmer markets, and Olympic-grade sports academy.',
    highlights: [
      'Zero vehicle movement on ground level (100% basement parking)',
      '30,000 sq.ft mega club with all-weather indoor pool',
      'Riverside wooden boardwalk & sunrise yoga gazebos',
      'Full Occupancy Certificate (OC) received'
    ],
    totalArea: '8.2 Acres Riverfront Land',
    unitConfigurations: ['3 BHK Classic (1,950 sq.ft)', '3 BHK + Servant (2,400 sq.ft)', '4 BHK Duplex (3,400 sq.ft)']
  },
  {
    id: 'proj-3',
    name: 'Imperial Heights Shastripuram',
    developer: 'Imperial Skyline Group',
    locality: 'Shastripuram Sector 4, Agra',
    priceStarting: '₹1.15 Cr onwards',
    units: '210 High-Rise Luxury Suites',
    status: 'Under Construction',
    possessionDate: 'June 2026',
    reraNumber: 'UPRERAAGT2024/7701',
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Modern 22-storey architectural towers redefining urban living in Shastripuram. Features smart home automation, high-speed elevators, sky jogging track on the 23rd floor terrace, and EV charging bays.',
    highlights: [
      'Sky jogging track & viewing observatory at 230 ft elevation',
      '3-tier 24/7 security with RFID vehicle access',
      '2 minutes to NH-19 Delhi-Agra Expressway',
      'Flexible 20:80 payment plans available with SBI & HDFC bank tie-ups'
    ],
    totalArea: '5.0 Acres Township',
    unitConfigurations: ['2 BHK + Study (1,450 sq.ft)', '3 BHK Premium (1,850 sq.ft)', '4 BHK Grand Suite (2,650 sq.ft)']
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 't-1',
    name: 'Dr. Alok Verma',
    title: 'Senior Cardiac Surgeon & Villa Owner',
    location: 'Fatehabad Road, Agra',
    rating: 5,
    comment: 'Finding a genuine clear-title luxury estate in Agra with heritage clearances can be daunting. Royal Agra Estate orchestrated the entire purchase of our 5 BHK palatial villa with impeccable confidentiality and legal perfection.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-2',
    name: 'Rajesh & Meenakshi Bansal',
    title: 'Industrialist & Heritage Property Investor',
    location: 'Dayalbagh, Agra',
    rating: 5,
    comment: 'The team at Royal Agra Estate understands the nuances of Agra’s prime micro-markets like no other. Their private architectural tour and market valuation advisory helped us acquire our riverfront duplex with complete confidence.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-3',
    name: 'Sunil Chawla (NRI, London)',
    title: 'Tech Entrepreneur & Investor',
    location: 'Mayfair, London / Agra',
    rating: 5,
    comment: 'Managing real estate in Agra from London was seamless thanks to their bespoke NRI Premium Concierge. They provided virtual 3D walk-throughs, complete registry handling, and zero-hassle tenant management.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }
];

export const STATS_DATA = [
  { value: '₹1,200+ Cr', label: 'Luxury Assets Transacted' },
  { value: '450+', label: 'Verified Exclusive Estates' },
  { value: '25+ Years', label: 'Legacy in Agra Real Estate' },
  { value: '100%', label: 'Clear Title Trust & Verification' }
];

export const AGRA_BUYING_GUIDE = [
  {
    title: '1. Title Deed Verification & Clean Sub-Registry',
    content: 'Every property listed on Royal Agra Estate is cross-verified against Agra Sub-Registrar records and mutation deeds to ensure zero encumbrances, bank liens, or legal disputes.'
  },
  {
    title: '2. Taj Trapezium Zone (TTZ) & Archaeological Clearances',
    content: 'Properties within the 10,400 sq. km TTZ eco-sensitive perimeter require specialized environmental clearances and strict adherence to height norms. Our advisory team verifies all NOCs from the Archeological Survey of India (ASI) and Pollution Control Board.'
  },
  {
    title: '3. Agra Master Plan 2031 & Metro Corridor Growth',
    content: 'With the operational Agra Metro Line 1 & Line 2 expanding across Taj East Gate, Fatehabad Road, Sanjay Place, and Sikandra, properties situated within 1 km of the metro stations are experiencing 14-18% annual capital appreciation.'
  },
  {
    title: '4. Stamp Duty & Registry Formalities in Uttar Pradesh',
    content: 'In Uttar Pradesh, stamp duty is 7% for male buyers, 6% for female buyers (on properties up to ₹10 Lacs, 7% thereafter with a 1% rebate up to limits), plus a 1% registration fee. Our in-house legal counsel manages all documentation seamlessly.'
  }
];
