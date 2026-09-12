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
  try {
    const cleanList = properties.filter(p => p && !p.isDeleted);
    localStorage.setItem('royal_agra_properties_v3', JSON.stringify(cleanList));
  } catch (e) {
    // ignore
  }
};

// Merges fallback or user listings cleanly
export const mergeWithUserListings = (list: Property[]): Property[] => {
  return list.filter(p => p && !p.isDeleted);
};

// PROPERTIES REAL-TIME SYNC & FETCH
export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'properties'), (snapshot) => {
    if (snapshot.empty) {
      setPropertiesCache([]);
      callback([]);
    } else {
      const deletedLocal = getDeletedPropertyIds();
      const activeProps = snapshot.docs
        .map(doc => doc.data() as Property)
        .filter(p => p && !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));
      
      setPropertiesCache(activeProps);
      callback(activeProps);
    }
  }, (error) => {
    console.error("Error in properties real-time listener, falling back to cache:", error);
    const cached = getPropertiesCache();
    const deletedLocal = getDeletedPropertyIds();
    if (cached) {
      callback(cached.filter(p => !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar')));
    } else {
      callback([]);
    }
  });

  return unsubscribe;
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
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
    console.error("Error fetching properties from Firestore:", error);
    const cached = getPropertiesCache();
    const deletedLocal = getDeletedPropertyIds();
    if (cached) {
      return cached.filter(p => !p.isDeleted && !deletedLocal.includes(p.id) && p.id !== 'prop-harish-nagar-89' && !p.title?.toLowerCase().includes('harish nagar'));
    }
    return [];
  }
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  const cleanProperty: Property = {
    ...property,
    isDeleted: false,
    isUserListing: true
  };

  // Update memory/local cache
  const current = getPropertiesCache();
  const exists = current.some(p => p.id === cleanProperty.id);
  const updated = exists 
    ? current.map(p => p.id === cleanProperty.id ? cleanProperty : p)
    : [cleanProperty, ...current];
  setPropertiesCache(updated);

  try {
    const payloadStr = JSON.stringify(cleanProperty);
    const payloadSizeKb = Math.round(payloadStr.length / 1024);
    console.log(`Saving property ${cleanProperty.id} to Firestore (Payload: ${payloadSizeKb} KB)...`);

    // Persist to Cloud Firestore so all other browsers/devices receive it instantly
    await setDoc(doc(db, 'properties', cleanProperty.id), cleanProperty);
    console.log(`Successfully persisted ${cleanProperty.id} to Firestore.`);
    return true;
  } catch (error) {
    console.error("Error saving property to Firestore:", error);
    return false;
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
