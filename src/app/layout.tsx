
"use client";

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthContext, useAuthContext } from '@/hooks/use-auth';

// This is now a client component because it uses hooks
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const authContextValue = useAuthContext();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <title>Wezo</title>
        <meta name="description" content="Streamline Your Career Journey" />
      </head>
      <body className="font-body antialiased">
        <AuthContext.Provider value={authContextValue}>
          {authContextValue.isLoading ? (
            <div className="flex items-center justify-center min-h-screen">
              {/* You can replace this with a more sophisticated loading spinner */}
              Loading...
            </div>
          ) : (
            children
          )}
        </AuthContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}
