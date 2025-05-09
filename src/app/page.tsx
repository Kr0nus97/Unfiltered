
"use client";

import { PostCard } from "@/components/core/PostCard";
import { FeedTabs } from "@/components/core/FeedTabs";
import { usePostsStore } from "@/store/postsStore";
import { useEffect, useState } from "react";
import type { Post } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const getAllPosts = usePostsStore(state => state.getAllPosts);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("new");

  useEffect(() => {
    // In a real app, you would fetch posts based on the activeTab
    if (activeTab === "new") {
      setPosts(getAllPosts());
    } else {
      // Placeholder for other tabs
      setPosts([]); 
    }
    setIsLoading(false);
  }, [getAllPosts, activeTab]);

  const handleTabChange = (tabValue: string) => {
    setIsLoading(true);
    setActiveTab(tabValue);
    // Simulate fetching data for other tabs
    if (tabValue !== "new") {
      setTimeout(() => {
        // Mock data for other tabs or clear posts
        setPosts([]); 
        setIsLoading(false);
      }, 500);
    }
  };

  const renderPosts = () => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
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
      );
    }

    if (posts.length === 0 && activeTab === "new") {
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold text-muted-foreground">No posts yet!</h2>
          <p className="text-muted-foreground">Be the first to share something interesting.</p>
        </div>
      );
    }
    
    if (activeTab === "new") {
        return posts.map((post) => <PostCard key={post.id} post={post} />);
    }
    
    return null; // Other tabs have their content within FeedTabs' TabsContent
  };


  return (
    <div className="max-w-2xl mx-auto">
      {/* h1 "Latest Posts" is removed, FeedTabs implies this context */}
      <FeedTabs onTabChange={handleTabChange}>
        {/* Children here are specifically for the "new" tab's content area in FeedTabs */}
        {renderPosts()}
      </FeedTabs>
    </div>
  );
}
