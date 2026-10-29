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
  createdAt?: string;
  status?: string;
}

// UNIFIED SUPER ADMIN PERMISSIONS SET
export const SUPER_ADMIN_PERMISSIONS = [
  'FULL_ADDRESS_ACCESS', // unmasked addresses, plot numbers, seller phone numbers
  'AUTO_APPROVE', // all listings posted by admin/authorized users are published immediately with status: "Active"
  'APPROVALS_QUEUE', // Approvals Queue & Listing Moderation
  'LEAD_CRM_STREAM', // Lead CRM Stream & WhatsApp Direct Triggers
  'DELETE_LISTINGS', // Delete Listings & Permanent Removal
  'LIVE_MAP_PINS', // Live Map Pins & Locality Management
  'PROJECTS_CMS' // Developer Projects CMS (Add/Edit/Delete projects)
] as const;

export type SuperAdminPermission = typeof SUPER_ADMIN_PERMISSIONS[number];

export const ADMIN_CREDENTIALS = [
  {
    email: 'shrey123@gmail.com',
    password: 'shrey123@gmail.com',
    name: 'Shrey Gupta',
    phone: '+91 9149079913',
    id: 'RAE-ADMIN-01',
    role: 'ceo' as const,
    avatar: '/team/shrey-gupta.jpg',
    permissions: [...SUPER_ADMIN_PERMISSIONS]
  },
  {
    email: 'abhi9557138449@gmail.com',
    password: 'abhi9557138449@gmail.com',
    name: 'Abhishek Singh Jadon',
    phone: '+91 9557138449',
    id: 'RAE-ADMIN-02',
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    permissions: [...SUPER_ADMIN_PERMISSIONS]
  },
  {
    email: 'shrey@royalagraestate.in',
    password: 'shrey123@gmail.com',
    name: 'Shrey Gupta',
    phone: '+91 9149079913',
    id: 'RAE-ADMIN-03',
    role: 'ceo' as const,
    avatar: '/team/shrey-gupta.jpg',
    permissions: [...SUPER_ADMIN_PERMISSIONS]
  }
];

export const isCEO = (user: UserProfile | null): boolean => {
  if (!user) return false;
  const emailLower = user.email?.toLowerCase().trim();
  const phoneClean = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
  return (
    user.role === 'ceo' ||
    emailLower === 'shrey123@gmail.com' ||
    emailLower === 'shrey@royalagraestate.in' ||
    phoneClean.endsWith('9149079913')
  );
};

export const getUserAvatar = (user?: UserProfile | null): string => {
  if (!user) return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
  if (isCEO(user)) {
    return '/team/shrey-gupta.jpg';
  }
  const emailLower = (user.email || '').toLowerCase().trim();
  if (emailLower === 'abhi9557138449@gmail.com' || user.role === 'admin') {
    return (user.avatar && !user.avatar.includes('shrey-gupta'))
      ? user.avatar
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';
  }
  if (user.avatar && !user.avatar.includes('shrey-gupta')) {
    return user.avatar;
  }
  return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
};

export const isAdmin = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  const emailLower = user.email?.toLowerCase().trim();
  const phoneClean = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
  return (
    user.role === 'admin' ||
    emailLower === 'abhi9557138449@gmail.com' ||
    emailLower === 'abhishek@royalagraestate.in' ||
    emailLower.endsWith('@royalagraestate.in') ||
    phoneClean.endsWith('9557138449')
  );
};

export const hasAdminPermission = (user: UserProfile | null, permission: string): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  return Boolean(user.permissions && user.permissions.includes(permission));
};

export const isPlotOrLand = (propertyType?: string): boolean => {
  if (!propertyType) return false;
  const lower = propertyType.toLowerCase();
  return lower.includes('plot') || lower.includes('land');
};

export const canViewFullAddress = (property: Property | null, user: UserProfile | null): boolean => {
  if (!user) return false;
  // Supreme access: Only the CEO account can view full unmasked address on the website
  if (isCEO(user)) return true;
  return false;
};

export const canEditProperty = (user: UserProfile | null, property: Property | null): boolean => {
  if (!user || !property) return false;
  // CEO and Admins have supreme rights to edit any property
  if (isCEO(user) || isAdmin(user)) return true;

  // Regular users can ONLY edit properties they personally posted
  const userEmail = user.email?.toLowerCase().trim();
  const ownerEmail = property.ownerEmail?.toLowerCase().trim();
  const userId = user.id?.trim();
  const ownerId = property.ownerId?.trim();

  if (userId && ownerId && userId === ownerId) return true;
  if (userEmail && ownerEmail && userEmail === ownerEmail) return true;

  return false;
};

export const canDeleteProperty = (user: UserProfile | null, property: Property | null): boolean => {
  if (!user || !property) return false;
  // CEO and Admins have supreme rights to delete any property
  if (isCEO(user) || isAdmin(user)) return true;

  // Regular users can ONLY delete properties they personally posted
  const userEmail = user.email?.toLowerCase().trim();
  const ownerEmail = property.ownerEmail?.toLowerCase().trim();
  const userId = user.id?.trim();
  const ownerId = property.ownerId?.trim();

  if (userId && ownerId && userId === ownerId) return true;
  if (userEmail && ownerEmail && userEmail === ownerEmail) return true;

  return false;
};

export const canAutoApprove = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  if (user.permissions?.includes('AUTO_APPROVE')) return true;
  if (isAdmin(user) && (!user.permissions || user.permissions.length === 0)) return true;
  return false;
};

export const canModerateListings = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  if (user.permissions?.includes('APPROVALS_QUEUE') || user.permissions?.includes('MODERATE_LISTINGS')) return true;
  if (isAdmin(user) && (!user.permissions || user.permissions.length === 0)) return true;
  return false;
};

export const canDeleteListings = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  if (user.permissions?.includes('DELETE_LISTINGS') || user.permissions?.includes('DELETE_PROPERTIES')) return true;
  if (isAdmin(user) && (!user.permissions || user.permissions.length === 0)) return true;
  return false;
};

export const canViewLeads = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  if (user.permissions?.includes('LEAD_CRM_STREAM') || user.permissions?.includes('LEAD_CRM_ACCESS')) return true;
  if (isAdmin(user) && (!user.permissions || user.permissions.length === 0)) return true;
  return false;
};

export const canManageProjects = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  if (user.permissions?.includes('PROJECTS_CMS')) return true;
  if (isAdmin(user) && (!user.permissions || user.permissions.length === 0)) return true;
  return false;
};

export const isPropertyOwner = (property: Property | null, user: UserProfile | null): boolean => {
  if (!property || !user) return false;
  if (isCEO(user)) return true;

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
  return isCEO(user) || isAdmin(user) || isPropertyOwner(property, user);
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
  if (canViewFullAddress(property, user)) {
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
    landmarks: property.landmarks || [], // Nearby areas chosen by owner remain visible in property information
    ownerContact: undefined,
    locationLink: undefined,
    mapUrl: undefined,
    googleMapsPinUrl: undefined,
    privateLocationNote: undefined,
    coordinates: { lat: 27.1767, lng: 78.0081 },
    agent: {
      name: 'Royal Agra Estate Concierge',
      role: 'Senior Advisory Desk',
      phone: '+91 91490 79913',
      email: 'contact@royalagraestate.in',
      avatar: property.agent?.avatar || '/team/shrey-gupta.jpg',
      experience: 'Verified Luxury Advisory'
    }
  };

  // Clean payload
  delete (masked as any).fullAddress;
  delete (masked as any).buildingName;
  delete (masked as any).plotNumber;
  delete (masked as any).ownerContact;
  delete (masked as any).locationLink;
  delete (masked as any).mapUrl;
  delete (masked as any).googleMapsPinUrl;
  delete (masked as any).privateLocationNote;

  return masked;
};

/**
 * Strict validator to guarantee no dummy or placeholder leads ("Prospective Buyer", "+91 9149079913", "buyer@royalagraestate.in")
 * ever appear in leads lists or get submitted. Only real external buyer leads are allowed.
 */
export const isValidClientLead = (lead: Partial<LeadSubmission> | null | undefined): boolean => {
  if (!lead) return false;
  const name = (lead.buyerName || '').trim();
  const email = (lead.email || '').trim().toLowerCase();
  const phone = (lead.phone || '').trim();
  const cleanPhone = phone.replace(/[^0-9]/g, '');

  // Must have a valid mobile number (at least 10 digits)
  if (cleanPhone.length < 10) return false;

  // Must have a real client name (strictly reject "Prospective Buyer")
  if (!name || name.toLowerCase().includes('prospective buyer') || name.length < 2) return false;

  // Must not have dummy placeholder email
  if (email === 'buyer@royalagraestate.in') return false;

  // Strictly exclude company owner direct lines (+91 9149079913 or +91 9557138449)
  // as genuine buyer leads come from external clients with their own mobile numbers
  if (cleanPhone.endsWith('9149079913') || cleanPhone.endsWith('9557138449')) {
    return false;
  }

  return true;
};
