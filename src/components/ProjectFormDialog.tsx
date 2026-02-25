'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import type { Project } from '@/firebase/firestore/projects';

const projectSchema = z.object({
  projectTitle: z.string().min(1, 'Project title is required'),
  projectPurposeProblemSolved: z
    .string()
    .min(10, 'Please describe the purpose in more detail (min 10 characters)'),
  toolsOrTechnologiesUsed: z.string().min(1, 'At least one technology is required'),
  skillsDemonstrated: z.string().min(1, 'At least one skill is required'),
  projectLink: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type ProjectFormData = z.infer<typeof projectSchema>;

type ProjectFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Project, 'id' | 'ownerId'>) => void;
  project?: Project | null;
};

export default function ProjectFormDialog({
  open,
  onOpenChange,
  onSubmit,
  project,
}: ProjectFormDialogProps) {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectTitle: '',
      projectPurposeProblemSolved: '',
      toolsOrTechnologiesUsed: '',
      skillsDemonstrated: '',
      projectLink: '',
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        projectTitle: project.projectTitle,
        projectPurposeProblemSolved: project.projectPurposeProblemSolved,
        toolsOrTechnologiesUsed: project.toolsOrTechnologiesUsed.join(', '),
        skillsDemonstrated: project.skillsDemonstrated.join(', '),
        projectLink: project.projectLink || '',
      });
    } else {
      form.reset({
        projectTitle: '',
        projectPurposeProblemSolved: '',
        toolsOrTechnologiesUsed: '',
        skillsDemonstrated: '',
        projectLink: '',
      });
    }
  }, [project, form, open]);
  
  const handleFormSubmit = (data: ProjectFormData) => {
    const processedData = {
      projectTitle: data.projectTitle,
      projectPurposeProblemSolved: data.projectPurposeProblemSolved,
      projectLink: data.projectLink,
      toolsOrTechnologiesUsed: data.toolsOrTechnologiesUsed.split(',').map((s) => s.trim()).filter(s => s !== ''),
      skillsDemonstrated: data.skillsDemonstrated.split(',').map((s) => s.trim()).filter(s => s !== ''),
    };
    onSubmit(processedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project Details' : 'Add New Portfolio Project'}</DialogTitle>
          <DialogDescription>
            Highlight your best work with detailed descriptions and the tech stack you used.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="projectTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Synthfolio" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectPurposeProblemSolved"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview / Problem Solved</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe the project goal and your contribution..." rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="toolsOrTechnologiesUsed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="React, Next.js, Firebase..." />
                      </FormControl>
                      <FormDescription>Comma-separated list</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="skillsDemonstrated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills Highlighted</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="UI Design, Backend Integration..." />
                      </FormControl>
                      <FormDescription>Comma-separated list</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <FormField
              control={form.control}
              name="projectLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Link or GitHub Repo (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://github.com/yourusername/repo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
