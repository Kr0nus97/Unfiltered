
"use client";

import type { Post, Comment as CommentType } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; 
import { Heart, MessageCircle, Share2, ThumbsDown, ExternalLink, User as UserIcon, SendHorizontal, CornerDownRight, AtSign, Fingerprint, Ghost, AlertCircle } from "lucide-react"; 
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { generatePseudonym } from "@/lib/pseudonyms";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Import Tooltip components

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
  const [commentIsAnonymous, setCommentIsAnonymous] = useState(false);
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

  const handleInteractionRequired = (actionDescription: string): boolean => {
    if (!user || isGuestMode) {
      toast({ 
        title: "Authentication Required", 
        description: `Please sign in to ${actionDescription}.`, 
        action: <ToastAction altText="Sign In" onClick={signInWithGoogle}>Sign In</ToastAction> 
      });
      return true; // Indicates interaction is blocked
    }
    return false; // Indicates interaction is allowed
  };

  const handlePostReaction = (actionType: 'like' | 'dislike') => {
    if (handleInteractionRequired(actionType === 'like' ? 'like posts' : 'dislike posts')) return;

    let currentLikes = likes;
    let currentDislikes = dislikes;
    let currentLiked = liked;
    let currentDisliked = disliked;
    
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

    setLiked(newLikedState); setDislikes(newDislikedState);
    setLikes(newLikesCount); setDislikes(newDislikesCount);
    updatePostReactions(post.id, newLikesCount, newDislikesCount, user?.uid);
    try { localStorage.setItem(getLocalStorageKey(post.id, 'post'), JSON.stringify({ liked: newLikedState, disliked: newDislikedState })); } catch (e) { console.error(e); }
  };

  const handleCommentReaction = (commentId: string, actionType: 'like' | 'dislike') => {
    if (handleInteractionRequired(actionType === 'like' ? 'like comments' : 'dislike comments')) return;
    
    const comment = post.comments?.find(c => c.id === commentId);
    if (!comment) return;

    let currentLikes = comment.likes;
    let currentDislikes = comment.dislikes;
    let currentLiked = false;
    let currentDisliked = false;

    const storedReactionString = localStorage.getItem(getLocalStorageKey(commentId, 'comment'));
    if (storedReactionString) {
        try {
            const storedReaction: StoredReaction = JSON.parse(storedReactionString);
            currentLiked = storedReaction.liked;
            currentDisliked = storedReaction.disliked;
        } catch (e) { /* ignore */ }
    }
    
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
    
    updateCommentReactions(post.id, commentId, newLikesCount, newDislikesCount, user?.uid);
    try { localStorage.setItem(getLocalStorageKey(commentId, 'comment'), JSON.stringify({ liked: newLikedState, disliked: newDislikedState })); } catch (e) { console.error(e); }
     // Force re-render of comments to reflect updated reaction counts for comments
    // This is a simplified way; ideally, the comment item itself would re-render
    // Or the specific comment in the local state would be updated.
    // For now, triggering a re-fetch or re-sort of the post's comments in the store will refresh it.
    // This requires the store to be observable by this component for changes to post.comments
    // The existing useEffect for post.comments already handles this.
  };
  
  const handleMessageAuthor = () => {
    if (post.isAnonymous) {
        toast({ title: "Cannot Message Author", description: "This post was made in UnFiltered mode." });
        return;
    }
    if (handleInteractionRequired('send direct messages')) return;

    if (post.userId && post.userId !== user?.uid) { // user is guaranteed by handleInteractionRequired
        openChatModal(post.userId, post.userDisplayName || post.pseudonym, post.id);
    } else if (post.userId === user?.uid) {
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
      const query = lastWord.substring(1).toLowerCase();
      setMentionQuery(query);
      const suggestions = usersForMentions.filter(u => 
        u.displayName.toLowerCase().includes(query) && u.id !== user?.uid
      ).slice(0, 5);
      setMentionSuggestions(suggestions);
    } else {
      setMentionSuggestions([]);
    }
  };

  const handleMentionSelect = (selectedUser: { id: string; displayName: string }) => {
    const words = commentText.split(/(\s+)/); // Split by space, keeping spaces
    let foundMention = false;
    for (let i = words.length - 1; i >= 0; i--) {
      if (words[i].startsWith("@")) {
        words[i] = `@${selectedUser.displayName.replace(/\s+/g, "")}`;
        foundMention = true;
        break;
      }
    }
    if (!foundMention && words.length > 0 && words[words.length-1] !== " ") { // If no @ found, append to last word if not space
        words[words.length -1] = `@${selectedUser.displayName.replace(/\s+/g, "")}`;
    } else if (!foundMention) { // If no @ or ends with space, append
        words.push(`@${selectedUser.displayName.replace(/\s+/g, "")}`);
    }

    setCommentText(words.join("") + " ");
    setMentionSuggestions([]);
    commentInputRef.current?.focus();
  };

  const handleReplyToComment = (commenterDisplayName: string) => {
    if (handleInteractionRequired('reply to comments')) return;
    const mentionTag = `@${commenterDisplayName.replace(/\s+/g, "")}`;
    setCommentText(prev => `${mentionTag} ${prev}`.trimStart());
    setShowCommentInput(true);
    setTimeout(() => commentInputRef.current?.focus(), 0); // Focus after state update
  };
  
  const submitComment = () => {
    if (handleInteractionRequired('post comments')) return;
    if (!commentText.trim()) {
        toast({ title: "Empty Comment", description: "Cannot submit an empty comment.", variant: "destructive" });
        return;
    }
    
    addCommentStore(post.id, {
        postId: post.id,
        userId: user!.uid, // user is guaranteed by handleInteractionRequired
        userDisplayName: user!.displayName || "User", // user is guaranteed
        userPhotoURL: user!.photoURL || undefined,
        text: commentText,
        isAnonymous: commentIsAnonymous,
    });
    setCommentText("");
    setShowCommentInput(false);
    setMentionSuggestions([]);
    setCommentIsAnonymous(false);
  };


  const renderComment = (comment: CommentType) => {
    let commentLiked = false;
    let commentDisliked = false;
    if (user && !isGuestMode) {
        const reactionKey = getLocalStorageKey(comment.id, 'comment');
        const reaction = localStorage.getItem(reactionKey);
        if (reaction) {
            try {
                const parsed = JSON.parse(reaction);
                commentLiked = parsed.liked;
                commentDisliked = parsed.disliked;
            } catch (e) { localStorage.removeItem(reactionKey); }
        }
    }

    const commentTimeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
    const commentAuthorName = comment.isAnonymous ? comment.pseudonym : comment.userDisplayName;
    const commentAuthorAvatar = comment.isAnonymous ? null : comment.userPhotoURL;
    const commentAvatarFallback = comment.isAnonymous ? <Ghost className="h-full w-full text-muted-foreground"/> : (comment.userDisplayName?.charAt(0).toUpperCase() || <UserIcon />);

    return (
      <div key={comment.id} className="mt-3 pt-3 border-t border-border/50">
        <div className="flex items-start space-x-2">
          <Avatar className="h-8 w-8">
            {commentAuthorAvatar && <AvatarImage src={commentAuthorAvatar} alt={commentAuthorName || 'Avatar'} />}
            <AvatarFallback>{commentAvatarFallback}</AvatarFallback>
          </Avatar>
          <div className="flex-grow">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-sm text-foreground">{commentAuthorName}</span>
              {!comment.isAnonymous && post.userId !== comment.userId && <span className="text-xs text-muted-foreground">({comment.pseudonym})</span>}
              <span className="text-xs text-muted-foreground">&middot; {commentTimeAgo}</span>
            </div>
            <MarkdownRenderer className="text-sm text-card-foreground py-1">
              {comment.text.replace(/@(\w+)/g, (match, username) => {
                const mentionedUser = usersForMentions.find(u => u.displayName.replace(/\s+/g, '') === username);
                return mentionedUser ? `[@${username}](/account/${mentionedUser.id})` : match; 
              })}
            </MarkdownRenderer>
            <div className="flex items-center space-x-1 mt-1">
              <Button variant="ghost" size="xs" onClick={() => handleCommentReaction(comment.id, 'like')} className={`flex items-center space-x-1 ${commentLiked ? 'text-accent' : 'text-muted-foreground hover:text-accent'} disabled:opacity-70`} disabled={isGuestMode || !user} title={isGuestMode || !user ? "Sign in to like" : (commentLiked ? "Unlike" : "Like")}>
                <Heart className={`h-3 w-3 ${commentLiked ? 'fill-current' : ''}`} /> <span className="text-xs">{comment.likes}</span>
              </Button>
              <Button variant="ghost" size="xs" onClick={() => handleCommentReaction(comment.id, 'dislike')} className={`flex items-center space-x-1 ${commentDisliked ? 'text-destructive' : 'text-muted-foreground hover:text-destructive'} disabled:opacity-70`} disabled={isGuestMode || !user} title={isGuestMode || !user ? "Sign in to dislike" : (commentDisliked ? "Remove dislike" : "Dislike")}>
                <ThumbsDown className={`h-3 w-3 ${commentDisliked ? 'fill-current' : ''}`} /> <span className="text-xs">{comment.dislikes}</span>
              </Button>
              <Button variant="ghost" size="xs" className="text-muted-foreground hover:text-accent disabled:opacity-70" onClick={() => handleReplyToComment(comment.userDisplayName)} disabled={isGuestMode || !user} title={isGuestMode || !user ? "Sign in to reply" : "Reply"}>
                <CornerDownRight className="h-3 w-3 mr-1" /> <span className="text-xs">Reply</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const displayName = post.isAnonymous ? post.pseudonym : (post.userDisplayName || post.pseudonym);
  const avatarImageSrc = post.isAnonymous ? undefined : post.userPhotoURL;
  const avatarFallbackContent = post.isAnonymous ? <Fingerprint className="h-5 w-5 text-primary-foreground" /> : (displayName?.substring(0, 1).toUpperCase() || <UserIcon />);
  
  const isUserPostOwner = user && post.userId === user.uid;

  return (
    <TooltipProvider>
    <Card className="mb-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card" id={`post-${post.id}`}>
      <CardHeader className="flex flex-row items-center space-x-3 pb-3">
        <Avatar className={cn("h-10 w-10", post.isAnonymous && "bg-primary")}>
          {avatarImageSrc && <AvatarImage src={avatarImageSrc} alt={displayName || "User avatar"} />}
          <AvatarFallback className={cn(post.isAnonymous && "bg-primary text-primary-foreground")}>
            {avatarFallbackContent}
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
        {post.text && <MarkdownRenderer className="text-card-foreground prose-sm dark:prose-invert max-w-none">
          {post.text.replace(/@(\w+)/g, (match, username) => {
            const mentionedUser = usersForMentions.find(u => u.displayName.replace(/\s+/g, "") === username);
            // For now, link to a generic account page, or user profile if available
            return mentionedUser ? `[@${username}](/account?userId=${mentionedUser.id})` : match;
          })}
        </MarkdownRenderer>}
        {post.imageUrl && (<div className="mt-3 rounded-lg overflow-hidden border"><Image src={post.imageUrl} alt={post.text ? post.text.substring(0,30) : "Post image"} width={500} height={300} className="w-full h-auto object-cover" data-ai-hint="social media image"/></div>)}
        {post.videoUrl && (<div className="mt-3 rounded-lg overflow-hidden border aspect-video bg-black"><video controls src={post.videoUrl} className="w-full h-full" data-ai-hint="social media video"><track kind="captions" /></video></div>)}
        {post.audioUrl && (<div className="mt-3"><audio controls src={post.audioUrl} className="w-full" data-ai-hint="social media audio"></audio></div>)}
        {post.linkUrl && (<div className="mt-3 p-3 border rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"><a href={post.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-accent hover:underline"><ExternalLink className="h-4 w-4 mr-2" />{post.linkTitle || post.linkUrl}</a></div>)}
        {post.isFlagged && (<div className="mt-3 p-2 border border-destructive/50 rounded-md bg-destructive/10 text-destructive text-xs">This post was flagged for: {post.flagReason || "Violating community guidelines."}</div>)}
      </CardContent>
      <CardFooter className="flex flex-col items-start pt-3 border-t">
        <div className="flex justify-between items-center w-full">
            <div className="flex space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => handlePostReaction('like')} className={cn('flex items-center space-x-1 disabled:opacity-60 disabled:cursor-not-allowed', liked && (user && !isGuestMode) ? 'text-accent' : 'text-muted-foreground hover:text-accent')} aria-pressed={liked && (user && !isGuestMode)} disabled={isGuestMode || !user}>
                        <Heart className={cn('h-5 w-5', liked && (user && !isGuestMode) ? 'fill-current' : '')} /> <span>{likes}</span>
                    </Button>
                  </TooltipTrigger>
                  {(isGuestMode || !user) && <TooltipContent><p>Sign in to like posts</p></TooltipContent>}
                </Tooltip>
                 <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" onClick={() => handlePostReaction('dislike')} className={cn('flex items-center space-x-1 disabled:opacity-60 disabled:cursor-not-allowed', disliked && (user && !isGuestMode) ? 'text-destructive' : 'text-muted-foreground hover:text-destructive')} aria-pressed={disliked && (user && !isGuestMode)} disabled={isGuestMode || !user}>
                        <ThumbsDown className={cn('h-5 w-5', disliked && (user && !isGuestMode) ? 'fill-current' : '')} /> <span>{dislikes}</span>
                    </Button>
                  </TooltipTrigger>
                  {(isGuestMode || !user) && <TooltipContent><p>Sign in to dislike posts</p></TooltipContent>}
                </Tooltip>
                 <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-accent disabled:opacity-60 disabled:cursor-not-allowed" onClick={() => { if (isGuestMode || !user) { handleInteractionRequired('comment on posts'); } else { setShowCommentInput(prev => !prev); } }} disabled={isGuestMode || !user}>
                        <MessageCircle className="h-5 w-5 mr-1" /> {post.commentsCount}
                    </Button>
                  </TooltipTrigger>
                   {(isGuestMode || !user) && <TooltipContent><p>Sign in to comment</p></TooltipContent>}
                </Tooltip>
            </div>
            <div className="flex space-x-1">
                {!post.isAnonymous && post.userId && !isUserPostOwner && ( 
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" onClick={handleMessageAuthor} className="text-muted-foreground hover:text-accent disabled:opacity-60 disabled:cursor-not-allowed" title="Message author" disabled={isGuestMode || !user}>
                        <SendHorizontal className="h-5 w-5"/>
                      </Button>
                    </TooltipTrigger>
                    {(isGuestMode || !user) && <TooltipContent><p>Sign in to message author</p></TooltipContent>}
                  </Tooltip>
                )}
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Share2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
        
        <div className="w-full mt-3">
            {post.comments && post.comments.length > 0 && (
                <div className="space-y-2 mb-3">
                    {post.comments.slice(0, 2).map(renderComment)} 
                    {post.comments.length > 2 && (
                        <Button variant="link" size="sm" className="text-accent p-0 h-auto hover:underline" onClick={() => alert("View all comments feature coming soon!")}>
                            View all {post.comments.length} comments
                        </Button>
                    )}
                </div>
            )}
             {post.comments && post.comments.length === 0 && !showCommentInput && (
                <p className="text-xs text-muted-foreground italic py-2 text-center">No comments yet. Be the first to share your thoughts!</p>
            )}

            {showCommentInput && (user && !isGuestMode) && ( // Only show input field if user is logged in and not guest
                <div className="mt-2 relative">
                    <Textarea
                        ref={commentInputRef}
                        placeholder="Add a comment... (Type @ to mention someone)"
                        value={commentText}
                        onChange={handleCommentInputChange}
                        className="w-full text-sm bg-background"
                        rows={2}
                    />
                    {mentionSuggestions.length > 0 && (
                        <Card className="absolute z-10 w-full mt-1 border bg-popover shadow-lg max-h-40 overflow-y-auto">
                        {mentionSuggestions.map(suggestion => (
                            <Button
                                key={suggestion.id}
                                variant="ghost"
                                className="w-full justify-start p-2 text-sm h-auto hover:bg-accent/10"
                                onClick={() => handleMentionSelect(suggestion)}
                            >
                                <Avatar className="h-6 w-6 mr-2">
                                    {suggestion.photoURL && <AvatarImage src={suggestion.photoURL} />}
                                    <AvatarFallback>{suggestion.displayName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                {suggestion.displayName}
                            </Button>
                        ))}
                        </Card>
                    )}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id={`comment-anonymous-switch-${post.id}`}
                                checked={commentIsAnonymous}
                                onCheckedChange={setCommentIsAnonymous}
                                aria-label="Comment in UnFiltered Mode"
                            />
                            <Label htmlFor={`comment-anonymous-switch-${post.id}`} className="text-xs flex items-center text-muted-foreground hover:text-foreground cursor-pointer">
                                <Fingerprint className="h-3 w-3 mr-1 text-primary" /> UnFiltered Mode
                            </Label>
                        </div>
                        <Button size="sm" onClick={submitComment} className="bg-accent text-accent-foreground hover:bg-accent/90">
                            {commentIsAnonymous ? "Comment Anonymously" : "Post Comment"}
                        </Button>
                    </div>
                </div>
            )}
             {showCommentInput && (isGuestMode || !user) && ( // If guest tries to comment (e.g. comment input was shown due to a click)
                 <Button variant="outline" size="sm" className="w-full mt-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground" onClick={() => { handleInteractionRequired('comment on posts'); setShowCommentInput(false); } }>
                    <AlertCircle className="h-4 w-4 mr-2"/> Sign in to comment or mention
                </Button>
            )}
        </div>
      </CardFooter>
    </Card>
    </TooltipProvider>
  );
}
