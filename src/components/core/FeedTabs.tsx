
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface FeedTabsProps {
  onTabChange?: (tabValue: string) => void;
  children: React.ReactNode; 
}

export function FeedTabs({ onTabChange, children }: FeedTabsProps) {
  return (
    <Tabs defaultValue="new" className="w-full" onValueChange={onTabChange}>
      <div className="flex justify-center mb-6 border-b">
        <TabsList className="grid w-full max-w-md grid-cols-3 bg-transparent p-0">
          <TabsTrigger 
            value="new" 
            className="pb-3 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            NEW
          </TabsTrigger>
          <TabsTrigger 
            value="hot" 
            className="pb-3 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            HOT
          </TabsTrigger>
          <TabsTrigger 
            value="friends" 
            className="pb-3 text-muted-foreground data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
          >
            FRIENDS
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="new">{children}</TabsContent>
      <TabsContent value="hot">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-muted-foreground">Hot Posts</h2>
          <p className="text-muted-foreground mt-2">Content for hot posts will be displayed here.</p>
        </div>
      </TabsContent>
      <TabsContent value="friends">
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-muted-foreground">Friends' Posts</h2>
          <p className="text-muted-foreground mt-2">Content from friends will be displayed here.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
