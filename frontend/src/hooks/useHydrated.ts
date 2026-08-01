import { useEffect, useState } from 'react';

/**
 * Returns false on the server and during first render, then true after hydration.
 * Use this to guard any reads from Zustand persist stores so server HTML matches
 * client HTML and React hydration doesn't throw.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
