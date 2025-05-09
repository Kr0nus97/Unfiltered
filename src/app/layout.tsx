
"use client"; // Keep this for AppProviders and ThemeProvider context

import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/core/AppProviders';
import { AppShell } from '@/components/core/AppShell';
import { useEffect, useState } from 'react';

const inter = Inter({
  variable: '--font-inter', // Updated variable name
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono', // Updated variable name
  subsets: ['latin'],
  weight: ['400', '700'], 
});

// Metadata needs to be exported from a Server Component or a static file.
// Since this is a client component due to AppProviders, we cannot export metadata here.
// It should be moved to a parent server component or defined statically if possible.
// For now, we'll rely on a default metadata or one defined at page level.
/*
export const metadata: Metadata = {
  title: 'UnFiltered - Anonymous Social Platform',
  description: 'Share your opinions freely and anonymously.',
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This is to avoid applying theme-dependent classes (bg-background, text-foreground) on initial server render
  // and then having a mismatch on client hydration before theme is determined.
  const bodyClassName = mounted 
    ? `${inter.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen bg-background text-foreground`
    : `${inter.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen`;


  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyClassName}>
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
