import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJx-9nbDWgUkABdgwjKuz554JTewboCP0",
  authDomain: "gen-lang-client-0202460050.firebaseapp.com",
  projectId: "gen-lang-client-0202460050",
  storageBucket: "gen-lang-client-0202460050.firebasestorage.app",
  messagingSenderId: "860963033562",
  appId: "1:860963033562:web:b9eb943d92fb7bfc1030e3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
