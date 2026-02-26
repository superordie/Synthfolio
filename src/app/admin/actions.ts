'use server';

import { db } from '@/firebase/config';
import { 
  doc, 
  setDoc, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc,
  getDoc,
  getDocs
} from 'firebase/firestore';
import { jobDescriptionSkillHighlighter } from '@/ai/flows/job-description-skill-highlighter';
import { portfolioContent as staticContent } from '@/lib/data';

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
    return { success: false, error: error.message || "Failed to update hero info." };
  }
}

/**
 * Saves or updates a project in Firestore.
 */
export async function saveProject(project: any) {
  try {
    const colRef = collection(db, 'users', USER_ID, 'projects');
    
    if (project.id) {
      const docRef = doc(db, 'users', USER_ID, 'projects', project.id);
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
    return { success: false, error: error.message || "Failed to save project." };
  }
}

/**
 * Deletes a project from Firestore.
 */
export async function deleteProjectAction(projectId: string) {
  try {
    const docRef = doc(db, 'users', USER_ID, 'projects', projectId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete project." };
  }
}

/**
 * Saves or updates an Experience entry.
 */
export async function saveExperience(exp: any) {
  try {
    const colRef = collection(db, 'users', USER_ID, 'experience');
    if (exp.id) {
      const docRef = doc(db, 'users', USER_ID, 'experience', exp.id);
      const { id, ...data } = exp;
      await updateDoc(docRef, data);
    } else {
      await addDoc(colRef, { ...exp, createdAt: new Date().toISOString() });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Deletes an Experience entry.
 */
export async function deleteExperienceAction(id: string) {
  try {
    const docRef = doc(db, 'users', USER_ID, 'experience', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Saves or updates an Education entry.
 */
export async function saveEducation(edu: any) {
  try {
    const colRef = collection(db, 'users', USER_ID, 'education');
    if (edu.id) {
      const docRef = doc(db, 'users', USER_ID, 'education', edu.id);
      const { id, ...data } = edu;
      await updateDoc(docRef, data);
    } else {
      await addDoc(colRef, { ...edu, createdAt: new Date().toISOString() });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Deletes an Education entry.
 */
export async function deleteEducationAction(id: string) {
  try {
    const docRef = doc(db, 'users', USER_ID, 'education', id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Saves or updates a skill category.
 */
export async function saveSkillCategory(category: { id?: string; title: string; skills: string[] }) {
  try {
    const colRef = collection(db, 'users', USER_ID, 'skills');
    
    if (category.id) {
      const docRef = doc(db, 'users', USER_ID, 'skills', category.id);
      const { id, ...data } = category;
      await updateDoc(docRef, data);
    } else {
      await addDoc(colRef, { ...category, createdAt: new Date().toISOString() });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save skill category." };
  }
}

/**
 * Deletes a skill category.
 */
export async function deleteSkillCategoryAction(categoryId: string) {
  try {
    const docRef = doc(db, 'users', USER_ID, 'skills', categoryId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * AI Aligner Action: Fetches portfolio data and runs the Genkit flow.
 */
export async function alignWithJobDescription(jobDescription: string) {
  try {
    const bioSnap = await getDoc(doc(db, 'users', USER_ID, 'portfolio', 'bio'));
    const projectsSnap = await getDocs(collection(db, 'users', USER_ID, 'projects'));
    const skillsSnap = await getDocs(collection(db, 'users', USER_ID, 'skills'));
    const expSnap = await getDocs(collection(db, 'users', USER_ID, 'experience'));
    const eduSnap = await getDocs(collection(db, 'users', USER_ID, 'education'));

    const liveProjects = projectsSnap.docs.map(d => d.data());
    const liveSkillsDocs = skillsSnap.docs.map(d => d.data());
    const liveExp = expSnap.docs.map(d => d.data());
    const liveEdu = eduSnap.docs.map(d => d.data());
    const liveBio = bioSnap.exists() ? bioSnap.data().about : staticContent.aboutMe;

    const formattedSkills = {
      technicalSkills: liveSkillsDocs.find(d => d.title === 'Technical Skills')?.skills || staticContent.skills.technicalSkills,
      toolsAndTechnologies: liveSkillsDocs.find(d => d.title === 'Tools & Technologies')?.skills || staticContent.skills.toolsAndTechnologies,
      professionalSoftSkills: liveSkillsDocs.find(d => d.title === 'Professional/Soft Skills')?.skills || staticContent.skills.professionalSoftSkills,
    };

    const input = {
      jobDescription,
      portfolioContent: {
        aboutMe: liveBio,
        projects: liveProjects.length > 0 ? liveProjects.map((p: any) => ({
          projectTitle: p.projectTitle,
          projectPurposeProblemSolved: p.projectPurposeProblemSolved,
          toolsOrTechnologiesUsed: p.toolsOrTechnologiesUsed || [],
          skillsDemonstrated: p.skillsDemonstrated || [],
          projectLink: p.projectLink || ""
        })) : staticContent.projects,
        skills: formattedSkills,
        workHistory: liveExp.length > 0 ? liveExp.map((e: any) => ({
          jobTitleRole: e.jobTitleRole,
          organizationCompany: e.organizationCompany,
          datesOfInvolvement: e.datesOfInvolvement,
          keyResponsibilities: e.keyResponsibilities || []
        })) : staticContent.workHistory,
        education: liveEdu.length > 0 ? liveEdu.map((e: any) => ({
          degreeProgramName: e.degreeProgramName,
          institutionName: e.institutionName,
          completionDate: e.completionDate,
          relevantCourseworkOrFocusAreas: e.relevantCourseworkOrFocusAreas || []
        })) : staticContent.education,
        certifications: staticContent.certifications
      }
    };

    const result = await jobDescriptionSkillHighlighter(input);
    return result;

  } catch (error: any) {
    console.error('AI Aligner Error:', error);
    return { 
      matchedSkills: [], 
      matchedProjects: [], 
      error: error.message || 'Failed to analyze job description.' 
    };
  }
}
