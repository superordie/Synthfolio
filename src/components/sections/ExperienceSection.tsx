
'use client';

import Section from '@/components/Section';
import { Card, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { seedExperience, addExperience, updateExperience, deleteExperience, type Experience } from '@/firebase/firestore/experience';
import { useToast } from '@/hooks/use-toast';
import ExperienceFormDialog from '../ExperienceFormDialog';
import { PlusCircle, Edit, Trash2, Loader2, Database, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useMemoFirebase } from '@/hooks/use-memo-firebase';
import { portfolioContent } from '@/lib/data';

const ExperienceSection = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const expQuery = useMemoFirebase(() =>
    firestore ? collection(firestore, 'experience') : null
  , [firestore]);
  
  const { data: firestoreExp, loading: expLoading } = useCollection<Experience>(expQuery);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);

  const experiences = useMemo(() => {
    if (firestoreExp && firestoreExp.length > 0) {
      return firestoreExp;
    }
    return portfolioContent.workHistory.map((h, i) => ({ ...h, id: `static-${i}`, ownerId: 'static' } as Experience));
  }, [firestoreExp]);

  const handleSeed = async () => {
    if (!firestore || !user) return;
    setIsSeeding(true);
    try {
      await seedExperience(firestore, user.uid);
      toast({ title: 'Success', description: 'Experience seeded.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAdd = () => {
    setSelectedExp(null);
    setIsFormOpen(true);
  };

  const handleEdit = (exp: Experience) => {
    setSelectedExp(exp);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteExperience(firestore, id);
    toast({ title: 'Deleted', description: 'Entry removed.' });
  };

  const handleFormSubmit = (data: Omit<Experience, 'id' | 'ownerId'>) => {
    if (!firestore || !user) return;
    if (selectedExp && !selectedExp.id.startsWith('static-')) {
      updateExperience(firestore, selectedExp.id, data);
      toast({ title: 'Updated', description: 'Experience updated.' });
    } else {
      addExperience(firestore, user.uid, data);
      toast({ title: 'Added', description: 'Experience added.' });
    }
  };

  const isLoading = userLoading || expLoading;
  const isDbEmpty = !expLoading && (!firestoreExp || firestoreExp.length === 0);

  return (
    <>
      <Section id="experience">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Work Experience</h2>
            {user && (
              <Button size="icon" variant="outline" onClick={handleAdd}>
                <PlusCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-lg text-muted-foreground">My professional journey and key accomplishments.</p>
        </div>

        {isLoading && !firestoreExp && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {user && isDbEmpty && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-dashed border-2 bg-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-primary flex items-center justify-center gap-2">
                  <Database className="h-5 w-5"/> Experience Setup
                </CardTitle>
              </CardHeader>
              <CardFooter className="justify-center">
                <Button onClick={handleSeed} disabled={isSeeding}>
                  {isSeeding ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Database className="mr-2 h-4 w-4"/>}
                  Seed Experience Database
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="relative max-w-2xl mx-auto">
          <div className="space-y-12">
            {experiences.map((job) => (
              <div key={job.id} className="pl-12 relative group">
                  <div className="absolute left-4 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold text-muted-foreground">{job.datesOfInvolvement}</p>
                    {user && user.uid === job.ownerId && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(job)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete entry?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(job.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-headline font-bold text-foreground">{job.jobTitleRole}</h3>
                  <p className="text-base font-medium text-foreground/80">{job.organizationCompany}</p>
                  <ul className="mt-4 space-y-2">
                      {job.keyResponsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 mt-1 text-primary/80 flex-shrink-0" />
                              <span className="text-muted-foreground">{resp}</span>
                          </li>
                      ))}
                  </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>
      <ExperienceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        experience={selectedExp}
      />
    </>
  );
};

export default ExperienceSection;
