import { cn } from "@/lib/utils";
import Image from "next/image";

export function WezoLogo({ className }: { className?: string }) {
  return (
    <Image
      src="https://raw.githubusercontent.com/burnt-exe/wezo/refs/heads/main/wezo-long.png"
      alt="Wezo Logo"
      width={140}
      height={40}
      priority
      className={cn("h-auto", className)}
    />
  );
}
