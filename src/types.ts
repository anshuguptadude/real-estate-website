export type PropertyType = 
  | 'All'
  | 'Luxury Villa'
  | 'Penthouse'
  | 'Heritage Haveli'
  | 'Apartment'
  | 'Gated Township Plot'
  | 'Commercial / Retail';

export type ListingType = 'Buy' | 'Rent' | 'Commercial' | 'Projects' | 'Plots';

export interface Property {
  id: string;
  title: string;
  tagline: string;
  propertyType: PropertyType;
  listingType: 'Sale' | 'Rent';
  price: number; // in INR (e.g., 28500000 = 2.85 Cr)
  priceDisplay: string; // "₹2.85 Cr"
  pricePerSqFt: number; // e.g., 8500
  location: string;
  locality: string;
  primaryAgraLocality?: string; // Standard public Agra locality (e.g. 'Fatehabad Road, Agra')
  address: string; // Publicly displays primary locality only
  fullAddress?: string; // Exact full street address & landmarks (Admin only)
  buildingName?: string; // Building / Estate Name (Admin only)
  plotNumber?: string; // Plot / Suite Number (Admin only)
  bedrooms: number;
  bathrooms: number;
  balconies: number;
  superAreaSqFt: number;
  carpetAreaSqFt: number;
  furnishing: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished' | 'Designer Fitted';
  facing: 'North-East (Vastu)' | 'North-East (Morning Sun)' | 'East' | 'North' | 'Taj View (South-East)' | 'Park Facing' | 'West' | 'South' | string;
  reraId: string;
  possession: 'Ready to Move' | 'Immediate' | 'Dec 2025' | 'Under Construction';
  featured: boolean;
  isExclusive: boolean;
  verified: boolean;
  isApproved?: boolean;
  verificationStatus?: 'Verified' | 'Not Verified' | 'In Process';
  verifiedBy?: string;
  verificationNumber?: string;
  images: string[];
  coverImage: string;
  description: string;
  highlights: string[];
  amenities: string[];
  landmarks: { name: string; distance: string; travelTime: string }[];
  floorPlans?: { title: string; size: string; image: string }[];
  agent: {
    name: string;
    role: string;
    phone: string;
    email: string;
    avatar: string;
    experience: string;
  };
  yearBuilt: number;
  parkingSpots: number;
  gatedSecurity: boolean;
  powerBackup: boolean;
  coordinates: { lat: number; lng: number };
  status?: 'Active' | 'Pending Approval' | 'Sold' | 'Rented' | 'published' | 'pending_verification' | 'rejected';
  isUserListing?: boolean;
  ownerId?: string;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  userId?: string;
  locationLink?: string;
  privateLocationNote?: string;
  editPendingApproval?: boolean;
  isDeleted?: boolean;
  lastEditedAt?: string;
  lastEditedBy?: string;
  priceGuide?: string;
  postedBy?: { id?: string; name?: string; email?: string; phone?: string; role?: string };
  postedDate?: string; // Formatted date e.g. "09 Oct 2024"
  createdAt?: string; // ISO or formatted timestamp
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'buyer' | 'owner' | 'admin' | 'ceo' | 'agent' | 'staff';
  avatar?: string;
  memberSince: string;
  city?: string;
  preferredLocality?: string;
  primaryInterest?: string;
  preferredBudget?: string;
  address?: string;
  dob?: string;
  profession?: string;
  status?: string;
  permissions?: string[];
  unlockedPropertyIds?: string[];
  disabledAt?: string;
  disabledReason?: string;
}

export type UserDashboardTab = 'listings' | 'profile' | 'saved' | 'inquiries' | 'leads' | 'approvals' | 'ceo-access';

export interface Project {
  id: string;
  name: string;
  developer: string;
  locality: string;
  priceStarting: string;
  units: string;
  status: 'Ready to Move' | 'Under Construction' | 'Newly Launched';
  possessionDate: string;
  reraNumber: string;
  coverImage: string;
  images: string[];
  description: string;
  highlights: string[];
  totalArea: string;
  unitConfigurations: string[];
}

export interface Neighborhood {
  id: string;
  name: string;
  tagline: string;
  avgPriceSqFt: string;
  totalListings: number;
  image: string;
  description: string;
  keyFeatures: string[];
  highlights: string;
}

export type ActiveScreen = 
  | 'home' 
  | 'properties' 
  | 'property-detail' 
  | 'sell-rent' 
  | 'projects' 
  | 'about' 
  | 'contact'
  | 'dashboard';

export interface FilterState {
  searchQuery: string;
  listingType: ListingType;
  locality: string;
  propertyType: PropertyType;
  priceRange: [number, number];
  bhk: string;
  possession: string;
  furnishing: string;
  facing: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'area-desc';
}
