
'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection } from 'firebase/firestore';
import { useState, useMemo } from 'react';
import { seedEducation, addEducation, updateEducation, deleteEducation, type Education } from '@/firebase/firestore/education';
import { seedCertifications, addCertification, updateCertification, deleteCertification, type Certification } from '@/firebase/firestore/certifications';
import { useToast } from '@/hooks/use-toast';
import EducationFormDialog from '../EducationFormDialog';
import CertificationFormDialog from '../CertificationFormDialog';
import { Award, BookOpen, ExternalLink, PlusCircle, Edit, Trash2, Loader2, Database } from 'lucide-react';
import Link from 'next/link';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useMemoFirebase } from '@/hooks/use-memo-firebase';
import { portfolioContent } from '@/lib/data';

const EducationSection = () => {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const eduQuery = useMemoFirebase(() => firestore ? collection(firestore, 'education') : null, [firestore]);
  const certQuery = useMemoFirebase(() => firestore ? collection(firestore, 'certifications') : null, [firestore]);
  
  const { data: firestoreEdu, loading: eduLoading } = useCollection<Education>(eduQuery);
  const { data: firestoreCert, loading: certLoading } = useCollection<Certification>(certQuery);

  const [isSeeding, setIsSeeding] = useState(false);
  
  // Education State
  const [isEduFormOpen, setIsEduFormOpen] = useState(false);
  const [selectedEdu, setSelectedEdu] = useState<Education | null>(null);

  // Cert State
  const [isCertFormOpen, setIsCertFormOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  const educationList = useMemo(() => {
    if (firestoreEdu && firestoreEdu.length > 0) return firestoreEdu;
    return portfolioContent.education.map((e, i) => ({ ...e, id: `static-${i}`, ownerId: 'static' } as Education));
  }, [firestoreEdu]);

  const certList = useMemo(() => {
    if (firestoreCert && firestoreCert.length > 0) return firestoreCert;
    return portfolioContent.certifications.map((c, i) => ({ ...c, id: `static-${i}`, ownerId: 'static' } as Certification));
  }, [firestoreCert]);

  const handleSeedAll = async () => {
    if (!firestore || !user) return;
    setIsSeeding(true);
    try {
      await seedEducation(firestore, user.uid);
      await seedCertifications(firestore, user.uid);
      toast({ title: 'Success', description: 'Education and certifications seeded.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setIsSeeding(false);
    }
  };

  // Education Handlers
  const handleAddEdu = () => { setSelectedEdu(null); setIsEduFormOpen(true); };
  const handleEditEdu = (edu: Education) => { setSelectedEdu(edu); setIsEduFormOpen(true); };
  const handleDeleteEdu = (id: string) => { if (firestore) deleteEducation(firestore, id); };
  const handleEduSubmit = (data: Omit<Education, 'id' | 'ownerId'>) => {
    if (!firestore || !user) return;
    if (selectedEdu && !selectedEdu.id.startsWith('static-')) updateEducation(firestore, selectedEdu.id, data);
    else addEducation(firestore, user.uid, data);
  };

  // Cert Handlers
  const handleAddCert = () => { setSelectedCert(null); setIsCertFormOpen(true); };
  const handleEditCert = (cert: Certification) => { setSelectedCert(cert); setIsCertFormOpen(true); };
  const handleDeleteCert = (id: string) => { if (firestore) deleteCertification(firestore, id); };
  const handleCertSubmit = (data: Omit<Certification, 'id' | 'ownerId'>) => {
    if (!firestore || !user) return;
    if (selectedCert && !selectedCert.id.startsWith('static-')) updateCertification(firestore, selectedCert.id, data);
    else addCertification(firestore, user.uid, data);
  };

  const isDbEmpty = !eduLoading && !certLoading && (!firestoreEdu || firestoreEdu.length === 0) && (!firestoreCert || firestoreCert.length === 0);

  return (
    <>
      <Section id="education" className="bg-card-foreground/5">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Education & Certifications</h2>
          <p className="mt-2 text-lg text-muted-foreground">My academic background and professional credentials.</p>
        </div>

        {user && isDbEmpty && (
          <div className="max-w-4xl mx-auto mb-12 text-center">
            <Card className="border-dashed border-2 bg-primary/5">
              <CardFooter className="justify-center py-8">
                <Button onClick={handleSeedAll} disabled={isSeeding}>
                  {isSeeding ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Database className="mr-2 h-4 w-4"/>}
                  Seed Education Database
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Education Card */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <BookOpen className="text-primary" />
                Education
              </CardTitle>
              {user && (
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddEdu}>
                  <PlusCircle className="h-5 w-5" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {educationList.map((edu) => (
                <div key={edu.id} className="group relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{edu.degreeProgramName}</h3>
                      <p className="text-muted-foreground">{edu.institutionName}</p>
                      <p className="text-sm text-muted-foreground">Expected: {edu.completionDate}</p>
                    </div>
                    {user && user.uid === edu.ownerId && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditEdu(edu)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteEdu(edu.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                  {edu.relevantCourseworkOrFocusAreas && edu.relevantCourseworkOrFocusAreas.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {edu.relevantCourseworkOrFocusAreas.map(course => (
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
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                <Award className="text-primary" />
                Certifications
              </CardTitle>
              {user && (
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleAddCert}>
                  <PlusCircle className="h-5 w-5" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {certList.map((cert) => (
                <div key={cert.id} className="group relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{cert.certificationName}</h3>
                      <p className="text-muted-foreground text-sm">Issued by {cert.issuingOrganization} &bull; {cert.yearEarned}</p>
                      {cert.credentialURL && (
                        <Button asChild variant="link" className="p-0 h-auto mt-1 text-primary text-xs">
                          <Link href={cert.credentialURL} target="_blank" rel="noopener noreferrer">
                            View Credential <ExternalLink className="ml-1 h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    {user && user.uid === cert.ownerId && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditCert(cert)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCert(cert.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </Section>
      <EducationFormDialog
        open={isEduFormOpen}
        onOpenChange={setIsEduFormOpen}
        onSubmit={handleEduSubmit}
        education={selectedEdu}
      />
      <CertificationFormDialog
        open={isCertFormOpen}
        onOpenChange={setIsCertFormOpen}
        onSubmit={handleCertSubmit}
        certification={selectedCert}
      />
    </>
  );
};

export default EducationSection;
