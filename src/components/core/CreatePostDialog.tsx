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
import { Group, Post } from "@/lib/types"; // Assuming these types exist
import { generatePseudonym } from "@/lib/pseudonyms";
import { Globe, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";
import { MOCK_GROUPS, usePostsStore } from "@/store/postsStore"; // We'll create this store

const postFormSchema = z.object({
  groupId: z.string().min(1, "Please select a group"),
  text: z.string().optional(),
  imageUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  linkUrl: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
}).refine(data => data.text || data.imageUrl || data.linkUrl, {
  message: "At least one field (text, image, or link) must be filled.",
  path: ["text"], // You can point to any field or a general error
});

type PostFormValues = z.infer<typeof postFormSchema>;

interface CreatePostDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function CreatePostDialog({ isOpen, onOpenChange }: CreatePostDialogProps) {
  const { toast } = useToast();
  const [isModerating, setIsModerating] = useState(false);
  const addPost = usePostsStore(state => state.addPost);
  const groups = MOCK_GROUPS; // Use mock groups

  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      groupId: "",
      text: "",
      imageUrl: "",
      linkUrl: "",
    },
  });

  async function onSubmit(data: PostFormValues) {
    setIsModerating(true);
    try {
      const contentToModerate: ModerateContentInput = {
        text: `${data.text || ''} ${data.imageUrl || ''} ${data.linkUrl || ''}`.trim(),
      };

      if (!contentToModerate.text) {
        toast({
          title: "Empty Post",
          description: "Cannot submit an empty post.",
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
        pseudonym: generatePseudonym(),
        text: data.text,
        imageUrl: data.imageUrl,
        linkUrl: data.linkUrl,
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        commentsCount: 0,
      };
      
      addPost(newPost); // Add to Zustand store

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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Create Anonymous Post</DialogTitle>
          <DialogDescription>
            Share your thoughts, images, or links. Your identity remains anonymous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="groupId" className="text-sm font-medium">Group</Label>
            <Controller
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
              className="min-h-[120px] resize-y"
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
          
          {form.formState.errors.text && !form.formState.errors.groupId && !form.formState.errors.imageUrl && !form.formState.errors.linkUrl && (
             <p className="text-sm text-destructive">{form.formState.errors.text.message}</p>
           )}


          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isModerating} className="bg-accent hover:bg-accent/90 text-accent-foreground">
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
      </DialogContent>
    </Dialog>
  );
}
