
"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LogIn, LogOut, User as UserIcon, Users, Info, Mail, KeyRound, UserPlus, Eye, EyeOff } from "lucide-react"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { EmailPasswordFormValues, SignUpFormValues } from "@/lib/types";
import { cn } from "@/lib/utils";

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});


export default function AccountPage() {
  const { user, isGuestMode, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signInAsGuest, signOutUser } = useAuth();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin"); // 'signin' or 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const signInForm = useForm<EmailPasswordFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const onSignInSubmit = async (data: EmailPasswordFormValues) => {
    await signInWithEmail(data);
  };

  const onSignUpSubmit = async (data: SignUpFormValues) => {
    await signUpWithEmail(data);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);


  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">Account Settings</h1>
        <div className="bg-card p-6 rounded-lg shadow-md border max-w-lg mx-auto">
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
      <h1 className="text-3xl font-bold text-primary mb-6 text-center sm:text-left">Account Settings</h1>
      <div className="bg-card p-6 rounded-lg shadow-md border max-w-lg mx-auto">
        {user && !isGuestMode ? ( // Google or Email/Pass Signed-In User
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center mb-6">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User Avatar"} />
                <AvatarFallback>
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon />}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{user.displayName || "User"}</h2>
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
        ) : isGuestMode ? ( // Guest User
           <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center mb-6">
              <Avatar className="h-16 w-16 mr-4">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <Users />
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Guest User</h2>
                <p className="text-sm text-muted-foreground">Browsing anonymously</p>
              </div>
            </div>
            <Alert variant="default" className="mb-6 bg-secondary/50">
              <Info className="h-5 w-5 text-primary" />
              <AlertTitle className="text-primary">You are in Guest Mode</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                As a guest, you can view posts and groups. To create posts, join groups, or interact (like/dislike), please sign in or create an account.
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <Button onClick={() => { signOutUser(); setAuthMode("signin"); }} className="bg-accent text-accent-foreground hover:bg-accent/90 flex-grow">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In / Create Account
                </Button>
            </div>
          </div>
        ) : ( // Not signed in, not a guest - Show Sign In / Sign Up options
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4 text-center">
              {authMode === "signin" ? "Sign In" : "Create Account"}
            </h2>
            {authMode === "signin" && (
              <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email-signin">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email-signin" type="email" placeholder="your@email.com" {...signInForm.register("email")} className="pl-10" />
                  </div>
                  {signInForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{signInForm.formState.errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password-signin">Password</Label>
                  <div className="relative">
                     <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="password-signin" type={showPassword ? "text" : "password"} placeholder="••••••••" {...signInForm.register("password")} className="pl-10 pr-10" />
                     <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={togglePasswordVisibility}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                  </div>
                  {signInForm.formState.errors.password && <p className="text-xs text-destructive mt-1">{signInForm.formState.errors.password.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={signInForm.formState.isSubmitting || loading}>
                  {signInForm.formState.isSubmitting || loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : <><LogIn className="mr-2 h-4 w-4" /> Sign In</>}
                </Button>
              </form>
            )}
            {authMode === "signup" && (
              <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email-signup">Email</Label>
                   <div className="relative">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="email-signup" type="email" placeholder="your@email.com" {...signUpForm.register("email")} className="pl-10"/>
                  </div>
                  {signUpForm.formState.errors.email && <p className="text-xs text-destructive mt-1">{signUpForm.formState.errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password-signup">Password</Label>
                  <div className="relative">
                     <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="password-signup" type={showPassword ? "text" : "password"} placeholder="Minimum 6 characters" {...signUpForm.register("password")} className="pl-10 pr-10"/>
                     <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={togglePasswordVisibility}>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                  </div>
                  {signUpForm.formState.errors.password && <p className="text-xs text-destructive mt-1">{signUpForm.formState.errors.password.message}</p>}
                </div>
                <div>
                  <Label htmlFor="confirmPassword-signup">Confirm Password</Label>
                   <div className="relative">
                     <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="confirmPassword-signup" type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password" {...signUpForm.register("confirmPassword")} className="pl-10 pr-10"/>
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" onClick={toggleConfirmPasswordVisibility}>
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     </Button>
                  </div>
                  {signUpForm.formState.errors.confirmPassword && <p className="text-xs text-destructive mt-1">{signUpForm.formState.errors.confirmPassword.message}</p>}
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground" disabled={signUpForm.formState.isSubmitting || loading}>
                   {signUpForm.formState.isSubmitting || loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : <><UserPlus className="mr-2 h-4 w-4" /> Create Account</>}
                </Button>
              </form>
            )}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {authMode === "signin" ? "Don't have an account?" : "Already have an account?"}{' '}
                <Button variant="link" className="p-0 h-auto text-accent" onClick={() => setAuthMode(authMode === "signin" ? "signup" : "signin")}>
                  {authMode === "signin" ? "Create one" : "Sign in"}
                </Button>
              </p>
            </div>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button onClick={signInWithGoogle} variant="outline" className="w-full" disabled={loading}>
              {/* Placeholder for Google Icon */}
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-.97 2.48-1.94 3.23v2.72h3.5c2.08-1.92 3.28-4.74 3.28-8.01z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.5-2.72c-.98.66-2.23 1.06-3.78 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.1-3.1C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Sign in with Google
            </Button>
            <Button onClick={signInAsGuest} variant="outline" className="w-full mt-4" disabled={loading}>
              <Users className="mr-2 h-4 w-4" />
              Continue as Guest
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
