
"use client";

import React from 'react';
import AppHeader from '@/components/core/AppHeader';
import BottomNavigationBar from '@/components/core/BottomNavigationBar';
import { CreatePostDialog } from '@/components/core/CreatePostDialog';
import { CreateGroupDialog } from '@/components/core/CreateGroupDialog'; // Import CreateGroupDialog
import { Toaster } from '@/components/ui/toaster';
import { useUiStore } from '@/store/uiStore';

export function AppShell({ children }: { children: React.ReactNode }) {
  const { 
    isCreatePostDialogOpen, 
    closeCreatePostDialog, 
    defaultGroupIdForPostDialog,
    openCreatePostDialog, // For BottomNavigationBar
    isCreateGroupDialogOpen, // Add state for CreateGroupDialog
    openCreateGroupDialog,   // Not used here directly, but part of store
    closeCreateGroupDialog   // Add action for CreateGroupDialog
  } = useUiStore();

  return (
    <>
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8 pb-24"> {/* pb-24 ensures content isn't hidden by bottom nav */}
        {children}
      </main>
      <BottomNavigationBar openCreatePostDialog={openCreatePostDialog} />
      <CreatePostDialog 
        isOpen={isCreatePostDialogOpen} 
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeCreatePostDialog();
          }
        }}
        defaultGroupId={defaultGroupIdForPostDialog}
      />
      <CreateGroupDialog
        isOpen={isCreateGroupDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            closeCreateGroupDialog();
          }
        }}
      />
      <Toaster />
    </>
  );
}
