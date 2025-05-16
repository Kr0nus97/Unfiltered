
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Rocket, Users, Fingerprint, ShieldAlert, MessageSquare, ActivityIcon, LogIn } from 'lucide-react'; // Added LogIn

const WELCOME_MODAL_DISMISSED_KEY = 'unfilteredWelcomeModalDismissed';

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(WELCOME_MODAL_DISMISSED_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(WELCOME_MODAL_DISMISSED_KEY, 'true');
    setIsOpen(false);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
      <DialogContent className="sm:max-w-[525px] bg-card shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center mb-2">Welcome to UnFiltered!</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mb-4">
            UnFiltered is an anonymous social media platform built with Next.js. It's designed for users to share opinions and content freely within interest-based groups.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4 px-2 text-sm">
          <p className="font-semibold text-lg text-foreground mb-2">Core Features:</p>
          <div className="flex items-start space-x-3">
            <Fingerprint className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">Anonymous Posting:</span> Share text (Markdown), images, videos, audio, and links with a dynamic pseudonym (e.g., "Clever_Wombat") for each post.</p>
          </div>
          <div className="flex items-start space-x-3">
            <Users className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">Group-Based Discussions:</span> Discover or create groups for focused conversations.</p>
          </div>
          <div className="flex items-start space-x-3">
            <Rocket className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">User Interaction:</span> Like, dislike, and comment on posts (with @mentions).</p>
          </div>
           <div className="flex items-start space-x-3">
            <LogIn className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">Authentication:</span> Sign in with Google, Email/Password, or browse as a Guest.</p>
          </div>
          <div className="flex items-start space-x-3">
            <ShieldAlert className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">AI Moderation:</span> Content is monitored to flag potentially harmful posts.</p>
          </div>
          <div className="flex items-start space-x-3">
            <ActivityIcon className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">Activity Feed:</span> Track mentions, post likes, and new group posts.</p>
          </div>
          <div className="flex items-start space-x-3">
            <MessageSquare className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
            <p><span className="font-semibold">Direct Messaging:</span> Message users directly, referencing posts if needed.</p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center mt-6">
          <Button onClick={handleDismiss} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
