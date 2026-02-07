"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  DollarSign,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <DollarSign className="w-5 h-5" />
            </div>
            ClientLedger
          </div>
          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

        <div className="max-w-3xl space-y-8">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
            ✨ Now in Public Beta
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Freelance Finance, <br />
            <span className="text-primary">Simplified.</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage clients, track contracts, and visualize your revenue. Stop
            using spreadsheets and start running a business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-lg">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-muted/50 border-t">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 bg-card rounded-xl border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Secure Contracts</h3>
              <p className="text-muted-foreground">
                Keep track of every agreement. Never lose scope of a project or
                forget a payment milestone again.
              </p>
            </div>
            <div className="space-y-4 p-6 bg-card rounded-xl border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Revenue Insights</h3>
              <p className="text-muted-foreground">
                Visual dashboards show you exactly how much you&apos;ve earned,
                what&apos;s pending, and what&apos;s overdue.
              </p>
            </div>
            <div className="space-y-4 p-6 bg-card rounded-xl border shadow-sm">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Client Management</h3>
              <p className="text-muted-foreground">
                Organize clients by country, currency, and project history. Your
                entire CRM in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t bg-background">
        <div className="container px-6 mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 font-bold text-lg">
            ClientLedger
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClientLedger Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
