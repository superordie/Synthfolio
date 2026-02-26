
'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { portfolioContent } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Education } from '@/firebase/firestore/education';
import type { Certification } from '@/firebase/firestore/certifications';

const EducationSection = () => {
  const firestore = useFirestore();

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
          </CardHeader>
          <CardContent className="space-y-6">
            {displayedCert.map((cert: any) => (
              <div key={cert.id} className="group relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{cert.certificationName}</h3>
                    <p className="text-muted-foreground text-sm">Issued by {cert.issuingOrganization} &bull; {cert.yearEarned}</p>
                  </div>
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
    </Section>
  );
};

export default EducationSection;
