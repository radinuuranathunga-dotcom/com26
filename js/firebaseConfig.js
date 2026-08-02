/**
 * firebaseConfig.js - Firebase Cloud Firestore Configuration & Initialization
 * Computer Engineering Department Academic Records System
 */

// Default Firebase Project Configuration
// Replace keys with your own Firebase Console credentials (https://console.firebase.google.com/)
export const firebaseConfig = {
  apiKey: "AIzaSyDemoKey_ReplaceWithYourFirebaseApiKey",
  authDomain: "compeng-26th-batch.firebaseapp.com",
  projectId: "compeng-26th-batch",
  storageBucket: "compeng-26th-batch.appspot.com",
  messagingSenderId: "102938475610",
  appId: "1:102938475610:web:abcdef1234567890"
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
      console.log("🔥 Firebase Cloud Firestore initialized successfully.");
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
