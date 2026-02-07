"use client";
import { useState } from "react";
import { signUp } from "aws-amplify/auth";

export default function RegisterForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp({
        username: email,
        password,
        options: { userAttributes: { email } },
      });
      onSuccess(email);
    } catch (err: unknown) {
      // ✅ FIXED: Changed 'any' to 'unknown'
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create account");
      }
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-2 border rounded text-black"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-2 border rounded text-black"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Sign Up
      </button>
    </form>
  );
}
