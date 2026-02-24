'use server';
/**
 * @fileOverview A Genkit flow that analyzes a job description and highlights relevant skills and projects
 *               from a provided portfolio.
 *
 * - jobDescriptionSkillHighlighter - The main function to call the flow.
 * - JobDescriptionSkillHighlighterInput - The input type for the flow.
 * - JobDescriptionSkillHighlighterOutput - The output type for the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PortfolioContentSchema = z
  .object({
    aboutMe: z.string().describe("The candidate's 'About Me' section."),
    education: z
      .array(
        z.object({
          degreeProgramName: z.string(),
          institutionName: z.string(),
          completionDate: z.string(),
          relevantCourseworkOrFocusAreas: z.array(z.string()).optional(),
        })
      )
      .describe("The candidate's education history."),
    certifications: z
      .array(
        z.object({
          certificationName: z.string(),
          issuingOrganization: z.string(),
          yearEarned: z.string(),
          credentialURL: z.string().url().optional(),
        })
      )
      .describe("The candidate's certifications."),
    workHistory: z
      .array(
        z.object({
          jobTitleRole: z.string(),
          organizationCompany: z.string(),
          datesOfInvolvement: z.string(),
          keyResponsibilities: z.array(z.string()),
        })
      )
      .describe("The candidate's work history."),
    skills: z
      .object({
        technicalSkills: z.array(z.string()),
        toolsAndTechnologies: z.array(z.string()),
        professionalSoftSkills: z.array(z.string()),
      })
      .describe("The candidate's skills categorized."),
    projects: z
      .array(
        z.object({
          projectTitle: z.string(),
          projectPurposeProblemSolved: z.string(),
          toolsOrTechnologiesUsed: z.array(z.string()),
          skillsDemonstrated: z.array(z.string()),
          projectLink: z.string().url().optional(),
        })
      )
      .describe("The candidate's portfolio projects."),
  })
  .describe('The structured content of the candidate\'s portfolio.');

const JobDescriptionSkillHighlighterInputSchema = z
  .object({
    jobDescription: z.string().describe('The job description to analyze.'),
    portfolioContent: PortfolioContentSchema,
  })
  .describe(
    'Input for the job description skill highlighter, including the job description and portfolio content.'
  );

export type JobDescriptionSkillHighlighterInput = z.infer<
  typeof JobDescriptionSkillHighlighterInputSchema
>;

const JobDescriptionSkillHighlighterOutputSchema = z
  .object({
    matchedSkills: z
      .array(
        z.object({
          category: z
            .enum(['technicalSkills', 'toolsAndTechnologies', 'professionalSoftSkills'])
            .describe('The category of the skill.'),
          skill: z.string().describe('The matched skill from the portfolio.'),
          relevanceExplanation: z
            .string()
            .optional()
            .describe('Explanation of why this skill is relevant to the job.'),
        })
      )
      .describe('A list of skills from the portfolio relevant to the job description.'),
    matchedProjects: z
      .array(
        z.object({
          projectTitle: z.string().describe('The title of the matched project.'),
          relevanceExplanation: z
            .string()
            .describe('Explanation of why this project is relevant to the job.'),
          projectLink: z.string().url().optional().describe('Optional link to the project.'),
        })
      )
      .describe('A list of projects from the portfolio relevant to the job description.'),
  })
  .describe('Output highlighting relevant skills and projects based on the job description.');

export type JobDescriptionSkillHighlighterOutput = z.infer<
  typeof JobDescriptionSkillHighlighterOutputSchema
>;

export async function jobDescriptionSkillHighlighter(
  input: JobDescriptionSkillHighlighterInput
): Promise<JobDescriptionSkillHighlighterOutput> {
  return jobDescriptionSkillHighlighterFlow(input);
}

const skillHighlighterPrompt = ai.definePrompt({
  name: 'jobDescriptionSkillHighlighterPrompt',
  input: {schema: JobDescriptionSkillHighlighterInputSchema},
  output: {schema: JobDescriptionSkillHighlighterOutputSchema},
  prompt: `You are a professional career branding expert and a hiring manager. Your task is to analyze a given job description and a candidate's portfolio content to identify the most relevant skills and projects that align with the job requirements.

**Job Description:**
{{{jobDescription}}}

**Candidate's Portfolio Content:**

**About Me:**
{{{portfolioContent.aboutMe}}}

**Education:**
{{#each portfolioContent.education}}
  - Degree/Program: {{{degreeProgramName}}}, Institution: {{{institutionName}}}, Completion: {{{completionDate}}}
    {{#if relevantCourseworkOrFocusAreas}}
    Coursework: {{#each relevantCourseworkOrFocusAreas}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    {{/if}}
{{/each}}

**Certifications:**
{{#each portfolioContent.certifications}}
  - Certification: {{{certificationName}}}, Organization: {{{issuingOrganization}}}, Year: {{{yearEarned}}}
    {{#if credentialURL}}
    URL: {{{credentialURL}}}
    {{/if}}
{{/each}}

**Work History:**
{{#each portfolioContent.workHistory}}
  - Job Title: {{{jobTitleRole}}}, Company: {{{organizationCompany}}}, Dates: {{{datesOfInvolvement}}}
    Responsibilities:
    {{#each keyResponsibilities}}
      - {{{this}}}
    {{/each}}
{{/each}}

**Skills:**
Technical Skills: {{#each portfolioContent.skills.technicalSkills}}- {{{this}}}\n{{/each}}
Tools & Technologies: {{#each portfolioContent.skills.toolsAndTechnologies}}- {{{this}}}\n{{/each}}
Professional/Soft Skills: {{#each portfolioContent.skills.professionalSoftSkills}}- {{{this}}}\n{{/each}}

**Projects:**
{{#each portfolioContent.projects}}
  - Project Title: {{{projectTitle}}}
    Purpose/Problem Solved: {{{projectPurposeProblemSolved}}}
    Tools/Technologies Used: {{#each toolsOrTechnologiesUsed}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    Skills Demonstrated: {{#each skillsDemonstrated}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
    {{#if projectLink}}
    Link: {{{projectLink}}}
    {{/if}}
{{/each}}

Based on the job description, carefully identify which of the candidate's skills and projects are most relevant. For each matched item, provide a concise explanation of its relevance to the job description. If a project has a link, include it.

Present the output in a structured JSON format as described in the \\\`JobDescriptionSkillHighlighterOutputSchema\\\`.
`,
});

const jobDescriptionSkillHighlighterFlow = ai.defineFlow(
  {
    name: 'jobDescriptionSkillHighlighterFlow',
    inputSchema: JobDescriptionSkillHighlighterInputSchema,
    outputSchema: JobDescriptionSkillHighlighterOutputSchema,
  },
  async (input) => {
    const {output} = await skillHighlighterPrompt(input);
    return output!;
  }
);
