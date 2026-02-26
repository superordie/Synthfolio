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
import { portfolioContent as staticContent, portfolioData as staticBio } from '@/lib/data';

const USER_ID = 'russell-robbins';

/**
 * Standardized 5-segment path for collections: users/russell-robbins/portfolio/content/[type]
 */
const getCollPath = (type: string) => collection(db, 'users', USER_ID, 'portfolio', 'content', type);
const getDocPath = (type: string, id: string) => doc(db, 'users', USER_ID, 'portfolio', 'content', type, id);

/**
 * Restores all original data from lib/data.ts to Firestore collections.
 */
export async function restorePortfolioData() {
  try {
    // 1. Bio (4-segment document path)
    const bioRef = doc(db, 'users', USER_ID, 'portfolio', 'bio');
    await setDoc(bioRef, { 
      about: staticBio.about,
      name: staticBio.name,
      title: staticBio.title,
      updatedAt: new Date().toISOString() 
    }, { merge: true });

    // 2. Projects
    const projectCol = getCollPath('projects');
    for (const project of staticContent.projects) {
      await addDoc(projectCol, {
        ...project,
        createdAt: new Date().toISOString()
      });
    }

    // 3. Experience
    const expCol = getCollPath('experience');
    for (const exp of staticContent.workHistory) {
      await addDoc(expCol, {
        ...exp,
        createdAt: new Date().toISOString()
      });
    }

    // 4. Education
    const eduCol = getCollPath('education');
    for (const edu of staticContent.education) {
      await addDoc(eduCol, {
        ...edu,
        createdAt: new Date().toISOString()
      });
    }

    // 5. Skills
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
    console.error("Restoration Error:", error);
    return { success: false, error: error.message };
  }
}

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

export async function saveProject(project: any) {
  try {
    const { id, ...data } = project;
    if (id) {
      await updateDoc(getDocPath('projects', id), data);
    } else {
      await addDoc(getCollPath('projects'), {
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

export async function saveExperience(exp: any) {
  try {
    const { id, ...data } = exp;
    if (id) {
      await updateDoc(getDocPath('experience', id), data);
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

export async function saveEducation(edu: any) {
  try {
    const { id, ...data } = edu;
    if (id) {
      await updateDoc(getDocPath('education', id), data);
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

export async function saveSkillCategory(category: any) {
  try {
    const { id, ...data } = category;
    if (id) {
      await updateDoc(getDocPath('skills', id), data);
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
    const liveBio = bioSnap.exists() ? bioSnap.data().about : staticBio.about;

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
