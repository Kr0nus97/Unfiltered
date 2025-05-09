import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          {/* SVG logo removed */}
          <span className="font-bold text-xl text-primary tracking-tight">UnFiltered</span>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
