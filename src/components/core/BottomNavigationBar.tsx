
"use client";

import Link from "next/link";
import { LayoutGrid, Users, Plus, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottomNavigationBarProps {
  setIsCreatePostOpen: (isOpen: boolean) => void;
}

export default function BottomNavigationBar({ setIsCreatePostOpen }: BottomNavigationBarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "FEED", icon: LayoutGrid },
    { href: "/groups", label: "GROUPS", icon: Users },
    { href: "/me", label: "ME", icon: User }, // Placeholder link
    { href: "/activity", label: "ACTIVITY", icon: Activity }, // Placeholder link
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-md md:hidden z-50">
      <div className="container mx-auto h-full flex items-center justify-around">
        {navItems.slice(0, 2).map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-full px-3 text-xs font-medium",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              {item.label}
            </Button>
          </Link>
        ))}

        <Button
          variant="default"
          size="icon"
          className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full w-14 h-14 shadow-lg transform -translate-y-4"
          onClick={() => setIsCreatePostOpen(true)}
          aria-label="Create Post"
        >
          <Plus className="h-7 w-7" />
        </Button>

        {navItems.slice(2).map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <Button
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-full px-3 text-xs font-medium",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              {item.label}
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
