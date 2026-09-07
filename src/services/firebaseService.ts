import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
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
const db = getFirestore(app);

// PROPERTIES REAL-TIME SYNC & FETCH
export const subscribeFirestoreProperties = (callback: (properties: Property[]) => void) => {
  const unsubscribe = onSnapshot(collection(db, 'properties'), async (snapshot) => {
    if (snapshot.empty) {
      // Seed initial mock properties if empty
      const seeded = PROPERTIES_DATA.map((p, idx) => ({
        ...p,
        status: p.status || (idx === 3 ? 'Sold' : 'published'),
        isUserListing: idx === 0 || idx === 2,
        ownerId: (idx === 0 || idx === 2) ? 'RAE-OWNER-01' : undefined,
        ownerName: (idx === 0 || idx === 2) ? 'Shrey Gupta' : p.agent?.name || 'Managing Partner'
      }));
      for (const prop of seeded) {
        await setDoc(doc(db, 'properties', prop.id), prop);
      }
      callback(seeded);
    } else {
      const props = snapshot.docs.map(doc => doc.data() as Property);
      callback(props);
    }
  }, (error) => {
    console.error("Error in properties real-time listener:", error);
  });

  return unsubscribe;
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'properties'));
    if (querySnapshot.empty) {
      const seeded = PROPERTIES_DATA.map((p, idx) => ({
        ...p,
        status: p.status || (idx === 3 ? 'Sold' : 'published'),
        isUserListing: idx === 0 || idx === 2,
        ownerId: (idx === 0 || idx === 2) ? 'RAE-OWNER-01' : undefined,
        ownerName: (idx === 0 || idx === 2) ? 'Shrey Gupta' : p.agent?.name || 'Managing Partner'
      }));
      for (const prop of seeded) {
        await setDoc(doc(db, 'properties', prop.id), prop);
      }
      return seeded;
    }
    return querySnapshot.docs.map(doc => doc.data() as Property);
  } catch (error) {
    console.error("Error fetching properties from Firestore:", error);
    return PROPERTIES_DATA as Property[];
  }
};

export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'properties', property.id), property);
    return true;
  } catch (error) {
    console.error("Error saving property to Firestore:", error);
    return false;
  }
};

export const deleteFirestoreProperty = async (propertyId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'properties', propertyId));
    return true;
  } catch (error) {
    console.error("Error deleting property from Firestore:", error);
    return false;
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

export const saveFirestoreAccount = async (account: any): Promise<boolean> => {
  try {
    await setDoc(doc(db, 'accounts', account.email || account.id), account);
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
