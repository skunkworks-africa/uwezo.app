
import { cn } from "@/lib/utils";
import Image from "next/image";

export function UwezoLogo({ className }: { className?: string }) {
  return (
    <Image
      src="https://raw.githubusercontent.com/burnt-exe/uwezo/main/public/logo.png"
      alt="Uwezo Logo"
      width={140}
      height={40}
      priority
      className={cn("h-auto", className)}
    />
  );
}
