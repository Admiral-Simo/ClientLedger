"use client";

import { useEffect } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/navigation";

export function useRedirectIfAuthenticated() {
  const router = useRouter();

  useEffect(() => {
    // 1. Define the function INSIDE the effect
    async function checkSession() {
      try {
        const session = await fetchAuthSession();
        if (session.tokens) {
          router.replace("/dashboard");
        }
      } catch {
        // 2. Removed unused 'err' variable
        // User is not logged in, just stay on the page
      }
    }

    // 3. Call it immediately
    checkSession();
  }, [router]); // 4. Add router to dependency array
}
