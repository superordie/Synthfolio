
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

export type SkillCategory = {
  id: string;
  ownerId: string;
  title: string;
  skills: string[];
};

export async function seedSkills(firestore: Firestore, userId: string) {
  const batch = writeBatch(firestore);
  const colRef = collection(firestore, 'skills');

  const categories = [
    { title: 'Technical Skills', skills: portfolioContent.skills.technicalSkills },
    { title: 'Tools & Technologies', skills: portfolioContent.skills.toolsAndTechnologies },
    { title: 'Professional & Soft Skills', skills: portfolioContent.skills.professionalSoftSkills },
  ];

  categories.forEach((cat) => {
    const docRef = doc(colRef);
    batch.set(docRef, { ...cat, ownerId: userId });
  });

  await batch.commit();
}

export function addSkillCategory(firestore: Firestore, userId: string, data: Omit<SkillCategory, 'id' | 'ownerId'>) {
  const colRef = collection(firestore, 'skills');
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

export function updateSkillCategory(firestore: Firestore, id: string, data: Partial<Omit<SkillCategory, 'id' | 'ownerId'>>) {
  const docRef = doc(firestore, 'skills', id);
  setDoc(docRef, data, { merge: true }).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'update',
      requestResourceData: data,
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}

export function deleteSkillCategory(firestore: Firestore, id: string) {
  const docRef = doc(firestore, 'skills', id);
  deleteDoc(docRef).catch(async () => {
    const error = new FirestorePermissionError({
      path: docRef.path,
      operation: 'delete',
    } satisfies SecurityRuleContext);
    errorEmitter.emit('permission-error', error);
  });
}
