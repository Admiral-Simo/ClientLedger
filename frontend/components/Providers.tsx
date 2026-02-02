"use client";

import { Amplify } from "aws-amplify";
import { authConfig } from "@/amplify-config";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

Amplify.configure(authConfig);

export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
