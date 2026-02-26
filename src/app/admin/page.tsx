'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Layers,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { db } from '@/firebase/config';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  updateHeroInfo, 
  saveProject, 
  deleteProjectAction, 
  updateSkillsCategory,
  deleteSkillsCategory,
  saveExperience,
  deleteExperienceAction,
  saveEducation,
  deleteEducationAction
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
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  
  // Editing states
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [editingSkillCat, setEditingSkillCat] = useState<any | null>(null);

  const ADMIN_PASSWORD = 'Li0nMast3r';

  // Real-time Data Fetching
  useEffect(() => {
    if (!isAdmin) return;

    const unsubHero = onSnapshot(doc(db, 'users', USER_ID, 'portfolio', 'bio'), (doc) => {
      if (doc.exists()) setHero(doc.data() as any);
    });

    const unsubProjects = onSnapshot(query(collection(db, 'users', USER_ID, 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubSkills = onSnapshot(collection(db, 'users', USER_ID, 'skills'), (snapshot) => {
      setSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubExp = onSnapshot(query(collection(db, 'users', USER_ID, 'experience'), orderBy('createdAt', 'desc')), (snapshot) => {
      setExperience(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubEdu = onSnapshot(query(collection(db, 'users', USER_ID, 'education'), orderBy('createdAt', 'desc')), (snapshot) => {
      setEducation(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubHero(); unsubProjects(); unsubSkills(); unsubExp(); unsubEdu();
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

  const handleSave = async (data: any, action: Function, setEditor: Function, title: string) => {
    setIsLoading(true);
    const res = await action(data);
    setIsLoading(false);
    if (res.success) {
      toast({ title: `${title} Saved` });
      setEditor(null);
    }
  };

  const handleDelete = async (id: string, action: Function, title: string) => {
    if (!confirm(`Delete this ${title}?`)) return;
    const res = await action(id);
    if (res.success) toast({ title: `${title} Deleted` });
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
          <TabsList className="bg-slate-900 border border-white/10 p-1 flex flex-wrap h-auto">
            <TabsTrigger value="bio" className="gap-2"><User className="h-4 w-4" /> Bio</TabsTrigger>
            <TabsTrigger value="projects" className="gap-2"><Layers className="h-4 w-4" /> Projects</TabsTrigger>
            <TabsTrigger value="skills" className="gap-2"><Plus className="h-4 w-4" /> Skills</TabsTrigger>
            <TabsTrigger value="experience" className="gap-2"><Briefcase className="h-4 w-4" /> Experience</TabsTrigger>
            <TabsTrigger value="education" className="gap-2"><GraduationCap className="h-4 w-4" /> Education</TabsTrigger>
          </TabsList>

          <TabsContent value="bio">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader><CardTitle>Core Identity</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={handleHeroUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input placeholder="Full Name" value={hero.name} onChange={(e) => setHero({...hero, name: e.target.value})} className="bg-slate-800 border-slate-700" />
                    <Input placeholder="Title" value={hero.title} onChange={(e) => setHero({...hero, title: e.target.value})} className="bg-slate-800 border-slate-700" />
                  </div>
                  <Textarea rows={8} placeholder="About Me" value={hero.about} onChange={(e) => setHero({...hero, about: e.target.value})} className="bg-slate-800 border-slate-700" />
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />} Save Bio
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Projects</h2>
              <Button onClick={() => setEditingProject({ projectTitle: '', projectPurposeProblemSolved: '', toolsOrTechnologiesUsed: [], projectLink: '' })} className="gap-2">
                <Plus className="h-4 w-4" /> New Project
              </Button>
            </div>
            {editingProject && (
              <Card className="bg-slate-900 border-primary/50 text-white">
                <CardHeader><CardTitle>{editingProject.id ? 'Edit' : 'New'} Project</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Title" value={editingProject.projectTitle} onChange={(e) => setEditingProject({...editingProject, projectTitle: e.target.value})} className="bg-slate-800 border-slate-700" />
                  <Textarea placeholder="Description" value={editingProject.projectPurposeProblemSolved} onChange={(e) => setEditingProject({...editingProject, projectPurposeProblemSolved: e.target.value})} className="bg-slate-800 border-slate-700" />
                  <Input placeholder="Stack (comma separated)" value={editingProject.toolsOrTechnologiesUsed?.join(', ')} onChange={(e) => setEditingProject({...editingProject, toolsOrTechnologiesUsed: e.target.value.split(',').map(s => s.trim())})} className="bg-slate-800 border-slate-700" />
                  <Input placeholder="GitHub Link" value={editingProject.projectLink} onChange={(e) => setEditingProject({...editingProject, projectLink: e.target.value})} className="bg-slate-800 border-slate-700" />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(editingProject, saveProject, setEditingProject, 'Project')}>Save</Button>
                    <Button variant="ghost" onClick={() => setEditingProject(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <Card key={p.id} className="bg-slate-900 border-white/5 flex flex-row items-center justify-between p-4">
                  <span className="font-semibold">{p.projectTitle}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingProject(p)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(p.id, deleteProjectAction, 'Project')}><Trash className="h-4 w-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Skills</h2>
              <Button onClick={() => setEditingSkillCat({ title: '', skills: [] })} className="gap-2">
                <Plus className="h-4 w-4" /> New Category
              </Button>
            </div>
            {editingSkillCat && (
              <Card className="bg-slate-900 border-primary/50 text-white p-4 space-y-4">
                <Input placeholder="Category Title" value={editingSkillCat.title} onChange={(e) => setEditingSkillCat({...editingSkillCat, title: e.target.value})} className="bg-slate-800 border-slate-700" />
                <Input placeholder="Skills (comma separated)" value={editingSkillCat.skills?.join(', ')} onChange={(e) => setEditingSkillCat({...editingSkillCat, skills: e.target.value.split(',').map(s => s.trim())})} className="bg-slate-800 border-slate-700" />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(editingSkillCat, updateSkillsCategory, setEditingSkillCat, 'Skills Category')}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingSkillCat(null)}>Cancel</Button>
                </div>
              </Card>
            )}
            <div className="grid grid-cols-1 gap-4">
              {skills.map(s => (
                <Card key={s.id} className="bg-slate-900 border-white/5 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{s.title}</h3>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {s.skills.map((sk: string, i: number) => <Badge key={i} variant="secondary">{sk}</Badge>)}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditingSkillCat(s)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(s.id, deleteSkillsCategory, 'Category')}><Trash className="h-4 w-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Experience</h2>
              <Button onClick={() => setEditingExp({ jobTitleRole: '', organizationCompany: '', datesOfInvolvement: '', keyResponsibilities: [] })}><Plus className="h-4 w-4 mr-2" /> Add</Button>
            </div>
            {editingExp && (
              <Card className="bg-slate-900 border-primary/50 p-4 space-y-4">
                <Input placeholder="Job Title" value={editingExp.jobTitleRole} onChange={(e) => setEditingExp({...editingExp, jobTitleRole: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Company" value={editingExp.organizationCompany} onChange={(e) => setEditingExp({...editingExp, organizationCompany: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Dates" value={editingExp.datesOfInvolvement} onChange={(e) => setEditingExp({...editingExp, datesOfInvolvement: e.target.value})} className="bg-slate-800" />
                <Textarea placeholder="Responsibilities (one per line)" value={editingExp.keyResponsibilities?.join('\n')} onChange={(e) => setEditingExp({...editingExp, keyResponsibilities: e.target.value.split('\n')})} className="bg-slate-800" />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(editingExp, saveExperience, setEditingExp, 'Experience')}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingExp(null)}>Cancel</Button>
                </div>
              </Card>
            )}
            {experience.map(e => (
              <Card key={e.id} className="bg-slate-900 border-white/5 p-4 flex justify-between items-center">
                <span>{e.jobTitleRole} @ {e.organizationCompany}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditingExp(e)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(e.id, deleteExperienceAction, 'Experience')}><Trash className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Education</h2>
              <Button onClick={() => setEditingEdu({ degreeProgramName: '', institutionName: '', completionDate: '', relevantCourseworkOrFocusAreas: [] })}><Plus className="h-4 w-4 mr-2" /> Add</Button>
            </div>
            {editingEdu && (
              <Card className="bg-slate-900 border-primary/50 p-4 space-y-4">
                <Input placeholder="Degree" value={editingEdu.degreeProgramName} onChange={(e) => setEditingEdu({...editingEdu, degreeProgramName: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Institution" value={editingEdu.institutionName} onChange={(e) => setEditingEdu({...editingEdu, institutionName: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Completion Date" value={editingEdu.completionDate} onChange={(e) => setEditingEdu({...editingEdu, completionDate: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Coursework (comma separated)" value={editingEdu.relevantCourseworkOrFocusAreas?.join(', ')} onChange={(e) => setEditingEdu({...editingEdu, relevantCourseworkOrFocusAreas: e.target.value.split(',').map(s => s.trim())})} className="bg-slate-800" />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(editingEdu, saveEducation, setEditingEdu, 'Education')}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingEdu(null)}>Cancel</Button>
                </div>
              </Card>
            )}
            {education.map(e => (
              <Card key={e.id} className="bg-slate-900 border-white/5 p-4 flex justify-between items-center">
                <span>{e.degreeProgramName} from {e.institutionName}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditingEdu(e)}><Edit className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(e.id, deleteEducationAction, 'Education')}><Trash className="h-4 w-4" /></Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
