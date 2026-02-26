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

  const skillsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'users', USER_ID, 'portfolio', 'content', 'skills'), orderBy('createdAt', 'asc'));
  }, [firestore]);

  const { data: liveCategories } = useCollection(skillsQuery);

  const staticCategories = [
    { title: 'Technical Skills', skills: portfolioContent.skills.technicalSkills },
    { title: 'Tools & Technologies', skills: portfolioContent.skills.toolsAndTechnologies },
    { title: 'Professional & Soft Skills', skills: portfolioContent.skills.professionalSoftSkills },
  ];

  const displayedCategories = (liveCategories && liveCategories.length > 0) ? liveCategories : staticCategories;

  return (
    <Section id="skills" className="bg-card-foreground/5">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Skills & Expertise</h2>
        <p className="mt-2 text-lg text-muted-foreground">My technical and professional toolkit, organized by category.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedCategories.map((cat: any, i: number) => (
          <Card key={cat.id || i} className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline text-foreground">{cat.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {cat.skills?.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="text-xs font-medium py-1 px-2.5">
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