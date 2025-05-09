"use client"; // Keep this for AppProviders and ThemeProvider context

import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/core/AppProviders';
import { AppShell } from '@/components/core/AppShell';
import { useEffect, useState } from 'react';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Metadata needs to be exported from a Server Component or a static file.
// Since this is a client component due to AppProviders, we cannot export metadata here.
// It should be moved to a parent server component or defined statically if possible.
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

  // Apply font variables to the html tag for global CSS variable access
  const htmlClassName = `${inter.variable} ${robotoMono.variable}`;

  // Base classes for the body. Font application is handled via globals.css and Tailwind config.
  const bodyBaseClasses = ['antialiased', 'flex', 'flex-col', 'min-h-screen'];
  
  // Theme-dependent classes are applied only after client-side mounting
  const bodyThemeClasses = mounted ? ['bg-background', 'text-foreground'] : [];

  const bodyClassName = [...bodyBaseClasses, ...bodyThemeClasses].join(' ');

  return (
    <html lang="en" className={htmlClassName} suppressHydrationWarning>
      <body className={bodyClassName} suppressHydrationWarning> {/* Added suppressHydrationWarning */}
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}