'use client';

import { useState } from 'react';
import { Loader2, Wand2, Lightbulb, Briefcase } from 'lucide-react';
import Section from '@/components/Section';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { alignWithJobDescription } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import type { JobDescriptionSkillHighlighterOutput } from '@/ai/flows/job-description-skill-highlighter';

type AlignerResult = JobDescriptionSkillHighlighterOutput & { error?: string };

const AiSkillAlignerSection = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AlignerResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAlign = async () => {
    if (!jobDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please paste a job description to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await alignWithJobDescription(jobDescription);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response);
    } catch (error: any) {
      toast({
        title: 'Analysis Failed',
        description: error.message || 'An unknown error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Section id="ai-aligner" className="bg-card-foreground/5">
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
          <Wand2 className="h-8 w-8" />
          AI Skill Aligner
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Paste a job description to see how my skills and projects align.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
          <CardDescription>
            Provide the text of a job description below. The AI will analyze it against my portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            <Textarea
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              disabled={isLoading}
              className="bg-background/50"
            />
            <Button onClick={handleAlign} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Align Skills'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {result && (result.matchedSkills.length > 0 || result.matchedProjects.length > 0) && (
        <div className="max-w-4xl mx-auto mt-8">
            <h3 className="font-headline text-2xl text-center mb-6 font-bold text-primary">Alignment Report</h3>
            <div className="space-y-6">
                {result.matchedSkills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Lightbulb /> Matched Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {result.matchedSkills.map((match, index) => (
                                    <AccordionItem value={`skill-${index}`} key={index}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-4">
                                                <span className="font-semibold">{match.skill}</span>
                                                <Badge variant="outline">{match.category}</Badge>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            {match.relevanceExplanation}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                )}
                 {result.matchedProjects.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Briefcase /> Relevant Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible className="w-full">
                                {result.matchedProjects.map((match, index) => (
                                    <AccordionItem value={`project-${index}`} key={index}>
                                        <AccordionTrigger className="font-semibold">{match.projectTitle}</AccordionTrigger>
                                        <AccordionContent>
                                            {match.relevanceExplanation}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
      )}
    </Section>
  );
};

export default AiSkillAlignerSection;
