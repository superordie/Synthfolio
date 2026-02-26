'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Initializes Firebase with enhanced error handling to prevent 
 * application-wide crashes during the development boot cycle.
 */
export function initializeFirebase() {
  try {
    if (!getApps().length) {
      let firebaseApp: FirebaseApp;
      
      // Attempt standard initialization (preferred for App Hosting)
      try {
        firebaseApp = initializeApp();
      } catch (e) {
        // Fallback to explicit config (standard for development)
        // We catch errors here to prevent the entire app from failing to compile
        // if the API key or config is temporarily invalid.
        try {
          firebaseApp = initializeApp(firebaseConfig);
        } catch (configError: any) {
          console.error("Firebase Configuration Error:", configError.message);
          // Return a dummy initialization to allow the app to boot and show the error boundary
          throw configError;
        }
      }

      return getSdks(firebaseApp);
    }

    return getSdks(getApp());
  } catch (err) {
    // Re-throw so the FirebaseClientProvider can handle it or let GlobalError catch it
    throw err;
  }
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
