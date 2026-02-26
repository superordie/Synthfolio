'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/use-admin';
import { 
  Lock, 
  Unlock, 
  Loader2, 
  Plus, 
  Trash, 
  Save, 
  Edit, 
  User, 
  LogOut,
  Layers
} from 'lucide-react';
import { db } from '@/firebase/config';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  updateHeroInfo, 
  saveProject, 
  deleteProjectAction, 
  updateSkillsCategory,
  deleteSkillsCategory
} from './actions';
import { Badge } from '@/components/ui/badge';

const USER_ID = 'russell-robbins';

export default function AdminCMS() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, login, logout } = useAdmin();
  const { toast } = useToast();

  // CMS State
  const [hero, setHero] = useState({ name: '', title: '', about: '' });
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  const ADMIN_PASSWORD = 'Li0nMast3r';

  // Real-time Data Fetching
  useEffect(() => {
    if (!isAdmin) return;

    // Fetch Hero (Doc - 5 segments)
    const heroRef = doc(db, 'users', USER_ID, 'portfolio', 'bio');
    const unsubHero = onSnapshot(heroRef, (doc) => {
      if (doc.exists()) setHero(doc.data() as any);
    });

    // Fetch Projects (Collection - 3 segments)
    const projectsRef = collection(db, 'users', USER_ID, 'projects');
    const unsubProjects = onSnapshot(query(projectsRef, orderBy('createdAt', 'desc')), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Skills (Collection - 3 segments)
    const skillsRef = collection(db, 'users', USER_ID, 'skills');
    const unsubSkills = onSnapshot(skillsRef, (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubHero();
      unsubProjects();
      unsubSkills();
    };
  }, [isAdmin]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      login();
      toast({ title: "Access Granted" });
    } else {
      toast({ title: "Access Denied", variant: "destructive" });
    }
  };

  const handleHeroUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await updateHeroInfo(hero);
    setIsLoading(false);
    if (res.success) toast({ title: "Hero Updated" });
  };

  const handleProjectSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await saveProject(editingProject);
    setIsLoading(false);
    if (res.success) {
      toast({ title: "Project Saved" });
      setEditingProject(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <Card className="w-full max-w-md border-white/10 bg-slate-900 text-white shadow-2xl">
          <CardHeader className="text-center">
            <Lock className="mx-auto text-primary h-8 w-8 mb-4" />
            <CardTitle className="text-2xl font-bold font-headline">Portfolio Admin</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Admin Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              <Button type="submit" className="w-full font-bold">Log In</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <Unlock className="text-primary h-6 w-6" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">Portfolio CMS</h1>
          </div>
          <Button variant="outline" onClick={logout} className="gap-2">
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-slate-900 border border-white/10 p-1">
            <TabsTrigger value="bio" className="gap-2"><User className="h-4 w-4" /> Bio</TabsTrigger>
            <TabsTrigger value="projects" className="gap-2"><Layers className="h-4 w-4" /> Projects</TabsTrigger>
            <TabsTrigger value="skills" className="gap-2"><Plus className="h-4 w-4" /> Skills</TabsTrigger>
          </TabsList>

          <TabsContent value="bio">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Core Identity</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleHeroUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Full Name</label>
                      <Input 
                        value={hero.name} 
                        onChange={(e) => setHero({...hero, name: e.target.value})}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Title</label>
                      <Input 
                        value={hero.title} 
                        onChange={(e) => setHero({...hero, title: e.target.value})}
                        className="bg-slate-800 border-slate-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">About Me</label>
                    <Textarea 
                      rows={8}
                      value={hero.about} 
                      onChange={(e) => setHero({...hero, about: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
                    Save Bio
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Projects</h2>
              <Button onClick={() => setEditingProject({ projectTitle: '', projectPurposeProblemSolved: '', toolsOrTechnologiesUsed: [], projectLink: '' })} className="gap-2">
                <Plus className="h-4 w-4" /> Add Project
              </Button>
            </div>

            {editingProject && (
              <Card className="bg-slate-900 border-primary/50 text-white">
                <CardHeader>
                  <CardTitle>{editingProject.id ? 'Edit Project' : 'New Project'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProjectSave} className="space-y-4">
                    <Input 
                      placeholder="Title"
                      value={editingProject.projectTitle}
                      onChange={(e) => setEditingProject({...editingProject, projectTitle: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                    />
                    <Textarea 
                      placeholder="Description"
                      value={editingProject.projectPurposeProblemSolved}
                      onChange={(e) => setEditingProject({...editingProject, projectPurposeProblemSolved: e.target.value})}
                      className="bg-slate-800 border-slate-700"
                    />
                    <Input 
                      placeholder="Stack (comma separated)"
                      value={editingProject.toolsOrTechnologiesUsed?.join(', ')}
                      onChange={(e) => setEditingProject({...editingProject, toolsOrTechnologiesUsed: e.target.value.split(',').map(s => s.trim())})}
                      className="bg-slate-800 border-slate-700"
                    />
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isLoading}>Save</Button>
                      <Button type="button" variant="ghost" onClick={() => setEditingProject(null)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(proj => (
                <Card key={proj.id} className="bg-slate-900 border-white/5">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-lg">{proj.projectTitle}</CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setEditingProject(proj)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteProjectAction(proj.id)}><Trash className="h-4 w-4" /></Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader>
                <CardTitle>Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {skills.map(cat => (
                  <div key={cat.id} className="p-4 rounded-lg bg-slate-800/50 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{cat.title}</h3>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteSkillsCategory(cat.id)}>
                        <Trash className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills.map((s: string, idx: number) => (
                        <Badge key={idx} variant="outline">{s}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full border-dashed"
                  onClick={() => {
                    const title = prompt("New Category?");
                    if (title) updateSkillsCategory({ title, skills: [] });
                  }}
                >
                  <Plus className="h-4 w-4" /> New Category
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
