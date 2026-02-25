'use client';
import { useMemo, type DependencyList } from 'react';
import type { DocumentReference, Query } from 'firebase/firestore';

// Custom hook to memoize Firebase queries and references.
// This prevents re-renders from causing infinite loops with useCollection/useDoc.
export function useMemoFirebase<T extends DocumentReference | Query>(
  factory: () => T | null,
  deps: DependencyList
): T | null {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedRef = useMemo(factory, deps);
  return memoizedRef;
}
