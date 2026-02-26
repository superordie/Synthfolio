'use client';

import Section from '@/components/Section';
import { CheckCircle, Briefcase } from 'lucide-react';
import { portfolioContent } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

const USER_ID = 'russell-robbins';

const ExperienceSection = () => {
  const firestore = useFirestore();

  const expQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'users', USER_ID, 'portfolio', 'content', 'experience'), orderBy('createdAt', 'desc'));
  }, [firestore]);
  const { data: liveExp } = useCollection(expQuery);

  const displayedExp = (liveExp && liveExp.length > 0) 
    ? liveExp 
    : portfolioContent.workHistory.map((e, i) => ({ ...e, id: `static-${i}` }));

  return (
    <Section id="experience">
      <div className="text-center mb-12 relative">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-2">
          <Briefcase className="h-8 w-8" />
          Professional Experience
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">My transition from transport logistics to technical management.</p>
      </div>

      <div className="relative max-w-3xl mx-auto border-l-2 border-primary/20 pl-8 space-y-12">
        {displayedExp.map((job: any) => (
          <div key={job.id} className="relative group">
              <div className="absolute -left-[41px] top-1.5 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-sm" />
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-bold text-primary/80 uppercase tracking-widest">{job.datesOfInvolvement}</p>
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
    </Section>
  );
};

export default ExperienceSection;