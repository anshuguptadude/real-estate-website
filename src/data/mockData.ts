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
    id: 'prop-fatehabad-sovereign-01',
    title: 'The Taj Sovereign Imperial Villa',
    tagline: 'Palatial 5 BHK independent luxury villa along prime Fatehabad Road with private pool and manicured lawns.',
    propertyType: 'Luxury Villa',
    listingType: 'Sale',
    price: 48500000,
    priceDisplay: '₹4.85 Cr',
    pricePerSqFt: 10104,
    location: 'Fatehabad Road Corridor, Agra',
    locality: 'Fatehabad Road',
    address: 'Villa 18, Sovereign Imperial Enclave, Fatehabad Road, Agra',
    bedrooms: 5,
    bathrooms: 5,
    balconies: 3,
    superAreaSqFt: 4800,
    carpetAreaSqFt: 3950,
    furnishing: 'Fully Furnished',
    facing: 'Taj View (South-East)',
    reraId: 'UPRERA-AGR-7821',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Agra Development Authority (ADA)',
    status: 'Active',
    isApproved: true,
    isUserListing: false,
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    description: 'An architectural masterpiece located on Fatehabad Road. Features double-height living ceilings, private temperature-controlled pool, Italian marble flooring throughout, imported modular chef kitchen, and private elevator.',
    highlights: ['Taj Mahal View Corridor', 'Private Heated Pool', 'ADA Sanctioned Freehold Title', 'Smart Home Automation'],
    amenities: ['Swimming Pool', 'Private Lift / Elevator', 'Landscaped Garden', '100% Power Backup', '24/7 Gated Security'],
    landmarks: [
      { name: 'Taj Mahal (East Gate)', distance: '3.2 km', travelTime: '7 mins' },
      { name: 'ITC Mughal & Oberoi Amarvilas', distance: '1.5 km', travelTime: '3 mins' },
      { name: 'Agra Metro Station', distance: '800 m', travelTime: '2 mins' }
    ],
    agent: {
      name: 'Royal Agra Concierge Desk',
      role: 'Senior Luxury Advisory Partner',
      phone: '+91 91490 79913',
      email: 'concierge@royalagraestate.in',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      experience: '10+ Years Luxury Portfolios'
    },
    yearBuilt: 2024,
    parkingSpots: 4,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.1612, lng: 78.0411 }
  },
  {
    id: 'prop-dayalbagh-heritage-02',
    title: 'Mughal Heritage Garden Residence',
    tagline: '4 BHK luxury riverfront villa in peaceful Dayalbagh with private courtyard and solar power.',
    propertyType: 'Luxury Villa',
    listingType: 'Sale',
    price: 36500000,
    priceDisplay: '₹3.65 Cr',
    pricePerSqFt: 9605,
    location: 'Dayalbagh Riverfront, Agra',
    locality: 'Dayalbagh',
    address: 'Plot 42, Heritage Royal Boulevard, Dayalbagh, Agra',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    superAreaSqFt: 3800,
    carpetAreaSqFt: 3100,
    furnishing: 'Designer Fitted',
    facing: 'North-East (Morning Sun)',
    reraId: 'UPRERA-AGR-4419',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Agra Development Authority (ADA)',
    status: 'Active',
    isApproved: true,
    isUserListing: false,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Immerse in the serene tranquility of Dayalbagh. This palatial residence offers optimal natural sunlight and ventilation architecture, sprawling private manicured lawn, rooftop stargazing terrace, and state-of-the-art security systems.',
    highlights: ['Optimal Natural Sunlight', 'Yamuna River Breeze', 'ADA Approved Clear Deed', 'EV Charging Station'],
    amenities: ['Private Garden / Terrace', '24/7 Security & CCTV', '100% Power Backup', 'Solar Plant', 'EV Charging Station'],
    landmarks: [
      { name: 'Dayalbagh Temple', distance: '600 m', travelTime: '2 mins' },
      { name: 'Sanjay Place Financial Hub', distance: '4.5 km', travelTime: '10 mins' },
      { name: 'NH-19 Expressway Highway', distance: '3.0 km', travelTime: '6 mins' }
    ],
    agent: {
      name: 'Royal Agra Concierge Desk',
      role: 'Senior Luxury Advisory Partner',
      phone: '+91 91490 79913',
      email: 'concierge@royalagraestate.in',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      experience: '10+ Years Luxury Portfolios'
    },
    yearBuilt: 2024,
    parkingSpots: 3,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.2289, lng: 78.0123 }
  },
  {
    id: 'prop-tajganj-kohinoor-03',
    title: 'The Kohinoor Penthouse Sky Suite',
    tagline: 'Panoramic 5 BHK duplex penthouse overlooking the Taj heritage corridor.',
    propertyType: 'Penthouse',
    listingType: 'Sale',
    price: 52000000,
    priceDisplay: '₹5.20 Cr',
    pricePerSqFt: 10000,
    location: 'Tajganj (Taj Corridor), Agra',
    locality: 'Tajganj (Taj Corridor)',
    address: 'Sky Suite 14A, Kohinoor Heights, Taj Corridor, Agra',
    bedrooms: 5,
    bathrooms: 5,
    balconies: 4,
    superAreaSqFt: 5200,
    carpetAreaSqFt: 4200,
    furnishing: 'Fully Furnished',
    facing: 'Taj View (South-East)',
    reraId: 'UPRERA-AGR-9902',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'UP RERA (Real Estate Regulatory Authority)',
    status: 'Active',
    isApproved: true,
    isUserListing: false,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'An elite sky mansion on the topmost floors of Kohinoor Heights. Unobstructed panoramic views of the Taj Mahal silhouette, private plunge jacuzzi, private elevator access directly into living lounge, and bespoke designer furnishings.',
    highlights: ['Uninterrupted Taj Mahal View', 'Private Jacuzzi & Sun Deck', 'Direct Private Elevator Access', 'Concierge Butler Service'],
    amenities: ['Private Lift / Elevator', 'Swimming Pool', 'Smart Home Automation', 'Home Theater', '24/7 Security & CCTV'],
    landmarks: [
      { name: 'Taj Mahal Monument', distance: '1.2 km', travelTime: '4 mins' },
      { name: 'Agra Cantt Railway Station', distance: '5.8 km', travelTime: '12 mins' },
      { name: 'Agra Civil Enclave Airport', distance: '10.5 km', travelTime: '20 mins' }
    ],
    agent: {
      name: 'Royal Agra Concierge Desk',
      role: 'Senior Luxury Advisory Partner',
      phone: '+91 91490 79913',
      email: 'concierge@royalagraestate.in',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      experience: '10+ Years Luxury Portfolios'
    },
    yearBuilt: 2025,
    parkingSpots: 4,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.1650, lng: 78.0450 }
  },
  {
    id: 'prop-sikandra-greens-04',
    title: 'Sikandra Greens Palatial Haven',
    tagline: 'Modern 4 BHK independent estate in gated enclave near NH-19 highway corridor.',
    propertyType: 'Luxury Villa',
    listingType: 'Sale',
    price: 29500000,
    priceDisplay: '₹2.95 Cr',
    pricePerSqFt: 8428,
    location: 'Sikandra, Agra',
    locality: 'Sikandra',
    address: 'Estate 7B, Green Meadows, Sikandra, Agra',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 2,
    superAreaSqFt: 3500,
    carpetAreaSqFt: 2800,
    furnishing: 'Semi-Furnished',
    facing: 'Park Facing',
    reraId: 'UPRERA-AGR-3321',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Agra Development Authority (ADA)',
    status: 'Active',
    isApproved: true,
    isUserListing: false,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ],
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    description: 'Spacious 4 BHK luxury villa situated within an exclusive gated residential community. Surrounded by landscaped greenery, offering quick transit to Delhi-NCR via NH-19 highway, and equipped with modern club amenities.',
    highlights: ['Gated Villa Township', 'Direct Delhi-Agra NH-19 Connectivity', 'ADA Approved', 'Clubhouse & Tennis Court'],
    amenities: ['Clubhouse & Gymnasium', '24/7 Security & CCTV', '100% Power Backup', 'Landscaped Garden', 'EV Charging Station'],
    landmarks: [
      { name: 'Sikandra Monument & Park', distance: '1.0 km', travelTime: '3 mins' },
      { name: 'Delhi-Agra NH-19 Highway', distance: '500 m', travelTime: '1 min' },
      { name: 'Sanjay Place Commercial Hub', distance: '7.0 km', travelTime: '15 mins' }
    ],
    agent: {
      name: 'Royal Agra Concierge Desk',
      role: 'Senior Luxury Advisory Partner',
      phone: '+91 91490 79913',
      email: 'concierge@royalagraestate.in',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
      experience: '10+ Years Luxury Portfolios'
    },
    yearBuilt: 2024,
    parkingSpots: 3,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.2150, lng: 77.9500 }
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
