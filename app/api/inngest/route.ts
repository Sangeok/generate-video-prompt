import { serve } from "inngest/next";
import { inngest } from "@/fsd/shared/lib/inngest";
import { createVideoPrompt } from "@/fsd/features/generate-video-prompt";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    createVideoPrompt
  ],
});
