
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isGuestMode: boolean;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) { // If a user is logged in via Firebase, they are not a guest
        setIsGuestMode(false);
      }
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
      toast({
        title: "Authentication Error",
        description: "Failed to get authentication state.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [toast]);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will handle setting user and loading=false
      // It will also set isGuestMode = false
      toast({
        title: "Signed In",
        description: "Successfully signed in with Google.",
      });
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Sign-in Error",
        description: (err as Error).message || "Failed to sign in with Google. Check console for details (e.g. 'auth/popup-closed-by-user' or 'auth/cancelled-popup-request' if popup was closed, or 'auth/unauthorized-domain' if localhost is not whitelisted in Firebase console).",
        variant: "destructive",
      });
      setLoading(false); // Ensure loading is false on error
    }
    // No finally setLoading(false) here, onAuthStateChanged handles it on success
  };

  const signInAsGuest = () => {
    setUser(null);
    setIsGuestMode(true);
    setLoading(false);
    setError(null);
    toast({
      title: "Guest Mode Activated",
      description: "You are now browsing as a guest. Posting and interactions are limited.",
    });
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      // onAuthStateChanged will set user to null
      setIsGuestMode(false); // Explicitly turn off guest mode
      toast({
        title: "Signed Out",
        description: "Successfully signed out.",
      });
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Sign-out Error",
        description: (err as Error).message || "Failed to sign out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isGuestMode, loading, error, signInWithGoogle, signInAsGuest, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

