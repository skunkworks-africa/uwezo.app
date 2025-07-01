import Link from "next/link";
import Image from "next/image";
import { UserNav } from "@/components/layout/user-nav";

export default function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image
                src="https://raw.githubusercontent.com/burnt-exe/wezo/refs/heads/main/wezo-long.png"
                alt="Wezo Logo"
                width={120}
                height={30}
                priority
              />
            </Link>
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
