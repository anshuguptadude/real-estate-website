// Royal Agra Estate - Native Hostinger Backend & High-Performance SQLite3 Persistence Engine
// 100% Self-Hosted on royalagraestate.in with Zero Cloud Quota Limits and Instant NVMe SSD Speeds

import { Property, UserProfile, Project } from '../types';
import { LeadSubmission } from '../utils/security';

// Dummy Firestore database object for backwards compatibility with any legacy typings
export const db: any = {};

// Quota error check is now obsolete because Hostinger self-hosted engine has NO free-tier quota limits
export const isQuotaExceededError = (error: any): boolean => false;

// Dynamic Base URL resolver:
// - In production on royalagraestate.in -> uses relative '/api'
// - In local development or staging -> calls live Hostinger API directly at 'https://royalagraestate.in/api'
const getApiBase = (): string => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host === 'royalagraestate.in' || host === 'www.royalagraestate.in') {
      return '/api';
    }
  }
  return 'https://royalagraestate.in/api';
};

// Generic type-safe API caller with abort controller timeout
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const url = `${getApiBase()}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      if (res.status === 404) return null;
      console.warn(`[Hostinger API] ${res.status} on ${endpoint}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[Hostinger API] Network fetch error for ${endpoint}:`, err);
    return null;
  }
}

// -------------------------------------------------------------
// 1. LEADS CAPTURE & REAL-TIME CRM STREAM (Hostinger SQLite Engine)
// -------------------------------------------------------------
export const saveFirestoreLead = async (lead: LeadSubmission): Promise<boolean> => {
  const leadId = lead.id || `LEAD-${Date.now()}`;
  const completeLead: LeadSubmission = {
    ...lead,
    id: leadId,
    createdAt: lead.createdAt || new Date().toISOString(),
    timestamp: lead.timestamp || new Date().toLocaleString(),
    status: lead.status || 'new'
  };

  // Always save locally first to guarantee zero lead loss offline
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_leads_v1');
      const existing: LeadSubmission[] = stored ? JSON.parse(stored) : [];
      const updated = [completeLead, ...existing.filter(l => l.id !== leadId)];
      localStorage.setItem('royal_agra_leads_v1', JSON.stringify(updated));
    }
  } catch {}

  try {
    await apiRequest('/leads.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeLead)
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_leads_updated'));
    }
    return true;
  } catch (error) {
    console.warn("Could not sync lead to Hostinger API (saved locally):", error);
    return true;
  }
};

export const fetchFirestoreLeads = async (): Promise<LeadSubmission[]> => {
  try {
    const data = await apiRequest<LeadSubmission[]>('/leads.php');
    if (Array.isArray(data)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('royal_agra_leads_v1', JSON.stringify(data));
      }
      return data;
    }
  } catch (error) {
    console.warn("Error fetching leads from Hostinger API:", error);
  }
  // Fallback to local storage
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_leads_v1');
      if (stored) return JSON.parse(stored);
    }
  } catch {}
  return [];
};

export const subscribeFirestoreLeads = (callback: (leads: LeadSubmission[]) => void): () => void => {
  let isSubscribed = true;
  const poll = async () => {
    if (!isSubscribed) return;
    const leads = await fetchFirestoreLeads();
    if (isSubscribed && leads) callback(leads);
  };

  poll();
  const intervalId = setInterval(poll, 8000);

  const handleUpdate = () => { poll(); };
  if (typeof window !== 'undefined') {
    window.addEventListener('royal_agra_leads_updated', handleUpdate);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') poll();
    });
    window.addEventListener('focus', poll);
  }

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('royal_agra_leads_updated', handleUpdate);
      window.removeEventListener('focus', poll);
    }
  };
};

export const deleteFirestoreLead = async (leadId: string): Promise<boolean> => {
  try {
    if (!leadId) return false;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_leads_v1');
      if (stored) {
        const existing: LeadSubmission[] = JSON.parse(stored);
        localStorage.setItem('royal_agra_leads_v1', JSON.stringify(existing.filter(l => l.id !== leadId)));
      }
    }
    await apiRequest(`/leads.php?id=${encodeURIComponent(leadId)}`, { method: 'DELETE' });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_leads_updated'));
    }
    return true;
  } catch (error) {
    console.error("Error deleting lead from Hostinger API:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 2. USER ACCOUNTS & RBAC PROFILES (Hostinger SQLite Engine)
// -------------------------------------------------------------
export const getLocalDeletedAccountEmails = (): Set<string> => {
  const set = new Set<string>();
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('royal_agra_deleted_accounts_v1') : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach(e => set.add(e.toLowerCase()));
      }
    }
  } catch {}
  return set;
};

export const markAccountDeletedLocally = (email: string): void => {
  try {
    if (typeof window === 'undefined' || !email) return;
    const deleted = getLocalDeletedAccountEmails();
    deleted.add(email.trim().toLowerCase());
    localStorage.setItem('royal_agra_deleted_accounts_v1', JSON.stringify(Array.from(deleted)));
  } catch {}
};

export const saveFirestoreAccount = async (account: any): Promise<boolean> => {
  try {
    if (!account) return false;
    const cleanEmail = account.email ? account.email.toLowerCase().trim() : '';
    const payload = {
      ...account,
      email: cleanEmail,
      updatedAt: new Date().toISOString()
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_accounts_backup');
      const existing: any[] = stored ? JSON.parse(stored) : [];
      const updated = [payload, ...existing.filter(a => a.email !== cleanEmail && a.id !== account.id)];
      localStorage.setItem('royal_agra_accounts_backup', JSON.stringify(updated));
    }

    await apiRequest('/accounts.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_accounts_updated'));
    }
    return true;
  } catch (error) {
    console.error("Error saving account to Hostinger API:", error);
    return false;
  }
};

export const fetchFirestoreAccounts = async (): Promise<any[]> => {
  const deletedEmails = getLocalDeletedAccountEmails();
  try {
    const data = await apiRequest<any[]>('/accounts.php');
    if (Array.isArray(data)) {
      const filtered = data.filter(a => a.email && !deletedEmails.has(a.email.toLowerCase()));
      if (typeof window !== 'undefined') {
        localStorage.setItem('royal_agra_accounts_backup', JSON.stringify(filtered));
      }
      return filtered;
    }
  } catch (error) {
    console.warn("Error fetching accounts from Hostinger API:", error);
  }

  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_accounts_backup');
      if (stored) {
        const parsed: any[] = JSON.parse(stored);
        return parsed.filter(a => a.email && !deletedEmails.has(a.email.toLowerCase()));
      }
    }
  } catch {}
  return [];
};

export const getFirestoreAccount = async (identifier: string): Promise<any | null> => {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  const deletedEmails = getLocalDeletedAccountEmails();
  if (deletedEmails.has(clean)) return null;

  try {
    const isEmail = clean.includes('@');
    const param = isEmail ? `email=${encodeURIComponent(clean)}` : `phone=${encodeURIComponent(clean)}`;
    const direct = await apiRequest<any>(`/accounts.php?${param}`);
    if (direct && (!direct.email || !deletedEmails.has(direct.email.toLowerCase()))) {
      return direct;
    }

    const all = await fetchFirestoreAccounts();
    const found = all.find(a => 
      (a.email && a.email.toLowerCase() === clean) ||
      (a.phone && (a.phone.replace(/\D/g, '') === clean.replace(/\D/g, '') || a.phone === identifier.trim())) ||
      (a.id && a.id.toLowerCase() === clean)
    );
    if (found) return found;

    return null;
  } catch (error) {
    console.warn("Error getting account from Hostinger API:", error);
    return null;
  }
};

export const subscribeFirestoreAccounts = (callback: (accounts: any[]) => void): () => void => {
  let isSubscribed = true;
  const poll = async () => {
    if (!isSubscribed) return;
    const accounts = await fetchFirestoreAccounts();
    if (isSubscribed && accounts) callback(accounts);
  };

  poll();
  const intervalId = setInterval(poll, 8000);

  const handleUpdate = () => { poll(); };
  if (typeof window !== 'undefined') {
    window.addEventListener('royal_agra_accounts_updated', handleUpdate);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') poll();
    });
    window.addEventListener('focus', poll);
  }

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('royal_agra_accounts_updated', handleUpdate);
      window.removeEventListener('focus', poll);
    }
  };
};

export const deleteFirestoreAccount = async (accountEmailOrId: string): Promise<boolean> => {
  try {
    if (!accountEmailOrId) return false;
    const docId = accountEmailOrId.trim().toLowerCase();
    markAccountDeletedLocally(docId);

    const isEmail = docId.includes('@');
    const param = isEmail ? `email=${encodeURIComponent(docId)}` : `id=${encodeURIComponent(docId)}`;
    await apiRequest(`/accounts.php?${param}`, { method: 'DELETE' });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_accounts_updated'));
    }
    return true;
  } catch (error) {
    console.error("Error deleting account from Hostinger API:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 3. PROPERTIES REAL-TIME SYNC & PERSISTENCE (Hostinger SQLite Engine)
// -------------------------------------------------------------
export const getLocalDeletedPropertyIds = (): Set<string> => {
  const set = new Set<string>();
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('royal_agra_deleted_property_ids_v2') : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => set.add(id));
      }
    }
  } catch {}
  return set;
};

export const markPropertyDeletedLocally = (id: string): void => {
  try {
    if (typeof window === 'undefined' || !id) return;
    const deleted = getLocalDeletedPropertyIds();
    deleted.add(id);
    localStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(Array.from(deleted)));
    
    // Also remove from local property stores immediately
    const storedProps = localStorage.getItem('royal_agra_properties_v2');
    if (storedProps) {
      try {
        const parsed = JSON.parse(storedProps);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((p: any) => p.id !== id);
          localStorage.setItem('royal_agra_properties_v2', JSON.stringify(filtered));
        }
      } catch {}
    }
    localStorage.removeItem('royal_agra_properties_v3');
    localStorage.removeItem('royal_agra_user_listings_v1');
  } catch {}
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  const deletedIds = getLocalDeletedPropertyIds();
  try {
    const data = await apiRequest<Property[]>('/properties.php');
    if (Array.isArray(data)) {
      const activeProps = data.filter(p => !deletedIds.has(p.id) && !p.isDeleted && p.status !== 'deleted');
      if (typeof window !== 'undefined') {
        localStorage.setItem('royal_agra_properties_v2', JSON.stringify(activeProps));
      }
      return activeProps;
    }
  } catch (error) {
    console.warn("Error fetching properties from Hostinger API:", error);
  }

  // Fallback to local storage
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_properties_v2');
      if (stored) {
        const parsed: Property[] = JSON.parse(stored);
        return parsed.filter(p => !deletedIds.has(p.id) && !p.isDeleted && p.status !== 'deleted');
      }
    }
  } catch {}
  return [];
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  const docId = property.id || `prop-${Date.now()}`;
  const completeProperty: Property = {
    ...property,
    id: docId,
    isDeleted: false,
    updatedAt: new Date().toISOString()
  };

  // Always save to localStorage first
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_properties_v2');
      const existing: Property[] = stored ? JSON.parse(stored) : [];
      const updated = [completeProperty, ...existing.filter(p => p.id !== docId)];
      localStorage.setItem('royal_agra_properties_v2', JSON.stringify(updated));

      // Clean tombstone if re-added
      const deleted = getLocalDeletedPropertyIds();
      if (deleted.has(docId)) {
        deleted.delete(docId);
        localStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(Array.from(deleted)));
      }
    }
  } catch {}

  try {
    await apiRequest('/properties.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeProperty)
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_properties_updated'));
    }
    return true;
  } catch (error) {
    console.warn("Could not sync property to Hostinger API (saved locally):", error);
    return true;
  }
};

export const deleteFirestoreProperty = async (id: string): Promise<boolean> => {
  try {
    if (!id) return false;
    markPropertyDeletedLocally(id);

    await apiRequest(`/properties.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_properties_updated'));
    }
    return true;
  } catch (error) {
    console.error("Error deleting property from Hostinger API:", error);
    return false;
  }
};

export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void): () => void => {
  let isSubscribed = true;
  const poll = async () => {
    if (!isSubscribed) return;
    const props = await fetchFirestoreProperties();
    if (isSubscribed && props) callback(props);
  };

  poll();
  const intervalId = setInterval(poll, 6000);

  const handleUpdate = () => { poll(); };
  if (typeof window !== 'undefined') {
    window.addEventListener('royal_agra_properties_updated', handleUpdate);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') poll();
    });
    window.addEventListener('focus', poll);
  }

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('royal_agra_properties_updated', handleUpdate);
      window.removeEventListener('focus', poll);
    }
  };
};

// -------------------------------------------------------------
// 4. PROJECTS REAL-TIME SYNC & CMS (Hostinger SQLite Engine)
// -------------------------------------------------------------
export const getLocalDeletedProjectIds = (): Set<string> => {
  const set = new Set<string>();
  try {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('royal_agra_deleted_project_ids_v1') : null;
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        parsed.forEach(id => set.add(id));
      }
    }
  } catch {}
  return set;
};

export const markProjectDeletedLocally = (id: string): void => {
  try {
    if (typeof window === 'undefined' || !id) return;
    const deleted = getLocalDeletedProjectIds();
    deleted.add(id);
    localStorage.setItem('royal_agra_deleted_project_ids_v1', JSON.stringify(Array.from(deleted)));

    const stored = localStorage.getItem('royal_agra_projects_v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const filtered = parsed.filter((p: any) => p.id !== id);
          localStorage.setItem('royal_agra_projects_v2', JSON.stringify(filtered));
        }
      } catch {}
    }
  } catch {}
};

export const clearDeletedProjectsTombstones = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('royal_agra_deleted_project_ids_v1');
    }
    apiRequest('/projects.php?action=restore_defaults', { method: 'POST' }).catch(() => {});
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_projects_updated'));
    }
  } catch {}
};

export const fetchFirestoreProjects = async (): Promise<Project[]> => {
  const deletedIds = getLocalDeletedProjectIds();
  try {
    const data = await apiRequest<Project[]>('/projects.php');
    if (Array.isArray(data)) {
      const active = data.filter(p => !deletedIds.has(p.id) && !(p as any).isDeleted);
      if (typeof window !== 'undefined') {
        localStorage.setItem('royal_agra_projects_v2', JSON.stringify(active));
      }
      return active;
    }
  } catch (error) {
    console.warn("Error fetching projects from Hostinger API:", error);
  }

  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_projects_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: any) => !deletedIds.has(p.id));
        }
      }
    }
  } catch {}
  return [];
};

export const saveFirestoreProject = async (project: Project): Promise<boolean> => {
  try {
    const docId = project.id || `proj-${Date.now()}`;
    const payload = {
      ...project,
      id: docId,
      updatedAt: new Date().toISOString()
    };
    await apiRequest('/projects.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_projects_updated'));
    }
    return true;
  } catch (error) {
    console.error("Error saving project to Hostinger API:", error);
    return false;
  }
};

export const deleteFirestoreProject = async (id: string): Promise<boolean> => {
  try {
    if (!id) return false;
    markProjectDeletedLocally(id);

    await apiRequest(`/projects.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('royal_agra_projects_updated'));
    }
    return true;
  } catch (error) {
    console.error("Error deleting project from Hostinger API:", error);
    return false;
  }
};

export const subscribeFirestoreProjects = (callback: (projects: Project[]) => void): () => void => {
  let isSubscribed = true;
  const poll = async () => {
    if (!isSubscribed) return;
    const projects = await fetchFirestoreProjects();
    if (isSubscribed && projects) callback(projects);
  };

  poll();
  const intervalId = setInterval(poll, 8000);

  const handleUpdate = () => { poll(); };
  if (typeof window !== 'undefined') {
    window.addEventListener('royal_agra_projects_updated', handleUpdate);
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') poll();
    });
    window.addEventListener('focus', poll);
  }

  return () => {
    isSubscribed = false;
    clearInterval(intervalId);
    if (typeof window !== 'undefined') {
      window.removeEventListener('royal_agra_projects_updated', handleUpdate);
      window.removeEventListener('focus', poll);
    }
  };
};

// -------------------------------------------------------------
// 5. USER FAVORITES
// -------------------------------------------------------------
export const saveUserFavorite = async (userId: string, propertyId: string): Promise<boolean> => {
  try {
    if (typeof window !== 'undefined') {
      const key = `royal_agra_favorites_${userId}`;
      const stored = localStorage.getItem(key);
      const favs: string[] = stored ? JSON.parse(stored) : [];
      if (!favs.includes(propertyId)) {
        favs.push(propertyId);
        localStorage.setItem(key, JSON.stringify(favs));
      }
    }
    return true;
  } catch {
    return false;
  }
};

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    if (typeof window !== 'undefined') {
      const key = `royal_agra_favorites_${userId}`;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch {
    return [];
  }
};
