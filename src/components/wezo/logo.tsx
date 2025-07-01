import { cn } from "@/lib/utils";

export function WezoLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={cn("h-8 w-8", className)}
      aria-label="Wezo Logo"
    >
      <defs>
        <linearGradient
          id="logoGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" style={{ stopColor: "hsl(var(--accent))" }} />
          <stop offset="100%" style={{ stopColor: "hsl(var(--primary))" }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logoGradient)"
        d="M2 3 L8 21 L12 9 L16 21 L22 3 L18 3 L12 15 L6 3 Z"
      ></path>
    </svg>
  );
}
