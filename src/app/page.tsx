"use client";

import { PostCard } from "@/components/core/PostCard";
import { usePostsStore } from "@/store/postsStore";
import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const getAllPosts = usePostsStore(state => state.getAllPosts);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setPosts(getAllPosts());
    setIsLoading(false);
  }, [getAllPosts]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 border rounded-lg shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-3 w-[200px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-4" />
            <Skeleton className="h-32 w-full rounded-md" /> {/* For image/link placeholder */}
            <div className="flex justify-between mt-4">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-muted-foreground">No posts yet!</h2>
        <p className="text-muted-foreground">Be the first to share something interesting.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Latest Posts</h1>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
