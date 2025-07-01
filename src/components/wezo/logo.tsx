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
        d="M3.37,3.86a1,1,0,0,1,1-1.1h3.33a1,1,0,0,1,.8.4L12,7.39l3.49-4.23a1,1,0,0,1,.8-.4h3.33a1,1,0,0,1,1,1.1L15.4,12l5.22,8.14a1,1,0,0,1-1,1.1H16.27a1,1,0,0,1-.8-.4L12,16.61l-3.49,4.23a1,1,0,0,1-.8.4H4.37a1,1,0,0,1-1-1.1L8.6,12,3.37,3.86Z"
      />
    </svg>
  );
}
