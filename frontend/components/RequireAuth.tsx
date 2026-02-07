"use client";

import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Define the function INSIDE the effect to avoid dependency warnings
    async function checkAuth() {
      try {
        const session = await fetchAuthSession();
        if (session.tokens) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          router.replace("/signin");
        }
      } catch {
        // Unused 'err' variable removed here to fix lint warning
        setIsAuthenticated(false);
        router.replace("/signin");
      }
    }

    checkAuth();
  }, [router]); // Router added to dependency array

  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
