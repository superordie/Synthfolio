'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';
import { portfolioContent } from '@/lib/data';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';

const USER_ID = 'russell-robbins';

const ProjectsSection = () => {
  const firestore = useFirestore();

  // Unified 5-segment path
  const projectsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'users', USER_ID, 'portfolio', 'content', 'projects'));
  }, [firestore]);

  const { data: liveProjects } = useCollection(projectsQuery);

  const displayedProjects = (liveProjects && liveProjects.length > 0) 
    ? liveProjects 
    : portfolioContent.projects.map((p, i) => ({ ...p, id: `static-p-${i}` }));

  return (
    <Section id="projects">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Featured Projects</h2>
        <p className="mt-2 text-lg text-muted-foreground">Showcasing technical problem-solving and AI-driven development.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedProjects.map((project: any) => (
          <Card key={project.id} className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 relative shadow-sm hover:shadow-md">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{project.projectTitle}</CardTitle>
              <CardDescription className="pt-2 text-foreground/80 line-clamp-3">
                {project.projectPurposeProblemSolved}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.toolsOrTechnologiesUsed?.map((tool: string) => (
                    <Badge key={tool} variant="secondary">{tool}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4">
              {project.projectLink && (
                <Button asChild variant="ghost" className="text-primary p-0 h-auto font-semibold">
                  <Link href={project.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    <Github className="mr-2 h-4 w-4" /> View Source <ArrowUpRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </Section>
  );
};

export default ProjectsSection;