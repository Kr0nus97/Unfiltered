
"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Construction } from "lucide-react";

export default function ActivityPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Activity</h1>
      <Alert className="bg-card border-border shadow-md">
        <Construction className="h-5 w-5 text-accent" />
        <AlertTitle className="text-foreground">Under Construction!</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          The Activity Feed is coming soon. Check back later to see your notifications and updates.
        </AlertDescription>
      </Alert>
      <div className="mt-8 text-center p-6 bg-card rounded-lg shadow-md border border-border">
        <p className="text-lg text-muted-foreground">
          This page will show your interactions, mentions, new posts in followed groups, and other relevant activities on UnFiltered.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}

