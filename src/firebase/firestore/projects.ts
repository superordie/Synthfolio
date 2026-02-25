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

export type Project = {
  id: string;
  ownerId: string;
  projectTitle: string;
  projectPurposeProblemSolved: string;
  toolsOrTechnologiesUsed: string[];
  skillsDemonstrated: string[];
  projectLink?: string;
};

const staticProjects = portfolioContent.projects;

export async function seedProjects(firestore: Firestore, userId: string) {
  const batch = writeBatch(firestore);
  const projectsCol = collection(firestore, 'projects');

  staticProjects.forEach((project) => {
    const docRef = doc(projectsCol);
    batch.set(docRef, { ...project, ownerId: userId });
  });

  await batch.commit();
}

export function addProject(firestore: Firestore, userId: string, data: Omit<Project, 'id' | 'ownerId'>) {
    const projectsCol = collection(firestore, 'projects');
    const newProject = {
        ...data,
        ownerId: userId,
    }

    addDoc(projectsCol, newProject)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: projectsCol.path,
                operation: 'create',
                requestResourceData: newProject,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        });
}

export function updateProject(firestore: Firestore, projectId: string, data: Partial<Omit<Project, 'id' | 'ownerId'>>) {
    const projectRef = doc(firestore, 'projects', projectId);
    
    setDoc(projectRef, data, { merge: true })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: projectRef.path,
                operation: 'update',
                requestResourceData: data,
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        });
}

export function deleteProject(firestore: Firestore, projectId: string) {
    const projectRef = doc(firestore, 'projects', projectId);

    deleteDoc(projectRef)
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: projectRef.path,
                operation: 'delete',
            } satisfies SecurityRuleContext);
            errorEmitter.emit('permission-error', permissionError);
        });
}
