import Link from "next/link";
import { WalletCards } from "lucide-react";
import { UserNav } from "@/components/layout/user-nav";

export default function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg">
                    <WalletCards className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl font-bold">Wezo</h1>
            </Link>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
