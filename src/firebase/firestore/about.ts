
'use client';

import { doc, setDoc, onSnapshot, type Firestore } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';

export function updateAbout(firestore: Firestore, userId: string, aboutText: string) {
  const docRef = doc(firestore, 'users', userId, 'portfolio', 'bio');
  
  setDoc(docRef, { about: aboutText }, { merge: true })
    .catch(async () => {
      const error = new FirestorePermissionError({
        path: docRef.path,
        operation: 'update',
        requestResourceData: { about: aboutText },
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', error);
    });
}
