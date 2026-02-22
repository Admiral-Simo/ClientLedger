"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  DollarSign,
  BarChart3,
  Globe,
  Lock,
  Zap,
  ChevronRight,
} from "lucide-react";

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  } as const;

  const stagger = {
    visible: { transition: { staggerChildren: 0.15 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 font-sans transition-colors duration-500">
      <main className="flex-1">
        {/* --- HERO SECTION --- */}
        <section className="relative pt-32 pb-40 px-6 overflow-hidden">
          {/* Dynamic Ambient Background - Now adaptive */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
            {/* Glow effect that softens in light mode */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 h-[700px] w-[1000px] rounded-full bg-primary/20 blur-[140px] opacity-40 dark:opacity-20 animate-pulse" />
            <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.1)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-5xl mx-auto text-center space-y-10"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-black text-primary tracking-[0.2em] uppercase"
            >
              <Zap className="w-3 h-3 fill-current" />
              Revolutionizing Freelance Finance
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl sm:text-8xl font-black tracking-tighter leading-[0.9] text-foreground"
            >
              Freelance Ops <br />
              <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Perfected.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium"
            >
              Automate contracts, monitor global revenue, and secure your
              financial future. Built for the modern developer-turned-founder.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5 justify-center pt-6"
            >
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-16 px-10 text-lg font-black rounded-2xl shadow-2xl shadow-primary/30 group transition-all hover:scale-105 active:scale-95"
                >
                  Join the Private Beta
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/signin">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-16 px-10 text-lg font-black rounded-2xl border-border bg-background/50 backdrop-blur-md hover:bg-muted transition-all active:scale-95"
                >
                  Live Demo
                </Button>
              </Link>
            </motion.div>

            {/* --- STACKED MOCKUP PREVIEW --- */}
            <motion.div
              variants={fadeInUp}
              className="mt-32 relative mx-auto max-w-5xl group"
            >
              <div className="relative z-20 rounded-3xl p-1.5 bg-gradient-to-br from-foreground/10 to-transparent border border-border/50 shadow-2xl overflow-hidden backdrop-blur-3xl transform transition-transform group-hover:-translate-y-2 duration-700">
                <div className="rounded-2xl overflow-hidden bg-card aspect-[16/9] relative">
                  <Image
                    src="/stats.png"
                    alt="Analytics Dashboard Preview"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="absolute -bottom-16 -right-12 z-10 w-2/3 rounded-3xl p-1.5 bg-gradient-to-br from-foreground/5 to-transparent border border-border/50 shadow-2xl overflow-hidden backdrop-blur-2xl hidden lg:block transform group-hover:translate-x-4 duration-700">
                <div className="rounded-2xl overflow-hidden bg-card aspect-[16/10] relative">
                  <Image
                    src="/clients.png"
                    alt="Client Management Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="absolute -inset-10 bg-primary/20 blur-[100px] -z-10 opacity-50 dark:opacity-30" />
            </motion.div>
          </motion.div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section
          id="features"
          className="py-40 border-t border-border/50 relative bg-muted/20"
        >
          <div className="container px-6 mx-auto max-w-7xl">
            <div className="text-center mb-20 space-y-4">
              <h2 className="text-3xl font-black tracking-tighter sm:text-5xl">
                Built for Growth
              </h2>
              <p className="text-muted-foreground font-medium italic">
                Tools to manage your journey to financial independence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Lock className="w-6 h-6" />}
                title="Cognito-Hardened Security"
                description="Your data is isolated and encrypted using enterprise-grade AWS infrastructure."
              />
              <FeatureCard
                icon={<Globe className="w-6 h-6" />}
                title="International Compliance"
                description="Auto-calculate multi-currency taxes for clients in Morocco, EU, and beyond."
              />
              <FeatureCard
                icon={<BarChart3 className="w-6 h-6" />}
                title="Predictive Analytics"
                description="Forecast your revenue and track progress toward your millionaire milestones."
              />
            </div>
          </div>
        </section>
      </main>

      {/* --- MINIMALIST FOOTER --- */}
      <footer className="py-24 border-t border-border/50 bg-card">
        <div className="container px-6 mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
              <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                <DollarSign className="w-5 h-5" />
              </div>
              ClientLedger
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-loose">
              Helping freelancers become <br /> the founders they were meant to
              be.
            </p>
          </div>

          <div className="flex flex-col items-end gap-6 text-right">
            <div className="flex gap-10 text-xs font-black uppercase tracking-widest text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-primary transition-colors">
                Source
              </Link>
            </div>
            <p className="text-[10px] font-black text-muted-foreground/40">
              © {new Date().getFullYear()} CLIENTLEDGER. ENGINEERED FOR THE 1%.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-6 p-10 rounded-[2.5rem] border border-border/50 bg-card/40 hover:bg-card/60 hover:border-primary/20 transition-all group relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary transition-all group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-inner">
        {icon}
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-black tracking-tight">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed font-medium">
          {description}
        </p>
      </div>

      <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="link"
          className="p-0 text-primary h-auto font-black text-xs tracking-widest uppercase"
        >
          Learn More <ChevronRight className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}
