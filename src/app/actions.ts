'use server';

import {
  jobDescriptionSkillHighlighter,
  type JobDescriptionSkillHighlighterInput,
} from '@/ai/flows/job-description-skill-highlighter';
import { portfolioContent } from '@/lib/data';

export async function alignWithJobDescription(jobDescription: string) {
  if (!jobDescription || jobDescription.trim().length < 50) {
    return { error: 'Please provide a job description with at least 50 characters.' };
  }

  const input: JobDescriptionSkillHighlighterInput = {
    jobDescription,
    portfolioContent: portfolioContent,
  };
  
  try {
    const result = await jobDescriptionSkillHighlighter(input);
    if (!result.matchedProjects.length && !result.matchedSkills.length) {
        return { error: 'The AI could not find strong matches for this job description. Try another one.'}
    }
    return result;
  } catch (error) {
    console.error('Error in AI skill highlighter flow:', error);
    return { error: 'Failed to analyze the job description due to a server error. Please try again later.' };
  }
}
