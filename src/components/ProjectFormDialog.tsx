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
    .min(1, 'Project purpose is required'),
  toolsOrTechnologiesUsed: z.string().min(1, 'Tools/technologies are required'),
  skillsDemonstrated: z.string().min(1, 'Skills are required'),
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
      form.reset();
    }
  }, [project, form, open]);
  
  const handleFormSubmit = (data: ProjectFormData) => {
    const processedData = {
      ...data,
      toolsOrTechnologiesUsed: data.toolsOrTechnologiesUsed.split(',').map((s) => s.trim()),
      skillsDemonstrated: data.skillsDemonstrated.split(',').map((s) => s.trim()),
    };
    onSubmit(processedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Update the details of your project.' : 'Fill in the details for your new project.'}
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
                    <Input {...field} />
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
                  <FormLabel>Purpose / Problem Solved</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toolsOrTechnologiesUsed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tools & Technologies (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="skillsDemonstrated"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills Demonstrated (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Link</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://github.com/..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
