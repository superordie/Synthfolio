
'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { seedSkills, addSkillCategory, updateSkillCategory, deleteSkillCategory, type SkillCategory } from '@/firebase/firestore/skills';
import { useToast } from '@/hooks/use-toast';
import SkillFormDialog from '../SkillFormDialog';
import { PlusCircle, Edit, Trash2, Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useMemoFirebase } from '@/hooks/use-memo-firebase';
import { portfolioContent } from '@/lib/data';

const SkillsSection = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const skillsQuery = useMemoFirebase(() =>
    firestore ? collection(firestore, 'skills') : null
  , [firestore]);
  
  const { data: firestoreSkills, loading: skillsLoading } = useCollection<SkillCategory>(skillsQuery);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);

  const skillCategories = useMemo(() => {
    if (firestoreSkills && firestoreSkills.length > 0) {
      return firestoreSkills;
    }
    return [
      { id: 'static-1', title: 'Technical Skills', skills: portfolioContent.skills.technicalSkills, ownerId: 'static' },
      { id: 'static-2', title: 'Tools & Technologies', skills: portfolioContent.skills.toolsAndTechnologies, ownerId: 'static' },
      { id: 'static-3', title: 'Professional & Soft Skills', skills: portfolioContent.skills.professionalSoftSkills, ownerId: 'static' },
    ] as SkillCategory[];
  }, [firestoreSkills]);

  const handleSeed = async () => {
    if (!firestore || !user) return;
    setIsSeeding(true);
    try {
      await seedSkills(firestore, user.uid);
      toast({ title: 'Success', description: 'Skills seeded.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (cat: SkillCategory) => {
    setSelectedCategory(cat);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!firestore) return;
    deleteSkillCategory(firestore, id);
    toast({ title: 'Deleted', description: 'Category removed.' });
  };

  const handleFormSubmit = (data: Omit<SkillCategory, 'id' | 'ownerId'>) => {
    if (!firestore || !user) return;
    if (selectedCategory && !selectedCategory.id.startsWith('static-')) {
      updateSkillCategory(firestore, selectedCategory.id, data);
      toast({ title: 'Updated', description: 'Skills updated.' });
    } else {
      addSkillCategory(firestore, user.uid, data);
      toast({ title: 'Added', description: 'New skills added.' });
    }
  };

  const isLoading = userLoading || skillsLoading;
  const isDbEmpty = !skillsLoading && (!firestoreSkills || firestoreSkills.length === 0);

  return (
    <>
      <Section id="skills" className="bg-card-foreground/5">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Skills & Expertise</h2>
            {user && (
              <Button size="icon" variant="outline" onClick={handleAdd} title="Add Skills">
                <PlusCircle className="h-5 w-5" />
              </Button>
            )}
          </div>
          <p className="mt-2 text-lg text-muted-foreground">A snapshot of my technical and professional capabilities.</p>
        </div>

        {isLoading && !firestoreSkills && (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {user && isDbEmpty && (
          <div className="max-w-2xl mx-auto mb-12">
            <Card className="border-dashed border-2 bg-primary/5">
              <CardHeader className="text-center">
                <CardTitle className="text-primary text-lg flex items-center justify-center gap-2">
                  <Database className="h-5 w-5"/> Skills Setup
                </CardTitle>
              </CardHeader>
              <CardFooter className="justify-center">
                <Button onClick={handleSeed} disabled={isSeeding}>
                  {isSeeding ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Database className="mr-2 h-4 w-4"/>}
                  Seed Skills Database
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {skillCategories.map((category) => (
            <Card key={category.id} className="flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl font-headline text-foreground">{category.title}</CardTitle>
                {user && user.uid === category.ownerId && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(category)}>
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
                          <AlertDialogTitle>Delete skills?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently remove this category.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(category.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-sm font-medium">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
      <SkillFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
      />
    </>
  );
};

export default SkillsSection;
