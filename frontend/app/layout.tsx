"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConfigureAmplify from "@/components/ConfigureAmplify";
import AuthListener from "@/components/AuthListener";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import PublicNavbar from "@/components/PublicNavbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConfigureAmplify />
          <Providers>
            <AuthListener />
            <div className="flex flex-col min-h-screen bg-background">
              {/* --- SHARED PUBLIC NAVBAR --- */}
              <PublicNavbar />

              <main className="flex-1">{children}</main>
            </div>
            <Toaster position="bottom-right" richColors />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
