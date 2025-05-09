
"use client"; // Ensure this is at the top if using hooks like useUiStore or useAuth

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

export default function AppHeader() {
  const openCreatePostDialog = useUiStore(state => state.openCreatePostDialog);
  const { user, loading: authLoading } = useAuth(); // Get user and auth loading state

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-primary tracking-tight">UnFiltered</span>
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="default"
            className="hidden md:inline-flex bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => openCreatePostDialog()}
            // Button is not disabled here; dialog will handle auth check
            // disabled={authLoading} // Optionally disable if auth is still loading
          >
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
          <ThemeToggle />
          <Link href="/account" passHref legacyBehavior>
            <Button variant="ghost" size="icon" aria-label="Account page">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
