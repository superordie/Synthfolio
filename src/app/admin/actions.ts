'use server';

import { db } from '@/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

/**
 * Updates the 'About Me' bio in Firestore.
 * Path: users/russell-robbins/portfolio/bio
 */
export async function updateAboutContent(newAboutText: string) {
  try {
    // Standardizing the document path to match your Hero/About components
    const docRef = doc(db, 'users', 'russell-robbins', 'portfolio', 'bio');

    await setDoc(docRef, { 
      about: newAboutText, 
      updatedAt: new Date().toISOString() 
    }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error("Firebase Save Error:", error);
    return { 
      success: false, 
      error: error.message || "Database rejected the save. Check Firebase Rules." 
    };
  }
}

/**
 * Placeholder for AI Alignment features.
 * This prevents the app from crashing if other components try to import it.
 */
export async function alignWithJobDescription(jobDescription: string) {
  try {
    console.log("AI Alignment triggered for:", jobDescription);
    
    // In a future update, we can add OpenAI/Gemini logic here.
    return { 
      success: true, 
      matches: ["Technical Management", "AI Development", "Next.js"],
      message: "Alignment placeholder active."
    };
  } catch (error: any) {
    return { success: false, error: "AI Service currently unavailable." };
  }
}

/**
 * Optional: Helper to reset the bio to a default state if needed
 */
export async function resetBio() {
  return await updateAboutContent("Hello! I am Russell Robbins, a technical manager and AI developer.");
}