'use client';

import { useState } from 'react';
import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { portfolioContent } from '@/lib/data';
import { useAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import SkillFormDialog from '@/components/SkillFormDialog';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { addSkillCategory, updateSkillCategory, deleteSkillCategory, type SkillCategory } from '@/firebase/firestore/skills';

const SkillsSection = () => {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);

  // Fetch live skills from Firestore
  const skillsQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'skills'), orderBy('title', 'asc'));
  }, [firestore]);

  const { data: liveSkills } = useCollection<SkillCategory>(skillsQuery);

  // Fallback to static data if live data is empty
  const staticCategories = [
    { id: 'static-1', title: 'Technical Skills', skills: portfolioContent.skills.technicalSkills },
    { id: 'static-2', title: 'Tools & Technologies', skills: portfolioContent.skills.toolsAndTechnologies },
    { id: 'static-3', title: 'Professional & Soft Skills', skills: portfolioContent.skills.professionalSoftSkills },
  ];

  const displayedCategories = (liveSkills && liveSkills.length > 0) ? liveSkills : staticCategories;

  const handleAddCategory = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const handleRemoveSkill = (category: SkillCategory, skillToRemove: string) => {
    if (!isAdmin || category.id.startsWith('static-')) return;
    const updatedSkills = category.skills.filter(s => s !== skillToRemove);
    updateSkillCategory(firestore, category.id, { skills: updatedSkills });
  };

  const handleSubmit = (data: any) => {
    if (editingCategory?.id && !editingCategory.id.startsWith('static-')) {
      updateSkillCategory(firestore, editingCategory.id, data);
    } else {
      addSkillCategory(firestore, 'russell-robbins', data);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Are you sure you want to delete this entire skill category?')) {
      deleteSkillCategory(firestore, id);
    }
  };

  return (
    <Section id="skills" className="bg-card-foreground/5">
      <div className="text-center mb-12 relative">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Skills & Expertise</h2>
        <p className="mt-2 text-lg text-muted-foreground">A snapshot of my technical and professional capabilities.</p>
        
        {isAdmin && (
          <Button onClick={handleAddCategory} size="sm" className="absolute top-0 right-0">
            <Plus className="h-4 w-4 mr-1" /> Add Category
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayedCategories.map((category) => (
          <Card key={category.id} className="group flex flex-col bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors duration-300 relative shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xl font-headline text-foreground">{category.title}</CardTitle>
              {isAdmin && !category.id.startsWith('static-') && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditCategory(category)}>
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteCategory(category.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-sm font-medium flex items-center gap-1 group/badge">
                    {skill}
                    {isAdmin && !category.id.startsWith('static-') && (
                      <button 
                        onClick={() => handleRemoveSkill(category, skill)}
                        className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {isAdmin && !category.id.startsWith('static-') && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 px-2 border-dashed text-xs w-full mt-2"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Skill
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <SkillFormDialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen} 
          onSubmit={handleSubmit} 
          category={editingCategory}
        />
      )}
    </Section>
  );
};

export default SkillsSection;
