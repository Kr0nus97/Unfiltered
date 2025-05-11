
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { EmailPasswordFormValues, SignUpFormValues } from '@/lib/types'; // Import new types

interface AuthContextType {
  user: User | null;
  isGuestMode: boolean;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (values: SignUpFormValues) => Promise<void>;
  signInWithEmail: (values: EmailPasswordFormValues) => Promise<void>;
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
      if (currentUser) { 
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
      toast({
        title: "Signed In",
        description: "Successfully signed in with Google.",
      });
    } catch (err: any) {
      setError(err as Error);
      toast({
        title: "Sign-in Error",
        description: err.message || "Failed to sign in with Google. Check console for details.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signUpWithEmail = async (values: SignUpFormValues) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      // Optionally update profile with a display name if provided, though not in SignUpFormValues
      // await updateProfile(userCredential.user, { displayName: values.displayName });
      // onAuthStateChanged will handle setting the user
      toast({
        title: "Account Created",
        description: "Successfully signed up with email and password.",
      });
    } catch (err: any) {
      setError(err as Error);
      toast({
        title: "Sign-up Error",
        description: err.message || "Failed to sign up with email and password.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const signInWithEmail = async (values: EmailPasswordFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Signed In",
        description: "Successfully signed in with email and password.",
      });
    } catch (err: any) {
      setError(err as Error);
      toast({
        title: "Sign-in Error",
        description: err.message || "Failed to sign in with email and password.",
        variant: "destructive",
      });
      setLoading(false);
    }
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
      setIsGuestMode(false); 
      toast({
        title: "Signed Out",
        description: "Successfully signed out.",
      });
    } catch (err: any) {
      setError(err as Error);
      toast({
        title: "Sign-out Error",
        description: err.message || "Failed to sign out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isGuestMode, loading, error, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest, signOutUser }}>
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

