import { createServerRunner } from "@aws-amplify/adapter-nextjs";
import { authConfig } from "@/amplify-config"; // Import YOUR config

export const { runWithAmplifyServerContext } = createServerRunner({
  config: authConfig,
});
