import { initializeApp } from 'firebase/app';
import { 
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
  limit
} from 'firebase/firestore';
import { Property, UserProfile, Project } from '../types';
import { LeadSubmission } from '../utils/security';

const firebaseConfig = {
  apiKey: "AIzaSyAJx-9nbDWgUkABdgwjKuz554JTewboCP0",
  authDomain: "gen-lang-client-0202460050.firebaseapp.com",
  projectId: "gen-lang-client-0202460050",
  storageBucket: "gen-lang-client-0202460050.firebasestorage.app",
  messagingSenderId: "860963033562",
  appId: "1:860963033562:web:b9eb943d92fb7bfc1030e3"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// -------------------------------------------------------------
// 1. LEADS CAPTURE (Direct Cloud Firestore Writes)
// -------------------------------------------------------------
export const saveFirestoreLead = async (lead: LeadSubmission): Promise<boolean> => {
  try {
    const leadId = lead.id || `LEAD-${Date.now()}`;
    const docRef = doc(db, 'leads', leadId);
    await setDoc(docRef, {
      ...lead,
      id: leadId,
      createdAt: new Date().toISOString(),
      status: 'new'
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving lead to Firestore:", error);
    return false;
  }
};

export const fetchFirestoreLeads = async (): Promise<LeadSubmission[]> => {
  try {
    const colRef = collection(db, 'leads');
    const q = query(colRef, orderBy('timestamp', 'desc'), limit(100));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data() as LeadSubmission);
  } catch (error) {
    console.warn("Error fetching leads from Firestore:", error);
    return [];
  }
};

// -------------------------------------------------------------
// 2. USER ACCOUNTS & PROFILES
// -------------------------------------------------------------
export const saveFirestoreAccount = async (account: UserProfile): Promise<boolean> => {
  try {
    const docId = account.id || `USER-${Date.now()}`;
    const docRef = doc(db, 'users', docId);
    await setDoc(docRef, {
      ...account,
      id: docId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving account to Firestore:", error);
    return false;
  }
};

export const fetchFirestoreAccounts = async (): Promise<UserProfile[]> => {
  try {
    const colRef = collection(db, 'users');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(d => d.data() as UserProfile);
  } catch (error) {
    console.warn("Error fetching accounts from Firestore:", error);
    return [];
  }
};

export const getFirestoreAccount = async (idOrEmail: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', idOrEmail);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    // Query by email
    const q = query(collection(db, 'users'), where('email', '==', idOrEmail.toLowerCase().trim()), limit(1));
    const querySnap = await getDocs(q);
    if (!querySnap.empty) {
      return querySnap.docs[0].data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.warn("Error retrieving account:", error);
    return null;
  }
};

// -------------------------------------------------------------
// 3. PROPERTIES CRUD & CLOUD PERSISTENCE
// -------------------------------------------------------------
export const saveFirestoreProperty = async (property: Property): Promise<boolean> => {
  try {
    const docId = property.id || `prop-${Date.now()}`;
    const docRef = doc(db, 'properties', docId);
    await setDoc(docRef, {
      ...property,
      id: docId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving property to Firestore:", error);
    return false;
  }
};

export const fetchFirestoreProperties = async (): Promise<Property[]> => {
  try {
    const colRef = collection(db, 'properties');
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) return [];
    return snapshot.docs.map(d => d.data() as Property);
  } catch (error) {
    console.warn("Error fetching properties from Firestore:", error);
    return [];
  }
};

export const deleteFirestoreProperty = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, 'properties', id);
    await deleteDoc(docRef);
    // Write tombstone to prevent resync
    const tombRef = doc(db, 'deleted_properties', id);
    await setDoc(tombRef, { deletedAt: new Date().toISOString() });
    return true;
  } catch (error) {
    console.error("Error deleting property from Firestore:", error);
    return false;
  }
};

// -------------------------------------------------------------
// 4. PROJECTS CRUD
// -------------------------------------------------------------
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
