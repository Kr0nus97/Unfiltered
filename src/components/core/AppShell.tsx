
"use client";

import React from 'react';
import AppHeader from '@/components/core/AppHeader';
import BottomNavigationBar from '@/components/core/BottomNavigationBar';
import { CreatePostDialog } from '@/components/core/CreatePostDialog';
import { Toaster } from '@/components/ui/toaster';
// ThemeToggle is not part of the bottom navigation as per the image, 
// but could be added to a "Me" page later.
// import { ThemeToggle } from './ThemeToggle'; 

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCreatePostOpen, setIsCreatePostOpen] = React.useState(false);

  return (
    <>
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 pb-24"> {/* pb-24 ensures content isn't hidden by bottom nav */}
        {children}
      </main>
      <BottomNavigationBar setIsCreatePostOpen={setIsCreatePostOpen} />
      <CreatePostDialog isOpen={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
      <Toaster />
    </>
  );
}

