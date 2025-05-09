
"use client";

import Link from "next/link";
import { LayoutGrid, Users, Plus, User, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface BottomNavigationBarProps {
  openCreatePostDialog: (defaultGroupId?: string) => void;
}

export default function BottomNavigationBar({ openCreatePostDialog }: BottomNavigationBarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "FEED", icon: LayoutGrid },
    { href: "/groups", label: "GROUPS", icon: Users },
    // The "POST" button is special and handled separately
    { href: "/account", label: "ME", icon: User }, 
    { href: "/activity", label: "ACTIVITY", icon: Activity }, 
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-border shadow-md md:hidden z-50">
      <div className="container mx-auto h-full flex items-center justify-around">
        {/* First two items */}
        {navItems.slice(0, 2).map((item) => (
          <Link key={item.label} href={item.href} passHref legacyBehavior>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "flex flex-col items-center justify-center h-full px-3 text-xs font-medium",
                pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <a>
                <item.icon className="h-5 w-5 mb-0.5" />
                {item.label}
              </a>
            </Button>
          </Link>
        ))}

        {/* Central Floating Action Button for POST */}
        <Button
          variant="default"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-16 h-16 shadow-lg transform -translate-y-5 flex flex-col items-center justify-center p-2"
          onClick={() => openCreatePostDialog()} 
          aria-label="Create Post"
        >
          <Plus className="h-6 w-6" />
          <span className="mt-0.5 text-xs font-medium">POST</span>
        </Button>

        {/* Last two items */}
        {navItems.slice(2).map((item) => (
          <Link key={item.label} href={item.href} passHref legacyBehavior>
            <Button
              variant="ghost"
              asChild
              className={cn(
                "flex flex-col items-center justify-center h-full px-3 text-xs font-medium",
                pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              )}
            >
              <a>
                <item.icon className="h-5 w-5 mb-0.5" />
                {item.label}
              </a>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}

