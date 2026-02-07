"use client";

import { useEffect } from "react";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { apiSlice } from "@/lib/features/apiSlice";

export default function AuthListener() {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen for Auth events (SignIn, SignOut)
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          console.log("User signed in, redirecting...");
          router.push("/dashboard");
          router.refresh();
          break;
        case "signedOut":
          console.log("User signed out, redirecting...");
          dispatch(apiSlice.util.resetApiState());
          router.push("/signin");
          router.refresh();
          break;
      }
    });

    return unsubscribe;
  }, [router, dispatch]);

  return null;
}
