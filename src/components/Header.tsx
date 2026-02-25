
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Menu, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioData } from '@/lib/data';
import { useAdmin } from '@/hooks/use-admin';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navLinks = [
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#ai-aligner', label: 'AI Aligner' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
];

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300 ease-in-out',
        hasScrolled ? 'bg-background/80 backdrop-blur-lg' : 'bg-transparent'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Code2 className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
            <span className="font-headline font-bold text-lg text-foreground flex items-center gap-2">
              {portfolioData.name}
              {isAdmin && <ShieldCheck className="h-4 w-4 text-primary animate-pulse" />}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
            {isAdmin && (
              <Button variant="outline" asChild className="border-primary/50 text-primary hover:bg-primary/10 ml-2">
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
             <Button asChild>
                <Link href="#contact">Contact Me</Link>
            </Button>
          </nav>
          
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 pt-10">
                  {navLinks.map((link) => (
                    <SheetClose key={link.href} asChild>
                      <Link href={link.href} className="text-lg text-foreground hover:text-primary transition-colors">
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  {isAdmin && (
                    <SheetClose asChild>
                      <Link href="/admin" className="text-lg text-primary font-semibold">
                        Admin Panel
                      </Link>
                    </SheetClose>
                  )}
                  <SheetClose asChild>
                    <Button asChild className="mt-4">
                      <Link href="#contact">Contact Me</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
