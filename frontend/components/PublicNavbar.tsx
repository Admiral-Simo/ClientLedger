"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { DollarSign, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🛡️ SECURITY: Don't show this navbar on dashboard routes to avoid double navbars
  if (pathname.startsWith("/dashboard")) return null;

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "Security", href: "/security" },
    { name: "Pricing", href: "/pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/30">
      <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
        {/* BRANDING */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary shadow-lg shadow-primary/20 text-white p-1.5 rounded-xl transition-transform group-hover:scale-110 active:scale-95">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="font-black text-xl tracking-tighter text-foreground">
            ClientLedger
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "text-xs font-black uppercase tracking-widest transition-colors",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">
          <Link href="/signin" className="hidden sm:block">
            <Button
              variant="ghost"
              className="text-xs font-bold uppercase tracking-tight"
            >
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-full px-5 text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-transform">
              Get Started
            </Button>
          </Link>

          {/* MOBILE TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-b bg-background p-6 space-y-4 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="block text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <Separator />
          <Link href="/signin" className="block w-full">
            <Button variant="outline" className="w-full rounded-xl">
              Login
            </Button>
          </Link>
        </motion.div>
      )}
    </header>
  );
}
