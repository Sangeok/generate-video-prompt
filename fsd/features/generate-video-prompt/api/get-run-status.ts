import { z } from "zod";
import type { InngestRun } from "../model/types";

const inngestRunSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("Running") }),
  z.object({
    status: z.literal("Completed"),
    output: z.object({
      script: z.object({ content: z.string(), scenes: z.array(z.string()) }),
      imagePrompts: z.array(z.string()),
      audioBase64: z.string(),
      caption: z.string(),
    }),
  }),
  z.object({ status: z.literal("Failed"), error: z.string().optional() }),
  z.object({ status: z.literal("Cancelled") }),
]);

export async function getRunStatus(eventId: string): Promise<InngestRun | null> {
  const res = await fetch(`/api/inngest-run/${eventId}`);
  if (!res.ok) return null;

  const data = await res.json();
  const run = data?.data?.[0];
  if (!run) return null;

  const parsed = inngestRunSchema.safeParse(run);
  if (!parsed.success) return null;

  return parsed.data;
}
