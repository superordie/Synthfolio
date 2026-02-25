
'use client';

import { useState } from 'react';
import Section from '@/components/Section';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/lib/data';
import { Github, Linkedin, Edit2 } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/hooks/use-admin';
import AboutFormDialog from '@/components/AboutFormDialog';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { updateAbout } from '@/firebase/firestore/about';

const HeroSection = () => {
  const { isAdmin } = useAdmin();
  const firestore = useFirestore();
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Fetch live bio
  const bioRef = useMemoFirebase(() => {
    return doc(firestore, 'users', 'russell-robbins', 'portfolio', 'bio');
  }, [firestore]);
  const { data: liveBio } = useDoc<{ about: string }>(bioRef);

  const displayedAbout = liveBio?.about || portfolioData.about;

  const handleUpdateAbout = (data: { about: string }) => {
    updateAbout(firestore, 'russell-robbins', data.about);
  };

  return (
    <Section id="hero" className="text-center flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] -mt-16 pt-16 relative">
      <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
        {portfolioData.name}
      </h1>
      <p className="mt-3 text-lg md:text-xl text-muted-foreground font-medium">
        {portfolioData.title}
      </p>
      <div className="mt-6 max-w-3xl relative group">
        <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
          {displayedAbout}
        </p>
        {isAdmin && (
          <Button 
            size="icon" 
            variant="ghost" 
            className="absolute -top-4 -right-10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => setIsAboutOpen(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild size="lg">
          <Link href={portfolioData.links.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="mr-2 h-5 w-5" />
            LinkedIn
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg">
          <Link href={portfolioData.links.github} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-5 w-5" />
            GitHub
          </Link>
        </Button>
      </div>

      <AboutFormDialog 
        open={isAboutOpen} 
        onOpenChange={setIsAboutOpen} 
        onSubmit={handleUpdateAbout}
        initialValue={displayedAbout}
      />
    </Section>
  );
};

export default HeroSection;
