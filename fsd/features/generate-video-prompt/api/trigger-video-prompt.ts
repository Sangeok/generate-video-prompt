"use server";

import { inngest } from "@/inngest/client";
import type { VideoStyle } from "../model/types";

export async function triggerVideoPrompt(topic: string, videoStyle: VideoStyle) {
  await inngest.send({
    name: "create/video.prompt",
    data: { topic, videoStyle },
  });
}
