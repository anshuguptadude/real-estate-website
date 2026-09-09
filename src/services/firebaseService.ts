import { initializeApp } from 'firebase/app';
import { 
  initializeFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  deleteDoc,
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { Property, Project } from '../types';
import { PROPERTIES_DATA, PROJECTS_DATA } from '../data/mockData';
import { LeadSubmission } from '../utils/security';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const databaseId = (firebaseConfig as any).databaseId || '(default)';
const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true
}, databaseId);

// LOCALSTORAGE HELPERS FOR DELETED ITEMS & PERSISTENCE CACHE
export const getDeletedPropertyIds = (): string[] => {
  try {
    const stored = localStorage.getItem('royal_agra_deleted_property_ids_v2');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearDeletedPropertyIdsLocally = () => {
  try {
    localStorage.removeItem('royal_agra_deleted_property_ids_v2');
    localStorage.removeItem('royal_agra_properties_cache_v2');
  } catch (err) {
    console.error("Error clearing deleted IDs:", err);
  }
};

export const markPropertyAsDeletedLocally = (id: string) => {
  try {
    const deleted = getDeletedPropertyIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(deleted));
    }
    // Also remove from cache
    const cached = getPropertiesCache();
    const filtered = cached.filter(p => p.id !== id);
    setPropertiesCache(filtered);
  } catch (err) {
    console.error("Error saving deleted ID:", err);
  }
};

export const getPropertiesCache = (): Property[] => {
  try {
    const stored = localStorage.getItem('royal_agra_properties_cache_v2');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// DEDICATED PERSISTENT USER LISTINGS STORE
// Guarantees any property created/posted by the user is preserved across refreshes and logouts
export const getUserPropertiesStore = (): Property[] => {
  try {
    const stored = localStorage.getItem('royal_agra_user_listings_v1');
    const deletedIds = getDeletedPropertyIds();
    const list: Property[] = stored ? JSON.parse(stored) : [];
    return list.filter(p => p && !p.isDeleted && !deletedIds.includes(p.id));
  } catch {
    return [];
  }
};

export const saveUserPropertyLocally = (property: Property) => {
  try {
    const existing = getUserPropertiesStore();
    const exists = existing.some(p => p.id === property.id);
    const updated = exists 
      ? existing.map(p => p.id === property.id ? property : p)
      : [property, ...existing];
    localStorage.setItem('royal_agra_user_listings_v1', JSON.stringify(updated));
  } catch (e) {
    console.error("Error saving user property locally:", e);
  }
};

export const removeUserPropertyLocally = (propertyId: string) => {
  try {
    const existing = getUserPropertiesStore();
    const updated = existing.filter(p => p.id !== propertyId);
    localStorage.setItem('royal_agra_user_listings_v1', JSON.stringify(updated));
  } catch (e) {
    // ignore
  }
};

// Merges any list of properties with the user's permanent local listings
export const mergeWithUserListings = (list: Property[]): Property[] => {
  const deletedIds = getDeletedPropertyIds();
  const userListings = getUserPropertiesStore().filter(p => !p.isDeleted && !deletedIds.includes(p.id));
  const baseList = list.filter(p => p && !p.isDeleted && !deletedIds.includes(p.id));

  // Map by id: user listings take precedence if newer, otherwise append user listings
  const map = new Map<string, Property>();
  baseList.forEach(p => map.set(p.id, p));
  userListings.forEach(p => map.set(p.id, p));

  return Array.from(map.values());
};

export const setPropertiesCache = (properties: Property[]) => {
  try {
    const deletedIds = getDeletedPropertyIds();
    // Always ensure user listings are merged into cache
    const merged = mergeWithUserListings(properties);
    const cleanList = merged.filter(p => !p.isDeleted && !deletedIds.includes(p.id));
    localStorage.setItem('royal_agra_properties_cache_v2', JSON.stringify(cleanList));
  } catch (e) {
    // ignore
  }
};

// PROPERTIES REAL-TIME SYNC & FETCH
export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'properties'), async (snapshot) => {
    const deletedIds = getDeletedPropertyIds();

    if (snapshot.empty) {
      // Seed initial mock properties if empty, excluding any deleted IDs
      const seeded = PROPERTIES_DATA
        .filter(p => !deletedIds.includes(p.id))
        .map((p, idx) => ({
          ...p,
          status: p.status || (idx === 3 ? 'Sold' : 'published'),
          isApproved: true,
          isDeleted: false,
          isUserListing: idx === 0 || idx === 2,
          ownerId: (idx === 0 || idx === 2) ? 'RAE-OWNER-01' : 'RAE-PARTNER-02',
          ownerName: (idx === 0 || idx === 2) ? 'Shrey Gupta' : p.agent?.name || 'Managing Partner'
        }));

      for (const prop of seeded) {
        try {
          await setDoc(doc(db, 'properties', prop.id), prop);
        } catch (err) {
          // ignore seeding write error
        }
      }
      const mergedSeeded = mergeWithUserListings(seeded);
      setPropertiesCache(mergedSeeded);
      callback(mergedSeeded);
    } else {
      const props = snapshot.docs
        .map(doc => doc.data() as Property)
        .filter(p => p && !p.isDeleted && !deletedIds.includes(p.id));
      const merged = mergeWithUserListings(props);
      setPropertiesCache(merged);
      callback(merged);
    }
  }, (error) => {
    console.error("Error in properties real-time listener, falling back to cache:", error);
    const deletedIds = getDeletedPropertyIds();
    const cached = getPropertiesCache();
    if (cached && cached.length > 0) {
      const merged = mergeWithUserListings(cached.filter(p => !p.isDeleted && !deletedIds.includes(p.id)));
      callback(merged);
    } else {
      const fallback = PROPERTIES_DATA
        .filter(p => !deletedIds.includes(p.id))
        .map((p, idx) => ({
          ...p,
          status: p.status || (idx === 3 ? 'Sold' : 'published'),
          isApproved: true,
          isDeleted: false
        }));
      const merged = mergeWithUserListings(fallback);
      setPropertiesCache(merged);
      callback(merged);
    }
  });

  return unsubscribe;
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  const deletedIds = getDeletedPropertyIds();
  try {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    if (querySnapshot.empty) {
      const seeded = PROPERTIES_DATA
        .filter(p => !deletedIds.includes(p.id))
        .map((p, idx) => ({
          ...p,
          status: p.status || (idx === 3 ? 'Sold' : 'published'),
          isApproved: true,
          isDeleted: false,
          isUserListing: idx === 0 || idx === 2,
          ownerId: (idx === 0 || idx === 2) ? 'RAE-OWNER-01' : 'RAE-PARTNER-02',
          ownerName: (idx === 0 || idx === 2) ? 'Shrey Gupta' : p.agent?.name || 'Managing Partner'
        }));
      for (const prop of seeded) {
        try {
          await setDoc(doc(db, 'properties', prop.id), prop);
        } catch (e) {}
      }
      setPropertiesCache(seeded);
      return seeded;
    }
    const list = querySnapshot.docs
      .map(doc => doc.data() as Property)
      .filter(p => p && !p.isDeleted && !deletedIds.includes(p.id));
    const merged = mergeWithUserListings(list);
    setPropertiesCache(merged);
    return merged;
  } catch (error) {
    console.error("Error fetching properties from Firestore:", error);
    const cached = getPropertiesCache();
    if (cached && cached.length > 0) {
      return mergeWithUserListings(cached.filter(p => !p.isDeleted && !deletedIds.includes(p.id)));
    }
    return mergeWithUserListings((PROPERTIES_DATA as Property[]).filter(p => !deletedIds.includes(p.id)));
  }
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  // Ensure isDeleted is false when saving/updating
  const cleanProperty: Property = {
    ...property,
    isDeleted: false,
    isUserListing: true
  };

  // 1. Immediately persist in dedicated local user listings store
  saveUserPropertyLocally(cleanProperty);

  // 2. Update memory cache
  const current = getPropertiesCache();
  const exists = current.some(p => p.id === cleanProperty.id);
  const updated = exists 
    ? current.map(p => p.id === cleanProperty.id ? cleanProperty : p)
    : [cleanProperty, ...current];
  setPropertiesCache(updated);

  try {
    // 3. Persist to Cloud Firestore
    await setDoc(doc(db, 'properties', cleanProperty.id), cleanProperty);
    return true;
  } catch (error) {
    console.error("Error saving property to Firestore:", error);
    return false;
  }
};

export const deleteFirestoreProperty = async (propertyId: string): Promise<boolean> => {
  // 1. Immediately record in persistent deleted list
  markPropertyAsDeletedLocally(propertyId);

  // 2. Remove from dedicated user listings store
  removeUserPropertyLocally(propertyId);

  // 3. Remove from cache
  const cached = getPropertiesCache();
  const filtered = cached.filter(p => p.id !== propertyId);
  setPropertiesCache(filtered);

  try {
    // 4. Soft-delete flag in Firestore (so any lingering listeners exclude it immediately)
    await setDoc(doc(db, 'properties', propertyId), { isDeleted: true, status: 'rejected' }, { merge: true });
    // 5. Also delete the document
    await deleteDoc(doc(db, 'properties', propertyId));
    return true;
  } catch (error) {
    console.error("Error deleting property from Firestore:", error);
    // Local persistent soft-delete guarantees it will not reappear
    return true;
  }
};

// PROJECTS REAL-TIME SYNC & FETCH
export const subscribeFirestoreProjects = (callback: (projects: Project[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'projects'), async (snapshot) => {
    if (snapshot.empty) {
      for (const proj of PROJECTS_DATA) {
        await setDoc(doc(db, 'projects', proj.id), proj);
      }
      callback(PROJECTS_DATA);
    } else {
      const projects = snapshot.docs.map(doc => doc.data() as Project);
      callback(projects);
    }
  }, (error) => {
    console.error("Error in projects real-time listener:", error);
  });

  return unsubscribe;
};

export const fetchFirestoreProjects = async (): Promise<Project[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    if (querySnapshot.empty) {
      for (const proj of PROJECTS_DATA) {
        await setDoc(doc(db, 'projects', proj.id), proj);
      }
      return PROJECTS_DATA;
    }
    return querySnapshot.docs.map(doc => doc.data() as Project);
  } catch (error) {
    console.error("Error fetching projects from Firestore:", error);
    return PROJECTS_DATA;
  }
};

export const saveFirestoreProject = async (project: Project): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'projects', project.id), project);
    return true;
  } catch (error) {
    console.error("Error saving project to Firestore:", error);
    return false;
  }
};

export const deleteFirestoreProject = async (projectId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'projects', projectId));
    return true;
  } catch (error) {
    console.error("Error deleting project from Firestore:", error);
    return false;
  }
};

// LEADS SYNC
export const subscribeFirestoreLeads = (callback: (leads: LeadSubmission[]) => void) => {
  try {
    const q = collection(db, 'leads');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leads: LeadSubmission[] = [];
      snapshot.forEach(doc => {
        leads.push(doc.data() as LeadSubmission);
      });
      callback(leads);
    }, (error) => {
      console.error("Error in real-time leads listener:", error);
    });
    return unsubscribe;
  } catch (error) {
    console.error("Failed to subscribe to leads:", error);
    return () => {};
  }
};

export const fetchFirestoreLeads = async (): Promise<LeadSubmission[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'leads'));
    return querySnapshot.docs.map(doc => doc.data() as LeadSubmission);
  } catch (error) {
    console.error("Error fetching leads from Firestore:", error);
    return [];
  }
};

export const saveFirestoreLead = async (lead: LeadSubmission): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'leads', lead.id), lead);
    return true;
  } catch (error) {
    console.error("Error saving lead to Firestore:", error);
    return false;
  }
};

export const deleteFirestoreLead = async (leadId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'leads', leadId));
    return true;
  } catch (error) {
    console.error("Error deleting lead from Firestore:", error);
    return false;
  }
};

// ACCOUNTS SYNC
export const fetchFirestoreAccounts = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'accounts'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return [];
  }
};

export const getFirestoreAccount = async (identifier: string): Promise<any | null> => {
  try {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    
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
    
    return null;
  } catch (error) {
    console.error("Error getting firestore account:", error);
    return null;
  }
};

export const saveFirestoreAccount = async (account: any): Promise<boolean> => {
  try {
    if (!account) return false;
    const docId = (account.email ? account.email.toLowerCase().trim() : account.id);
    if (!docId) return false;
    await setDoc(doc(db, 'accounts', docId), {
      ...account,
      email: account.email ? account.email.toLowerCase().trim() : '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving account:", error);
    return false;
  }
};

// FAVORITES SYNC
export const saveUserFavorite = async (userId: string, propertyId: string) => {
  try {
    const docRef = doc(db, 'favorites', `${userId}_${propertyId}`);
    await setDoc(docRef, { userId, propertyId, createdAt: new Date() });
    return true;
  } catch (error) {
    console.error("Error saving favorite: ", error);
    return false;
  }
};

export const getUserFavorites = async (userId: string) => {
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data().propertyId);
  } catch (error) {
    console.error("Error getting favorites: ", error);
    return [];
  }
};
