'use server';

import { db } from '@/firebase/config';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc
} from 'firebase/firestore';

const USER_ID = 'russell-robbins';

/**
 * Updates the Hero/Bio information in Firestore.
 */
export async function updateHeroInfo(data: { name: string; title: string; about: string }) {
  try {
    const docRef = doc(db, 'users', USER_ID, 'portfolio', 'bio');
    await setDoc(docRef, { 
      ...data,
      updatedAt: new Date().toISOString() 
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Hero Update Error:", error);
    return { success: false, error: error.message || "Failed to update hero info." };
  }
}

/**
 * Saves or updates a project in Firestore.
 */
export async function saveProject(project: any) {
  try {
    const colRef = collection(db, 'users', USER_ID, 'portfolio', 'projects');
    
    if (project.id) {
      const docRef = doc(db, 'users', USER_ID, 'portfolio', 'projects', project.id);
      const { id, ...data } = project;
      await updateDoc(docRef, data);
    } else {
      await addDoc(colRef, {
        ...project,
        createdAt: new Date().toISOString()
      });
    }

    return { success: true };
  } catch (error: any) {
    console.error("Project Save Error:", error);
    return { success: false, error: error.message || "Failed to save project." };
  }
}

/**
 * Deletes a project from Firestore.
 */
export async function deleteProjectAction(projectId: string) {
  try {
    const docRef = doc(db, 'users', USER_ID, 'portfolio', 'projects', projectId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    console.error("Project Delete Error:", error);
    return { success: false, error: error.message || "Failed to delete project." };
  }
}

/**
 * Updates a skill category in Firestore.
 */
export async function updateSkillsCategory(category: { id?: string; title: string; skills: string[] }) {
  try {
    const colRef = collection(db, 'users', USER_ID, 'portfolio', 'skillCategories');
    
    if (category.id) {
      const docRef = doc(db, 'users', USER_ID, 'portfolio', 'skillCategories', category.id);
      const { id, ...data } = category;
      await updateDoc(docRef, data);
    } else {
      await addDoc(colRef, category);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Skills Update Error:", error);
    return { success: false, error: error.message || "Failed to update skills." };
  }
}

/**
 * Deletes a skill category.
 */
export async function deleteSkillsCategory(categoryId: string) {
  try {
    const docRef = doc(db, 'users', USER_ID, 'portfolio', 'skillCategories', categoryId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Legacy support/AI features
 */
export async function alignWithJobDescription(jobDescription: string) {
  try {
    console.log("AI Alignment triggered");
    return { 
      success: true, 
      matches: ["Technical Management", "AI Development"],
      message: "Alignment complete."
    };
  } catch (error: any) {
    return { success: false, error: "AI Service error." };
  }
}
