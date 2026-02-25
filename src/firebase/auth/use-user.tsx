'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
// 1. Added setPersistence and browserSessionPersistence here
import { onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export function useUser() {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // 2. We wrap the listener in setPersistence to ensure a clean session
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            setUser(user);
            setLoading(false);
          },
          (error) => {
            console.error('Auth state change error:', error);
            setLoading(false);
          }
        );

        return () => unsubscribe();
      })
      .catch((err) => {
        console.error("Persistence failed:", err);
        setLoading(false);
      });
      
  }, [auth]);

  return { user, loading };
}