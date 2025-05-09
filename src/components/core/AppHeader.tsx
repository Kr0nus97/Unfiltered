"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle, Home, Users } from "lucide-react";
import { CreatePostDialog } from "./CreatePostDialog"; // Will create this next
import React from "react";

export default function AppHeader() {
  const [isCreatePostOpen, setIsCreatePostOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
            <span className="font-bold text-xl">UnFiltered</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Home className="inline-block mr-1 h-4 w-4" />
              Feed
            </Link>
            <Link
              href="/groups"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              <Users className="inline-block mr-1 h-4 w-4" />
              Groups
            </Link>
          </nav>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button onClick={() => setIsCreatePostOpen(true)} variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <PlusCircle className="mr-2 h-5 w-5" /> Create Post
            </Button>
          </div>
        </div>
      </header>
      <CreatePostDialog isOpen={isCreatePostOpen} onOpenChange={setIsCreatePostOpen} />
    </>
  );
}
