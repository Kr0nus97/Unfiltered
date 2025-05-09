import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import AppHeader from '@/components/core/AppHeader';
import { AppProviders } from '@/components/core/AppProviders';
import { ClientFooterYear } from '@/components/core/ClientFooterYear';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <AppProviders>
          <AppHeader />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster />
          <footer className="py-6 text-center text-muted-foreground text-sm border-t">
            © <ClientFooterYear /> UnFiltered. All rights reserved (not really).
          </footer>
        </AppProviders>
      </body>
    </html>
  );
}
