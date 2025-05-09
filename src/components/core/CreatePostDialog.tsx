
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
import { useToast } from "@/hooks/use-toast";
import { moderateContent, type ModerateContentInput, type ModerateContentOutput } from "@/ai/flows/moderate-content";
import { Group, Post } from "@/lib/types"; 
import { generatePseudonym } from "@/lib/pseudonyms";
import { Globe, Image as ImageIcon, Link as LinkIcon, Loader2, Video, Music, LogIn } from "lucide-react";
import { MOCK_GROUPS, usePostsStore } from "@/store/postsStore"; 
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";

const postFormSchema = z.object({
  groupId: z.string().min(1, "Please select a group"),
  text: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  videoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  audioUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  linkUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
}).refine(data => data.text || data.imageUrl || data.videoUrl || data.audioUrl || data.linkUrl, {
  message: "At least one field (text, image, video, audio, or link) must be filled.",
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
  const [isModerating, setIsModerating] = useState(false);
  const addPost = usePostsStore(state => state.addPost);
  const groups = MOCK_GROUPS; 
  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      groupId: defaultGroupId || "",
      text: "",
      imageUrl: "",
      videoUrl: "",
      audioUrl: "",
      linkUrl: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        groupId: defaultGroupId || (groups.length > 0 ? groups[0].id : ""), // Fallback to first group if no default
        text: "",
        imageUrl: "",
        videoUrl: "",
        audioUrl: "",
        linkUrl: "",
      });
    }
  }, [isOpen, defaultGroupId, form, groups]);
  
  useEffect(() => {
    // If user logs in while dialog is open, ensure groupId is set if it was default
    if (user && isOpen && !form.getValues("groupId") && defaultGroupId) {
        form.setValue("groupId", defaultGroupId);
    }
  }, [user, isOpen, defaultGroupId, form]);


  async function onSubmit(data: PostFormValues) {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a post.",
        variant: "destructive",
      });
      return;
    }

    setIsModerating(true);
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
        setIsModerating(false);
        return;
      }
      
      const moderationResult: ModerateContentOutput = await moderateContent(contentToModerate);

      if (moderationResult.isHateSpeech || moderationResult.isSpam || moderationResult.isOffTopic) {
        toast({
          title: "Post Moderated",
          description: moderationResult.flagReason || "Your post violates community guidelines and cannot be published.",
          variant: "destructive",
        });
        setIsModerating(false);
        return;
      }

      const newPost: Post = {
        id: crypto.randomUUID(),
        groupId: data.groupId,
        groupName: groups.find(g => g.id === data.groupId)?.name,
        pseudonym: generatePseudonym(), // User-specific pseudonym generation could be added later
        userId: user.uid, // Associate post with user
        userDisplayName: user.displayName || "Anonymous",
        userPhotoURL: user.photoURL,
        text: data.text,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        audioUrl: data.audioUrl,
        linkUrl: data.linkUrl,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        commentsCount: 0,
      };
      
      addPost(newPost); 

      toast({
        title: "Post Created!",
        description: "Your anonymous post has been published.",
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
      setIsModerating(false);
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

    if (!user) {
      return (
        <div className="py-10 text-center">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Sign In Required</DialogTitle>
            <DialogDescription className="mt-2">
              You need to be signed in to create a post on UnFiltered.
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

    return (
      <>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create Anonymous Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, images, videos, audio, or links. Your identity remains anonymous.
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
              <p className="text-xs text-destructive">{form.formState.errors.groupId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">Your Message (Markdown supported)</Label>
            <Textarea
              id="text"
              placeholder="What's on your mind?"
              {...form.register("text")}
              className="min-h-[100px] resize-y"
            />
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
              <p className="text-xs text-destructive">{form.formState.errors.imageUrl.message}</p>
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
              <p className="text-xs text-destructive">{form.formState.errors.videoUrl.message}</p>
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
              <p className="text-xs text-destructive">{form.formState.errors.audioUrl.message}</p>
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
              <p className="text-xs text-destructive">{form.formState.errors.linkUrl.message}</p>
            )}
          </div>
          
          {form.formState.errors.text && !form.formState.errors.groupId && !form.formState.errors.imageUrl && !form.formState.errors.videoUrl && !form.formState.errors.audioUrl && !form.formState.errors.linkUrl && (
             <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
           )}

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isModerating} className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {isModerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Moderating...
                </>
              ) : (
                "Post Anonymously"
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
