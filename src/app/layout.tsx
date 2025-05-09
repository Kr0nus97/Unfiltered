
import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/core/AppProviders';
import { AppShell } from '@/components/core/AppShell';

const inter = Inter({
  variable: '--font-geist-sans', // Keep original CSS variable name
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-geist-mono', // Keep original CSS variable name
  subsets: ['latin'],
  weight: ['400', '700'], // Roboto Mono often needs weights specified
});

export const metadata: Metadata = {
  title: 'UnFiltered - Anonymous Social Platform',
  description: 'Share your opinions freely and anonymously.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning
      >
        <AppProviders>
          <AppShell>{children}</AppShell>
        </AppProviders>
      </body>
    </html>
  );
}

