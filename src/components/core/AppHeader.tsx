import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-primary">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
            <path d="M12 12a7 7 0 0 0-7 7"></path>
            <path d="M12 12a7 7 0 0 1 7 7"></path>
          </svg>
          <span className="font-bold text-xl text-primary tracking-tight">UnFiltered</span>
        </Link>
        {/* ThemeToggle removed to match visual guide, can be added to a settings/profile page later */}
      </div>
    </header>
  );
}
