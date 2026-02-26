'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioContent } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { SkillCategory } from '@/firebase/firestore/skills';

const USER_ID = 'russell-robbins';

const SkillsSection = () => {
  const firestore = useFirestore();

  // Fetch live skills from updated path: users/russell-robbins/skills
  const skillsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'users', USER_ID, 'skills'), orderBy('title', 'asc'));
  }, [firestore]);

  const { data: liveSkills } = useCollection<SkillCategory>(skillsQuery);

  const staticCategories = [
    { id: 'static-1', title: 'Technical Skills', skills: portfolioContent.skills.technicalSkills },
    { id: 'static-2', title: 'Tools & Technologies', skills: portfolioContent.skills.toolsAndTechnologies },
    { id: 'static-3', title: 'Professional & Soft Skills', skills: portfolioContent.skills.professionalSoftSkills },
  ];

  const displayedCategories = (liveSkills && liveSkills.length > 0) ? liveSkills : staticCategories;

  return (
    <Section id="skills" className="bg-card-foreground/5">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Skills & Expertise</h2>
        <p className="mt-2 text-lg text-muted-foreground">A snapshot of my technical and professional capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayedCategories.map((category) => (
          <Card key={category.id} className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300 relative shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl font-headline text-foreground">{category.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {category.skills?.map((skill) => (
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
  );
};

export default SkillsSection;
