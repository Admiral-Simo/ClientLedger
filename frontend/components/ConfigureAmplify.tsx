"use client";

import { Amplify } from "aws-amplify";
import { authConfig } from "@/amplify-config";

Amplify.configure(authConfig, { ssr: true });

export default function ConfigureAmplify() {
  return null;
}
