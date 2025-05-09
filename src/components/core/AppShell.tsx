
"use client";

import React from 'react';
import AppHeader from '@/components/core/AppHeader';
import BottomNavigationBar from '@/components/core/BottomNavigationBar';
import { CreatePostDialog } from '@/components/core/CreatePostDialog';
import { Toaster } from '@/components/ui/toaster';
import { ThemeToggle } from './ThemeToggle'; // Keep for potential future use in "Me" page

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCreatePostOpen, setIsCreatePostOpen] = React.useState(false);

  return (
    <>
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 pb-24"> {/* Added pb-24 for bottom nav */}
        {children}
      </main>
      {/* ThemeToggle could be part of a user settings page accessible via BottomNav "ME" item */}
      {/* For now, it's not rendered here, but keeping import if needed for a new location */}
      <BottomNavigationBar setIsCreatePostOpen={setIsCreatePostOpen} />
      <CreatePostDialog isOpen={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
      <Toaster />
    </>
  );
}
