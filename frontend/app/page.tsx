"use client";
import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import VerifyForm from "@/components/auth/VerifyForm";

export default function HomePage() {
  const [view, setView] = useState<"LOGIN" | "REGISTER" | "VERIFY">("LOGIN");
  const [verifyEmail, setVerifyEmail] = useState("");

  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {view === "LOGIN" && "Login"}
          {view === "REGISTER" && "Create Account"}
          {view === "VERIFY" && "Verify Email"}
        </h1>

        {view === "LOGIN" && <LoginForm />}

        {view === "REGISTER" && (
          <RegisterForm
            onSuccess={(email) => {
              setVerifyEmail(email);
              setView("VERIFY");
            }}
          />
        )}

        {view === "VERIFY" && (
          <VerifyForm email={verifyEmail} onSuccess={() => setView("LOGIN")} />
        )}

        <div className="mt-4 text-center text-sm">
          {view === "LOGIN" ? (
            <button
              onClick={() => setView("REGISTER")}
              className="text-blue-600 underline"
            >
              No account? Register
            </button>
          ) : (
            <button
              onClick={() => setView("LOGIN")}
              className="text-blue-600 underline"
            >
              Back to Login
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
