
'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error);
  }, [error]);

  return (
    <html>
      <body className="bg-background text-foreground flex items-center justify-center min-h-screen p-4 font-sans dark">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-4xl font-bold font-headline text-primary">Something went wrong</h1>
          <p className="text-muted-foreground">
            A critical error occurred in the application. We've been notified and are looking into it.
          </p>
          <div className="bg-card border border-border p-4 rounded-lg text-left overflow-auto max-h-40">
            <code className="text-xs text-destructive">{error.message || 'Unknown Error'}</code>
          </div>
          <Button onClick={() => reset()} className="w-full" size="lg">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
