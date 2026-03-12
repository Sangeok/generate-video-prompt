import { inngest } from "../client";

export const createVideoPrompt = inngest.createFunction(
  { id: "create-video-prompt" },
  { event: "create/video.prompt" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  },
);