
"use client";

import { Post } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Heart, MessageCircle, Share2, ThumbsDown, ExternalLink, User as UserIcon } from "lucide-react"; 
import { formatDistanceToNow } from 'date-fns';
import { MarkdownRenderer } from "./MarkdownRenderer";
import Image from "next/image"; 
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostsStore } from "@/store/postsStore";
import { useAuth } from "@/context/AuthContext"; 
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const updatePostReactions = usePostsStore(state => state.updatePostReactions);
  const { user, isGuestMode, signInWithGoogle } = useAuth(); 
  const { toast } = useToast();

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [timeAgo, setTimeAgo] = useState<string | null>(null);

  useEffect(() => {
    if (post.createdAt) {
      setTimeAgo(formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }));
    }
  }, [post.createdAt]);

  useEffect(() => {
    setLikes(post.likes);
    setDislikes(post.dislikes);
    // Reset local liked/disliked state if user changes or post changes
    // This is a simplification; a more robust solution would store user's reactions
    setLiked(false); 
    setDisliked(false);
  }, [post.likes, post.dislikes, user, post.id]);


  const handleInteraction = (actionType: 'like' | 'dislike') => {
    if (!user || isGuestMode) {
      toast({
          title: "Sign in to interact",
          description: "Please sign in with Google to like or dislike posts.",
          action: <ToastAction altText="Sign In" onClick={signInWithGoogle}>Sign In</ToastAction>
      });
      return;
    }

    let newLikesCount = likes;
    let newDislikesCount = dislikes;
    let newLikedState = liked;
    let newDislikedState = disliked;

    if (actionType === 'like') {
      if (liked) {
        newLikedState = false;
        newLikesCount--;
      } else {
        newLikedState = true;
        newLikesCount++;
        if (disliked) {
          newDislikedState = false;
          newDislikesCount--;
        }
      }
    } else if (actionType === 'dislike') {
      if (disliked) {
        newDislikedState = false;
        newDislikesCount--;
      } else {
        newDislikedState = true;
        newDislikesCount++;
        if (liked) {
          newLikedState = false;
          newLikesCount--;
        }
      }
    }
    
    setLiked(newLikedState);
    setDislikes(newDislikedState);
    setLikes(newLikesCount < 0 ? 0 : newLikesCount);
    setDislikes(newDislikesCount < 0 ? 0 : newDislikesCount);
    updatePostReactions(post.id, newLikesCount < 0 ? 0 : newLikesCount, newDislikesCount < 0 ? 0 : newDislikesCount, user.uid); 
  };
  
  const displayName = post.userDisplayName || post.pseudonym;
  const avatarInitial = displayName?.substring(0, 1).toUpperCase();
  const avatarImageSrc = post.userPhotoURL;

  const canInteract = !!user && !isGuestMode;

  return (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300" id={`post-${post.id}`}>
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Avatar className="h-10 w-10">
          {avatarImageSrc ? (
            <AvatarImage src={avatarImageSrc} alt={displayName || "User avatar"} />
          ) : null}
          <AvatarFallback className={avatarImageSrc ? '' : 'bg-primary text-primary-foreground'}>
            {avatarInitial || <UserIcon />}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold text-card-foreground">{displayName}</CardTitle>
          <div className="text-xs text-muted-foreground">
            Posted in <Link href={`/groups/${post.groupId}`} className="text-accent hover:underline">{post.groupName || post.groupId}</Link>
            {' \u00b7 '}
            {timeAgo !== null ? timeAgo : <Skeleton className="h-3 w-20 inline-block" />}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {post.text && <MarkdownRenderer className="text-card-foreground">{post.text}</MarkdownRenderer>}
        
        {post.imageUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border">
            <Image
              src={post.imageUrl}
              alt="Post image"
              width={500}
              height={300}
              className="w-full h-auto object-cover"
              data-ai-hint="social media image"
            />
          </div>
        )}

        {post.videoUrl && (
          <div className="mt-3 rounded-lg overflow-hidden border aspect-video">
            <video controls src={post.videoUrl} className="w-full h-full bg-black" data-ai-hint="social media video">
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {post.audioUrl && (
          <div className="mt-3">
            <audio controls src={post.audioUrl} className="w-full" data-ai-hint="social media audio">
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {post.linkUrl && (
          <div className="mt-3 p-3 border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-accent hover:underline">
              <ExternalLink className="h-4 w-4 mr-2" />
              {post.linkTitle || post.linkUrl}
            </a>
          </div>
        )}

        {post.isFlagged && (
          <div className="mt-3 p-2 border border-destructive/50 rounded-md bg-destructive/10 text-destructive text-xs">
            This post was flagged for: {post.flagReason || "Violating community guidelines."}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-3 border-t">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleInteraction('like')}
            className={`flex items-center space-x-1 ${canInteract && liked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}
            aria-pressed={canInteract && liked}
            title={!canInteract ? "Sign in to like" : (liked ? "Unlike post" : "Like post")}
          >
            <Heart className={`h-5 w-5 ${canInteract && liked ? 'fill-current' : ''}`} /> <span>{likes}</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleInteraction('dislike')}
            className={`flex items-center space-x-1 ${canInteract && disliked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}
            aria-pressed={canInteract && disliked}
            title={!canInteract ? "Sign in to dislike" : (disliked ? "Remove dislike" : "Dislike post")}
          >
            <ThumbsDown className={`h-5 w-5 ${canInteract && disliked ? 'fill-current' : ''}`} /> <span>{dislikes}</span>
          </Button>
        </div>
        <div className="flex space-x-2">
           <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <MessageCircle className="h-5 w-5 mr-1" /> {post.commentsCount}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

