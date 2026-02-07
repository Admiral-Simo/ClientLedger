"use client";

import { useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export function useRedirectIfAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const session = await fetchAuthSession();
      if (session.tokens) {
        // User is already logged in -> Go to Dashboard
        router.replace("/dashboard");
      }
    } catch (err) {
      // User is not logged in -> Stay here
    }
  }
}
