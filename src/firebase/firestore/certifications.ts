
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

export type Certification = {
  id: string;
  ownerId: string;
  certificationName: string;
  issuingOrganization: string;
  yearEarned: string;
  credentialURL?: string;
};

export async function seedCertifications(firestore: Firestore, userId: string) {
  const batch = writeBatch(firestore);
  const colRef = collection(firestore, 'certifications');

  portfolioContent.certifications.forEach((item) => {
    const docRef = doc(colRef);
    batch.set(docRef, { ...item, ownerId: userId });
  });

  await batch.commit();
}

export function addCertification(firestore: Firestore, userId: string, data: Omit<Certification, 'id' | 'ownerId'>) {
  const colRef = collection(firestore, 'certifications');
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

export function updateCertification(firestore: Firestore, id: string, data: Partial<Omit<Certification, 'id' | 'ownerId'>>) {
  const docRef = doc(firestore, 'certifications', id);
  setDoc(docRef, data, { merge: true }).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: data,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}

export function deleteCertification(firestore: Firestore, id: string) {
  const docRef = doc(firestore, 'certifications', id);
  deleteDoc(docRef).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'delete',
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}
