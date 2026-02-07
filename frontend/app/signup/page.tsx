"use client";

import { useState } from "react";
import { signUp, confirmSignUp } from "aws-amplify/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Mail,
} from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState<"SIGNUP" | "VERIFY" | "SUCCESS">("SIGNUP");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [code, setCode] = useState("");

  // Step 1: Create Account
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp({
        username: form.email,
        password: form.password,
        options: {
          userAttributes: {
            email: form.email,
          },
        },
      });
      // On success, move to Verification Step
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

  // Step 2: Verify Email Code
  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await confirmSignUp({
        username: form.email,
        confirmationCode: code,
      });
      // On success, show Success Card
      setStep("SUCCESS");
      setLoading(false);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid verification code");
      }
      setLoading(false);
    }
  };

  // --- RENDER: SUCCESS STATE ---
  if (step === "SUCCESS") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Card className="w-full max-w-md shadow-xl text-center p-6 border-slate-200">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl mb-2">Account Verified!</CardTitle>
          <CardDescription className="mb-6">
            Your account is active. You can now log in to your dashboard.
          </CardDescription>
          <Button asChild className="w-full">
            <Link href="/">Go to Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  // --- RENDER: VERIFICATION STATE ---
  if (step === "VERIFY") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 relative">
        <div className="absolute inset-0 bg-grid-slate-200/[0.04] bg-[bottom_1px_center]" />
        <Card className="w-full max-w-md relative z-10 shadow-xl border-slate-200">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Check your email
            </CardTitle>
            <CardDescription className="text-center">
              We sent a verification code to <strong>{form.email}</strong>
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleVerification}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  placeholder="123456"
                  className="text-center text-lg tracking-widest"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full font-semibold"
                type="submit"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Account
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  // --- RENDER: SIGNUP STATE (Default) ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative">
      <div className="absolute inset-0 bg-grid-slate-200/[0.04] bg-[bottom_1px_center]" />

      <Card className="w-full max-w-md relative z-10 shadow-xl border-slate-200">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="bg-slate-900 text-white p-2 rounded-lg inline-flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span className="font-bold tracking-tight">ClientLedger</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Start managing your freelance business today
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full font-semibold"
              type="submit"
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>

            <div className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
