"use client";
import { useState } from "react";
import { signIn } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn({ username: email, password });
      router.push("/dashboard");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
        className="bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        Log In
      </button>
    </form>
  );
}
