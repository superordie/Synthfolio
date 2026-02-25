
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

  const ADMIN_PASSWORD = 'russell2025'; 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password === ADMIN_PASSWORD) {
      try {
        if (auth) {
          await signInAnonymously(auth);
        }
        login();
        toast({
          title: "Admin Mode Active",
          description: "Welcome back. You can now edit your portfolio directly.",
        });
        router.push('/');
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "Could not establish secure admin session.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Access Denied",
        description: "Invalid credentials.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {isAdmin ? <Unlock className="text-primary h-8 w-8" /> : <Lock className="text-primary h-8 w-8" />}
          </div>
          <CardTitle className="font-headline text-3xl font-bold">
            {isAdmin ? 'Session Active' : 'Restricted Access'}
          </CardTitle>
          <CardDescription>
            {isAdmin 
              ? 'Portfolio management tools are now visible.' 
              : 'Authorized personnel only. Please verify your identity.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isAdmin ? (
            <div className="space-y-4">
              <Button asChild className="w-full h-12 text-lg" variant="default">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Back to Portfolio
                </Link>
              </Button>
              <Button 
                onClick={() => { logout(); router.refresh(); }} 
                className="w-full h-12 text-lg" 
                variant="destructive"
              >
                Log Out
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-lg bg-background/50"
                  autoFocus
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enter Admin Mode'}
              </Button>
              <Button asChild variant="ghost" className="w-full h-12 text-muted-foreground">
                <Link href="/">Cancel</Link>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
