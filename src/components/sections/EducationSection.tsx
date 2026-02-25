'use client';

import Section from '@/components/Section';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, BookOpen, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { portfolioContent } from '@/lib/data';
import { Button } from '@/components/ui/button';

const EducationSection = () => {
  return (
    <Section id="education" className="bg-card-foreground/5">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Education & Certifications</h2>
        <p className="mt-2 text-lg text-muted-foreground">My academic background and professional credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Education Card */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <BookOpen className="text-primary" />
              Education
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {portfolioContent.education.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg">{edu.degreeProgramName}</h3>
                <p className="text-muted-foreground">{edu.institutionName}</p>
                <p className="text-sm text-muted-foreground">Expected: {edu.completionDate}</p>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-2xl">
              <Award className="text-primary" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {portfolioContent.certifications.map((cert, index) => (
              <div key={index}>
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
            ))}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
};

export default EducationSection;
