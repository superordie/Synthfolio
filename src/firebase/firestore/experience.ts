
'use client';

import {
  collection,
  addDoc,
  setDoc,
  deleteDoc,
  doc,
  writeBatch,
  type Firestore,
} from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { portfolioContent } from '@/lib/data';

export type Experience = {
  id: string;
  ownerId: string;
  jobTitleRole: string;
  organizationCompany: string;
  datesOfInvolvement: string;
  keyResponsibilities: string[];
};

export async function seedExperience(firestore: Firestore, userId: string) {
  const batch = writeBatch(firestore);
  const colRef = collection(firestore, 'experience');

  portfolioContent.workHistory.forEach((item) => {
    const docRef = doc(colRef);
    batch.set(docRef, { ...item, ownerId: userId });
  });

  await batch.commit();
}

export function addExperience(firestore: Firestore, userId: string, data: Omit<Experience, 'id' | 'ownerId'>) {
  const colRef = collection(firestore, 'experience');
  const newData = { ...data, ownerId: userId };

  addDoc(colRef, newData).catch(async () => {
    const error = new FirestorePermissionError({
      path: colRef.path,
      operation: 'create',
      requestResourceData: newData,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}

export function updateExperience(firestore: Firestore, id: string, data: Partial<Omit<Experience, 'id' | 'ownerId'>>) {
  const docRef = doc(firestore, 'experience', id);
  setDoc(docRef, data, { merge: true }).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: data,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}

export function deleteExperience(firestore: Firestore, id: string) {
  const docRef = doc(firestore, 'experience', id);
  deleteDoc(docRef).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'delete',
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}
