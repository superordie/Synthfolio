
'use client';

import { useState } from 'react';
import Section from '@/components/Section';
import { CheckCircle, Plus, Edit2, Trash2 } from 'lucide-react';
import { portfolioContent } from '@/lib/data';
import { useAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import ExperienceFormDialog from '@/components/ExperienceFormDialog';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { addExperience, updateExperience, deleteExperience, type Experience } from '@/firebase/firestore/experience';

const ExperienceSection = () => {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  // Fetch live experience
  const expQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'experience'), orderBy('datesOfInvolvement', 'desc'));
  }, [firestore]);

  const { data: liveExp } = useCollection<Experience>(expQuery);

  const displayedExp = (liveExp && liveExp.length > 0) 
    ? liveExp 
    : portfolioContent.workHistory.map((e, i) => ({ ...e, id: `static-${i}` }));

  const handleAdd = () => {
    setEditingExperience(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (exp: any) => {
    setEditingExperience(exp);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingExperience?.id && !editingExperience.id.startsWith('static-')) {
      updateExperience(firestore, editingExperience.id, data);
    } else {
      addExperience(firestore, 'russell-robbins', data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this experience?')) {
      deleteExperience(firestore, id);
    }
  };

  return (
    <Section id="experience">
      <div className="text-center mb-12 relative">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Work Experience</h2>
        <p className="mt-2 text-lg text-muted-foreground">My professional journey and key accomplishments.</p>
        
        {isAdmin && (
          <Button onClick={handleAdd} size="sm" className="absolute top-0 right-0">
            <Plus className="h-4 w-4 mr-1" /> Add Experience
          </Button>
        )}
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="space-y-12">
          {displayedExp.map((job: any) => (
            <div key={job.id} className="pl-12 relative group">
                <div className="absolute left-4 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-muted-foreground">{job.datesOfInvolvement}</p>
                  {isAdmin && !job.id.startsWith('static-') && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(job)}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(job.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-headline font-bold text-foreground">{job.jobTitleRole}</h3>
                <p className="text-base font-medium text-foreground/80">{job.organizationCompany}</p>
                <ul className="mt-4 space-y-2">
                    {job.keyResponsibilities.map((resp: string, i: number) => (
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

      <ExperienceFormDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSubmit={handleSubmit} 
        experience={editingExperience}
      />
    </Section>
  );
};

export default ExperienceSection;
