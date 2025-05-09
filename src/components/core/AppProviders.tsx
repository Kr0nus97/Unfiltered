"use client";

import React from 'react';

// This component can be used to wrap any client-side providers.
// If children depend on client-only data, they should handle that internally,
// e.g. with a useEffect hook.
// The isMounted check was removed because if AppProviders returns null initially
// while its children were server-rendered, it causes a hydration mismatch.
// Providers themselves are usually safe.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
