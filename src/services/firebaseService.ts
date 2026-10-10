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

// -------------------------------------------------------------
// 1. LEADS CAPTURE & REAL-TIME CRM STREAM
// -------------------------------------------------------------
export const saveFirestoreLead = async (lead: LeadSubmission): Promise<boolean> => {
  try {
    const leadId = lead.id || `LEAD-${Date.now()}`;
    const docRef = doc(db, 'leads', leadId);
    await setDoc(docRef, {
      ...lead,
      id: leadId,
      createdAt: lead.createdAt || new Date().toISOString(),
      timestamp: lead.timestamp || new Date().toLocaleString(),
      status: lead.status || 'new'
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving lead to Firestore:", error);
    return false;
  }
};

export const subscribeFirestoreLeads = (callback: (leads: LeadSubmission[]) => void): () => void => {
  try {
    const colRef = collection(db, 'leads');
    const q = query(colRef, limit(100));
    return onSnapshot(q, (snapshot) => {
      const leads = snapshot.docs.map(d => d.data() as LeadSubmission);
      leads.sort((a, b) => {
        const timeA = new Date(a.createdAt || a.timestamp || 0).getTime();
        const timeB = new Date(b.createdAt || b.timestamp || 0).getTime();
        return timeB - timeA;
      });
      callback(leads);
    }, (error) => {
      console.warn("Error in real-time leads listener:", error);
    });
  } catch (error) {
    console.warn("Failed to subscribe to leads:", error);
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
    const unsubscribe = onSnapshot(collection(db, 'accounts'), (snapshot) => {
      const accounts = snapshot.docs.map(doc => doc.data());
      callback(accounts);
    }, (error) => {
      console.warn("Error in real-time accounts listener:", error);
    });
    return unsubscribe;
  } catch (error) {
    console.warn("Failed to subscribe to accounts:", error);
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

export const deleteFirestoreAccount = async (accountEmailOrId: string): Promise<boolean> => {
  try {
    if (!accountEmailOrId) return false;
    const docId = accountEmailOrId.trim().toLowerCase();
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
export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void): () => void => {
  try {
    const unsub = onSnapshot(collection(db, 'properties'), async (snapshot) => {
      try {
        let deletedIds = new Set<string>();
        try {
          const tombSnap = await getDocs(collection(db, 'deleted_properties'));
          deletedIds = new Set(tombSnap.docs.map(d => d.id));
        } catch (e) {
          console.warn("Error fetching deleted properties tombstone:", e);
        }

        const activeProps: Property[] = [];
        snapshot.docs.forEach(docSnap => {
          if (!deletedIds.has(docSnap.id)) {
            activeProps.push(docSnap.data() as Property);
          }
        });
        callback(activeProps);
      } catch (err) {
        console.warn("Error processing properties real-time snapshot:", err);
      }
    }, (error) => {
      console.warn("Error in properties real-time listener:", error);
    });
    return unsub;
  } catch (error) {
    console.warn("Failed to subscribe to properties:", error);
    return () => {};
  }
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  try {
    const colRef = collection(db, 'properties');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];

    let deletedIds = new Set<string>();
    try {
      const tombSnap = await getDocs(collection(db, 'deleted_properties'));
      deletedIds = new Set(tombSnap.docs.map(d => d.id));
    } catch {}

    return snapshot.docs
      .filter(d => !deletedIds.has(d.id))
      .map(d => d.data() as Property);
  } catch (error) {
    console.warn("Error fetching properties from Firestore:", error);
    return [];
  }
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  try {
    const docId = property.id || `prop-${Date.now()}`;
    const docRef = doc(db, 'properties', docId);
    await setDoc(docRef, {
      ...property,
      id: docId,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Clean up any old tombstone if property is re-added
    try {
      await deleteDoc(doc(db, 'deleted_properties', docId));
    } catch {}

    return true;
  } catch (error) {
    console.error("Error saving property to Firestore:", error);
    return false;
  }
};

export const deleteFirestoreProperty = async (id: string): Promise<boolean> => {
  try {
    if (!id) return false;
    const docRef = doc(db, 'properties', id);
    await deleteDoc(docRef);
    // Write tombstone to prevent resync
    const tombRef = doc(db, 'deleted_properties', id);
    await setDoc(tombRef, { id, deletedAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("Error deleting property from Firestore:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 4. PROJECTS REAL-TIME SYNC & CMS
// -------------------------------------------------------------
export const subscribeFirestoreProjects = (callback: (projects: Project[]) => void): () => void => {
  try {
    return onSnapshot(collection(db, 'projects'), (snapshot) => {
      if (!snapshot.empty) {
        callback(snapshot.docs.map(d => d.data() as Project));
      }
    }, (error) => {
      console.warn("Error in projects real-time listener:", error);
    });
  } catch (error) {
    console.warn("Failed to subscribe to projects:", error);
    return () => {};
  }
};

export const fetchFirestoreProjects = async (): Promise<Project[]> => {
  try {
    const colRef = collection(db, 'projects');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => d.data() as Project);
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
    await deleteDoc(doc(db, 'projects', id));
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
