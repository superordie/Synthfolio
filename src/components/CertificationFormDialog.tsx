
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
import type { Certification } from '@/firebase/firestore/certifications';

const certSchema = z.object({
  certificationName: z.string().min(1, 'Name is required'),
  issuingOrganization: z.string().min(1, 'Organization is required'),
  yearEarned: z.string().min(1, 'Year is required'),
  credentialURL: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

type CertFormData = z.infer<typeof certSchema>;

type CertificationFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<Certification, 'id' | 'ownerId'>) => void;
  certification?: Certification | null;
};

export default function CertificationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  certification,
}: CertificationFormDialogProps) {
  const form = useForm<CertFormData>({
    resolver: zodResolver(certSchema),
    defaultValues: {
      certificationName: '',
      issuingOrganization: '',
      yearEarned: '',
      credentialURL: '',
    },
  });

  useEffect(() => {
    if (certification) {
      form.reset({
        certificationName: certification.certificationName,
        issuingOrganization: certification.issuingOrganization,
        yearEarned: certification.yearEarned,
        credentialURL: certification.credentialURL || '',
      });
    } else {
      form.reset();
    }
  }, [certification, form, open]);
  
  const handleFormSubmit = (data: CertFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{certification ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
          <DialogDescription>
            Showcase your credentials.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="certificationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certification Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issuingOrganization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuing Organization</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="yearEarned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Earned</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="credentialURL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credential URL (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save Certification</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
