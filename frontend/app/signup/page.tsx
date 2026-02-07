"use client";

import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

export default function SignupPage() {
  const [step, setStep] = useState<"SIGNUP" | "VERIFY" | "SUCCESS">("SIGNUP");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });
  const [code, setCode] = useState("");
  useRedirectIfAuthenticated();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signUp({
        username: form.email,
        password: form.password,
        options: { userAttributes: { email: form.email } },
      });
      setStep("VERIFY");
      setLoading(false);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account");
      }
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await confirmSignUp({ username: form.email, confirmationCode: code });
      setStep("SUCCESS");
      setLoading(false);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid code");
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      {/* LEFT SIDE: BRANDING */}
      <div className="hidden bg-zinc-900 text-white lg:flex flex-col justify-between p-10 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-2 text-lg font-medium">
          <div className="bg-white text-zinc-900 p-1 rounded">
            <DollarSign className="w-4 h-4" />
          </div>
          ClientLedger
        </div>
        <div className="relative z-10 space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Starting my agency was hard. Managing the finances was
              harder. ClientLedger made it simple.&rdquo;
            </p>
            <footer className="text-sm opacity-80">Alex Chen</footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE: FORMS */}
      <div className="flex items-center justify-center py-12 px-6 bg-background">
        <div className="mx-auto grid w-full max-w-[350px] gap-6">
          {/* HEADER (Only show if not success) */}
          {step !== "SUCCESS" && (
            <div className="flex flex-col space-y-2 text-center">
              <Link href="/" className="absolute top-8 left-8 md:hidden">
                <ArrowLeft className="w-6 h-6 text-muted-foreground" />
              </Link>
              <h1 className="text-3xl font-bold tracking-tight">
                {step === "SIGNUP" ? "Create an account" : "Verify email"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {step === "SIGNUP"
                  ? "Enter your email below to create your account"
                  : `We sent a code to ${form.email}`}
              </p>
            </div>
          )}

          {/* ERROR ALERT */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* STEP 1: SIGNUP FORM */}
          {step === "SIGNUP" && (
            <form onSubmit={handleSignup} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="underline text-primary font-medium"
                >
                  Login
                </Link>
              </div>
            </form>
          )}

          {/* STEP 2: VERIFY FORM */}
          {step === "VERIFY" && (
            <form onSubmit={handleVerification} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  className="text-center text-lg tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Account
              </Button>
            </form>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === "SUCCESS" && (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Account Created
              </h1>
              <p className="text-muted-foreground">
                Your account has been verified. You can now log in.
              </p>
              <Link href="/signin">
                <Button className="w-full mt-4">Go to Login</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
