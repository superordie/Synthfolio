'use client';

import { doc, setDoc, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

/**
 * Updates the user's bio/about section in Firestore.
 */
export function updateAbout(firestore: Firestore, userId: string, aboutText: string) {
  const docRef = doc(firestore, 'users', userId, 'portfolio', 'bio');
  
  // Initiate the write operation immediately (non-blocking)
  setDoc(docRef, { about: aboutText, updatedAt: new Date().toISOString() }, { merge: true })
    .catch(async () => {
      // Catch and emit permission errors for the Admin loop
      const error = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { about: aboutText },
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', error);
    });
}
