'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, Github, PlusCircle, Edit, Trash2, Loader2, Database } from 'lucide-react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useState } from 'react';
import { seedProjects, addProject, updateProject, deleteProject, type Project } from '@/firebase/firestore/projects';
import { useToast } from '@/hooks/use-toast';
import ProjectFormDialog from '../ProjectFormDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useMemoFirebase } from '@/hooks/use-memo-firebase';

const ProjectsSection = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const projectsQuery = useMemoFirebase(() =>
    firestore ? collection(firestore, 'projects') : null
  , [firestore]);
  
  const { data: projects, loading: projectsLoading } = useCollection<Project>(projectsQuery);

  const [isSeeding, setIsSeeding] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleSeedProjects = async () => {
    if (!firestore || !user) return;
    setIsSeeding(true);
    try {
      await seedProjects(firestore, user.uid);
      toast({
        title: 'Success',
        description: 'Initial projects have been added to the database.',
      });
    } catch (error: any) {
      toast({
        title: 'Error Seeding Projects',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleAddClick = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  }

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setIsFormOpen(true);
  }

  const handleDeleteProject = (projectId: string) => {
    if (!firestore) return;
    deleteProject(firestore, projectId);
    toast({ title: 'Success', description: 'Project deleted.' });
  }

  const handleFormSubmit = (data: Omit<Project, 'id' | 'ownerId'>) => {
    if (!firestore || !user) return;

    if (selectedProject) {
      // Update
      updateProject(firestore, selectedProject.id, data);
      toast({ title: 'Success', description: 'Project updated.'});
    } else {
      // Create
      addProject(firestore, user.uid, data);
      toast({ title: 'Success', description: 'Project added.' });
    }
  };

  const isLoading = userLoading || projectsLoading;

  return (
    <>
      <Section id="projects">
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-4">
            <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Projects</h2>
            {user && (
              <Button size="icon" variant="outline" onClick={handleAddClick}>
                <PlusCircle />
                <span className="sr-only">Add Project</span>
              </Button>
            )}
          </div>
          <p className="mt-2 text-lg text-muted-foreground">A selection of my work demonstrating my skills.</p>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        )}

        {!isLoading && projects && projects.length === 0 && (
          <div className="text-center max-w-lg mx-auto">
            <p>No projects found in the database.</p>
            {user && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Database/> Seed Initial Data</CardTitle>
                  <CardDescription>
                    Your projects database is empty. You can seed it with the initial projects from the portfolio template.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button onClick={handleSeedProjects} disabled={isSeeding}>
                    {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                    Seed Projects
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects && projects.map((project) => (
            <Card key={project.id} className="flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300">
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
              <CardFooter className="justify-between">
                {project.projectLink && (
                  <Button asChild variant="ghost" className="text-primary hover:text-primary px-0">
                      <Link href={project.projectLink} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" /> View on GitHub <ArrowUpRight className="ml-2 h-4 w-4" />
                      </Link>
                  </Button>
                )}
                {user && user.uid === project.ownerId && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => handleEditClick(project)}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project
                            from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProject(project.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </Section>
      {user && (
        <ProjectFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          project={selectedProject}
        />
      )}
    </>
  );
};

export default ProjectsSection;
