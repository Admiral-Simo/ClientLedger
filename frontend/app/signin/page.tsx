"use client";

import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, DollarSign, AlertCircle, ArrowLeft } from "lucide-react";
import { useRedirectIfAuthenticated } from "@/hooks/useRedirectIfAuthenticated";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });
  useRedirectIfAuthenticated();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signIn({ username: form.username, password: form.password });
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in");
      }
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:grid-cols-2 min-h-screen">
      {/* LEFT SIDE: BRANDING (Visible on Desktop) */}
      <div className="hidden bg-zinc-900 text-white lg:flex flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-10 flex items-center gap-2 text-lg font-medium">
          <div className="bg-white text-zinc-900 p-1 rounded">
            <DollarSign className="w-4 h-4" />
          </div>
          ClientLedger
        </div>
        <div className="relative z-10 space-y-4">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This platform completely transformed how I handle my
              freelance contracts. I finally know exactly where my money is
              coming from.&rdquo;
            </p>
            <footer className="text-sm opacity-80">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex items-center justify-center py-12 px-6 bg-background">
        <div className="mx-auto grid w-full max-w-[350px] gap-6">
          <div className="flex flex-col space-y-2 text-center">
            <Link href="/" className="absolute top-8 left-8 md:hidden">
              <ArrowLeft className="w-6 h-6 text-muted-foreground" />
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>

          <form onSubmit={handleLogin} className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-xs underline text-muted-foreground"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline text-primary font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
