
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
import type { Experience } from '@/firebase/firestore/experience';

const expSchema = z.object({
  jobTitleRole: z.string().min(1, 'Job title is required'),
  organizationCompany: z.string().min(1, 'Company is required'),
  datesOfInvolvement: z.string().min(1, 'Dates are required'),
  keyResponsibilities: z.string().min(1, 'Responsibilities are required'),
});

type ExpFormData = z.infer<typeof expSchema>;

type ExperienceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Experience, 'id' | 'ownerId'>) => void;
  experience?: Experience | null;
};

export default function ExperienceFormDialog({
  open,
  onOpenChange,
  onSubmit,
  experience,
}: ExperienceFormDialogProps) {
  const form = useForm<ExpFormData>({
    resolver: zodResolver(expSchema),
    defaultValues: {
      jobTitleRole: '',
      organizationCompany: '',
      datesOfInvolvement: '',
      keyResponsibilities: '',
    },
  });

  useEffect(() => {
    if (experience) {
      form.reset({
        jobTitleRole: experience.jobTitleRole,
        organizationCompany: experience.organizationCompany,
        datesOfInvolvement: experience.datesOfInvolvement,
        keyResponsibilities: experience.keyResponsibilities.join('\n'),
      });
    } else {
      form.reset();
    }
  }, [experience, form, open]);
  
  const handleFormSubmit = (data: ExpFormData) => {
    const processedData = {
      ...data,
      keyResponsibilities: data.keyResponsibilities.split('\n').map((s) => s.trim()).filter(s => s !== ''),
    };
    onSubmit(processedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{experience ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          <DialogDescription>
            Record your professional journey.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="jobTitleRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Title / Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization / Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="datesOfInvolvement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dates (e.g. 2022 - Present)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keyResponsibilities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Responsibilities (one per line)</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Experience</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
