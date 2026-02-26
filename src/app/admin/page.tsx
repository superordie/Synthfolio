'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, Unlock, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PASSWORD = 'Li0nMast3r'; 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simple local check - No Firebase involved for this test
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert("Wrong password - Test mode");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md border-white/10 bg-slate-800 text-white shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {isLoggedIn ? <Unlock className="text-blue-400 h-8 w-8" /> : <Lock className="text-blue-400 h-8 w-8" />}
          </div>
          <CardTitle className="text-2xl font-bold">
            {isLoggedIn ? 'Access Granted' : 'Admin Test Portal'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoggedIn ? (
            <div className="text-center space-y-4">
              <p className="text-green-400">If you see this, the /admin route is WORKING.</p>
              <Button onClick={() => window.location.href = '/'} className="w-full bg-slate-700">Return Home</Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Test Login'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}