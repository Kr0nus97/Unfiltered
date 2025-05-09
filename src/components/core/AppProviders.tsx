"use client";

import React, { useEffect, useState } from 'react';

// This component can be used to wrap any client-side providers
// For now, it mainly helps with ensuring client components that use localStorage or other browser APIs
// don't cause hydration mismatches.
export function AppProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // You can return a loader here if needed, or null
    return null; 
  }

  return <>{children}</>;
}
