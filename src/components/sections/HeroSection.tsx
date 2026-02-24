import Section from '@/components/Section';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/lib/data';
import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <Section id="hero" className="text-center flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] -mt-16 pt-16">
      <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary">
        {portfolioData.name}
      </h1>
      <p className="mt-3 text-lg md:text-xl text-muted-foreground font-medium">
        {portfolioData.title}
      </p>
      <p className="mt-6 max-w-3xl text-base md:text-lg text-foreground/80 leading-relaxed">
        {portfolioData.about}
      </p>
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
    </Section>
  );
};

export default HeroSection;
