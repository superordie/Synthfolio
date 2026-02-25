"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Code2, Menu, X, LogIn, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { portfolioData } from '@/lib/data';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useUser } from '@/firebase';
import { signInWithGoogle, signOutWithGoogle } from '@/firebase/auth';


const navLinks = [
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#ai-aligner', label: 'AI Aligner' },
  { href: '#experience', label: 'Experience' },
  { href: '#education', label: 'Education' },
];

const Header = () => {
  const [hasScrolled, setHasScrolled] = useState(false);
  const { user, loading } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AuthButton = () => {
    if (loading) return <Button variant="ghost" size="icon" disabled />;
    if (user) {
      return (
        <Button onClick={signOutWithGoogle} variant="ghost" title="Sign Out">
          <LogOut />
          <span className="sr-only">Sign Out</span>
        </Button>
      )
    }
    return (
       <Button onClick={signInWithGoogle} variant="ghost" title="Sign In">
          <LogIn />
          <span className="sr-only">Sign In</span>
        </Button>
    )
  }

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
            <span className="font-headline font-bold text-lg text-foreground">
              {portfolioData.name}
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
             <Button asChild>
                <Link href="#contact">Contact Me</Link>
            </Button>
            <AuthButton />
          </nav>
          
          <div className="md:hidden flex items-center">
            <AuthButton />
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
