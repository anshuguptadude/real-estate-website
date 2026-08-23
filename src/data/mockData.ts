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
    id: 'prop-1',
    title: 'The Taj Sovereign Villa & Estate',
    tagline: 'Palatial 5 BHK Mansion with Direct View of the Taj Mahal Skyline',
    propertyType: 'Luxury Villa',
    listingType: 'Sale',
    price: 68500000, // ₹6.85 Cr
    priceDisplay: '₹6.85 Cr',
    pricePerSqFt: 11416,
    location: 'Fatehabad Road Corridor, Agra',
    locality: 'Fatehabad Road',
    address: 'Plot 18, Royal Enclave, Near Hotel ITC Mughal, Fatehabad Road, Agra',
    bedrooms: 5,
    bathrooms: 6,
    balconies: 4,
    superAreaSqFt: 6000,
    carpetAreaSqFt: 4850,
    furnishing: 'Designer Fitted',
    facing: 'Taj View (South-East)',
    reraId: 'UPRERAAGT2023/9012',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Agra Development Authority (ADA)',
    verificationNumber: 'ADA/2023/9012',
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'An irreplaceable architectural masterpiece inspired by classical Mughal geometry and modern Italian luxury. Situated within the elite gated enclave of Fatehabad Road, this 5-bedroom palatial residence offers private heated infinity pool, Italian marble flooring, imported teak woodwork, 20-ft double height ceilings, and panoramic rooftop views toward the monument corridor.',
    highlights: [
      'Private 40ft temperature-controlled pool & jacuzzi',
      'Direct unobstructed views of the Taj Mahal monument skyline',
      'Imported Statuario Italian marble & handcrafted brass accents',
      '4-car private automated subterranean garage',
      'Full home automation by Crestron with biometric access',
      'Clear freehold title with complete heritage zone clearances'
    ],
    amenities: [
      'Private Swimming Pool',
      'Private Lift / Elevator',
      'Landscaped Mughal Garden',
      'Home Cinema (12 Recliners)',
      '100% 3-Phase Power Backup',
      '24/7 Armed Security & CCTV',
      'Private Gymnasium & Spa',
      'Servant Quarters (2 Rooms)',
      'Solar Powered Grid (15kW)',
      'Vastu Compliant Layout'
    ],
    landmarks: [
      { name: 'Taj Mahal East Gate', distance: '2.8 km', travelTime: '7 mins' },
      { name: 'Agra Metro Station (Fatehabad Rd)', distance: '600 m', travelTime: '2 mins' },
      { name: 'ITC Mughal & Oberoi Amarvilas', distance: '1.2 km', travelTime: '4 mins' },
      { name: 'Agra-Lucknow Expressway Toll', distance: '6.5 km', travelTime: '12 mins' }
    ],
    agent: {
      name: 'Shrey Gupta',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 91490 79913',
      email: 'shrey@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: 'Luxury Residential & HNI Advisory'
    },
    yearBuilt: 2023,
    parkingSpots: 4,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.1612, lng: 78.0421 }
  },
  {
    id: 'prop-2',
    title: 'Imperial Mughal Riverfront Penthouse',
    tagline: 'Duplex Penthouse Overlooking the Sacred Yamuna River',
    propertyType: 'Penthouse',
    listingType: 'Sale',
    price: 34500000, // ₹3.45 Cr
    priceDisplay: '₹3.45 Cr',
    pricePerSqFt: 8214,
    location: 'Dayalbagh Riverfront Promenade, Agra',
    locality: 'Dayalbagh',
    address: 'Sky Suite 1401, The Yamuna Crown, Dayalbagh, Agra',
    bedrooms: 4,
    bathrooms: 5,
    balconies: 3,
    superAreaSqFt: 4200,
    carpetAreaSqFt: 3400,
    furnishing: 'Fully Furnished',
    facing: 'North-East (Vastu)',
    reraId: 'UPRERAAGT2024/7741',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'UP RERA & Agra Development Authority (ADA)',
    verificationNumber: 'UPRERAAGT2024/7741',
    coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'A lavish sky penthouse spanning two upper levels with an expansive wrap-around wooden deck and private rooftop plunge pool. Offering serene riverfront breezes in green Dayalbagh, bespoke European modular kitchen, soundproof acoustic glazing, and private express elevator access.',
    highlights: [
      'Expansive wrap-around river-facing sundeck (900 sq.ft)',
      'Private glass-enclosed rooftop plunge pool',
      'Dual master suites with walk-in walk-through dressers',
      'Exclusive high-speed private biometric elevator',
      'Centralized VRV air-conditioning with Daikin systems'
    ],
    amenities: [
      'Private Plunge Pool',
      'Clubhouse with Squash Court',
      'Infinity Lap Pool',
      'Concierge Desk',
      '2 Covered EV Parking Bays',
      '24/7 Multi-tier Security',
      'Yoga & Meditation Deck',
      'Banquet Hall & Guest Suites'
    ],
    landmarks: [
      { name: 'Dayalbagh Educational Institute', distance: '1.0 km', travelTime: '3 mins' },
      { name: 'Sanjay Place Financial Center', distance: '4.5 km', travelTime: '10 mins' },
      { name: 'NH-19 Expressway Highway', distance: '3.8 km', travelTime: '8 mins' },
      { name: 'Agra Cantt Railway Station', distance: '9.2 km', travelTime: '18 mins' }
    ],
    agent: {
      name: 'Abhishek Singh Jadon',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 95571 38449',
      email: 'abhishek@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experience: 'Commercial Investments & Legal Diligence'
    },
    yearBuilt: 2024,
    parkingSpots: 3,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.2285, lng: 78.0152 }
  },
  {
    id: 'prop-3',
    title: 'Noor-E-Taj Heritage Haveli Estate',
    tagline: 'Restored 19th Century Courtyard Haveli with Modern Luxury Amenities',
    propertyType: 'Heritage Haveli',
    listingType: 'Sale',
    price: 89000000, // ₹8.90 Cr
    priceDisplay: '₹8.90 Cr',
    pricePerSqFt: 12714,
    location: 'Taj East Gate Heritage Zone, Agra',
    locality: 'Tajganj (Taj Corridor)',
    address: 'Haveli 4, Heritage Lane, Taj East Gate Road, Tajganj, Agra',
    bedrooms: 6,
    bathrooms: 7,
    balconies: 6,
    superAreaSqFt: 7000,
    carpetAreaSqFt: 5900,
    furnishing: 'Designer Fitted',
    facing: 'North-East (Vastu)',
    reraId: 'UPRERAAGT2022/6120',
    possession: 'Ready to Move',
    featured: true,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Tehsil Sub-Registrar Agra (Heritage Freehold)',
    verificationNumber: 'AGR/HER/1892/04',
    coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'An authentic heritage landmark meticulously restored by celebrated conservation architects. Features hand-carved red sandstone jharokhas, central fountain courtyard, restored fresco ceilings, brass hardware, and integrated smart luxury infrastructure.',
    highlights: [
      'Restored central courtyard with continuous stone water fountain',
      'Authentic red sandstone archways & carved jharokha balconies',
      'Complete legal heritage ownership with freehold title registry',
      'Commercial hospitality & boutique stay permit available',
      'Private library room, cigar lounge & temperature-controlled wine cellar'
    ],
    amenities: [
      'Courtyard Water Fountain',
      'Private Turkish Hamam & Steam',
      'Heritage Jharokhas',
      'Antique Teak Finishings',
      'Modern High-Efficiency HVAC',
      'Gated Private Compound',
      'Staff Accommodation (3 Suites)',
      'Surveillance Security System'
    ],
    landmarks: [
      { name: 'Taj Mahal Monument', distance: '1.4 km', travelTime: '4 mins' },
      { name: 'Agra Fort', distance: '3.6 km', travelTime: '8 mins' },
      { name: 'Taj Nature Walk Sanctuary', distance: '1.1 km', travelTime: '3 mins' },
      { name: 'Agra Airport (Kheria)', distance: '10.5 km', travelTime: '22 mins' }
    ],
    agent: {
      name: 'Shrey Gupta',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 91490 79913',
      email: 'shrey@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: 'Luxury Residential & HNI Advisory'
    },
    yearBuilt: 2022,
    parkingSpots: 6,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.1705, lng: 78.0498 }
  },
  {
    id: 'prop-4',
    title: 'The Royal Crest Grand Residence (4 BHK)',
    tagline: 'Ultra-Modern High-Rise Luxury in Gated Shastripuram Community',
    propertyType: 'Apartment',
    listingType: 'Sale',
    price: 18500000, // ₹1.85 Cr
    priceDisplay: '₹1.85 Cr',
    pricePerSqFt: 6607,
    location: 'Shastripuram Prime Township, Agra',
    locality: 'Shastripuram',
    address: 'Tower A, Floor 11, The Royal Crest, Shastripuram Sector 4, Agra',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    superAreaSqFt: 2800,
    carpetAreaSqFt: 2250,
    furnishing: 'Semi-Furnished',
    facing: 'North-East (Vastu)',
    reraId: 'UPRERAAGT2024/3392',
    possession: 'Ready to Move',
    featured: false,
    isExclusive: false,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Agra Development Authority (ADA)',
    verificationNumber: 'ADA/SHP/2024/3392',
    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600566752229-250ed79470f8?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'A spacious 4 BHK luxury apartment in Agra’s premier high-rise township with Olympic-length swimming pool, tennis court, grand 30,000 sq.ft clubhouse, and seamless connectivity to the Delhi-Agra Highway.',
    highlights: [
      'Corner unit with 3 side open panoramic city views',
      'Engineered Italian modular kitchen with chimney & built-in oven',
      'Vastu compliant entrance with auspicious north-east orientation',
      'Underground basement parking with dedicated EV charging point'
    ],
    amenities: [
      'Clubhouse & Gym',
      'Swimming Pool',
      'Tennis & Badminton Courts',
      'Kids Play Park',
      '24/7 Security & Video Intercom',
      '100% DG Power Backup',
      'Jogging Track & Zen Garden'
    ],
    landmarks: [
      { name: 'Delhi-Agra Highway (NH-19)', distance: '1.5 km', travelTime: '3 mins' },
      { name: 'Sikandra Monument', distance: '3.2 km', travelTime: '6 mins' },
      { name: 'DPS Agra School', distance: '2.0 km', travelTime: '5 mins' },
      { name: 'Sanjay Place Commercial Hub', distance: '6.0 km', travelTime: '12 mins' }
    ],
    agent: {
      name: 'Shrey Gupta',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 91490 79913',
      email: 'shrey@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: 'Luxury Residential & HNI Advisory'
    },
    yearBuilt: 2024,
    parkingSpots: 2,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.2031, lng: 77.9542 }
  },
  {
    id: 'prop-5',
    title: 'Ananda Eco-Luxury Villa Estate',
    tagline: 'Sustainable 4 BHK Private Villa with Organic Orchard & Solar Integration',
    propertyType: 'Luxury Villa',
    listingType: 'Sale',
    price: 29500000, // ₹2.95 Cr
    priceDisplay: '₹2.95 Cr',
    pricePerSqFt: 7375,
    location: 'Shamshabad Expressway Green Belt, Agra',
    locality: 'Shamshabad Road',
    address: 'Villa 12, Ananda Green Meadows, Shamshabad Road, Agra',
    bedrooms: 4,
    bathrooms: 4,
    balconies: 3,
    superAreaSqFt: 4000,
    carpetAreaSqFt: 3200,
    furnishing: 'Semi-Furnished',
    facing: 'East',
    reraId: 'UPRERAAGT2023/8854',
    possession: 'Ready to Move',
    featured: false,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Bank Approved Clear Title (SBI/HDFC)',
    verificationNumber: 'BNK/APPR/2023/8854',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Surrounded by tranquil landscaped greens, Ananda Eco-Luxury Villa blends natural stone architecture, passive solar cooling, private plunge pool, and expansive terrace gardens for peaceful luxury living away from urban noise.',
    highlights: [
      'Private 800 sq.ft lawn with fruit orchard trees',
      '10kW On-grid solar system generating zero-cost electricity',
      'Rainwater harvesting and organic composting unit',
      'Gated community with 24/7 security and concierge'
    ],
    amenities: [
      'Private Lawn & Plunge Pool',
      'Organic Herb Garden',
      'Clubhouse with Infinity Pool',
      'Outdoor Barbecue Area',
      'Solar Power Backup',
      'EV Charging Station'
    ],
    landmarks: [
      { name: 'Agra-Lucknow Expressway Entry', distance: '3.0 km', travelTime: '5 mins' },
      { name: 'Fatehabad Road Commercial Strip', distance: '5.5 km', travelTime: '10 mins' },
      { name: 'Agra Ring Road Bypass', distance: '2.2 km', travelTime: '4 mins' }
    ],
    agent: {
      name: 'Abhishek Singh Jadon',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 95571 38449',
      email: 'abhishek@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experience: 'Commercial Investments & Legal Diligence'
    },
    yearBuilt: 2023,
    parkingSpots: 3,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.1354, lng: 78.0678 }
  },
  {
    id: 'prop-6',
    title: 'Fatehabad Royale Corporate Plaza (Grade A Floor)',
    tagline: 'Prime Commercial Office Floor on Agra’s Most Prestigious Commercial Boulevard',
    propertyType: 'Commercial / Retail',
    listingType: 'Sale',
    price: 45000000, // ₹4.50 Cr
    priceDisplay: '₹4.50 Cr',
    pricePerSqFt: 9000,
    location: 'Fatehabad Road Main Commercial Belt, Agra',
    locality: 'Fatehabad Road',
    address: '5th Floor, Royale Corporate Plaza, Fatehabad Road, Agra',
    bedrooms: 0,
    bathrooms: 4,
    balconies: 2,
    superAreaSqFt: 5000,
    carpetAreaSqFt: 4100,
    furnishing: 'Designer Fitted',
    facing: 'North',
    reraId: 'UPRERAAGT2024/1105',
    possession: 'Ready to Move',
    featured: false,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'UP RERA & Nagar Nigam Agra',
    verificationNumber: 'UPRERAAGT2024/1105',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Grade A corporate commercial floor ideal for bank regional offices, multinational corporate headquarters, luxury diamond/jewellery brand showrooms, or premium tech centers with massive frontage on Fatehabad Road.',
    highlights: [
      'High rental yield potential of 8.5% with top-tier corporate tenants',
      'Direct frontage on 6-lane Fatehabad Road metro corridor',
      'Centralized chillers HVAC with dual high-speed Mitsubishi elevators',
      'Dedicated 8-car reserved basement parking slots'
    ],
    amenities: [
      'Triple Height Reception Lobby',
      'High-Speed Elevators',
      '100% Power Redundancy',
      'Advanced Fire Sprinkler Systems',
      'Visitor Valet Parking',
      'Cafeteria & Terrace Lounge'
    ],
    landmarks: [
      { name: 'Upcoming Fatehabad Rd Metro Station', distance: '150 m', travelTime: '1 min' },
      { name: 'Hotel Taj View & Courtyard Marriott', distance: '400 m', travelTime: '2 mins' },
      { name: 'Sanjay Place Financial District', distance: '5.2 km', travelTime: '11 mins' }
    ],
    agent: {
      name: 'Abhishek Singh Jadon',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 95571 38449',
      email: 'abhishek@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experience: 'Commercial Investments & Legal Diligence'
    },
    yearBuilt: 2024,
    parkingSpots: 8,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.1589, lng: 78.0385 }
  },
  {
    id: 'prop-7',
    title: 'The Heritage Enclave Gated Plot (500 Sq. Yds)',
    tagline: 'Exclusive Freehold Residential Plot in VVIP Dayalbagh Enclave',
    propertyType: 'Gated Township Plot',
    listingType: 'Sale',
    price: 22500000, // ₹2.25 Cr
    priceDisplay: '₹2.25 Cr',
    pricePerSqFt: 5000,
    location: 'Dayalbagh Heritage Colony, Agra',
    locality: 'Dayalbagh',
    address: 'Plot 44, Heritage Enclave, Near Riverfront, Dayalbagh, Agra',
    bedrooms: 0,
    bathrooms: 0,
    balconies: 0,
    superAreaSqFt: 4500,
    carpetAreaSqFt: 4500,
    furnishing: 'Unfurnished',
    facing: 'North-East (Vastu)',
    reraId: 'UPRERAAGT2023/4521',
    possession: 'Immediate',
    featured: false,
    isExclusive: false,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Agra Development Authority (ADA)',
    verificationNumber: 'ADA/DYB/2023/4521',
    coverImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Rare 500 sq. yard clear-title freehold plot with 45-ft wide sector road frontage inside an ultra-exclusive gated colony of Agra’s top industrialists and doctors in green Dayalbagh.',
    highlights: [
      '100% Freehold Agra Development Authority (ADA) approved registry',
      'Auspicious North-East corner orientation',
      'Underground electricity, water lines, and optical fiber ready',
      'Gated barrier with 24/7 security guards and tree-lined avenues'
    ],
    amenities: [
      'Gated Entry Guardhouse',
      'Underground Cabling',
      'Parks & Walking Trails',
      'Street Lighting & CCTV'
    ],
    landmarks: [
      { name: 'Radha Soami Temple Memorial', distance: '1.2 km', travelTime: '3 mins' },
      { name: 'Sanjay Place Hub', distance: '4.0 km', travelTime: '8 mins' },
      { name: 'Civil Lines Officers Colony', distance: '5.0 km', travelTime: '10 mins' }
    ],
    agent: {
      name: 'Abhishek Singh Jadon',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 95571 38449',
      email: 'abhishek@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      experience: 'Commercial Investments & Legal Diligence'
    },
    yearBuilt: 2024,
    parkingSpots: 0,
    gatedSecurity: true,
    powerBackup: false,
    coordinates: { lat: 27.2341, lng: 78.0089 }
  },
  {
    id: 'prop-8',
    title: 'The Kohinoor Crown Penthouse (3 BHK Luxury)',
    tagline: 'Exclusive Luxury Sky Villa in Sanjay Place Financial Boulevard',
    propertyType: 'Penthouse',
    listingType: 'Rent',
    price: 125000, // ₹1.25 Lac / Month
    priceDisplay: '₹1.25 Lac/mo',
    pricePerSqFt: 48,
    location: 'Sanjay Place High Street, Agra',
    locality: 'Sanjay Place',
    address: 'Sky Suite 10, Kohinoor Heights, Sanjay Place, Agra',
    bedrooms: 3,
    bathrooms: 4,
    balconies: 3,
    superAreaSqFt: 2600,
    carpetAreaSqFt: 2100,
    furnishing: 'Fully Furnished',
    facing: 'North',
    reraId: 'UPRERAAGT2024/5019',
    possession: 'Immediate',
    featured: false,
    isExclusive: true,
    verified: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Nagar Nigam & Commercial Registry',
    verificationNumber: 'SJP/COMM/2024/5019',
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Fully furnished designer sky villa tailored for senior corporate executives, doctors, and foreign diplomats. Includes imported Italian sofas, OLED home theater, smart climate control, and daily housekeeping service option.',
    highlights: [
      'Turnkey luxury: Italian furnishings, cutlery, and smart appliances',
      'Direct access to Sanjay Place restaurants, banks, and metro',
      'Double height private balcony with city skyline views',
      'Dedicated covered reserved car parking'
    ],
    amenities: [
      'Club Lounge',
      'Fitness Gym',
      'Concierge & Housekeeping',
      '100% Power Backup',
      'Biometric Access'
    ],
    landmarks: [
      { name: 'Sanjay Place Metro Station', distance: '200 m', travelTime: '2 mins' },
      { name: 'Agra Cantt Railway Station', distance: '5.5 km', travelTime: '12 mins' },
      { name: 'Civil Lines Club', distance: '2.5 km', travelTime: '5 mins' }
    ],
    agent: {
      name: 'Shrey Gupta',
      role: 'Managing Partner & Co-Founder',
      phone: '+91 91490 79913',
      email: 'shrey@royalagraestate.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: 'Luxury Residential & HNI Advisory'
    },
    yearBuilt: 2023,
    parkingSpots: 2,
    gatedSecurity: true,
    powerBackup: true,
    coordinates: { lat: 27.2012, lng: 78.0065 }
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
