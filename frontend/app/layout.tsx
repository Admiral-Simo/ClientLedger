import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ConfigureAmplify from "@/components/ConfigureAmplify";
import AuthListener from "@/components/AuthListener";
import Providers from "@/components/Providers";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.className}
        __processed_fec1ca33-333a-45b4-a927-5697198a0d2a__="true"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConfigureAmplify />
          <Providers>
            <AuthListener />
            {children}
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
