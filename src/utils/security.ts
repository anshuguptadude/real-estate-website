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

export const isAdmin = (user: UserProfile | null): boolean => {
  if (!user) return false;
  const emailLower = user.email?.toLowerCase().trim();
  return (
    user.role === 'admin' ||
    emailLower === 'shrey123@gmail.com' ||
    emailLower === 'abhi9557138449@gmail.com' ||
    emailLower === 'shrey@royalagraestate.in' ||
    emailLower === 'abhishek@royalagraestate.in'
  );
};

export const getMaskedProperty = (property: Property, user: UserProfile | null): Property => {
  if (isAdmin(user)) {
    return property;
  }
  // For non-admin (buyer / guest view), mask sensitive details
  return {
    ...property,
    address: `${property.locality}, Agra`,
    ownerContact: undefined,
    owner_phone: undefined,
    owner_email: undefined,
    agent: {
      name: 'Royal Agra Estate Concierge',
      role: 'Senior Advisory Desk',
      phone: '+91 91490 79913',
      email: 'contact@royalagraestate.in',
      avatar: property.agent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      experience: 'Verified Luxury Advisory'
    }
  };
};
