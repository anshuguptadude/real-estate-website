import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  initializeFirestore,
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  deleteDoc, 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { Property, UserProfile, Project } from '../types';
import { LeadSubmission } from '../utils/security';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const databaseId = (firebaseConfig as any).databaseId || '(default)';

// Initialize Cloud Firestore on active database
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true
}, databaseId);

// Helper: Detect Firestore Free-Tier Quota Limit Exceeded
let hasLoggedQuotaNotice = false;
export const isQuotaExceededError = (error: any): boolean => {
  if (!error) return false;
  const msg = String(error?.message || '').toLowerCase();
  const code = String(error?.code || '').toLowerCase();
  const isQuota = code === 'resource-exhausted' || msg.includes('quota limit exceeded') || msg.includes('quota exceeded');
  if (isQuota && !hasLoggedQuotaNotice) {
    hasLoggedQuotaNotice = true;
    console.info("[Royal Agra Estate] Cloud database daily free quota reached. Switching seamlessly to cached local storage mode.");
  }
  return isQuota;
};

// -------------------------------------------------------------
// 1. LEADS CAPTURE & REAL-TIME CRM STREAM
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

  // Always save locally first to guarantee ZERO lead loss even under quota limits or offline
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_leads_v1');
      const existing: LeadSubmission[] = stored ? JSON.parse(stored) : [];
      const updated = [completeLead, ...existing.filter(l => l.id !== leadId)];
      localStorage.setItem('royal_agra_leads_v1', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, 'leads', leadId);
    await setDoc(docRef, completeLead, { merge: true });
    return true;
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      console.warn("Could not sync lead to Firestore cloud (saved locally):", error);
    }
    return true; // Still true because lead is saved locally
  }
};

export const subscribeFirestoreLeads = (callback: (leads: LeadSubmission[]) => void): () => void => {
  try {
    const colRef = collection(db, 'leads');
    const q = query(colRef, limit(100));
    let unsubscribed = false;
    let unsubSnapshot: (() => void) | null = null;

    unsubSnapshot = onSnapshot(q, (snapshot) => {
      if (unsubscribed) return;
      const leads = snapshot.docs.map(d => d.data() as LeadSubmission);
      leads.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
        const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
        return timeB - timeA;
      });
      callback(leads);
    }, (error) => {
      if (isQuotaExceededError(error)) {
        unsubscribed = true;
        if (unsubSnapshot) unsubSnapshot();
        // Fallback to local stored leads
        try {
          const stored = localStorage.getItem('royal_agra_leads_v1');
          if (stored) callback(JSON.parse(stored));
        } catch {}
      } else {
        console.warn("Error in real-time leads listener:", error);
      }
    });

    return () => {
      unsubscribed = true;
      if (unsubSnapshot) unsubSnapshot();
    };
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      console.warn("Failed to subscribe to leads:", error);
    }
    return () => {};
  }
};

export const fetchFirestoreLeads = async (): Promise<LeadSubmission[]> => {
  try {
    const colRef = collection(db, 'leads');
    const q = query(colRef, limit(100));
    const snapshot = await getDocs(q);
    const leads = snapshot.docs.map(d => d.data() as LeadSubmission);
    leads.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
      const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
      return timeB - timeA;
    });
    return leads;
  } catch (error) {
    console.warn("Error fetching leads from Firestore:", error);
    return [];
  }
};

export const deleteFirestoreLead = async (leadId: string): Promise<boolean> => {
  try {
    if (!leadId) return false;
    await deleteDoc(doc(db, 'leads', leadId));
    return true;
  } catch (error) {
    console.error("Error deleting lead from Firestore:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 2. USER ACCOUNTS & RBAC PROFILES (Cloud Sync & CEO Master)
// -------------------------------------------------------------
export const saveFirestoreAccount = async (account: any): Promise<boolean> => {
  try {
    if (!account) return false;
    const docId = account.email ? account.email.toLowerCase().trim() : account.id;
    if (!docId) return false;
    await setDoc(doc(db, 'accounts', docId), {
      ...account,
      email: account.email ? account.email.toLowerCase().trim() : '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    if (account.id) {
      await setDoc(doc(db, 'users', account.id), {
        ...account,
        updatedAt: new Date().toISOString()
      }, { merge: true }).catch(() => {});
    }
    return true;
  } catch (error) {
    console.error("Error saving account to Firestore:", error);
    return false;
  }
};

export const subscribeFirestoreAccounts = (callback: (accounts: any[]) => void): () => void => {
  try {
    let unsubscribed = false;
    let unsub: (() => void) | null = null;
    unsub = onSnapshot(collection(db, 'accounts'), (snapshot) => {
      if (unsubscribed) return;
      const accounts = snapshot.docs.map(doc => doc.data());
      callback(accounts);
    }, (error) => {
      if (isQuotaExceededError(error)) {
        unsubscribed = true;
        if (unsub) unsub();
        // Fallback to local accounts
        try {
          const stored = localStorage.getItem('royal_agra_accounts_backup');
          if (stored) callback(JSON.parse(stored));
        } catch {}
      } else {
        console.warn("Error in real-time accounts listener:", error);
      }
    });
    return () => {
      unsubscribed = true;
      if (unsub) unsub();
    };
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      console.warn("Failed to subscribe to accounts:", error);
    }
    return () => {};
  }
};

export const fetchFirestoreAccounts = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'accounts'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.warn("Error fetching accounts from Firestore:", error);
    return [];
  }
};

export const getFirestoreAccount = async (identifier: string): Promise<any | null> => {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();
  try {
    // 1. Direct document check
    const directDoc = await getDoc(doc(db, 'accounts', clean));
    if (directDoc.exists()) {
      return directDoc.data();
    }
    
    // 2. Query by email
    const qEmail = query(collection(db, 'accounts'), where('email', '==', clean));
    const snapEmail = await getDocs(qEmail);
    if (!snapEmail.empty) {
      return snapEmail.docs[0].data();
    }
    
    // 3. Query by phone
    const qPhone = query(collection(db, 'accounts'), where('phone', '==', identifier.trim()));
    const snapPhone = await getDocs(qPhone);
    if (!snapPhone.empty) {
      return snapPhone.docs[0].data();
    }

    // 4. Fallback check in users
    const userDoc = await getDoc(doc(db, 'users', clean));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    return null;
  } catch (error) {
    console.warn("Error getting firestore account:", error);
    return null;
  }
};

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

export const deleteFirestoreAccount = async (accountEmailOrId: string): Promise<boolean> => {
  try {
    if (!accountEmailOrId) return false;
    const docId = accountEmailOrId.trim().toLowerCase();
    markAccountDeletedLocally(docId);
    await deleteDoc(doc(db, 'accounts', docId));
    await deleteDoc(doc(db, 'users', docId)).catch(() => {});
    return true;
  } catch (error) {
    console.error("Error deleting account from Firestore:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 3. PROPERTIES REAL-TIME SYNC & PERSISTENCE
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

export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void): () => void => {
  try {
    const deletedIds = getLocalDeletedPropertyIds();
    let isTerminated = false;
    let unsubTombstones: (() => void) | null = null;
    let unsubProperties: (() => void) | null = null;

    // 1. Listen for deleted_properties tombstones in real-time
    try {
      unsubTombstones = onSnapshot(collection(db, 'deleted_properties'), (tombSnap) => {
        if (isTerminated) return;
        try {
          tombSnap.docs.forEach(docSnap => {
            deletedIds.add(docSnap.id);
            markPropertyDeletedLocally(docSnap.id);
          });
        } catch (err) {
          console.warn("Error reading deleted_properties tombstones:", err);
        }
      }, (error) => {
        if (isQuotaExceededError(error)) {
          if (unsubTombstones) { unsubTombstones(); unsubTombstones = null; }
        } else {
          console.warn("Tombstone listener warning:", error);
        }
      });
    } catch {}

    // 2. Listen for properties collection changes
    try {
      unsubProperties = onSnapshot(collection(db, 'properties'), (snapshot) => {
        if (isTerminated) return;
        try {
          const activeProps: Property[] = [];
          snapshot.docs.forEach(docSnap => {
            const data = docSnap.data() as Property;
            const propId = data.id || docSnap.id;
            if (!deletedIds.has(propId) && !data.isDeleted && data.status !== 'deleted') {
              activeProps.push({
                ...data,
                id: propId
              });
            }
          });
          callback(activeProps);
        } catch (err) {
          console.warn("Error processing properties real-time snapshot:", err);
        }
      }, (error) => {
        if (isQuotaExceededError(error)) {
          isTerminated = true;
          if (unsubProperties) { unsubProperties(); unsubProperties = null; }
          if (unsubTombstones) { unsubTombstones(); unsubTombstones = null; }
          // Fallback to local properties store
          try {
            const stored = localStorage.getItem('royal_agra_properties_v2');
            if (stored) {
              const parsed: Property[] = JSON.parse(stored);
              const filtered = parsed.filter(p => !deletedIds.has(p.id) && !p.isDeleted && p.status !== 'deleted');
              if (filtered.length > 0) callback(filtered);
            }
          } catch {}
        } else {
          console.warn("Error in properties real-time listener:", error);
        }
      });
    } catch {}

    return () => {
      isTerminated = true;
      if (unsubTombstones) unsubTombstones();
      if (unsubProperties) unsubProperties();
    };
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      console.warn("Failed to subscribe to properties:", error);
    }
    return () => {};
  }
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  try {
    const deletedIds = getLocalDeletedPropertyIds();
    try {
      const tombSnap = await getDocs(collection(db, 'deleted_properties'));
      tombSnap.docs.forEach(d => deletedIds.add(d.id));
    } catch {}

    const colRef = collection(db, 'properties');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];

    return snapshot.docs
      .map(d => ({ ...d.data(), id: d.data().id || d.id } as Property))
      .filter(p => !deletedIds.has(p.id) && !p.isDeleted && p.status !== 'deleted');
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      console.warn("Error fetching properties from Firestore:", error);
    }
    return [];
  }
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  const docId = property.id || `prop-${Date.now()}`;
  const completeProperty: Property = {
    ...property,
    id: docId,
    isDeleted: false,
    updatedAt: new Date().toISOString()
  };

  // Always save to localStorage first to guarantee zero property loss under quota limit or offline
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('royal_agra_properties_v2');
      const existing: Property[] = stored ? JSON.parse(stored) : [];
      const updated = [completeProperty, ...existing.filter(p => p.id !== docId)];
      localStorage.setItem('royal_agra_properties_v2', JSON.stringify(updated));
    }
  } catch {}

  try {
    const docRef = doc(db, 'properties', docId);
    await setDoc(docRef, completeProperty, { merge: true });

    // Clean up any old tombstone if property is re-added
    try {
      await deleteDoc(doc(db, 'deleted_properties', docId));
      const deleted = getLocalDeletedPropertyIds();
      if (deleted.has(docId)) {
        deleted.delete(docId);
        localStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(Array.from(deleted)));
      }
    } catch {}

    return true;
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      console.warn("Could not sync property to Firestore cloud (saved locally):", error);
    }
    return true; // Still true because saved locally
  }
};

export const deleteFirestoreProperty = async (id: string): Promise<boolean> => {
  try {
    if (!id) return false;
    // 1. Mark locally first so no browser reload resurrects it
    markPropertyDeletedLocally(id);

    // 2. Write tombstone to Firestore to prevent resurrection across all devices
    const tombRef = doc(db, 'deleted_properties', id);
    await setDoc(tombRef, { id, deletedAt: new Date().toISOString() }, { merge: true }).catch(() => {});

    // 3. Mark soft-delete on the property doc in case deleteDoc takes time
    const docRef = doc(db, 'properties', id);
    await setDoc(docRef, { isDeleted: true, status: 'deleted', deletedAt: new Date().toISOString() }, { merge: true }).catch(() => {});

    // 4. Hard-delete document from properties collection
    await deleteDoc(docRef).catch(() => {});
    return true;
  } catch (error) {
    console.error("Error deleting property from Firestore:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 4. PROJECTS REAL-TIME SYNC & CMS
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

    // Also remove from local project store immediately
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
  } catch {}
};

export const subscribeFirestoreProjects = (callback: (projects: Project[]) => void): () => void => {
  try {
    const deletedIds = getLocalDeletedProjectIds();
    let unsubscribed = false;
    let unsubTombstones: (() => void) | null = null;
    let unsubProjects: (() => void) | null = null;

    // 1. Listen for deleted_projects tombstones in real-time
    try {
      unsubTombstones = onSnapshot(collection(db, 'deleted_projects'), (tombSnap) => {
        if (unsubscribed) return;
        try {
          tombSnap.docs.forEach(docSnap => {
            deletedIds.add(docSnap.id);
            markProjectDeletedLocally(docSnap.id);
          });
        } catch {}
      }, (err) => {
        if (!isQuotaExceededError(err)) console.warn("Deleted projects listener error:", err);
      });
    } catch {}

    // 2. Listen for active projects in real-time
    unsubProjects = onSnapshot(collection(db, 'projects'), (snapshot) => {
      if (unsubscribed) return;
      const currentDeleted = getLocalDeletedProjectIds();
      const projects = snapshot.docs
        .map(d => d.data() as Project)
        .filter(p => !currentDeleted.has(p.id) && !(p as any).isDeleted);
      callback(projects);
    }, (error) => {
      if (isQuotaExceededError(error)) {
        unsubscribed = true;
        if (unsubProjects) unsubProjects();
        if (unsubTombstones) unsubTombstones();
        // Fallback to local stored projects
        try {
          const stored = localStorage.getItem('royal_agra_projects_v2');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              callback(parsed.filter((p: any) => !getLocalDeletedProjectIds().has(p.id)));
            }
          }
        } catch {}
      } else {
        console.warn("Error in projects real-time listener:", error);
      }
    });

    return () => {
      unsubscribed = true;
      if (unsubProjects) unsubProjects();
      if (unsubTombstones) unsubTombstones();
    };
  } catch (error) {
    if (!isQuotaExceededError(error)) {
      console.warn("Failed to subscribe to projects:", error);
    }
    return () => {};
  }
};

export const fetchFirestoreProjects = async (): Promise<Project[]> => {
  try {
    const colRef = collection(db, 'projects');
    const snapshot = await getDocs(colRef);
    const deletedIds = getLocalDeletedProjectIds();
    return snapshot.docs
      .map(d => d.data() as Project)
      .filter(p => !deletedIds.has(p.id) && !(p as any).isDeleted);
  } catch (error) {
    console.warn("Error fetching projects from Firestore:", error);
    return [];
  }
};

export const saveFirestoreProject = async (project: Project): Promise<boolean> => {
  try {
    const docId = project.id || `proj-${Date.now()}`;
    const docRef = doc(db, 'projects', docId);
    await setDoc(docRef, {
      ...project,
      id: docId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving project to Firestore:", error);
    return false;
  }
};

export const deleteFirestoreProject = async (id: string): Promise<boolean> => {
  try {
    if (!id) return false;
    // 1. Mark locally first so no browser reload resurrects it
    markProjectDeletedLocally(id);

    // 2. Write tombstone to Firestore to prevent resurrection across all devices
    const tombRef = doc(db, 'deleted_projects', id);
    await setDoc(tombRef, { id, deletedAt: new Date().toISOString() }, { merge: true }).catch(() => {});

    // 3. Hard-delete document from projects collection
    const docRef = doc(db, 'projects', id);
    await deleteDoc(docRef).catch(() => {});
    return true;
  } catch (error) {
    console.error("Error deleting project from Firestore:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 5. USER FAVORITES
// -------------------------------------------------------------
export const saveUserFavorite = async (userId: string, propertyId: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'favorites', `${userId}_${propertyId}`);
    await setDoc(docRef, { userId, propertyId, createdAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("Error saving favorite:", error);
    return false;
  }
};

export const getUserFavorites = async (userId: string): Promise<string[]> => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(d => d.data().propertyId);
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
};
