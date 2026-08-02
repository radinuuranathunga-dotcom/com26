/**
 * firebaseConfig.js - Official Firebase Cloud Firestore Credentials
 * Computer Engineering Department Academic Records System
 */

// Production Firebase Project Configuration (com26-c48f0)
export const firebaseConfig = {
  apiKey: "AIzaSyAS17xEGn30HeICqSeNmalw9gbivJ7YVlw",
  authDomain: "com26-c48f0.firebaseapp.com",
  projectId: "com26-c48f0",
  storageBucket: "com26-c48f0.firebasestorage.app",
  messagingSenderId: "712028352621",
  appId: "1:712028352621:web:78a13864ff879f24784f64",
  measurementId: "G-Z7ECKN3280"
};

let db = null;
let isFirestoreConnected = false;

export function initFirebase() {
  try {
    if (typeof window !== 'undefined' && window.firebase) {
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(firebaseConfig);
      }
      db = window.firebase.firestore();
      isFirestoreConnected = true;
      console.log("🔥 Firebase Cloud Firestore initialized with project com26-c48f0.");
    }
  } catch (e) {
    console.warn("🔥 Firebase initialization note:", e);
    isFirestoreConnected = false;
  }
  return { db, isConnected: isFirestoreConnected };
}

export function getDb() {
  if (!db) {
    const res = initFirebase();
    db = res.db;
  }
  return db;
}
