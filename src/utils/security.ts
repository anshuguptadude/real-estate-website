import { Property, UserProfile } from '../types';

export interface LeadSubmission {
  id: string;
  propertyId: string;
  propertyTitle: string;
  buyerName: string;
  phone: string;
  email: string;
  preferredTime: string;
  timestamp: string;
}

export const ADMIN_CREDENTIALS = [
  {
    email: 'shrey123@gmail.com',
    password: 'shrey123@gmail.com',
    name: 'Shrey Gupta',
    phone: '+91 9149079913',
    id: 'RAE-ADMIN-01',
    role: 'admin' as const
  },
  {
    email: 'abhi9557138449@gmail.com',
    password: 'abhi9557138449@gmail.com',
    name: 'Abhishek Singh Jadon',
    phone: '+91 9557138449',
    id: 'RAE-ADMIN-02',
    role: 'admin' as const
  }
];

export const isCEO = (user: UserProfile | null): boolean => {
  if (!user) return false;
  const emailLower = user.email?.toLowerCase().trim();
  const phoneClean = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
  return (
    user.role === 'admin' ||
    emailLower === 'shrey123@gmail.com' ||
    emailLower === 'shrey@royalagraestate.in' ||
    phoneClean.endsWith('9149079913')
  );
};

export const isAdmin = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  const emailLower = user.email?.toLowerCase().trim();
  const phoneClean = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
  return (
    user.role === 'admin' ||
    emailLower === 'shrey123@gmail.com' ||
    emailLower === 'abhi9557138449@gmail.com' ||
    emailLower === 'shrey@royalagraestate.in' ||
    emailLower === 'abhishek@royalagraestate.in' ||
    emailLower.endsWith('@royalagraestate.in') ||
    phoneClean.endsWith('9557138449')
  );
};

export const formatAgraLocality = (localityStr?: string): string => {
  if (!localityStr) return 'Agra';
  let loc = localityStr.trim();
  if (loc.includes('(')) {
    loc = loc.split('(')[0].trim();
  }
  loc = loc.replace(/,?\s*Agra/gi, '').replace(/,?\s*Uttar Pradesh/gi, '').replace(/,?\s*UP/gi, '').trim();
  
  if (loc.includes('Fatehabad')) loc = 'Fatehabad Road';
  else if (loc.includes('Dayalbagh')) loc = 'Dayalbagh';
  else if (loc.includes('Tajganj') || loc.includes('Taj Ganj')) loc = 'Tajganj';
  else if (loc.includes('Shastripuram')) loc = 'Shastripuram';
  else if (loc.includes('Sanjay Place')) loc = 'Sanjay Place';
  else if (loc.includes('Shamshabad')) loc = 'Shamshabad Road';
  else if (loc.includes('Sikandra')) loc = 'Sikandra';
  else if (loc.includes('Kamla Nagar')) loc = 'Kamla Nagar';
  else if (loc.includes('Vibhav Nagar')) loc = 'Vibhav Nagar';
  else if (loc.includes('Civil Lines')) loc = 'Civil Lines';

  return `${loc || 'Agra'}, Agra`;
};

export const getMaskedProperty = (property: Property, user: UserProfile | null): Property => {
  if (isAdmin(user)) {
    return property;
  }

  const primaryLocality = formatAgraLocality(property.primaryAgraLocality || property.locality || property.location);
  const baseLocality = primaryLocality.replace(', Agra', '').trim();

  // For non-admin (public / buyer / guest view), mask all confidential location & contact details
  const masked: Property = {
    ...property,
    location: primaryLocality,
    locality: baseLocality,
    primaryAgraLocality: primaryLocality,
    address: primaryLocality,
    fullAddress: undefined,
    buildingName: undefined,
    plotNumber: undefined,
    landmarks: [], // Masked for non-admins to prevent micro-landmark leakage
    ownerContact: undefined,
    agent: {
      name: 'Royal Agra Estate Concierge',
      role: 'Senior Advisory Desk',
      phone: '+91 91490 79913',
      email: 'contact@royalagraestate.in',
      avatar: property.agent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: 'Verified Luxury Advisory'
    }
  };

  // Clean payload
  delete (masked as any).fullAddress;
  delete (masked as any).buildingName;
  delete (masked as any).plotNumber;
  delete (masked as any).ownerContact;

  return masked;
};

