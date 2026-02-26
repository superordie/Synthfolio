'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  GraduationCap,
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { db } from '@/firebase/config';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  updateHeroInfo, 
  saveProject, 
  deleteProjectAction, 
  saveSkillCategory,
  deleteSkillCategoryAction,
  saveExperience,
  deleteExperienceAction,
  saveEducation,
  deleteEducationAction,
  restorePortfolioData
} from './actions';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const USER_ID = 'russell-robbins';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { isAdmin, login, logout } = useAdmin();
  const { toast } = useToast();

  const [hero, setHero] = useState({ name: '', title: '', about: '' });
  const [projects, setProjects] = useState<any[]>([]);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [experience, setExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [editingCat, setEditingCat] = useState<any | null>(null);
  const [newSkillNames, setNewSkillNames] = useState<Record<string, string>>({});

  const ADMIN_PASSWORD = 'Li0nMast3r';

  useEffect(() => {
    if (!isAdmin) return;

    // Listeners for 5-segment collection paths
    const unsubHero = onSnapshot(doc(db, 'users', USER_ID, 'portfolio', 'bio'), (doc) => {
      if (doc.exists()) setHero(doc.data() as any);
    });

    const unsubProjects = onSnapshot(query(collection(db, 'users', USER_ID, 'portfolio', 'content', 'projects'), orderBy('createdAt', 'desc')), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubSkills = onSnapshot(query(collection(db, 'users', USER_ID, 'portfolio', 'content', 'skills'), orderBy('createdAt', 'asc')), (snapshot) => {
      setSkillCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubExp = onSnapshot(query(collection(db, 'users', USER_ID, 'portfolio', 'content', 'experience'), orderBy('createdAt', 'desc')), (snapshot) => {
      setExperience(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubEdu = onSnapshot(query(collection(db, 'users', USER_ID, 'portfolio', 'content', 'education'), orderBy('createdAt', 'desc')), (snapshot) => {
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

  const handleRestore = async () => {
    if (!confirm("This will upload all original data to Firestore. Existing live items will be kept. Continue?")) return;
    setIsRestoring(true);
    const res = await restorePortfolioData();
    setIsRestoring(false);
    if (res.success) {
      toast({ title: "Portfolio Restored", description: "Original data is now live." });
    } else {
      toast({ title: "Restoration Failed", description: res.error, variant: "destructive" });
    }
  };

  const handleSave = async (data: any, action: Function, setEditor: Function, title: string) => {
    setIsLoading(true);
    const res = await action(data);
    setIsLoading(false);
    if (res.success) {
      toast({ title: `${title} Saved` });
      setEditor(null);
    } else {
      toast({ title: "Error", description: res.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: string, action: Function, title: string) => {
    if (!confirm(`Are you sure you want to delete this ${title}?`)) return;
    const res = await action(id);
    if (res.success) toast({ title: `${title} Deleted` });
  };

  const handleAddSkillToCategory = async (cat: any) => {
    const skillName = newSkillNames[cat.id];
    if (!skillName?.trim()) return;
    const updatedSkills = [...(cat.skills || []), skillName.trim()];
    const res = await saveSkillCategory({ ...cat, skills: updatedSkills });
    if (res.success) {
      setNewSkillNames(prev => ({ ...prev, [cat.id]: '' }));
    }
  };

  const handleRemoveSkillFromCategory = async (cat: any, skillToRemove: string) => {
    const updatedSkills = cat.skills.filter((s: string) => s !== skillToRemove);
    await saveSkillCategory({ ...cat, skills: updatedSkills });
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <Card className="w-full max-w-md border-white/10 bg-slate-900 text-white">
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
            <h1 className="text-3xl font-bold font-headline">CMS Dashboard</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleRestore} disabled={isRestoring}>
              {isRestoring ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Restore Data
            </Button>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>

        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="bg-slate-900 border border-white/10 p-1">
            <TabsTrigger value="bio">Bio</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          <TabsContent value="bio">
            <Card className="bg-slate-900 border-white/10 text-white">
              <CardHeader><CardTitle>Identity</CardTitle></CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave(hero, updateHeroInfo, () => {}, 'Bio'); }} className="space-y-4">
                  <Input value={hero.name} onChange={(e) => setHero({...hero, name: e.target.value})} placeholder="Name" className="bg-slate-800 border-slate-700" />
                  <Input value={hero.title} onChange={(e) => setHero({...hero, title: e.target.value})} placeholder="Title" className="bg-slate-800 border-slate-700" />
                  <Textarea rows={6} value={hero.about} onChange={(e) => setHero({...hero, about: e.target.value})} placeholder="About" className="bg-slate-800 border-slate-700" />
                  <Button type="submit" disabled={isLoading}><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Projects</h2>
              <Button onClick={() => setEditingProject({ projectTitle: '', projectPurposeProblemSolved: '', toolsOrTechnologiesUsed: [], projectLink: '' })}>
                <Plus className="h-4 w-4 mr-2" /> New Project
              </Button>
            </div>

            {projects.length === 0 && !editingProject && (
              <Alert className="bg-slate-900 border-primary/20">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle>No projects found</AlertTitle>
                <AlertDescription>Click "Restore Data" to upload your original projects or add a new one.</AlertDescription>
              </Alert>
            )}

            {editingProject && (
              <Card className="bg-slate-900 border-primary/50 text-white">
                <CardHeader><CardTitle>{editingProject.id ? 'Edit' : 'Add'} Project</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Title" value={editingProject.projectTitle} onChange={(e) => setEditingProject({...editingProject, projectTitle: e.target.value})} className="bg-slate-800" />
                  <Textarea placeholder="Summary" value={editingProject.projectPurposeProblemSolved} onChange={(e) => setEditingProject({...editingProject, projectPurposeProblemSolved: e.target.value})} className="bg-slate-800" />
                  <Input placeholder="Technologies (csv)" value={editingProject.toolsOrTechnologiesUsed?.join(', ')} onChange={(e) => setEditingProject({...editingProject, toolsOrTechnologiesUsed: e.target.value.split(',').map(s => s.trim())})} className="bg-slate-800" />
                  <Input placeholder="GitHub Link" value={editingProject.projectLink} onChange={(e) => setEditingProject({...editingProject, projectLink: e.target.value})} className="bg-slate-800" />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(editingProject, saveProject, setEditingProject, 'Project')}>Save</Button>
                    <Button variant="ghost" onClick={() => setEditingProject(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(p => (
                <Card key={p.id} className="bg-slate-900 border-white/5">
                  <CardHeader>
                    <CardTitle className="text-lg">{p.projectTitle}</CardTitle>
                    <CardDescription className="line-clamp-2">{p.projectPurposeProblemSolved}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingProject(p)}><Edit className="h-4 w-4 mr-2" /> Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id, deleteProjectAction, 'Project')}><Trash className="h-4 w-4 mr-2" /> Delete</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Skills</h2>
              <Button onClick={() => setEditingCat({ title: '', skills: [] })}><Plus className="h-4 w-4 mr-2" /> New Category</Button>
            </div>

            {editingCat && (
              <Card className="bg-slate-900 border-primary/50 text-white mb-4">
                <CardHeader><CardTitle>New Category</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <Input placeholder="Title" value={editingCat.title} onChange={(e) => setEditingCat({...editingCat, title: e.target.value})} className="bg-slate-800" />
                  <div className="flex gap-2">
                    <Button onClick={() => handleSave(editingCat, saveSkillCategory, setEditingCat, 'Category')}>Save</Button>
                    <Button variant="ghost" onClick={() => setEditingCat(null)}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <Accordion type="single" collapsible className="space-y-2">
              {skillCategories.map(cat => (
                <AccordionItem key={cat.id} value={cat.id} className="bg-slate-900 border-white/5 px-4 rounded-lg">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-4">
                      <span className="font-bold">{cat.title}</span>
                      <Badge variant="secondary">{cat.skills?.length || 0} skills</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 space-y-4">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add skill..." 
                        value={newSkillNames[cat.id] || ''} 
                        onChange={(e) => setNewSkillNames(prev => ({ ...prev, [cat.id]: e.target.value }))}
                        className="bg-slate-800"
                      />
                      <Button onClick={() => handleAddSkillToCategory(cat)} size="sm">Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {cat.skills?.map((s: string) => (
                        <Badge key={s} variant="outline" className="flex gap-2 py-1 pr-1">
                          {s} <button onClick={() => handleRemoveSkillFromCategory(cat, s)} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(cat.id, deleteSkillCategoryAction, 'Category')}><Trash className="h-4 w-4 mr-2" /> Delete Category</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          <TabsContent value="experience" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Experience</h2>
              <Button onClick={() => setEditingExp({ jobTitleRole: '', organizationCompany: '', datesOfInvolvement: '', keyResponsibilities: [] })}>
                <Plus className="h-4 w-4 mr-2" /> New Entry
              </Button>
            </div>
            {editingExp && (
              <Card className="bg-slate-900 border-primary/50 p-4 space-y-4">
                <Input placeholder="Role" value={editingExp.jobTitleRole} onChange={(e) => setEditingExp({...editingExp, jobTitleRole: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Company" value={editingExp.organizationCompany} onChange={(e) => setEditingExp({...editingExp, organizationCompany: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Dates" value={editingExp.datesOfInvolvement} onChange={(e) => setEditingExp({...editingExp, datesOfInvolvement: e.target.value})} className="bg-slate-800" />
                <Textarea placeholder="Responsibilities (newline)" value={editingExp.keyResponsibilities?.join('\n')} onChange={(e) => setEditingExp({...editingExp, keyResponsibilities: e.target.value.split('\n')})} className="bg-slate-800" />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(editingExp, saveExperience, setEditingExp, 'Experience')}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingExp(null)}>Cancel</Button>
                </div>
              </Card>
            )}
            <div className="space-y-4">
              {experience.map(e => (
                <Card key={e.id} className="bg-slate-900 border-white/5 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{e.jobTitleRole}</h3>
                    <p className="text-sm text-slate-400">{e.organizationCompany} &bull; {e.datesOfInvolvement}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingExp(e)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id, deleteExperienceAction, 'Experience')}><Trash className="h-4 w-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="education" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-headline">Education</h2>
              <Button onClick={() => setEditingEdu({ degreeProgramName: '', institutionName: '', completionDate: '' })}>
                <Plus className="h-4 w-4 mr-2" /> New Entry
              </Button>
            </div>
            {editingEdu && (
              <Card className="bg-slate-900 border-primary/50 p-4 space-y-4">
                <Input placeholder="Degree" value={editingEdu.degreeProgramName} onChange={(e) => setEditingEdu({...editingEdu, degreeProgramName: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Institution" value={editingEdu.institutionName} onChange={(e) => setEditingEdu({...editingEdu, institutionName: e.target.value})} className="bg-slate-800" />
                <Input placeholder="Date" value={editingEdu.completionDate} onChange={(e) => setEditingEdu({...editingEdu, completionDate: e.target.value})} className="bg-slate-800" />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(editingEdu, saveEducation, setEditingEdu, 'Education')}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingEdu(null)}>Cancel</Button>
                </div>
              </Card>
            )}
            <div className="space-y-4">
              {education.map(e => (
                <Card key={e.id} className="bg-slate-900 border-white/5 p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{e.degreeProgramName}</h3>
                    <p className="text-sm text-slate-400">{e.institutionName} &bull; {e.completionDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingEdu(e)}><Edit className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(e.id, deleteEducationAction, 'Education')}><Trash className="h-4 w-4" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}