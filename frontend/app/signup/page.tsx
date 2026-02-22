"use client";

import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  DollarSign,
  Lock,
  CheckCircle2,
  Mail,
  ChevronRight,
} from "lucide-react";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

export default function SignupPage() {
  const [step, setStep] = useState<"SIGNUP" | "VERIFY" | "SUCCESS">("SIGNUP");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [code, setCode] = useState("");

  useRedirectIfAuthenticated();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp({
        username: form.email,
        password: form.password,
        options: { userAttributes: { email: form.email } },
      });
      setStep("VERIFY");
      toast.success("Verification code has been sent", {
        description: `Please check your email box: ${form.email}`,
      });
    } catch (err: any) {
      toast.error("Signup Failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmSignUp({ username: form.email, confirmationCode: code });
      setStep("SUCCESS");
      toast.success("Account Verified");
    } catch (err: any) {
      toast.error("Invalid Code", {
        description: "The code you entered is incorrect or expired.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      {/* --- ADAPTIVE AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.05)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] opacity-40 dark:opacity-20" />

      <div className="w-full max-w-md relative z-10">
        {/* BRANDING */}
        <div className="flex flex-col items-center mb-10 space-y-3">
          <div className="bg-primary shadow-xl shadow-primary/20 text-primary-foreground p-3 rounded-2xl transition-transform hover:scale-110 active:scale-95">
            <DollarSign className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter">ClientLedger</h1>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">
            Elite Freelance Network
          </p>
        </div>

        {/* --- STEP-BASED FORM CARD --- */}

        <div className="bg-card/50 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-10 shadow-2xl transition-all duration-300">
          <AnimatePresence mode="wait">
            {/* STEP 1: SIGNUP */}
            {step === "SIGNUP" && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black tracking-tight">
                    Create Account
                  </h2>
                  <p className="text-xs font-medium text-muted-foreground">
                    Join the elite network of developers.
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">
                      Work Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="name@agency.com"
                      className="bg-muted/30 border-none h-14 rounded-2xl px-6 text-md focus-visible:ring-primary/20"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-60">
                      Secret Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-muted/30 border-none h-14 rounded-2xl px-6 text-md focus-visible:ring-primary/20"
                      required
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl font-black text-md shadow-xl shadow-primary/20 group transition-all hover:scale-[1.02] active:scale-[0.98]"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Request Access"
                    )}
                  </Button>
                </form>

                <p className="text-center text-xs font-bold text-muted-foreground/70">
                  Already a member?{" "}
                  <Link
                    href="/signin"
                    className="text-primary font-black hover:underline underline-offset-8"
                  >
                    Login
                  </Link>
                </p>
              </motion.div>
            )}

            {/* STEP 2: VERIFY */}
            {step === "VERIFY" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                    <Mail className="h-7 w-7 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black tracking-tight">
                      Verify Identity
                    </h2>
                    <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                      We sent a 6-digit security code to <br />
                      <span className="text-foreground font-bold">
                        {form.email}
                      </span>
                    </p>
                  </div>
                </div>

                <form onSubmit={handleVerification} className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-center block opacity-60">
                      Authentication Code
                    </Label>
                    <Input
                      className="bg-muted/30 border-none h-20 rounded-2xl text-center text-3xl font-black tracking-[0.4em] focus-visible:ring-primary/20 placeholder:text-muted-foreground/20"
                      placeholder="000000"
                      maxLength={6}
                      required
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-14 rounded-2xl font-black text-md shadow-xl shadow-primary/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Authorize Account"
                    )}
                  </Button>
                </form>

                <button
                  type="button"
                  className="w-full text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors"
                  onClick={() => setStep("SIGNUP")}
                >
                  Edit Email Address
                </button>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === "SUCCESS" && (
              <motion.div
                key="success"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-8 py-4"
              >
                <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-in zoom-in duration-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter">
                    Verified.
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">
                    Your node is active. Access is now granted.
                  </p>
                </div>
                <Link href="/signin" className="block">
                  <Button className="w-full h-16 rounded-2xl font-black text-md shadow-2xl shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white">
                    Go to Login Portal <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SECURITY FOOTER */}
        <div className="mt-10 flex items-center justify-center gap-2.5 text-[9px] font-black text-muted-foreground/50 uppercase tracking-[0.25em]">
          <Lock className="w-3 h-3" />
          End-to-End Encrypted via AWS Cognito
        </div>
      </div>
    </div>
  );
}
