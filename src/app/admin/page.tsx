
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/use-admin';
import { useAuth } from '@/firebase/provider';
import { signInAnonymously } from 'firebase/auth';
import { Lock, Unlock, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin, login, logout } = useAdmin();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  // Simple hardcoded password for MVP. 
  // In a real app, this would be checked against a secure backend.
  const ADMIN_PASSWORD = 'russell2025'; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password === ADMIN_PASSWORD) {
      try {
        // Sign in anonymously to Firebase to satisfy security rules for writing
        await signInAnonymously(auth);
        login();
        toast({
          title: "Welcome back, Russell",
          description: "Admin mode is now active.",
        });
        router.push('/');
      } catch (error) {
        toast({
          title: "Firebase Error",
          description: "Could not authenticate with database.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid admin password.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            {isAdmin ? <Unlock className="text-primary h-6 w-6" /> : <Lock className="text-primary h-6 w-6" />}
          </div>
          <CardTitle className="font-headline text-2xl">
            {isAdmin ? 'Admin Active' : 'Portfolio Administration'}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'You have full editing permissions.' 
              : 'Enter password to unlock editing controls.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
            <div className="space-y-4">
              <Button asChild className="w-full" variant="outline">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Go to Portfolio
                </Link>
              </Button>
              <Button 
                onClick={() => { logout(); router.refresh(); }} 
                className="w-full" 
                variant="destructive"
              >
                Deactivate Admin Mode
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enter Admin Mode'}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/">Cancel</Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
