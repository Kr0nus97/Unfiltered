
"use client";

import type { Post, Comment as CommentType } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Heart, MessageCircle, Share2, ThumbsDown, ExternalLink, User as UserIcon, SendHorizontal, CornerDownRight, AtSign } from "lucide-react"; 
import { formatDistanceToNow } from 'date-fns';
import { MarkdownRenderer } from "./MarkdownRenderer";
import Image from "next/image"; 
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostsStore } from "@/store/postsStore";
import { useAuth } from "@/context/AuthContext"; 
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useUiStore } from "@/store/uiStore";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { generatePseudonym } from "@/lib/pseudonyms";

interface PostCardProps {
  post: Post;
}

interface StoredReaction {
  liked: boolean;
  disliked: boolean;
}

export function PostCard({ post }: PostCardProps) {
  const updatePostReactions = usePostsStore(state => state.updatePostReactions);
  const updateCommentReactions = usePostsStore(state => state.updateCommentReactions);
  const addCommentStore = usePostsStore(state => state.addComment);
  const usersForMentions = usePostsStore(state => state.usersForMentions);

  const { user, isGuestMode, signInWithGoogle } = useAuth(); 
  const { toast } = useToast();
  const openChatModal = useUiStore(state => state.openChatModal);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likes, setLikes] = useState(post.likes);
  const [dislikes, setDislikes] = useState(post.dislikes);
  const [timeAgo, setTimeAgo] = useState<string | null>(null);

  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [mentionQuery, setMentionQuery] = useState("");
  const [mentionSuggestions, setMentionSuggestions] = useState<{ id: string; displayName: string; photoURL?: string }[]>([]);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  const getLocalStorageKey = (itemId: string, type: 'post' | 'comment') => `unfiltered-reaction-${type}-${itemId}`;

  useEffect(() => {
    setLikes(post.likes);
    setDislikes(post.dislikes);
    if (user && !isGuestMode) {
        const storedReactionString = localStorage.getItem(getLocalStorageKey(post.id, 'post'));
        if (storedReactionString) {
          try {
            const storedReaction: StoredReaction = JSON.parse(storedReactionString);
            setLiked(storedReaction.liked);
            setDisliked(storedReaction.disliked);
          } catch (e) { localStorage.removeItem(getLocalStorageKey(post.id, 'post')); setLiked(false); setDisliked(false); }
        } else { setLiked(false); setDisliked(false); }
    } else { setLiked(false); setDisliked(false); }
  }, [post.id, post.likes, post.dislikes, user, isGuestMode]);

  useEffect(() => {
    if (post.createdAt) {
      setTimeAgo(formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }));
    }
  }, [post.createdAt]);

  const handleInteraction = (actionType: 'like' | 'dislike', itemId: string, itemType: 'post' | 'comment') => {
    if (!user || isGuestMode) {
      toast({ title: "Sign in to interact", description: "Please sign in to like or dislike.", action: <ToastAction altText="Sign In" onClick={signInWithGoogle}>Sign In</ToastAction> });
      return;
    }

    let currentLikes = itemType === 'post' ? likes : post.comments?.find(c => c.id === itemId)?.likes || 0;
    let currentDislikes = itemType === 'post' ? dislikes : post.comments?.find(c => c.id === itemId)?.dislikes || 0;
    let currentLiked = itemType === 'post' ? liked : (localStorage.getItem(getLocalStorageKey(itemId, 'comment')) ? JSON.parse(localStorage.getItem(getLocalStorageKey(itemId, 'comment'))!).liked : false);
    let currentDisliked = itemType === 'post' ? disliked : (localStorage.getItem(getLocalStorageKey(itemId, 'comment')) ? JSON.parse(localStorage.getItem(getLocalStorageKey(itemId, 'comment'))!).disliked : false);
    
    let newLikesCount = currentLikes;
    let newDislikesCount = currentDislikes;
    let newLikedState = currentLiked;
    let newDislikedState = currentDisliked;

    if (actionType === 'like') {
      newLikedState = !newLikedState;
      newLikesCount = newLikedState ? newLikesCount + 1 : newLikesCount - 1;
      if (newLikedState && newDislikedState) { newDislikedState = false; newDislikesCount--; }
    } else if (actionType === 'dislike') {
      newDislikedState = !newDislikedState;
      newDislikesCount = newDislikedState ? newDislikesCount + 1 : newDislikesCount - 1;
      if (newDislikedState && newLikedState) { newLikedState = false; newLikesCount--; }
    }
    
    newLikesCount = Math.max(0, newLikesCount);
    newDislikesCount = Math.max(0, newDislikesCount);

    if (itemType === 'post') {
      setLiked(newLikedState); setDislikes(newDislikedState);
      setLikes(newLikesCount); setDislikes(newDislikesCount);
      updatePostReactions(postId, newLikesCount, newDislikesCount, user.uid);
      try { localStorage.setItem(getLocalStorageKey(itemId, 'post'), JSON.stringify({ liked: newLikedState, disliked: newDislikedState })); } catch (e) { console.error(e); }
    } else {
      updateCommentReactions(post.id, itemId, newLikesCount, newDislikesCount, user.uid);
      try { localStorage.setItem(getLocalStorageKey(itemId, 'comment'), JSON.stringify({ liked: newLikedState, disliked: newDislikedState })); } catch (e) { console.error(e); }
    }
  };
  
  const handleMessageAuthor = () => {
    if (!user || isGuestMode) {
        toast({ title: "Sign in to message", description: "Please sign in with Google to send messages.", action: <ToastAction altText="Sign In" onClick={signInWithGoogle}>Sign In</ToastAction> });
        return;
    }
    if (post.userId && post.userId !== user.uid) {
        openChatModal(post.userId, post.userDisplayName || post.pseudonym, post.id);
    } else if (post.userId === user.uid) {
        toast({ title: "Cannot message yourself", description: "You cannot start a chat with yourself." });
    } else {
        toast({ title: "Cannot message author", description: "This post's author information is unavailable for messaging." });
    }
  };

  const handleCommentInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCommentText(text);
    const lastWord = text.split(/\s+/).pop() || "";
    if (lastWord.startsWith("@") && lastWord.length > 1) {
      setMentionQuery(lastWord.substring(1).toLowerCase());
      const suggestions = usersForMentions.filter(u => 
        u.displayName.toLowerCase().includes(mentionQuery) && u.id !== user?.uid
      ).slice(0, 5);
      setMentionSuggestions(suggestions);
    } else {
      setMentionSuggestions([]);
    }
  };

  const handleMentionSelect = (selectedUser: { id: string; displayName: string }) => {
    const words = commentText.split(/\s+/);
    words.pop(); // Remove the partial @mention
    // Replace spaces in display name for the mention tag, but store ID for actual linking
    const mentionTag = `@${selectedUser.displayName.replace(/\s+/g, "")}`; 
    setCommentText(words.join(" ") + (words.length > 0 ? " " : "") + mentionTag + " ");
    setMentionSuggestions([]);
    commentInputRef.current?.focus();
  };

  const handleReplyToComment = (commenterDisplayName: string) => {
    if (!user || isGuestMode) {
        toast({ title: "Sign in to reply", description: "Please sign in to reply to comments.", action: <ToastAction altText="Sign In" onClick={signInWithGoogle}>Sign In</ToastAction> });
        return;
    }
    const mentionTag = `@${commenterDisplayName.replace(/\s+/g, "")}`;
    setCommentText(prev => `${mentionTag} ${prev}`.trimStart());
    setShowCommentInput(true);
    commentInputRef.current?.focus();
  };
  
  const submitComment = () => {
    if (!commentText.trim() || !user) return;
    
    addCommentStore(post.id, {
        postId: post.id,
        userId: user.uid,
        userDisplayName: user.displayName || "Anonymous User",
        userPhotoURL: user.photoURL || undefined,
        text: commentText,
        // Mentions will be processed in store based on text content
    });
    setCommentText("");
    setShowCommentInput(false);
    setMentionSuggestions([]);
  };


  const renderComment = (comment: CommentType) => {
    // Simplified reaction state for comments, ideally also from local storage per comment
    let commentLiked = false;
    let commentDisliked = false;
    if (user && !isGuestMode) {
        const reaction = localStorage.getItem(getLocalStorageKey(comment.id, 'comment'));
        if (reaction) {
            const parsed = JSON.parse(reaction);
            commentLiked = parsed.liked;
            commentDisliked = parsed.disliked;
        }
    }

    const commentTimeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
      <div key={comment.id} className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-start space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.userPhotoURL} alt={comment.userDisplayName} />
            <AvatarFallback>{comment.userDisplayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-foreground">{comment.userDisplayName}</span>
              <span className="text-xs text-muted-foreground">({comment.pseudonym})</span>
              <span className="text-xs text-muted-foreground">&middot; {commentTimeAgo}</span>
            </div>
            <MarkdownRenderer className="text-sm text-card-foreground py-1">
              {comment.text.replace(/@(\w+)/g, (match, username) => {
                const mentionedUser = usersForMentions.find(u => u.displayName.replace(/\s+/g, '') === username);
                if (mentionedUser) {
                  return `[@${username}](/account/${mentionedUser.id})`; // Markdown link
                }
                return match; // Return original if no user found (e.g. @notarealuser)
              })}
            </MarkdownRenderer>
            <div className="flex items-center space-x-2 mt-1">
              <Button variant="ghost" size="xs" onClick={() => handleInteraction('like', comment.id, 'comment')} className={`flex items-center space-x-1 ${commentLiked ? 'text-accent' : 'text-muted-foreground hover:text-accent'}`}>
                <Heart className={`h-3 w-3 ${commentLiked ? 'fill-current' : ''}`} /> <span className="text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="xs" onClick={() => handleInteraction('dislike', comment.id, 'comment')} className={`flex items-center space-x-1 ${commentDisliked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'}`}>
                <ThumbsDown className={`h-3 w-3 ${commentDisliked ? 'fill-current' : ''}`} /> <span className="text-xs">{comment.dislikes}</span>
              </Button>
              <Button variant="ghost" size="xs" className="text-muted-foreground hover:text-accent" onClick={() => handleReplyToComment(comment.userDisplayName)}>
                <CornerDownRight className="h-3 w-3 mr-1" /> <span className="text-xs">Reply</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const displayName = post.userDisplayName || post.pseudonym;
  const avatarInitial = displayName?.substring(0, 1).toUpperCase();
  const avatarImageSrc = post.userPhotoURL;
  const canInteract = !!user && !isGuestMode;
  const { postId } = post; // Ensure postId is available for interactions

  return (
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300" id={`post-${post.id}`}>
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Avatar className="h-10 w-10">
          {avatarImageSrc ? (<AvatarImage src={avatarImageSrc} alt={displayName || "User avatar"} />) : null}
          <AvatarFallback className={avatarImageSrc ? '' : 'bg-primary text-primary-foreground'}>{avatarInitial || <UserIcon />}</AvatarFallback>
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
        {post.text && <MarkdownRenderer className="text-card-foreground">{post.text.replace(/@(\w+)/g, (match, username) => {
            const mentionedUser = usersForMentions.find(u => u.displayName.replace(/\s+/g, "") === username);
            return mentionedUser ? `[@${username}](/account/${mentionedUser.id})` : match;
          })}
        </MarkdownRenderer>}
        {post.imageUrl && (<div className="mt-3 rounded-lg overflow-hidden border"><Image src={post.imageUrl} alt="Post image" width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media image"/></div>)}
        {post.videoUrl && (<div className="mt-3 rounded-lg overflow-hidden border aspect-video"><video controls src={post.videoUrl} className="w-full h-full bg-black" data-ai-hint="social media video">Your browser does not support the video tag.</video></div>)}
        {post.audioUrl && (<div className="mt-3"><audio controls src={post.audioUrl} className="w-full" data-ai-hint="social media audio">Your browser does not support the audio element.</audio></div>)}
        {post.linkUrl && (<div className="mt-3 p-3 border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"><a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-accent hover:underline"><ExternalLink className="h-4 w-4 mr-2" />{post.linkTitle || post.linkUrl}</a></div>)}
        {post.isFlagged && (<div className="mt-3 p-2 border border-destructive/50 rounded-md bg-destructive/10 text-destructive text-xs">This post was flagged for: {post.flagReason || "Violating community guidelines."}</div>)}
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-3 border-t">
        <div className="flex justify-between items-center w-full">
            <div className="flex space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleInteraction('like', post.id, 'post')} className={cn('flex items-center space-x-1 disabled:opacity-70 disabled:cursor-not-allowed', canInteract && liked ? 'text-accent' : 'text-muted-foreground hover:text-accent')} aria-pressed={canInteract && liked} title={!canInteract ? "Sign in to like" : (liked ? "Unlike post" : "Like post")} disabled={!canInteract}>
                    <Heart className={cn('h-5 w-5', canInteract && liked ? 'fill-current' : '')} /> <span>{likes}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleInteraction('dislike', post.id, 'post')} className={cn('flex items-center space-x-1 disabled:opacity-70 disabled:cursor-not-allowed', canInteract && disliked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive')} aria-pressed={canInteract && disliked} title={!canInteract ? "Sign in to dislike" : (disliked ? "Remove dislike" : "Dislike post")} disabled={!canInteract}>
                    <ThumbsDown className={cn('h-5 w-5', canInteract && disliked ? 'fill-current' : '')} /> <span>{dislikes}</span>
                </Button>
                 <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent" onClick={() => setShowCommentInput(prev => !prev)}>
                    <MessageCircle className="h-5 w-5 mr-1" /> {post.commentsCount}
                </Button>
            </div>
            <div className="flex space-x-1">
                {post.userId && post.userId !== user?.uid && ( // Show message button if post author is not current user
                  <Button variant="ghost" size="sm" onClick={handleMessageAuthor} className="text-muted-foreground hover:text-accent" title="Message author" disabled={!canInteract}>
                    <SendHorizontal className="h-5 w-5"/>
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
        {/* Comments Section */}
        <div className="w-full mt-3">
            {post.comments && post.comments.length > 0 && (
                <div className="space-y-2 mb-3">
                    {post.comments.slice(0, 2).map(renderComment)} 
                    {post.comments.length > 2 && (
                        <Button variant="link" size="sm" className="text-accent p-0 h-auto" onClick={() => alert("View all comments (not implemented yet)")}>
                            View all {post.comments.length} comments
                        </Button>
                    )}
                </div>
            )}
             {post.comments && post.comments.length === 0 && !showCommentInput && (
                <p className="text-xs text-muted-foreground italic py-2">No comments yet. Be the first to share your thoughts!</p>
            )}

            {showCommentInput && (
                <div className="mt-2 relative">
                    <Textarea
                        ref={commentInputRef}
                        placeholder="Add a comment... (Type @ to mention someone)"
                        value={commentText}
                        onChange={handleCommentInputChange}
                        className="w-full text-sm"
                        rows={2}
                        disabled={!canInteract}
                    />
                    {mentionSuggestions.length > 0 && (
                        <Card className="absolute z-10 w-full mt-1 border bg-card shadow-lg max-h-40 overflow-y-auto">
                        {mentionSuggestions.map(suggestion => (
                            <Button
                                key={suggestion.id}
                                variant="ghost"
                                className="w-full justify-start p-2 text-sm h-auto"
                                onClick={() => handleMentionSelect(suggestion)}
                            >
                                <Avatar className="h-6 w-6 mr-2">
                                    <AvatarImage src={suggestion.photoURL} />
                                    <AvatarFallback>{suggestion.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {suggestion.displayName}
                            </Button>
                        ))}
                        </Card>
                    )}
                     <div className="mt-2 flex justify-end">
                        <Button size="sm" onClick={submitComment} disabled={!commentText.trim() || !canInteract} className="bg-accent text-accent-foreground hover:bg-accent/80">
                            Post Comment
                        </Button>
                    </div>
                </div>
            )}
             {!canInteract && (showCommentInput || (post.comments && post.comments.length === 0)) && (
                 <Button variant="outline" size="sm" className="w-full mt-2" onClick={signInWithGoogle}>
                    <AtSign className="h-4 w-4 mr-2"/> Sign in to comment or mention
                </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
