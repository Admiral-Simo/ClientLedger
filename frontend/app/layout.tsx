import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import ConfigureAmplify from "@/components/ConfigureAmplify";
import AuthListener from "@/components/AuthListener";
import StoreProvider from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ClientLedger",
  description: "Freelance Contract Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Initialize Config First */}
        <ConfigureAmplify />

        <StoreProvider>
          {/* Active Listener for Redirects */}
          <AuthListener />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
