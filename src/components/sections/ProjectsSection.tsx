
'use client';

import { useState } from 'react';
import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Github, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { portfolioContent } from '@/lib/data';
import { useAdmin } from '@/hooks/use-admin';
import ProjectFormDialog from '@/components/ProjectFormDialog';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { addProject, updateProject, deleteProject, type Project } from '@/firebase/firestore/projects';

const ProjectsSection = () => {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Fetch live projects
  const projectsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'projects'), orderBy('projectTitle', 'asc'));
  }, [firestore]);

  const { data: liveProjects } = useCollection<Project>(projectsQuery);

  const displayedProjects = (liveProjects && liveProjects.length > 0) 
    ? liveProjects 
    : portfolioContent.projects.map((p, i) => ({ ...p, id: `static-${i}` }));

  const handleAdd = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: any) => {
    if (editingProject?.id && !editingProject.id.startsWith('static-')) {
      updateProject(firestore, editingProject.id, data);
    } else {
      addProject(firestore, 'russell-robbins', data);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this project?')) {
      deleteProject(firestore, id);
    }
  };

  return (
    <Section id="projects">
      <div className="text-center mb-12 relative">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Projects</h2>
        <p className="mt-2 text-lg text-muted-foreground">A selection of my work demonstrating my skills.</p>
        
        {isAdmin && (
          <Button onClick={handleAdd} size="sm" className="absolute top-0 right-0">
            <Plus className="h-4 w-4 mr-1" /> Add Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {displayedProjects.map((project: any) => (
          <Card key={project.id} className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300 relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="font-headline text-2xl">{project.projectTitle}</CardTitle>
                {isAdmin && !project.id.startsWith('static-') && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(project)}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
              <CardDescription className="pt-2 text-foreground/80">{project.projectPurposeProblemSolved}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="mb-4">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.toolsOrTechnologiesUsed.map((tool: string) => (
                    <Badge key={tool} variant="secondary">{tool}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">Skills Demonstrated</h4>
                <div className="flex flex-wrap gap-2">
                  {project.skillsDemonstrated.map((skill: string) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {project.projectLink && (
                <Button asChild variant="ghost" className="text-primary hover:text-primary px-0">
                  <Link href={project.projectLink} target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" /> View on GitHub <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <ProjectFormDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          onSubmit={handleSubmit} 
          project={editingProject}
        />
      )}
    </Section>
  );
};

export default ProjectsSection;
