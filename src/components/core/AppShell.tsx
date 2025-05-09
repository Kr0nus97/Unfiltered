
"use client";

import React from 'react';
import AppHeader from '@/components/core/AppHeader';
import BottomNavigationBar from '@/components/core/BottomNavigationBar';
import { CreatePostDialog } from '@/components/core/CreatePostDialog';
import { Toaster } from '@/components/ui/toaster';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isCreatePostOpen, setIsCreatePostOpen] = React.useState(false);

  return (
    <>
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 pb-24"> {/* Added pb-24 for bottom nav */}
        {children}
      </main>
      <BottomNavigationBar setIsCreatePostOpen={setIsCreatePostOpen} />
      <CreatePostDialog isOpen={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
      <Toaster />
    </>
  );
}
