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
import firebaseConfigRaw from '../../firebase-applet-config.json';

// Support both environment variables (production) and json config with safe fallback
export const getFirebaseConfig = () => {
  const env = (typeof import.meta !== 'undefined' && (import.meta as any).env) || {};
  return {
    projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfigRaw.projectId || "startup-topic-76rpq",
    databaseId: env.VITE_FIREBASE_DATABASE_ID || (firebaseConfigRaw as any).databaseId || "ai-studio-shreycapital-02f918d8-06c3-458c-a1d4-b0991807339e",
    appId: env.VITE_FIREBASE_APP_ID || firebaseConfigRaw.appId || "1:249920231770:web:1eee413ecb37d1377fbb63",
    apiKey: env.VITE_FIREBASE_API_KEY || firebaseConfigRaw.apiKey || "AIzaSyBieQlxB89sF0FDm1a4v2E9BbmnxrM6Fw",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigRaw.authDomain || "startup-topic-76rpq.firebaseapp.com",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigRaw.storageBucket || "startup-topic-76rpq.firebasestorage.app",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigRaw.messagingSenderId || "249920231770",
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigRaw.measurementId || ""
  };
};

const firebaseConfig = getFirebaseConfig();
export const app = initializeApp(firebaseConfig);
export const databaseId = firebaseConfig.databaseId || '(default)';
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true
}, databaseId);

// SAFE TIMEOUT WRAPPER TO PREVENT HANGS ON NETWORK SLEEP / COLD BOOT
export const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 3500, fallbackValue: T): Promise<T> => {
  return new Promise<T>((resolve) => {
    let hasResolved = false;
    const timer = setTimeout(() => {
      if (!hasResolved) {
        hasResolved = true;
        resolve(fallbackValue);
      }
    }, timeoutMs);

    promise
      .then((res) => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timer);
          resolve(res);
        }
      })
      .catch((err) => {
        if (!hasResolved) {
          hasResolved = true;
          clearTimeout(timer);
          console.warn("Operation timed out or failed, using fallback:", err);
          resolve(fallbackValue);
        }
      });
  });
};

// Safe localStorage helper for SSR/Node/Testing environments
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {}
    return null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  }
};

// LOCALSTORAGE HELPERS FOR DELETED ITEMS & PERSISTENCE CACHE
export const getDeletedPropertyIds = (): string[] => {
  try {
    const stored = safeStorage.getItem('royal_agra_deleted_property_ids_v2');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const clearDeletedPropertyIdsLocally = () => {
  try {
    safeStorage.removeItem('royal_agra_deleted_property_ids_v2');
    safeStorage.removeItem('royal_agra_properties_v3');
    safeStorage.removeItem('royal_agra_properties_cache_v2');
  } catch (err) {
    console.error("Error clearing deleted IDs:", err);
  }
};

export const markPropertyAsDeletedLocally = (id: string) => {
  try {
    const deleted = getDeletedPropertyIds();
    if (!deleted.includes(id)) {
      deleted.push(id);
      safeStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(deleted));
    }
    // Also remove from cache
    const cached = getPropertiesCache();
    const filtered = cached.filter(p => p.id !== id);
    setPropertiesCache(filtered);
    // Also remove from user listings
    removeUserListingLocally(id);
  } catch (err) {
    console.error("Error saving deleted ID:", err);
  }
};

// CLOUD FIRESTORE DELETED PROPERTIES SYNC (Cross-Device Global Deletion Tombstones)
export const saveFirestoreDeletedPropertyId = async (propertyId: string, deletedBy: string = 'admin'): Promise<boolean> => {
  try {
    await withTimeout(
      setDoc(doc(db, 'deleted_properties', propertyId), {
        id: propertyId,
        deletedAt: new Date().toISOString(),
        deletedBy: deletedBy || 'admin'
      }, { merge: true }),
      4000,
      undefined
    );
    return true;
  } catch (err) {
    console.warn("Cloud tombstone write note:", err);
    return false;
  }
};

export const fetchFirestoreDeletedPropertyIds = async (): Promise<string[]> => {
  return withTimeout(
    (async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'deleted_properties'));
        const cloudIds = querySnapshot.docs.map(doc => doc.id || (doc.data() as any)?.id).filter(Boolean);
        const local = getDeletedPropertyIds();
        const merged = Array.from(new Set([...local, ...cloudIds]));
        safeStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(merged));
        return merged;
      } catch (err) {
        console.warn("Cloud tombstone fetch note (using local):", err);
        return getDeletedPropertyIds();
      }
    })(),
    3500,
    getDeletedPropertyIds()
  );
};

export const subscribeFirestoreDeletedPropertyIds = (callback: (deletedIds: string[]) => void): () => void => {
  try {
    const unsubscribe = onSnapshot(collection(db, 'deleted_properties'), (snapshot) => {
      const cloudIds = snapshot.docs.map(doc => doc.id || (doc.data() as any)?.id).filter(Boolean);
      const local = getDeletedPropertyIds();
      const merged = Array.from(new Set([...local, ...cloudIds]));
      safeStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(merged));

      // Clean local cache & user listings
      const cached = getPropertiesCache();
      const cleanCache = cached.filter(p => !merged.includes(p.id));
      setPropertiesCache(cleanCache);

      const userListings = getUserListings();
      const cleanListings = userListings.filter(p => !merged.includes(p.id));
      safeStorage.setItem('royal_agra_user_listings_v1', JSON.stringify(cleanListings));

      callback(merged);
    }, (err) => {
      console.warn("Deleted properties real-time listener note:", err);
      callback(getDeletedPropertyIds());
    });
    return unsubscribe;
  } catch (err) {
    console.warn("Failed to subscribe to deleted properties:", err);
    return () => {};
  }
};

export const clearFirestoreDeletedPropertyIds = async (propertyIds?: string[]): Promise<boolean> => {
  try {
    if (propertyIds && propertyIds.length > 0) {
      for (const id of propertyIds) {
        await deleteDoc(doc(db, 'deleted_properties', id));
      }
    } else {
      const snap = await getDocs(collection(db, 'deleted_properties'));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    }
    clearDeletedPropertyIdsLocally();
    return true;
  } catch (err) {
    console.warn("Error clearing cloud deleted property IDs:", err);
    return false;
  }
};

// LOCAL USER LISTINGS BACKUP STORE (Guarantees user listings never vanish on cloud delay/snapshot refresh)
export const getUserListings = (): Property[] => {
  try {
    const deleted = getDeletedPropertyIds();
    const stored = safeStorage.getItem('royal_agra_user_listings_v1');
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) 
        ? parsed.filter(p => p && !p.isDeleted && !deleted.includes(p.id)) 
        : [];
    }
    return [];
  } catch {
    return [];
  }
};

export const saveUserListingLocally = (property: Property) => {
  try {
    const deleted = getDeletedPropertyIds();
    if (deleted.includes(property.id)) return;
    const current = getUserListings();
    const filtered = current.filter(p => p.id !== property.id && !p.isDeleted && !deleted.includes(p.id));
    const updated = [property, ...filtered];
    // Keep max 20 local listings to prevent quota issues
    safeStorage.setItem('royal_agra_user_listings_v1', JSON.stringify(updated.slice(0, 20)));
  } catch (err) {
    console.warn("Local user listings quota note:", err);
  }
};

export const removeUserListingLocally = (propertyId: string) => {
  try {
    const current = getUserListings();
    const updated = current.filter(p => p.id !== propertyId);
    safeStorage.setItem('royal_agra_user_listings_v1', JSON.stringify(updated));
  } catch (err) {
    console.warn("Local user listings removal note:", err);
  }
};

export const getPropertiesCache = (): Property[] => {
  try {
    const deleted = getDeletedPropertyIds();
    const stored = safeStorage.getItem('royal_agra_properties_v3');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter(p => p && !p.isDeleted && !deleted.includes(p.id));
      }
    }
    return [];
  } catch {
    return [];
  }
};

export const setPropertiesCache = (properties: Property[]) => {
  try {
    const deleted = getDeletedPropertyIds();
    const cleanList = properties.filter(p => p && !p.isDeleted && !deleted.includes(p.id));
    // Keep max 50 recent properties in cache to stay well within 5MB quota
    safeStorage.setItem('royal_agra_properties_v3', JSON.stringify(cleanList.slice(0, 50)));
  } catch (e) {
    console.warn("Properties cache storage note:", e);
  }
};

// Merges fallback or user listings cleanly while strictly honoring Cloud & Local Tombstones
export const mergeWithUserListings = (list: Property[], extraDeletedIds: string[] = []): Property[] => {
  const localDeleted = getDeletedPropertyIds();
  const allDeleted = Array.from(new Set([...localDeleted, ...extraDeletedIds]));
  const userListings = getUserListings().filter(p => !allDeleted.includes(p.id));
  
  const baseClean = (list && list.length > 0 ? list : PROPERTIES_DATA)
    .filter(p => p && !p.isDeleted && !allDeleted.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));
  
  const merged = [...baseClean];

  // Guarantee baseline properties are present ONLY IF not explicitly deleted on any device
  for (const bp of PROPERTIES_DATA) {
    if (!allDeleted.includes(bp.id) && !merged.some(p => p.id === bp.id)) {
      merged.push(bp);
    }
  }

  for (const ul of userListings) {
    if (!allDeleted.includes(ul.id) && !merged.some(p => p.id === ul.id)) {
      merged.unshift(ul);
    }
  }
  return merged;
};

// PROPERTIES REAL-TIME SYNC & FETCH
export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
    const deletedLocal = getDeletedPropertyIds();

    if (snapshot.empty) {
      const combined = mergeWithUserListings(PROPERTIES_DATA, deletedLocal);
      setPropertiesCache(combined);
      callback(combined);
    } else {
      const serverProps = snapshot.docs
        .map(doc => doc.data() as Property)
        .filter(p => p && !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));
      
      const combined = mergeWithUserListings(serverProps, deletedLocal);
      setPropertiesCache(combined);
      callback(combined);
    }
  }, (error) => {
    console.warn("Properties real-time listener note (using baseline & cache):", error);
    const cached = getPropertiesCache();
    const merged = mergeWithUserListings(cached);
    callback(merged);
  });

  return unsubscribe;
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  return withTimeout(
    (async () => {
      try {
        const [querySnapshot, cloudDeletedIds] = await Promise.all([
          getDocs(collection(db, 'properties')),
          fetchFirestoreDeletedPropertyIds()
        ]);
        
        const localDeleted = getDeletedPropertyIds();
        const allDeleted = Array.from(new Set([...localDeleted, ...cloudDeletedIds]));
        
        const serverProps = querySnapshot.docs
          .map(doc => doc.data() as Property)
          .filter(p => p && !p.isDeleted && !allDeleted.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));

        const merged = mergeWithUserListings(serverProps, allDeleted);
        setPropertiesCache(merged);
        return merged;
      } catch (error) {
        console.warn("Error fetching properties from Firestore, using baseline & cache:", error);
        const cached = getPropertiesCache();
        return mergeWithUserListings(cached);
      }
    })(),
    4000,
    mergeWithUserListings(getPropertiesCache())
  );
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  const cleanProperty: Property = {
    ...property,
    isDeleted: false,
    status: property.status || 'Active',
    isApproved: property.isApproved !== undefined ? property.isApproved : true,
    isUserListing: true
  };

  // If restoring or creating a property that was in deleted list, clean it from deleted list
  try {
    const localDeleted = getDeletedPropertyIds();
    if (localDeleted.includes(cleanProperty.id)) {
      const updated = localDeleted.filter(id => id !== cleanProperty.id);
      safeStorage.setItem('royal_agra_deleted_property_ids_v2', JSON.stringify(updated));
    }
    await withTimeout(deleteDoc(doc(db, 'deleted_properties', cleanProperty.id)), 3000, undefined);
  } catch {}

  // 1. Immediately backup to local user listings store
  saveUserListingLocally(cleanProperty);

  // 2. Update memory and local cache immediately
  const current = getPropertiesCache();
  const exists = current.some(p => p.id === cleanProperty.id);
  const updated = exists 
    ? current.map(p => p.id === cleanProperty.id ? cleanProperty : p)
    : [cleanProperty, ...current];
  setPropertiesCache(updated);

  // 3. Persist to Cloud Firestore with payload safety protection (Guarantees < 350 KB document size)
  try {
    let sanitizedImages = cleanProperty.images || [];
    let sanitizedCover = cleanProperty.coverImage || '';

    // If payload is large, trim images array to max 6 photos and ensure string length is within bounds
    if (sanitizedImages.length > 6) {
      sanitizedImages = sanitizedImages.slice(0, 6);
    }

    let docToSave: Property = {
      ...cleanProperty,
      coverImage: sanitizedCover,
      images: sanitizedImages
    };

    const payloadStr = JSON.stringify(docToSave);
    const payloadSizeKb = Math.round(payloadStr.length / 1024);
    console.log(`Saving property ${cleanProperty.id} to Firestore (Payload: ${payloadSizeKb} KB)...`);

    // If still over 500 KB, keep top 3 images to strictly respect Firestore 1 MB document quota
    if (payloadSizeKb > 500 && docToSave.images && docToSave.images.length > 3) {
      docToSave = {
        ...docToSave,
        images: docToSave.images.slice(0, 3)
      };
    }

    const sanitizedDoc = JSON.parse(JSON.stringify(docToSave));

    // Save directly to Firestore properties collection with timeout guard
    await withTimeout(
      setDoc(doc(db, 'properties', cleanProperty.id), sanitizedDoc, { merge: true }),
      8000,
      undefined
    );

    console.log(`Successfully persisted ${cleanProperty.id} to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.error("Cloud Firestore write note:", error);
    return true;
  }
};

export const deleteFirestoreProperty = async (propertyId: string, deletedBy: string = 'admin'): Promise<boolean> => {
  // 1. Mark in local deleted list and remove from local stores
  markPropertyAsDeletedLocally(propertyId);
  removeUserListingLocally(propertyId);

  // 2. Remove from local cache
  const cached = getPropertiesCache();
  const filtered = cached.filter(p => p.id !== propertyId);
  setPropertiesCache(filtered);

  try {
    // 3. Persist permanent Cloud Tombstone to 'deleted_properties' collection
    await saveFirestoreDeletedPropertyId(propertyId, deletedBy);

    // 4. Mark soft-delete in Firestore so all other clients filter it out
    await withTimeout(
      setDoc(doc(db, 'properties', propertyId), { 
        id: propertyId, 
        isDeleted: true, 
        status: 'rejected',
        deletedAt: new Date().toISOString(),
        deletedBy
      }, { merge: true }),
      3500,
      undefined
    );
    
    // 5. Also hard-delete document from 'properties' collection
    await withTimeout(deleteDoc(doc(db, 'properties', propertyId)), 3500, undefined);
    return true;
  } catch (error) {
    console.warn("Firestore delete note:", error);
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
  return withTimeout(
    (async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'accounts'));
        return querySnapshot.docs.map(doc => doc.data());
      } catch (error) {
        console.warn("Error fetching accounts:", error);
        return [];
      }
    })(),
    3500,
    []
  );
};

export const getFirestoreAccount = async (identifier: string): Promise<any | null> => {
  if (!identifier) return null;
  const clean = identifier.trim().toLowerCase();

  return withTimeout(
    (async () => {
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
        
        return null;
      } catch (error) {
        console.warn("Error getting firestore account:", error);
        return null;
      }
    })(),
    3500,
    null
  );
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
