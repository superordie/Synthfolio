
'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to manage and check admin status.
 * Uses localStorage for persistence and an event-based approach for reactivity.
 */
export function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check initial state
    const adminStatus = typeof window !== 'undefined' && localStorage.getItem('portfolio_admin') === 'true';
    setIsAdmin(adminStatus);

    // Listen for storage changes (e.g. from other tabs or the admin page)
    const handleStorageChange = () => {
      setIsAdmin(localStorage.getItem('portfolio_admin') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('admin-state-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('admin-state-change', handleStorageChange);
    };
  }, []);

  const login = () => {
    localStorage.setItem('portfolio_admin', 'true');
    window.dispatchEvent(new Event('admin-state-change'));
    setIsAdmin(true);
  };

  const logout = () => {
    localStorage.removeItem('portfolio_admin');
    window.dispatchEvent(new Event('admin-state-change'));
    setIsAdmin(false);
  };

  return { isAdmin, login, logout };
}
