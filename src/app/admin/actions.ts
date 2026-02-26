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
 * Paths follow the odd segment rule for Firestore collections.
 * Collection: users/{userId}/portfolio/content/{type} (5 segments)
 */
const getCollPath = (type: string) => collection(db, 'users', USER_ID, 'portfolio', 'content', type);
const getDocPath = (type: string, id: string) => doc(db, 'users', USER_ID, 'portfolio', 'content', type, id);

/**
 * Restores original hardcoded data into Firestore collections.
 */
export async function restorePortfolioData() {
  try {
    // 1. Projects
    const projectCol = getCollPath('projects');
    for (const project of staticContent.projects) {
      await addDoc(projectCol, {
        ...project,
        createdAt: new Date().toISOString()
      });
    }

    // 2. Experience
    const expCol = getCollPath('experience');
    for (const exp of staticContent.workHistory) {
      await addDoc(expCol, {
        ...exp,
        createdAt: new Date().toISOString()
      });
    }

    // 3. Education
    const eduCol = getCollPath('education');
    for (const edu of staticContent.education) {
      await addDoc(eduCol, {
        ...edu,
        createdAt: new Date().toISOString()
      });
    }

    // 4. Skills (Restoring as categories)
    const skillsCol = getCollPath('skills');
    const categories = [
      { title: 'Technical Skills', skills: staticContent.skills.technicalSkills },
      { title: 'Tools & Technologies', skills: staticContent.skills.toolsAndTechnologies },
      { title: 'Professional/Soft Skills', skills: staticContent.skills.professionalSoftSkills },
    ];

    for (const cat of categories) {
      await addDoc(skillsCol, {
        ...cat,
        createdAt: new Date().toISOString()
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Updates the Hero/Bio information (Single Document).
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
    return { success: false, error: error.message };
  }
}

/**
 * Projects CRUD
 */
export async function saveProject(project: any) {
  try {
    const { id, ...data } = project;
    if (id) {
      const docRef = getDocPath('projects', id);
      await updateDoc(docRef, data);
    } else {
      const colRef = getCollPath('projects');
      await addDoc(colRef, {
        ...data,
        createdAt: new Date().toISOString()
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteProjectAction(projectId: string) {
  try {
    await deleteDoc(getDocPath('projects', projectId));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Experience CRUD
 */
export async function saveExperience(exp: any) {
  try {
    const { id, ...data } = exp;
    if (id) {
      const docRef = getDocPath('experience', id);
      await updateDoc(docRef, data);
    } else {
      await addDoc(getCollPath('experience'), { 
        ...data, 
        createdAt: new Date().toISOString() 
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteExperienceAction(id: string) {
  try {
    await deleteDoc(getDocPath('experience', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Education CRUD
 */
export async function saveEducation(edu: any) {
  try {
    const { id, ...data } = edu;
    if (id) {
      const docRef = getDocPath('education', id);
      await updateDoc(docRef, data);
    } else {
      await addDoc(getCollPath('education'), { 
        ...data, 
        createdAt: new Date().toISOString() 
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    await deleteDoc(getDocPath('education', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Skills CRUD
 */
export async function saveSkillCategory(category: any) {
  try {
    const { id, ...data } = category;
    if (id) {
      const docRef = getDocPath('skills', id);
      await updateDoc(docRef, data);
    } else {
      await addDoc(getCollPath('skills'), { 
        ...data, 
        createdAt: new Date().toISOString() 
      });
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteSkillCategoryAction(id: string) {
  try {
    await deleteDoc(getDocPath('skills', id));
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * AI Aligner Logic
 */
export async function alignWithJobDescription(jobDescription: string) {
  try {
    const bioSnap = await getDoc(doc(db, 'users', USER_ID, 'portfolio', 'bio'));
    const projectsSnap = await getDocs(getCollPath('projects'));
    const skillsSnap = await getDocs(getCollPath('skills'));
    const expSnap = await getDocs(getCollPath('experience'));
    const eduSnap = await getDocs(getCollPath('education'));

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

    return await jobDescriptionSkillHighlighter(input);

  } catch (error: any) {
    return { matchedSkills: [], matchedProjects: [], error: error.message };
  }
}
