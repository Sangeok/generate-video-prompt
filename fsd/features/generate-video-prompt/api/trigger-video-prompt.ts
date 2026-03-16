"use server";

import { inngest } from "@/inngest/client";
import type { VideoStyle } from "../model/types";

export async function triggerVideoPrompt(topic: string, videoStyle: VideoStyle) {
  const { ids } = await inngest.send({
    name: "create/video.prompt",
    data: { topic, videoStyle },
  });
  return { eventId: ids[0] };
}
