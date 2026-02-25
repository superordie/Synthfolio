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
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import type { SkillCategory } from '@/firebase/firestore/skills';

const skillSchema = z.object({
  title: z.string().min(1, 'Category title is required'),
  skills: z.string().min(1, 'At least one skill is required'),
});

type SkillFormData = z.infer<typeof skillSchema>;

type SkillFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<SkillCategory, 'id' | 'ownerId'>) => void;
  category?: SkillCategory | null;
};

export default function SkillFormDialog({
  open,
  onOpenChange,
  onSubmit,
  category,
}: SkillFormDialogProps) {
  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      title: '',
      skills: '',
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        title: category.title,
        skills: category.skills.join(', '),
      });
    } else {
      form.reset({
        title: '',
        skills: '',
      });
    }
  }, [category, form, open]);
  
  const handleFormSubmit = (data: SkillFormData) => {
    const processedData = {
      title: data.title,
      skills: data.skills.split(',').map((s) => s.trim()).filter(s => s !== ''),
    };
    onSubmit(processedData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{category ? 'Edit Skill Category' : 'Add New Skill Category'}</DialogTitle>
          <DialogDescription>
            Organize your expertise into clear categories for visitors.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Technical Skills, Soft Skills" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="skills"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skills List</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="React, Next.js, Firebase..." />
                  </FormControl>
                  <FormDescription>
                    Separate multiple skills with commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
