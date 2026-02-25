'use client';

import { useState } from 'react';
import Section from '@/components/Section';
import { CheckCircle, Plus, Edit2, Trash2, Briefcase } from 'lucide-react';
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

  // Fetch live work experience from Firestore
  const expQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'experience'), orderBy('datesOfInvolvement', 'desc'));
  }, [firestore]);

  const { data: liveExp } = useCollection<Experience>(expQuery);

  // Ensure we have a working list, falling back to static data if no live data is found
  const displayedExp = (liveExp && liveExp.length > 0) 
    ? liveExp 
    : portfolioContent.workHistory.map((e, i) => ({ ...e, id: `static-${i}` }));

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsDialogOpen(true);
  };

  const handleEditExperience = (exp: any) => {
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

  const handleDeleteExperience = (id: string) => {
    if (confirm('Delete this professional experience?')) {
      deleteExperience(firestore, id);
    }
  };

  return (
    <Section id="experience">
      <div className="text-center mb-12 relative">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Briefcase className="h-8 w-8" />
          Professional Experience
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">My transition from transport logistics to technical management.</p>
        
        {isAdmin && (
          <Button onClick={handleAddExperience} size="sm" className="absolute top-0 right-0">
            <Plus className="h-4 w-4 mr-1" /> Add Role
          </Button>
        )}
      </div>

      <div className="relative max-w-3xl mx-auto border-l-2 border-primary/20 pl-8 space-y-12">
        {displayedExp.map((job: any) => (
          <div key={job.id} className="relative group">
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-sm" />
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-primary/80 uppercase tracking-widest">{job.datesOfInvolvement}</p>
                {isAdmin && !job.id.startsWith('static-') && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditExperience(job)}>
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDeleteExperience(job.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-headline font-bold text-foreground">{job.jobTitleRole}</h3>
              <p className="text-lg font-medium text-muted-foreground mb-4">{job.organizationCompany}</p>
              <ul className="space-y-3">
                  {job.keyResponsibilities.map((resp: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 mt-0.5 text-primary flex-shrink-0" />
                          <span className="text-foreground/80 leading-relaxed">{resp}</span>
                      </li>
                  ))}
              </ul>
          </div>
        ))}
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
