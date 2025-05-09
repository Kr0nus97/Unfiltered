
"use client";

import { GroupCard } from "@/components/core/GroupCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePostsStore } from "@/store/postsStore";
import { useUiStore } from "@/store/uiStore";
import { Group } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";

export default function GroupsPage() {
  const allGroups = usePostsStore(state => state.groups);
  const openCreateGroupDialog = useUiStore(state => state.openCreateGroupDialog);
  const { user, loading: authLoading } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Consider auth loading as well
    if (allGroups.length > 0 && !authLoading) {
      setIsLoading(false);
    } else if (!authLoading && allGroups.length === 0) {
      setIsLoading(false); // No groups, but auth is done
    }
  }, [allGroups, authLoading]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return allGroups;
    return allGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allGroups, searchTerm]);


  if (isLoading || authLoading) {
    return (
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4 sm:mb-0">Discover Groups</h1>
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>
        <div className="relative mb-8 max-w-md mx-auto sm:mx-0 sm:max-w-sm">
           <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg shadow bg-card">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-3" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary mb-4 sm:mb-0">Discover Groups</h1>
        {/* Create Group button is not disabled by authLoading, dialog handles auth */}
        <Button 
          onClick={openCreateGroupDialog} 
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto"
        >
          <PlusCircle className="mr-2 h-5 w-5" /> Create New Group
        </Button>
      </div>
      <div className="relative mb-8 max-w-md mx-auto sm:mx-0 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for groups..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full"
        />
      </div>
      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10 bg-card rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-muted-foreground">
            {searchTerm ? "No groups found matching your search." : "No groups available yet."}
          </h2>
          <p className="text-muted-foreground mt-2">
            {searchTerm ? "Try a different search term or " : ""}
            Why not create the first one?
          </p>
          {!searchTerm && (
             <Button 
              onClick={openCreateGroupDialog} 
              className="mt-6 bg-accent hover:bg-accent/90 text-accent-foreground"
             >
              <PlusCircle className="mr-2 h-5 w-5" /> Create a Group
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
