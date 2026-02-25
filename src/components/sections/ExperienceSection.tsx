'use client';

import Section from '@/components/Section';
import { CheckCircle } from 'lucide-react';
import { portfolioContent } from '@/lib/data';

const ExperienceSection = () => {
  return (
    <Section id="experience">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Work Experience</h2>
        <p className="mt-2 text-lg text-muted-foreground">My professional journey and key accomplishments.</p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div className="space-y-12">
          {portfolioContent.workHistory.map((job, index) => (
            <div key={index} className="pl-12 relative group">
                <div className="absolute left-4 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-muted-foreground">{job.datesOfInvolvement}</p>
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
  );
};

export default ExperienceSection;
