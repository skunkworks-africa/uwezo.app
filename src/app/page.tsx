import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WezoLogo } from "@/components/wezo/logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
            <WezoLogo />
            <span className="text-2xl font-bold">Wezo</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <Link href="/login" aria-label="Go to login page">
            <WezoLogo className="h-48 w-48 sm:h-64 sm:w-64 text-primary transition-transform duration-300 ease-in-out hover:scale-105" />
        </Link>
      </main>
       <footer className="flex items-center justify-center h-16 border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()}&nbsp;
          <a
            href="https://skunkworks.africa"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            Skunkworks
          </a>
          . All rights reserved.
        </p>
      </footer>
    </div>
  );
}
