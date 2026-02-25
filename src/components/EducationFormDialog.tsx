
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
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import type { Education } from '@/firebase/firestore/education';

const eduSchema = z.object({
  degreeProgramName: z.string().min(1, 'Degree is required'),
  institutionName: z.string().min(1, 'Institution is required'),
  completionDate: z.string().min(1, 'Completion date is required'),
  relevantCourseworkOrFocusAreas: z.string().optional(),
});

type EduFormData = z.infer<typeof eduSchema>;

type EducationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Education, 'id' | 'ownerId'>) => void;
  education?: Education | null;
};

export default function EducationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  education,
}: EducationFormDialogProps) {
  const form = useForm<EduFormData>({
    resolver: zodResolver(eduSchema),
    defaultValues: {
      degreeProgramName: '',
      institutionName: '',
      completionDate: '',
      relevantCourseworkOrFocusAreas: '',
    },
  });

  useEffect(() => {
    if (education) {
      form.reset({
        degreeProgramName: education.degreeProgramName,
        institutionName: education.institutionName,
        completionDate: education.completionDate,
        relevantCourseworkOrFocusAreas: education.relevantCourseworkOrFocusAreas?.join(', ') || '',
      });
    } else {
      form.reset();
    }
  }, [education, form, open]);
  
  const handleFormSubmit = (data: EduFormData) => {
    const processedData = {
      ...data,
      relevantCourseworkOrFocusAreas: data.relevantCourseworkOrFocusAreas ? data.relevantCourseworkOrFocusAreas.split(',').map((s) => s.trim()).filter(s => s !== '') : [],
    };
    onSubmit(processedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{education ? 'Edit Education' : 'Add Education'}</DialogTitle>
          <DialogDescription>
            Your academic achievements.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="degreeProgramName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree / Program</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institutionName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="completionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Completion Date (e.g. May 2024)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="relevantCourseworkOrFocusAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Coursework (comma-separated)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Education</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
