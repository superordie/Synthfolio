import { getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// Memoize Firebase instances to avoid re-initialization
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  if (!firebaseApp) {
    const apps = getApps();
    if (apps.length > 0) {
      firebaseApp = apps[0];
    } else {
      if (!firebaseConfig.projectId) {
        throw new Error(
          'Firebase config is not set. Please provision a Firebase project.'
        );
      }
      firebaseApp = initializeApp(firebaseConfig);
    }
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }

  return { app: firebaseApp, auth, firestore };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
