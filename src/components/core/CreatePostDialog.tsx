
"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { moderateContent, type ModerateContentInput, type ModerateContentOutput } from "@/ai/flows/moderate-content";
import type { Group, Post, ActivityType, UserCreatedPostData } from "@/lib/types"; 
import { generatePseudonym } from "@/lib/pseudonyms";
import { Globe, Image as ImageIcon, Link as LinkIcon, Loader2, Video, Music, LogIn, UserCheck, AlertCircle, Fingerprint } from "lucide-react"; 
import { usePostsStore } from "@/store/postsStore"; 
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";


const postFormSchema = z.object({
  groupId: z.string().min(1, "Please select a group"),
  text: z.string().max(5000, "Post text cannot exceed 5000 characters.").optional(), 
  imageUrl: z.string().url("Please enter a valid URL for the image.").optional().or(z.literal('')),
  videoUrl: z.string().url("Please enter a valid URL for the video.").optional().or(z.literal('')),
  audioUrl: z.string().url("Please enter a valid URL for the audio.").optional().or(z.literal('')),
  linkUrl: z.string().url("Please enter a valid URL for the link.").optional().or(z.literal('')),
  isAnonymous: z.boolean().optional(),
}).refine(data => data.text || data.imageUrl || data.videoUrl || data.audioUrl || data.linkUrl, {
  message: "At least one content field (text, image, video, audio, or link) must be filled.",
  path: ["text"], 
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  defaultGroupId?: string;
}

export function CreatePostDialog({ isOpen, onOpenChange, defaultGroupId }: CreatePostDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addPost = usePostsStore(state => state.addPost);
  const groups = usePostsStore(state => state.groups); 
  const addActivityItem = usePostsStore(state => state.addActivityItem);
  const { user, isGuestMode, loading: authLoading, signInWithGoogle } = useAuth();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      groupId: defaultGroupId || "",
      text: "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      linkUrl: "",
      isAnonymous: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        groupId: defaultGroupId || (groups.length > 0 ? groups[0].id : ""), 
        text: "",
        imageUrl: "",
        videoUrl: "",
        audioUrl: "",
        linkUrl: "",
        isAnonymous: false,
      });
    }
  }, [isOpen, defaultGroupId, form, groups]);
  
  useEffect(() => {
    if (user && !isGuestMode && isOpen && !form.getValues("groupId") && (defaultGroupId || (groups.length > 0 && !defaultGroupId))) {
        form.setValue("groupId", defaultGroupId || groups[0].id);
    } else if (isOpen && defaultGroupId && !form.getValues("groupId")) { 
        form.setValue("groupId", defaultGroupId);
    }
  }, [user, isGuestMode, isOpen, defaultGroupId, form, groups]);


  async function onSubmit(data: PostFormValues) {
    if (!user || isGuestMode) { 
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive",
        action: <Button onClick={() => {onOpenChange(false); signInWithGoogle();}}>Sign In</Button>
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const contentToModerate: ModerateContentInput = {
        text: `${data.text || ''} ${data.imageUrl || ''} ${data.videoUrl || ''} ${data.audioUrl || ''} ${data.linkUrl || ''}`.trim(),
      };

      if (!contentToModerate.text) {
        toast({
          title: "Empty Post",
          description: "Cannot submit an empty post. Please add some content.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      const moderationResult: ModerateContentOutput = await moderateContent(contentToModerate);

      const selectedGroup = groups.find(g => g.id === data.groupId);

      if (moderationResult.isHateSpeech || moderationResult.isSpam || moderationResult.isOffTopic) {
        toast({
          title: "Post Moderated",
          description: moderationResult.flagReason || "Your post violates community guidelines and cannot be published.",
          variant: "destructive",
        });
         addActivityItem({
          userId: user.uid,
          type: 'USER_POST_FLAGGED',
          data: {
            type: 'USER_POST_FLAGGED', 
            postSnippet: (data.text || "Media post").substring(0, 50) + '...',
            groupId: data.groupId,
            groupName: selectedGroup?.name || data.groupId,
            flagReason: moderationResult.flagReason || "Violating community guidelines",
            isUserAnonymousPost: data.isAnonymous,
            postPseudonym: data.isAnonymous ? generatePseudonym() : undefined,
          },
        });
        setIsSubmitting(false);
        return;
      }

      const newPostData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'dislikes' | 'commentsCount' | 'comments' | 'pseudonym'> = {
        groupId: data.groupId,
        groupName: selectedGroup?.name,
        userId: user.uid, 
        userDisplayName: user.displayName || "Anonymous User",
        userPhotoURL: user.photoURL,
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        audioUrl: data.audioUrl,
        linkUrl: data.linkUrl,
        isAnonymous: data.isAnonymous,
      };
      
      addPost(newPostData); // The store will handle ID, createdAt, pseudonym, etc.
      const createdPost = usePostsStore.getState().posts.find(p => p.groupId === newPostData.groupId && p.userId === newPostData.userId && p.text === newPostData.text); // Simplistic find

      if (createdPost) {
        addActivityItem({
            userId: user.uid,
            type: 'USER_CREATED_POST',
            data: {
            type: 'USER_CREATED_POST',
            postId: createdPost.id,
            postSnippet: (createdPost.text || "Media post").substring(0, 50) + '...',
            groupId: createdPost.groupId,
            groupName: createdPost.groupName || createdPost.groupId,
            isAnonymousPost: createdPost.isAnonymous,
            postPseudonym: createdPost.isAnonymous ? createdPost.pseudonym : undefined,
            } as UserCreatedPostData,
        });
      }


      toast({
        title: "Post Created!",
        description: data.isAnonymous ? "Your anonymous post has been published." : "Your post has been published.",
      });
      form.reset(); 
      onOpenChange(false); 
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Could not create post. Please try again.",
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

    if (!user || isGuestMode) { 
      return (
        <div className="py-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Create a Post</DialogTitle>
          </DialogHeader>
            <Alert variant="default" className="my-6 text-left bg-secondary/30 border-accent/30">
              <UserCheck className="h-5 w-5 text-accent" />
              <AlertTitle className="font-semibold text-accent">Sign In to Post</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                You are currently browsing as a guest. To create a post and contribute to the UnFiltered community, please sign in with your Google account or Email. This helps maintain a safe and enjoyable environment for everyone.
              </AlertDescription>
            </Alert>
          <Button onClick={() => { onOpenChange(false); signInWithGoogle(); }} className="mt-4 bg-accent text-accent-foreground hover:bg-accent/90 w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Sign in to Post
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
    
    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, images, videos, audio, or links. Choose to post with your profile or in UnFiltered mode.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupId" className="text-sm font-medium">Group</Label>
            <Controller
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value} 
                  defaultValue={field.value || defaultGroupId || (groups.length > 0 ? groups[0].id : "")}
                >
                  <SelectTrigger id="groupId" aria-label="Select group">
                    <SelectValue placeholder="Select a group..." />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.length === 0 && <SelectItem value="" disabled>No groups available</SelectItem>}
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.groupId && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.groupId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">Your Message (Markdown supported)</Label>
            <Textarea
              id="text"
              placeholder="What's on your mind? (Max 5000 characters)"
              {...form.register("text")}
              className="min-h-[100px] resize-y"
            />
             {form.formState.errors.text && ( 
              <p className="text-xs text-destructive mt-1">{form.formState.errors.text.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-sm font-medium">Image URL (Optional)</Label>
             <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.png"
                {...form.register("imageUrl")}
              />
            </div>
            {form.formState.errors.imageUrl && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.imageUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-sm font-medium">Video URL (Optional)</Label>
             <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-muted-foreground" />
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://example.com/video.mp4"
                {...form.register("videoUrl")}
              />
            </div>
            {form.formState.errors.videoUrl && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.videoUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="audioUrl" className="text-sm font-medium">Audio URL (Optional)</Label>
             <div className="flex items-center space-x-2">
              <Music className="h-5 w-5 text-muted-foreground" />
              <Input
                id="audioUrl"
                type="url"
                placeholder="https://example.com/audio.mp3"
                {...form.register("audioUrl")}
              />
            </div>
            {form.formState.errors.audioUrl && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.audioUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkUrl" className="text-sm font-medium">Link URL (Optional)</Label>
            <div className="flex items-center space-x-2">
              <LinkIcon className="h-5 w-5 text-muted-foreground" />
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://example.com/article"
                {...form.register("linkUrl")}
              />
            </div>
            {form.formState.errors.linkUrl && (
              <p className="text-xs text-destructive mt-1">{form.formState.errors.linkUrl.message}</p>
            )}
          </div>
          
          {user && !isGuestMode && (
            <div className="flex items-center space-x-3 pt-2">
              <Controller
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <Switch
                    id="isAnonymous"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    aria-label="Post in UnFiltered Mode"
                  />
                )}
              />
              <Label htmlFor="isAnonymous" className="text-sm flex items-center cursor-pointer">
                <Fingerprint className="h-4 w-4 mr-2 text-primary" /> Post in UnFiltered Mode (Anonymous)
              </Label>
            </div>
          )}
           
           {form.formState.errors.text && form.formState.errors.text.type === "manual" && (
             <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
           )}


          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting || (groups.length === 0 && !defaultGroupId)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                form.watch("isAnonymous") ? "Post Anonymously" : "Post with Profile" 
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
