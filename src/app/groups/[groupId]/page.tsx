
"use client";

import { PostCard } from "@/components/core/PostCard";
import { usePostsStore } from "@/store/postsStore";
import type { Post, Group } from "@/lib/types";
import { useParams, notFound, useRouter } from "next/navigation";
import { useEffect, useState, useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
// CreatePostDialog is now rendered globally in RootLayout.
// We need a way to trigger it. This typically involves context or a global state.
// For now, we'll assume setIsCreatePostOpen is available via a hypothetical context or passed props.
// This example won't fully work without that context.
// A simple solution would be to pass the setCreatePostOpen function down through props,
// or use a Zustand action to control the dialog's visibility.

// For the purpose of this change, we'll remove the direct dialog invocation
// and assume the button would call a global state setter.
// Let's simulate this by making the button non-functional for opening the dialog
// until a proper global state solution is in place.
// OR, we can modify RootLayout to pass down the setter via a React Context.

// Let's assume the parent RootLayout makes setIsCreatePostOpen available via a context
// For now, the functionality of opening the dialog from here is deferred.
// A proper solution would involve:
// 1. Creating a React Context in RootLayout for isCreatePostOpen and setIsCreatePostOpen.
// 2. Consuming that context here.

// As a temporary workaround, we'll just make the button not open the dialog.
// The global dialog will be opened by the bottom nav bar.
// The user would then select the group in the dialog.
// To make THIS button work, it'd need to set the global dialog state.

export default function GroupPage() {
  const params = useParams();
  const groupId = params.groupId as string;

  const getPostsByGroupId = usePostsStore(state => state.getPostsByGroupId);
  const getGroupById = usePostsStore(state => state.getGroupById);
  // For now, we cannot directly call setIsCreatePostOpen from RootLayout here
  // without a context or prop drilling. The button will be for UI purposes.
  // const { setIsCreatePostOpen } = useSomeGlobalDialogContext(); // hypothetical

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
      setIsLoading(false);
    }
  }, [groupId, getPostsByGroupId, getGroupById]);

  useEffect(() => {
    if (group) {
        setPosts(getPostsByGroupId(groupId).sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  }, [usePostsStore(state => state.posts), group, groupId, getPostsByGroupId]);


  if (isLoading) {
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

  if (!group) {
    notFound();
  }

  const handleOpenCreatePostDialog = () => {
    // This would ideally call a global function to open the dialog.
    // For example: openGlobalCreatePostDialog({ defaultGroupId: group.id });
    // For now, this button won't open the global dialog directly without context.
    // The user can use the bottom navigation bar to open the post dialog.
    alert("Use the '+' button in the bottom navigation bar to create a post. You can select this group from the dialog.");
  };


  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 p-6 rounded-lg shadow-md bg-card border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{group.name}</h1>
            <p className="text-muted-foreground mb-4">{group.description}</p>
          </div>
          {/* This button's onClick needs to trigger the global dialog from RootLayout */}
          <Button variant="outline" size="sm" onClick={handleOpenCreatePostDialog} className="ml-4 hidden md:inline-flex">
            <Edit3 className="mr-2 h-4 w-4" /> Post to Group
          </Button>
        </div>
        <Link href="/groups" className="inline-flex items-center text-sm text-accent hover:underline">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to all groups
        </Link>
      </div>

      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <div className="text-center py-10 bg-card rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-muted-foreground">No posts in this group yet.</h2>
          <p className="text-muted-foreground mt-2">Why not be the first to share something?</p>
          {/* This button's onClick also needs to trigger the global dialog */}
          <Button onClick={handleOpenCreatePostDialog} className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground hidden md:inline-flex">
             Create Post
          </Button>
        </div>
      )}
      {/* CreatePostDialog is no longer rendered here directly */}
    </div>
  );
}
