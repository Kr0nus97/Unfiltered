
"use client";

import { PostCard } from "@/components/core/PostCard";
import { usePostsStore } from "@/store/postsStore";
import { useUiStore } from "@/store/uiStore"; 
import type { Post, Group } from "@/lib/types";
import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext"; 
import { cn } from "@/lib/utils";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.groupId as string;

  const { user, isGuestMode, loading: authLoading } = useAuth(); 
  const getPostsByGroupId = usePostsStore(state => state.getPostsByGroupId);
  const getGroupById = usePostsStore(state => state.getGroupById);
  const openCreatePostDialog = useUiStore(state => state.openCreatePostDialog);

  const [posts, setPosts] = useState<Post[]>([]);
  const [group, setGroup] = useState<Group | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (groupId) {
      const currentGroup = getGroupById(groupId);
      setGroup(currentGroup);
      if (currentGroup) {
        setPosts(getPostsByGroupId(groupId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      }
      setIsLoading(false); // Done loading group details
    }
  }, [groupId, getPostsByGroupId, getGroupById]);

  useEffect(() => {
    // Re-fetch/re-sort posts if the global posts state changes (e.g., a new post is added)
     const newPosts = getPostsByGroupId(groupId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
     setPosts(newPosts);
  }, [usePostsStore(state => state.posts), groupId, getPostsByGroupId]);

  // Effect to redirect if group is not found after loading, including auth loading
  useEffect(() => {
    if (!isLoading && !authLoading && !group) {
      notFound();
    }
  }, [isLoading, authLoading, group, router]);


  if (isLoading || authLoading) { 
     return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6 mb-6" />
        <div className="space-y-6 mt-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg shadow bg-card">
              <div className="flex items-center space-x-3 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-32 w-full rounded-md" />
              <div className="flex justify-between mt-4">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!group) { // Should be caught by the useEffect above now, but kept as a safeguard
    notFound(); // Or return a specific "Group not found" component
    return null;
  }

  const handleOpenCreatePostInGroup = () => {
    openCreatePostDialog(group.id); 
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 p-6 rounded-lg shadow-md bg-card border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{group.name}</h1>
            <p className="text-muted-foreground mb-4">{group.description}</p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenCreatePostInGroup} 
            className={cn(
                "ml-4 hidden md:inline-flex border-accent text-accent hover:bg-accent hover:text-accent-foreground",
                isGuestMode && "opacity-70"
            )}
            // Button not disabled; dialog handles auth/guest state
          >
            <Edit3 className="mr-2 h-4 w-4" /> Post to Group
          </Button>
        </div>
        <Link href="/groups" className="inline-flex items-center text-sm text-accent hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to all groups
        </Link>
      </div>
       <div className="md:hidden mb-6">
          <Button 
            variant="default" 
            size="lg" 
            onClick={handleOpenCreatePostInGroup} 
            className={cn(
                "w-full bg-accent hover:bg-accent/90 text-accent-foreground",
                isGuestMode && "opacity-70"
            )}
            // Button not disabled; dialog handles auth/guest state
          >
            <Edit3 className="mr-2 h-5 w-5" /> Post to {group.name}
          </Button>
        </div>


      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="text-center py-10 bg-card rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-muted-foreground">No posts in this group yet.</h2>
          <p className="text-muted-foreground mt-2">Why not be the first to share something?</p>
          <Button 
            onClick={handleOpenCreatePostInGroup} 
            className={cn(
                "mt-6 bg-accent hover:bg-accent/90 text-accent-foreground hidden md:inline-flex",
                isGuestMode && "opacity-70"
            )}
            // Button not disabled; dialog handles auth/guest state
          >
             Create First Post
          </Button>
        </div>
      )}
    </div>
  );
}

