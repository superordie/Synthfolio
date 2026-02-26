'use client';

import React, { useMemo, useState, useEffect, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

/**
 * Wraps the application in the FirebaseProvider on the client.
 * Handles initialization errors gracefully to avoid blocking the main thread.
 */
export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [initError, setInitError] = useState<Error | null>(null);

  const firebaseServices = useMemo(() => {
    try {
      return initializeFirebase();
    } catch (err: any) {
      console.error("Firebase Client Initialization Failed:", err);
      setInitError(err);
      return null;
    }
  }, []);

  // If initialization failed completely, we throw the error so the GlobalError boundary can catch it.
  // This is better than a blank screen or a Turbopack manifest hang.
  if (initError) {
    throw initError;
  }

  // If services aren't ready yet, don't render children to avoid 'useFirebase' context errors.
  if (!firebaseServices) {
    return null; 
  }

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
