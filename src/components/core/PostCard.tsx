
"use client";

import { Post } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, ThumbsDown, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { MarkdownRenderer } from "./MarkdownRenderer";
import Image from "next/image"; 
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDislike?: (postId: string) => void;
}

export function PostCard({ post, onLike, onDislike }: PostCardProps) {
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

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikes(prev => prev -1);
    } else {
      setLiked(true);
      setLikes(prev => prev + 1);
      if (disliked) {
        setDisliked(false);
        setDislikes(prev => prev -1);
      }
    }
    onLike?.(post.id);
  };

  const handleDislike = () => {
    if (disliked) {
      setDisliked(false);
      setDislikes(prev => prev -1);
    } else {
      setDisliked(true);
      setDislikes(prev => prev +1);
      if (liked) {
        setLiked(false);
        setLikes(prev => prev -1);
      }
    }
    onDislike?.(post.id);
  };
  
  const pseudonymInitial = post.pseudonym.substring(0, 1).toUpperCase();

  return (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary text-primary-foreground">{pseudonymInitial}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg font-semibold">{post.pseudonym}</CardTitle>
          <p className="text-xs text-muted-foreground">
            Posted in <Link href={`/groups/${post.groupId}`} className="text-accent hover:underline">{post.groupName || post.groupId}</Link>
            {' \u00b7 '}
            {timeAgo !== null ? timeAgo : <Skeleton className="h-3 w-20 inline-block" />}
          </p>
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
          <Button variant="ghost" size="sm" onClick={handleLike} className={`flex items-center space-x-1 ${liked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}>
            <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} /> <span>{likes}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDislike} className={`flex items-center space-x-1 ${disliked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}>
            <ThumbsDown className={`h-5 w-5 ${disliked ? 'fill-current' : ''}`} /> <span>{dislikes}</span>
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

