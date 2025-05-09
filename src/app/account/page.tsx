
"use client";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, LogOut, User as UserIcon } from "lucide-react"; // Import UserIcon

export default function AccountPage() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
        <div className="bg-card p-6 rounded-lg shadow-md border">
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
      <div className="bg-card p-6 rounded-lg shadow-md border">
        {user ? (
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center mb-6">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User Avatar"} />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{user.displayName || "Anonymous User"}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-4">
              Welcome to your account page. More settings will be available here soon.
            </p>
            <Button onClick={signOutUser} variant="destructive" className="w-full sm:w-auto">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        ) : (
          <div className="text-center sm:text-left">
            <p className="text-muted-foreground mb-6">
              Sign in to manage your account and access more features.
            </p>
            <Button onClick={signInWithGoogle} className="bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto">
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
