'use client';

import { useState } from 'react';
import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, ExternalLink, Plus, Edit2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { portfolioContent } from '@/lib/data';
import { useAdmin } from '@/hooks/use-admin';
import { Button } from '@/components/ui/button';
import EducationFormDialog from '@/components/EducationFormDialog';
import CertificationFormDialog from '@/components/CertificationFormDialog';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { addEducation, updateEducation, deleteEducation, type Education } from '@/firebase/firestore/education';
import { addCertification, updateCertification, deleteCertification, type Certification } from '@/firebase/firestore/certifications';

const EducationSection = () => {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();
  
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // Fetch live education
  const eduQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'education'), orderBy('completionDate', 'desc'));
  }, [firestore]);
  const { data: liveEdu } = useCollection<Education>(eduQuery);

  // Fetch live certifications
  const certQuery = useMemoFirebase(() => {
    return query(collection(firestore, 'certifications'), orderBy('yearEarned', 'desc'));
  }, [firestore]);
  const { data: liveCert } = useCollection<Certification>(certQuery);

  const displayedEdu = (liveEdu && liveEdu.length > 0) 
    ? liveEdu 
    : portfolioContent.education.map((e, i) => ({ ...e, id: `static-edu-${i}` }));

  const displayedCert = (liveCert && liveCert.length > 0) 
    ? liveCert 
    : portfolioContent.certifications.map((c, i) => ({ ...c, id: `static-cert-${i}` }));

  return (
    <Section id="education" className="bg-card-foreground/5">
      <div className="text-center mb-12 relative">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Education & Certifications</h2>
        <p className="mt-2 text-lg text-muted-foreground">My academic background and professional credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Education Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <BookOpen className="text-primary" />
              Education
            </CardTitle>
            {isAdmin && (
              <Button size="sm" variant="ghost" onClick={() => { setEditingEdu(null); setIsEduOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {displayedEdu.map((edu: any) => (
              <div key={edu.id} className="group relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{edu.degreeProgramName}</h3>
                    <p className="text-muted-foreground">{edu.institutionName}</p>
                    <p className="text-sm text-muted-foreground">Completed: {edu.completionDate}</p>
                  </div>
                  {isAdmin && !edu.id.toString().startsWith('static-') && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingEdu(edu); setIsEduOpen(true); }}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteEducation(firestore, edu.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {edu.relevantCourseworkOrFocusAreas && edu.relevantCourseworkOrFocusAreas.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {edu.relevantCourseworkOrFocusAreas.map((course: string) => (
                        <Badge key={course} variant="outline" className="text-[10px]">{course}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Certifications Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Award className="text-primary" />
              Certifications
            </CardTitle>
            {isAdmin && (
              <Button size="sm" variant="ghost" onClick={() => { setEditingCert(null); setIsCertOpen(true); }}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {displayedCert.map((cert: any) => (
              <div key={cert.id} className="group relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{cert.certificationName}</h3>
                    <p className="text-muted-foreground text-sm">Issued by {cert.issuingOrganization} &bull; {cert.yearEarned}</p>
                  </div>
                  {isAdmin && !cert.id.toString().startsWith('static-') && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingCert(cert); setIsCertOpen(true); }}>
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteCertification(firestore, cert.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
                {cert.credentialURL && (
                  <Button asChild variant="link" className="p-0 h-auto mt-1 text-primary text-xs">
                    <Link href={cert.credentialURL} target="_blank" rel="noopener noreferrer">
                      View Credential <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <EducationFormDialog 
        open={isEduOpen} 
        onOpenChange={setIsEduOpen} 
        onSubmit={(data) => editingEdu ? updateEducation(firestore, editingEdu.id, data) : addEducation(firestore, 'russell-robbins', data)} 
        education={editingEdu}
      />
      <CertificationFormDialog 
        open={isCertOpen} 
        onOpenChange={setIsCertOpen} 
        onSubmit={(data) => editingCert ? updateCertification(firestore, editingCert.id, data) : addCertification(firestore, 'russell-robbins', data)} 
        certification={editingCert}
      />
    </Section>
  );
};

export default EducationSection;
