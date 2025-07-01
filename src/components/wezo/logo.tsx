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
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        fill="url(#logoGradient)"
        d="M12 2L2 8.5l10 13.5L22 8.5L12 2zm0 2.31L19.5 8.5 12 18.31 4.5 8.5L12 4.31z"
      />
    </svg>
  );
}
