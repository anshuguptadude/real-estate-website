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

export const isPropertyOwner = (property: Property | null, user: UserProfile | null): boolean => {
  if (!property || !user) return false;
  if (isAdmin(user)) return true;

  const uId = user.id?.trim();
  const uEmail = user.email?.trim().toLowerCase();
  const uPhone = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
  const uName = user.name?.trim().toLowerCase();

  const pOwnerId = property.ownerId?.trim();
  const pUserId = property.userId?.trim();
  const pPostedById = property.postedBy?.id?.trim();
  const pEmail = property.ownerEmail?.trim().toLowerCase();
  const pPostedByEmail = property.postedBy?.email?.trim().toLowerCase();
  const pPhone = property.ownerContact ? property.ownerContact.replace(/[^0-9]/g, '') : '';
  const pOwnerName = property.ownerName?.trim().toLowerCase();
  const pPostedByName = property.postedBy?.name?.trim().toLowerCase();

  const matchId = Boolean(uId && (pOwnerId === uId || pUserId === uId || pPostedById === uId));
  const matchEmail = Boolean(
    (uEmail && pEmail && pEmail === uEmail) || 
    (uEmail && pPostedByEmail && pPostedByEmail === uEmail)
  );
  const matchPhone = Boolean(
    uPhone && pPhone && 
    (pPhone === uPhone || pPhone.endsWith(uPhone) || uPhone.endsWith(pPhone))
  );
  const matchName = Boolean(
    uName && ((pOwnerName && pOwnerName === uName) || (pPostedByName && pPostedByName === uName))
  );

  return matchId || matchEmail || matchPhone || matchName;
};

export const isPropertyOwnerOrAdmin = (property: Property | null, user: UserProfile | null): boolean => {
  return isAdmin(user) || isPropertyOwner(property, user);
};

export const getMaskedProperty = (property: Property, user: UserProfile | null): Property => {
  if (isAdmin(user)) {
    return property;
  }
  
  // For non-admin accounts (buyers, guests, and owners on public/catalog views), mask sensitive details:
  // Show ONLY the primary area locality, hide exact street address & coordinates
  const primaryLocality = property.locality 
    ? (property.locality.toLowerCase().includes('agra') ? property.locality : `${property.locality}, Agra`)
    : (property.location || 'Agra');

  return {
    ...property,
    address: primaryLocality,
    coordinates: { lat: 27.1767, lng: 78.0081 },
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
};
