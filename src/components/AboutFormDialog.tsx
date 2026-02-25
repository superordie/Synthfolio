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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

const aboutSchema = z.object({
  about: z.string().min(20, 'Please provide a more detailed bio (at least 20 characters)'),
});

type AboutFormData = z.infer<typeof aboutSchema>;

type AboutFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AboutFormData) => void;
  initialValue?: string;
};

export default function AboutFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValue = '',
}: AboutFormDialogProps) {
  const form = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      about: initialValue,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ about: initialValue });
    }
  }, [open, initialValue, form]);
  
  const handleFormSubmit = (data: AboutFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit About Me</DialogTitle>
          <DialogDescription>
            Your bio is the first thing visitors see. Keep it professional, engaging, and reflective of your goals.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Professional Summary</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={12} 
                      className="bg-background/50 leading-relaxed" 
                      placeholder="Tell the world about your journey and expertise..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Discard</Button>
                </DialogClose>
                <Button type="submit">Update Bio</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
