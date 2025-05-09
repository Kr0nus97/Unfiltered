"use client";

import { useState, useEffect } from 'react';

export function ClientFooterYear() {
  // Use an empty string as a placeholder that the server will also render.
  // Then update to the actual year on the client after mount.
  const [year, setYear] = useState<string | number>(''); 

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
