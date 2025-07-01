import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WalletCards } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
                <WalletCards className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">Wezo</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Streamline Your Career Journey
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Wezo helps you manage your applications, track your onboarding progress, and build your professional profile, all in one place.
                </p>
              </div>
              <div className="space-x-4 mt-6">
                 <Button asChild size="lg">
                    <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
       <footer className="flex items-center justify-center h-16 border-t">
        <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Wezo. All rights reserved.</p>
      </footer>
    </div>
  );
}
