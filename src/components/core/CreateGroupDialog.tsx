
"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { Group, ActivityType } from "@/lib/types";
import { usePostsStore } from "@/store/postsStore";
import { useAuth } from "@/context/AuthContext";
import { Loader2, LogIn, Image as ImageIcon, UserCheck, AlertCircle } from "lucide-react"; // Added UserCheck, AlertCircle
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const groupFormSchema = z.object({
  name: z.string().min(3, "Group name must be at least 3 characters long.").max(50, "Group name must be at most 50 characters long."),
  description: z.string().min(10, "Description must be at least 10 characters long.").max(200, "Description must be at most 200 characters long."),
  backgroundImageUrl: z.string().url("Please enter a valid URL for the background image.").optional().or(z.literal('')),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

interface CreateGroupDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CreateGroupDialog({ isOpen, onOpenChange }: CreateGroupDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addGroup = usePostsStore(state => state.addGroup);
  const addActivityItem = usePostsStore(state => state.addActivityItem);
  const { user, isGuestMode, loading: authLoading, signInWithGoogle } = useAuth();

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      description: "",
      backgroundImageUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        description: "",
        backgroundImageUrl: "",
      });
    }
  }, [isOpen, form]);

  async function onSubmit(data: GroupFormValues) {
    if (!user) { // This covers guests as well
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a group.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newGroupId = crypto.randomUUID();
      const newGroup: Group = {
        id: newGroupId,
        name: data.name,
        description: data.description,
        backgroundImageUrl: data.backgroundImageUrl || undefined,
        creatorId: user.uid,
        postCount: 0,
        memberCount: 1, 
      };

      addGroup(newGroup);
      addActivityItem({
        userId: user.uid,
        type: 'USER_CREATED_GROUP',
        data: {
          groupId: newGroupId,
          groupName: data.name,
        },
      });


      toast({
        title: "Group Created!",
        description: `The group "${data.name}" has been successfully created.`,
      });
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Could not create group. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const renderDialogContent = () => {
    if (authLoading) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4 py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication status...</p>
        </div>
      );
    }

    if (!user && isGuestMode) { // Guest mode
      return (
        <div className="py-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Guest Mode Notice</DialogTitle>
          </DialogHeader>
            <Alert variant="default" className="my-4 text-left bg-secondary/30">
              <UserCheck className="h-5 w-5 text-accent" />
              <AlertTitle className="font-semibold">Sign In to Create Groups</AlertTitle>
              <AlertDescription>
                You are currently browsing as a guest. To create a new group, please sign in with your Google account.
              </AlertDescription>
            </Alert>
          <Button onClick={() => { onOpenChange(false); signInWithGoogle(); }} className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <DialogFooter className="sm:justify-center mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      );
    }


    if (!user && !isGuestMode) { // Not signed in, not guest
      return (
        <div className="py-10 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Sign In Required</DialogTitle>
            <DialogDescription className="mt-2">
              You need to be signed in to create a new group.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={signInWithGoogle} className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
          <DialogFooter className="sm:justify-center mt-8">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </div>
      );
    }

    // User is signed in (not a guest)
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create New Group</DialogTitle>
          <DialogDescription>
            Fill in the details to start a new community on UnFiltered.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Group Name</Label>
            <Input
              id="name"
              placeholder="e.g., Awesome Tech Discoveries"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              placeholder="What is this group about?"
              {...form.register("description")}
              className="min-h-[100px] resize-y"
            />
            {form.formState.errors.description && (
              <p className="text-xs text-destructive">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundImageUrl" className="text-sm font-medium">Background Image URL (Optional)</Label>
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                id="backgroundImageUrl"
                type="url"
                placeholder="https://picsum.photos/seed/newgroup/600/300"
                {...form.register("backgroundImageUrl")}
              />
            </div>
            {form.formState.errors.backgroundImageUrl && (
              <p className="text-xs text-destructive">{form.formState.errors.backgroundImageUrl.message}</p>
            )}
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </DialogFooter>
        </form>
      </>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card">
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
}

