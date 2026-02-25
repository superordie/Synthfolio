'use client';

import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';
import type { ReactNode } from 'react';

// This provider ensures that Firebase is only initialized once on the client
// and that the firebase instances are available to all child components.
export function FirebaseClientProvider({ children }: { children: ReactNode }) {
  const { app, auth, firestore } = initializeFirebase();

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
