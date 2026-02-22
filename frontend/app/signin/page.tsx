"use client";

import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, DollarSign, ShieldCheck, Lock } from "lucide-react";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  useRedirectIfAuthenticated();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { nextStep } = await signIn({
        username: form.username,
        password: form.password,
      });

      if (
        nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        toast.info("Security update required", {
          description:
            "Please set a permanent password via the confirmation flow.",
        });
      } else {
        toast.success("Welcome back!", {
          description: "Signing into your secure ledger...",
        });
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Authentication Failed", {
        description:
          err.message || "Please check your credentials and try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* --- ADAPTIVE AMBIENT BACKGROUND --- */}
      {/* Grid pattern that works in both modes */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.05)_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Soft glow that stays subtle in light mode and vibrant in dark mode */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-40 dark:opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-10 space-y-3">
          <div className="bg-primary shadow-xl shadow-primary/20 text-primary-foreground p-3 rounded-2xl transition-transform hover:scale-110 active:scale-95">
            <DollarSign className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">ClientLedger</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            Secure Login Portal
          </p>
        </div>

        {/* --- THE CARD --- */}
        <div className="bg-card/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 shadow-2xl transition-all duration-300">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60"
              >
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="bg-muted/30 border-none h-14 rounded-2xl focus-visible:ring-primary/20 text-md px-6 placeholder:text-muted-foreground/50 transition-all"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-widest opacity-60"
                >
                  Password
                </Label>
                <Link
                  href="#"
                  className="text-[10px] font-bold text-primary hover:underline uppercase tracking-tighter transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                className="bg-muted/30 border-none h-14 rounded-2xl focus-visible:ring-primary/20 px-6 transition-all"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 rounded-2xl font-black text-md shadow-xl shadow-primary/20 group transition-all hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  Access Ledger <ShieldCheck className="w-4 h-4 opacity-40" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs font-bold text-muted-foreground/70">
              New here?{" "}
              <Link
                href="/signup"
                className="text-primary font-black hover:underline underline-offset-8 decoration-2 transition-all"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* SECURITY BADGE */}
        <div className="mt-10 flex items-center justify-center gap-2.5 text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.25em]">
          <Lock className="w-3 h-3" />
          End-to-End Encrypted via AWS Cognito
        </div>
      </motion.div>
    </div>
  );
}
