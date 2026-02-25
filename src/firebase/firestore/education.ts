
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

export type Education = {
  id: string;
  ownerId: string;
  degreeProgramName: string;
  institutionName: string;
  completionDate: string;
  relevantCourseworkOrFocusAreas?: string[];
};

export async function seedEducation(firestore: Firestore, userId: string) {
  const batch = writeBatch(firestore);
  const colRef = collection(firestore, 'education');

  portfolioContent.education.forEach((item) => {
    const docRef = doc(colRef);
    batch.set(docRef, { ...item, ownerId: userId });
  });

  await batch.commit();
}

export function addEducation(firestore: Firestore, userId: string, data: Omit<Education, 'id' | 'ownerId'>) {
  const colRef = collection(firestore, 'education');
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

export function updateEducation(firestore: Firestore, id: string, data: Partial<Omit<Education, 'id' | 'ownerId'>>) {
  const docRef = doc(firestore, 'education', id);
  setDoc(docRef, data, { merge: true }).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: data,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}

export function deleteEducation(firestore: Firestore, id: string) {
  const docRef = doc(firestore, 'education', id);
  deleteDoc(docRef).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'delete',
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}
