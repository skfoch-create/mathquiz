import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, addDoc } from 'firebase/firestore';

// env 따옴표 제거 및 안전 파싱 함수
const cleanEnv = (val: string | undefined) => {
  if (!val) return '';
  return val.replace(/^["']|["']$/g, '').trim();
};

const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID)
};

export const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app: any;
let auth: any;
let db: any;
let googleProvider: any;

try {
  if (isFirebaseConfigured) {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
  }
} catch (e) {
  console.warn("Firebase initialization warning fallback to local mode:", e);
}

export { auth, db, googleProvider, signInWithPopup, signInAnonymously, firebaseSignOut };
export { collection, doc, setDoc, getDoc, getDocs, query, orderBy, limit, addDoc };
