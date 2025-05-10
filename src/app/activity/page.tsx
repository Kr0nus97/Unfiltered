
"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { usePostsStore } from "@/store/postsStore";
import type { ActivityItem as ActivityItemType } from "@/lib/types";
import { ActivityItemCard } from "@/components/core/ActivityItemCard";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn, ListChecks, BellOff, Users } from "lucide-react"; // Added Users icon
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ActivityPage() {
  const { user, isGuestMode, loading: authLoading, signInWithGoogle } = useAuth();
  const getUserActivities = usePostsStore(state => state.getUserActivities);
  const markAllActivitiesAsRead = usePostsStore(state => state.markAllActivitiesAsRead);
  const markActivityAsRead = usePostsStore(state => state.markActivityAsRead);

  const [activities, setActivities] = useState<ActivityItemType[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setIsLoadingActivities(true);
      return;
    }
    if (user && !isGuestMode) { // Only fetch activities for logged-in (non-guest) users
      setIsLoadingActivities(true);
      const userActivities = getUserActivities(user.uid);
      setActivities(userActivities);
      setIsLoadingActivities(false);
    } else { // Guests or non-logged-in users have no activities
      setActivities([]);
      setIsLoadingActivities(false);
    }
  }, [user, isGuestMode, authLoading, getUserActivities, usePostsStore(state => state.activityFeed)]);

  const handleMarkAllRead = () => {
    if (user && !isGuestMode) {
      markAllActivitiesAsRead(user.uid);
    }
  };

  const handleMarkOneRead = (activityId: string) => {
    if (user && !isGuestMode) {
      markActivityAsRead(user.uid, activityId);
    }
  };
  
  const unreadCount = activities.filter(a => !a.isRead).length;

  if (authLoading || (user && !isGuestMode && isLoadingActivities)) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Activity Feed</h1>
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg bg-card" />
          ))}
        </div>
      </div>
    );
  }

  if (!user && isGuestMode) { // Guest mode
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-primary mb-6">Activity Feed</h1>
        <Alert className="max-w-md mx-auto bg-card border-border shadow-md">
            <Users className="h-5 w-5 text-accent" />
            <AlertTitle className="text-foreground">Guest Mode</AlertTitle>
            <AlertDescription className="text-muted-foreground mb-4">
            You are browsing as a guest. Sign in with Google to view your activity and notifications.
            </AlertDescription>
            <Button onClick={signInWithGoogle} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                <LogIn className="mr-2 h-4 w-4" /> Sign in with Google
            </Button>
        </Alert>
      </div>
    );
  }
  
  if (!user && !isGuestMode) { // Not logged in, not guest
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-3xl font-bold text-primary mb-6">Activity Feed</h1>
        <Alert className="max-w-md mx-auto bg-card border-border shadow-md">
            <LogIn className="h-5 w-5 text-accent" />
            <AlertTitle className="text-foreground">Sign In to View Activity</AlertTitle>
            <AlertDescription className="text-muted-foreground mb-4">
            Please sign in to see your notifications and updates on UnFiltered.
            </AlertDescription>
            <Button onClick={signInWithGoogle} className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
                <LogIn className="mr-2 h-4 w-4" /> Sign in with Google
            </Button>
        </Alert>
      </div>
    );
  }
  
  // User is logged in and not a guest
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold text-primary mb-4 sm:mb-0">Activity Feed</h1>
        {activities.length > 0 && unreadCount > 0 && (
          <Button onClick={handleMarkAllRead} variant="outline" size="sm">
            <ListChecks className="mr-2 h-4 w-4" /> Mark all as read ({unreadCount})
          </Button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg shadow-md border border-border">
          <BellOff className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground">No activity yet.</h2>
          <p className="text-muted-foreground mt-2">
            Start interacting with posts or create your own to see updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map(activity => (
            <ActivityItemCard 
                key={activity.id} 
                activity={activity} 
                onMarkAsRead={() => handleMarkOneRead(activity.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

