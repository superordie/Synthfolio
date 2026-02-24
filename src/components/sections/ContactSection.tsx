import Section from '@/components/Section';
import { Button } from '@/components/ui/button';
import { portfolioData } from '@/lib/data';
import { Github, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const ContactSection = () => {
  return (
    <Section id="contact">
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary">Get In Touch</h2>
        <p className="mt-2 text-lg text-muted-foreground">I'm open to new opportunities and collaborations. Let's connect.</p>
        
        <div className="mt-8">
            <Button asChild size="lg" className="text-lg">
                <a href={`mailto:${portfolioData.email}`}>
                    <Mail className="mr-2 h-5 w-5" />
                    {portfolioData.email}
                </a>
            </Button>
        </div>
        
        <div className="mt-6 flex justify-center gap-4">
            <Button asChild variant="ghost" size="icon" className="h-12 w-12">
                <Link href={portfolioData.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin className="h-6 w-6" />
                </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" className="h-12 w-12">
                <Link href={portfolioData.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github className="h-6 w-6" />
                </Link>
            </Button>
        </div>
      </div>
    </Section>
  );
};

export default ContactSection;
