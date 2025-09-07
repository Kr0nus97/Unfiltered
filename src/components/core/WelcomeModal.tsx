
"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LockKeyhole, Users, Rocket, ShieldAlert, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const WELCOME_MODAL_DISMISSED_KEY = 'unfilteredWelcomeModalDismissed_v2'; // Increment version if content changes significantly

interface WelcomeStepContent {
  id: number;
  icon: React.ElementType;
  iconColor?: string;
  sectionTitle: string;
  description: string | React.ReactNode;
}

const steps: WelcomeStepContent[] = [
  {
    id: 1,
    icon: LockKeyhole,
    iconColor: "text-purple-400",
    sectionTitle: "Complete Anonymity",
    description: "Your identity is protected. Every post you make is assigned a unique pseudonym in the format \"Adjective_Object\".",
  },
  {
    id: 2,
    icon: Users,
    iconColor: "text-blue-400",
    sectionTitle: "Discover & Share",
    description: "Explore diverse interest-based groups. Share your thoughts, images, videos, audio, and links freely.",
  },
  {
    id: 3,
    icon: Rocket,
    iconColor: "text-green-400",
    sectionTitle: "Engage & Connect",
    description: "Like, dislike, and comment on posts. Use @mentions to interact and message other users directly.",
  },
  {
    id: 4,
    icon: ShieldAlert,
    iconColor: "text-red-400",
    sectionTitle: "Flexible & Secure",
    description: "Sign in with Google, Email/Password, or browse as a Guest. AI moderation helps maintain a respectful environment.",
  },
];

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed

  useEffect(() => {
    const dismissed = localStorage.getItem(WELCOME_MODAL_DISMISSED_KEY);
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(WELCOME_MODAL_DISMISSED_KEY, 'true');
    setIsOpen(false);
    setCurrentStep(0); // Reset for next time if logic changes
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleDismiss();
    }
  };

  if (!isOpen) {
    return null;
  }

  const activeStepContent = steps[currentStep];
  const IconComponent = activeStepContent.icon;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleDismiss(); }}>
      <DialogContent className="sm:max-w-md bg-card shadow-xl p-0 flex flex-col justify-between min-h-[380px]">
        <DialogHeader className="p-6 text-center relative">
          <DialogTitle className="text-3xl font-bold mb-1">
            <span className="bg-gradient-to-r from-fuchsia-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Welcome to UnFiltered!
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            Your anonymous space to express yourself freely
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center text-center px-6 py-4 flex-grow">
          <div className={cn(
            "mb-4 rounded-full p-3 flex items-center justify-center w-16 h-16",
            currentStep === 0 ? "bg-purple-500/20" : currentStep === 1 ? "bg-blue-500/20" : currentStep === 2 ? "bg-green-500/20" : "bg-red-500/20"
          )}>
            <IconComponent className={cn("w-8 h-8", activeStepContent.iconColor)} />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{activeStepContent.sectionTitle}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {activeStepContent.description}
          </p>
        </div>

        <DialogFooter className="p-6 flex items-center justify-between w-full border-t border-border">
          <div className="flex space-x-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={cn(
                  "h-2.5 w-2.5 rounded-full transition-all",
                  currentStep === index ? "bg-primary w-4" : "bg-muted hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[100px]"
          >
            {currentStep < steps.length - 1 ? "Next" : "Got it!"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
