
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
            <Image
                src="https://raw.githubusercontent.com/burnt-exe/uwezo/main/public/logo.png"
                alt="Uwezo Logo"
                width={120}
                height={30}
                priority
            />
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
            <Image
                src="https://raw.githubusercontent.com/burnt-exe/uwezo/main/uwezo-hero.png"
                alt="Uwezo Hero"
                width={256}
                height={256}
                className="transition-transform duration-300 ease-in-out hover:scale-105"
                priority
            />
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
