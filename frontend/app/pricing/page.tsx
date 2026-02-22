"use client";

import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-6 transition-colors duration-500 relative">
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px)] [background-size:40px_40px] -z-10" />

      <div className="max-w-6xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter">
            Scalable <span className="text-primary">Value.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto font-medium italic">
            Whether you're freelancing in Casablanca or Berlin, we have a plan
            to help you hit your 35-millionaire goal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* FREE TIER */}
          <PricingCard
            title="Starter Beta"
            price="0"
            description="Perfect for new freelancers finding their feet."
            features={[
              "Up to 5 Active Clients",
              "Multi-Currency Support (MAD, EUR, USD)",
              "AWS SES Email Integration",
              "Standard PDF Invoices",
            ]}
            buttonText="Start for Free"
            href="/signup"
          />

          {/* PRO TIER */}
          <PricingCard
            title="Pro Ledger"
            price="15"
            featured
            description="Advanced tools for the career freelancer."
            features={[
              "Unlimited Clients",
              "Advanced Revenue Analytics",
              "Custom Branding & Profiles",
              "Priority PDF Generation",
              "Millionaire Goal Tracking",
            ]}
            buttonText="Scale My Business"
            href="/signup"
          />
        </div>

        <div className="pt-12 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">
          No hidden fees. Secured by AWS Payments.
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  href,
  featured = false,
}: any) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative rounded-[2.5rem] p-1 border transition-all shadow-2xl",
        featured ? "bg-gradient-to-b from-primary to-blue-600" : "bg-border/50",
      )}
    >
      <Card className="bg-card/90 backdrop-blur-2xl border-none rounded-[2.4rem] h-full flex flex-col p-6">
        {featured && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[9px] font-black px-4 py-1.5 rounded-full text-primary-foreground tracking-widest uppercase shadow-lg">
            Recommended
          </div>
        )}

        <CardHeader className="text-left pb-8">
          <CardTitle className="text-2xl font-black tracking-tight">
            {title}
          </CardTitle>
          <div className="flex items-baseline gap-1 mt-4">
            <span className="text-5xl font-black tracking-tighter">
              ${price}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              / Month
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-medium leading-relaxed">
            {description}
          </p>
        </CardHeader>

        <CardContent className="flex-1 space-y-4">
          {features.map((feature: string, i: number) => (
            <div key={i} className="flex items-center gap-3 text-sm font-bold">
              <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="opacity-80">{feature}</span>
            </div>
          ))}
        </CardContent>

        <CardFooter className="pt-8">
          <Link href={href} className="w-full">
            <Button
              className={cn(
                "w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl",
                featured
                  ? "bg-primary shadow-primary/20"
                  : "bg-muted text-foreground hover:bg-muted/80",
              )}
            >
              {buttonText} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

// Utility to merge classes safely
import { cn } from "@/lib/utils";
