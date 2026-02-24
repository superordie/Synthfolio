import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioContent } from '@/lib/data';
import { ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';

const ProjectsSection = () => {
  return (
    <Section id="projects">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Projects</h2>
        <p className="mt-2 text-lg text-muted-foreground">A selection of my work demonstrating my skills.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {portfolioContent.projects.map((project) => (
          <Card key={project.projectTitle} className="flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{project.projectTitle}</CardTitle>
              <CardDescription className="pt-2 text-foreground/80">{project.projectPurposeProblemSolved}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.toolsOrTechnologiesUsed.map((tool) => (
                    <Badge key={tool} variant="secondary">{tool}</Badge>
                  ))}
                </div>
              </div>
               <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Skills Demonstrated</h4>
                <div className="flex flex-wrap gap-2">
                  {project.skillsDemonstrated.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {project.projectLink && (
                 <Button asChild variant="ghost" className="text-primary hover:text-primary">
                    <Link href={project.projectLink} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" /> View on GitHub <ArrowUpRight className="ml-2 h-4 w-4" />
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
