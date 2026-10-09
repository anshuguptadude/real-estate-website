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

// UNIFIED SUPER ADMIN PERMISSIONS SET
export const SUPER_ADMIN_PERMISSIONS = [
  'FULL_ADDRESS_ACCESS', // unmasked addresses, plot numbers, seller phone numbers
  'AUTO_APPROVE', // all listings posted by either admin are published immediately with status: "Active"
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
    permissions: [...SUPER_ADMIN_PERMISSIONS]
  },
  {
    email: 'abhi9557138449@gmail.com',
    password: 'abhi9557138449@gmail.com',
    name: 'Abhishek Singh Jadon',
    phone: '+91 9557138449',
    id: 'RAE-ADMIN-02',
    role: 'admin' as const,
    permissions: [...SUPER_ADMIN_PERMISSIONS]
  },
  {
    email: 'shrey@royalagraestate.in',
    password: 'shrey123@gmail.com',
    name: 'Shrey Gupta',
    phone: '+91 9149079913',
    id: 'RAE-ADMIN-03',
    role: 'ceo' as const,
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

export const isAdmin = (user: UserProfile | null): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  const emailLower = user.email?.toLowerCase().trim();
  const phoneClean = user.phone ? user.phone.replace(/[^0-9]/g, '') : '';
  return (
    user.role === 'admin' ||
    emailLower === 'abhi9557138449@gmail.com' ||
    emailLower === 'abhishek@royalagraestate.in' ||
    phoneClean.endsWith('9557138449')
  );
};

export const hasAdminPermission = (user: UserProfile | null, permission: string): boolean => {
  if (!user) return false;
  if (isCEO(user)) return true;
  return Boolean(user.permissions && user.permissions.includes(permission));
};

export const canViewFullAddress = (property: Property | null, user: UserProfile | null): boolean => {
  if (!user) return false;
  // 1. CEO always has supreme access
  if (isCEO(user)) return true;
  // 2. Property Owner always has access to their own property
  if (property && isPropertyOwner(property, user)) return true;
  // 3. Explicit FULL_ADDRESS_ACCESS permission
  if (user.permissions?.includes('FULL_ADDRESS_ACCESS') || user.permissions?.includes('FULL_ADMIN_DOSSIER')) return true;
  // 4. Specific unlocked property permission granted by CEO
  if (property && user.unlockedPropertyIds && user.unlockedPropertyIds.includes(property.id)) return true;
  // 5. Default fallback for co-founder admins if permissions array is untouched
  if (isAdmin(user) && (!user.permissions || user.permissions.length === 0)) return true;
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

export const getMaskedProperty = (property: Property, user: UserProfile | null): Property => {
  if (canViewFullAddress(property, user)) {
    return property;
  }
  
  // For accounts without full address access, mask sensitive details:
  // Show ONLY the primary area locality, hide exact street address & coordinates
  const primaryLocality = property.locality 
    ? (property.locality.toLowerCase().includes('agra') ? property.locality : `${property.locality}, Agra`)
    : (property.location || 'Agra');

  return {
    ...property,
    address: primaryLocality,
    coordinates: { lat: 27.1767, lng: 78.0081 },
    privateLocationNote: undefined,
    locationLink: undefined,
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
