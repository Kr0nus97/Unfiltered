"use client";

import { GroupCard } from "@/components/core/GroupCard";
import { Input } from "@/components/ui/input";
import { usePostsStore } from "@/store/postsStore";
import { Group } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function GroupsPage() {
  const allGroups = usePostsStore(state => state.groups);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading if groups were fetched asynchronously
    if (allGroups.length > 0) {
      setIsLoading(false);
    }
  }, [allGroups]);

  const filteredGroups = useMemo(() => {
    if (!searchTerm) return allGroups;
    return allGroups.filter(group =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allGroups, searchTerm]);


  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8 text-center text-primary">Discover Groups</h1>
        <div className="relative mb-8 max-w-md mx-auto">
           <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg shadow">
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
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Discover Groups</h1>
      <div className="relative mb-8 max-w-md mx-auto">
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
        <p className="text-center text-muted-foreground mt-10">No groups found matching your search.</p>
      )}
    </div>
  );
}
