'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioContent } from '@/lib/data';

const SkillsSection = () => {
  const skillCategories = [
    { id: '1', title: 'Technical Skills', skills: portfolioContent.skills.technicalSkills },
    { id: '2', title: 'Tools & Technologies', skills: portfolioContent.skills.toolsAndTechnologies },
    { id: '3', title: 'Professional & Soft Skills', skills: portfolioContent.skills.professionalSoftSkills },
  ];

  return (
    <Section id="skills" className="bg-card-foreground/5">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Skills & Expertise</h2>
        <p className="mt-2 text-lg text-muted-foreground">A snapshot of my technical and professional capabilities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {skillCategories.map((category) => (
          <Card key={category.id} className="flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl font-headline text-foreground">{category.title}</CardTitle>
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
  );
};

export default SkillsSection;
