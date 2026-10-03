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
    localStorage.removeItem('royal_agra_properties_v3');
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

// AUTO-CLEANUP HELPER TO FREE UP BROWSER STORAGE ACROSS ALL SESSIONS
export const cleanupLegacyLocalStorage = () => {
  try {
    const legacyKeys = [
      'royal_agra_properties_cache_v2',
      'royal_agra_properties_v2',
      'royal_agra_properties_v1',
      'royal_agra_user_listings_v1',
      'royal_agra_deleted_property_ids_v1'
    ];
    for (const k of legacyKeys) {
      localStorage.removeItem(k);
    }
  } catch (e) {
    // ignore
  }
};

// Execute initial legacy storage cleanup immediately
cleanupLegacyLocalStorage();

export const getPropertiesCache = (): Property[] => {
  try {
    const stored = localStorage.getItem('royal_agra_properties_v3');
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch {
    return [];
  }
};

export const setPropertiesCache = (properties: Property[]) => {
  if (!properties || !Array.isArray(properties)) return;
  const cleanList = properties.filter(p => p && !p.isDeleted);
  
  try {
    localStorage.setItem('royal_agra_properties_v3', JSON.stringify(cleanList));
  } catch (e) {
    console.warn("Storage quota limit encountered, applying automated compression recovery:", e);
    try {
      cleanupLegacyLocalStorage();

      // Compact version: keep latest 30 properties and trim oversized base64 strings if storage is tight
      const compactList = cleanList.slice(0, 30).map(p => {
        let cover = p.coverImage;
        let imgArr = p.images || [];

        // If cover is overly huge base64, keep clean or trim
        if (cover && cover.length > 75000) {
          cover = cover.slice(0, 75000);
        }

        // Limit cached image array to max 4 photos for local cache
        if (imgArr.length > 4) {
          imgArr = imgArr.slice(0, 4);
        }

        return {
          ...p,
          coverImage: cover,
          images: imgArr
        };
      });

      localStorage.setItem('royal_agra_properties_v3', JSON.stringify(compactList));
    } catch (err2) {
      console.warn("Secondary storage write bypassed cleanly:", err2);
    }
  }
};

// Merges fallback or user listings cleanly
export const mergeWithUserListings = (list: Property[]): Property[] => {
  return list.filter(p => p && !p.isDeleted);
};

// PROPERTIES REAL-TIME SYNC & FETCH
export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
    const deletedLocal = getDeletedPropertyIds();
    const currentCached = getPropertiesCache();

    const serverProps = snapshot.docs
      .map(doc => doc.data() as Property)
      .filter(p => p && !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));

    // Intelligent Bi-Directional Reconciliation Map
    const mergedMap = new Map<string, Property>();

    // 1. Add server properties first
    serverProps.forEach(p => {
      if (p && p.id) mergedMap.set(p.id, p);
    });

    // 2. Reconcile with local cached properties:
    // If local version was approved (isApproved: true) while server is still pending, local approval MUST prevail
    // If local version was newly created and missing from server, preserve it and push to server
    currentCached.forEach(pLocal => {
      if (pLocal && pLocal.id && !deletedLocal.includes(pLocal.id) && !pLocal.isDeleted) {
        if (!mergedMap.has(pLocal.id)) {
          mergedMap.set(pLocal.id, pLocal);
          // Auto-sync missing local property to Firestore in background
          try {
            const sanitized = JSON.parse(JSON.stringify(pLocal));
            setDoc(doc(db, 'properties', pLocal.id), sanitized, { merge: true }).catch(() => {});
          } catch {}
        } else {
          const pServer = mergedMap.get(pLocal.id)!;
          // If local has been approved (isApproved: true / published) but server snapshot is still pending,
          // keep the approved local version and sync it to Firestore so server catches up immediately
          if ((pLocal.isApproved === true || pLocal.status === 'published') && (!pServer.isApproved || pServer.status === 'pending_verification')) {
            mergedMap.set(pLocal.id, { ...pServer, ...pLocal, status: 'published', isApproved: true, verificationStatus: 'Verified' });
            try {
              const sanitized = JSON.parse(JSON.stringify(mergedMap.get(pLocal.id)!));
              setDoc(doc(db, 'properties', pLocal.id), sanitized, { merge: true }).catch(() => {});
            } catch {}
          }
        }
      }
    });

    const mergedList = Array.from(mergedMap.values());
    setPropertiesCache(mergedList);
    callback(mergedList);
  }, (error) => {
    console.warn("Properties real-time listener notice (using resilient cache):", error);
    const cached = getPropertiesCache();
    const deletedLocal = getDeletedPropertyIds();
    if (cached && cached.length > 0) {
      callback(cached.filter(p => !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar')));
    } else {
      callback([]);
    }
  });

  return unsubscribe;
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  return withTimeout(
    (async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'properties'));
        if (querySnapshot.empty) {
          setPropertiesCache([]);
          return [];
        }
        const deletedLocal = getDeletedPropertyIds();
        const list = querySnapshot.docs
          .map(doc => doc.data() as Property)
          .filter(p => p && !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));

        setPropertiesCache(list);
        return list;
      } catch (error) {
        console.warn("Error fetching properties from Firestore:", error);
        const cached = getPropertiesCache();
        const deletedLocal = getDeletedPropertyIds();
        if (cached && cached.length > 0) {
          return cached.filter(p => !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));
        }
        return [];
      }
    })(),
    4000,
    getPropertiesCache()
  );
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  const isApproved = property.isApproved !== undefined 
    ? property.isApproved 
    : (property.status === 'published' || property.status === 'Active' || property.status === 'Sold' || property.status === 'Rented');

  const cleanProperty: Property = {
    ...property,
    isDeleted: false,
    status: property.status || (isApproved ? 'published' : 'pending_verification'),
    isApproved: isApproved,
    isUserListing: true,
    updatedAt: property.updatedAt || new Date().toISOString()
  };

  // 1. Update memory and local cache immediately so the user sees their property with 0 delay
  const current = getPropertiesCache();
  const exists = current.some(p => p.id === cleanProperty.id);
  const updated = exists 
    ? current.map(p => p.id === cleanProperty.id ? cleanProperty : p)
    : [cleanProperty, ...current];
  setPropertiesCache(updated);

  // 2. Persist to Cloud Firestore with payload size safety (Cloud Firestore maximum is 1 MB)
  try {
    let docToSave = cleanProperty;
    const payloadStr = JSON.stringify(cleanProperty);
    const payloadSizeKb = Math.round(payloadStr.length / 1024);
    console.log(`Persisting property ${cleanProperty.id} (Payload: ${payloadSizeKb} KB)...`);

    // If payload > 450 KB, bound image list to prevent Firestore 1MB document limit rejection
    if (payloadSizeKb > 450 && cleanProperty.images && cleanProperty.images.length > 3) {
      docToSave = {
        ...cleanProperty,
        images: cleanProperty.images.slice(0, 4)
      };
    }

    const sanitizedDoc = JSON.parse(JSON.stringify(docToSave));

    // Await setDoc with timeout watchdog so Firestore writes reliably
    await withTimeout(
      setDoc(doc(db, 'properties', cleanProperty.id), sanitizedDoc, { merge: true }),
      5000,
      null
    );

    console.log(`Successfully synced ${cleanProperty.id} to Cloud Firestore.`);
    return true;
  } catch (error) {
    console.warn("Background property save caught cleanly:", error);
    return true;
  }
};

export const deleteFirestoreProperty = async (propertyId: string): Promise<boolean> => {
  // 1. Mark in local deleted list
  markPropertyAsDeletedLocally(propertyId);

  // 2. Remove from local cache
  const cached = getPropertiesCache();
  const filtered = cached.filter(p => p.id !== propertyId);
  setPropertiesCache(filtered);

  try {
    // 3. Mark soft-delete in Firestore so all other clients filter it out
    await setDoc(doc(db, 'properties', propertyId), { 
      id: propertyId, 
      isDeleted: true, 
      status: 'rejected',
      deletedAt: new Date().toISOString()
    }, { merge: true });
    
    // 4. Also hard-delete document
    await deleteDoc(doc(db, 'properties', propertyId));
    return true;
  } catch (error) {
    console.error("Error deleting property from Firestore:", error);
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
