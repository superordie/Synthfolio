'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioContent } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

const USER_ID = 'russell-robbins';

const SkillsSection = () => {
  const firestore = useFirestore();

  // Fetch live skills from simplified list path
  const skillsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'users', USER_ID, 'skills'), orderBy('name', 'asc'));
  }, [firestore]);

  const { data: liveSkills } = useCollection<{ name: string }>(skillsQuery);

  // Fallback to static data if no live skills exist
  const staticSkills = [
    ...portfolioContent.skills.technicalSkills,
    ...portfolioContent.skills.toolsAndTechnologies,
    ...portfolioContent.skills.professionalSoftSkills,
  ];

  return (
    <Section id="skills" className="bg-card-foreground/5">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Skills & Expertise</h2>
        <p className="mt-2 text-lg text-muted-foreground">A unified snapshot of my technical and professional capabilities.</p>
      </div>

      <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-headline text-foreground text-center">My Professional Toolkit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap justify-center gap-3">
            {liveSkills && liveSkills.length > 0 ? (
              liveSkills.map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-sm font-medium py-1.5 px-3">
                  {skill.name}
                </Badge>
              ))
            ) : (
              staticSkills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="text-sm font-medium py-1.5 px-3">
                  {skill}
                </Badge>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </Section>
  );
};

export default SkillsSection;