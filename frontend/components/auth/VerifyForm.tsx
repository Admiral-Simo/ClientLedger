"use client";
import { useState } from "react";
import { confirmSignUp } from "aws-amplify/auth";

export default function VerifyForm({
  email,
  onSuccess,
}: {
  email: string;
  onSuccess: () => void;
}) {
  const [code, setCode] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      alert("Verified!");
      onSuccess();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm">Code sent to: {email}</p>
      <form onSubmit={handleVerify} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Verify Account
        </button>
      </form>
    </div>
  );
}
