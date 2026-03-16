import type { InngestRun } from "../model/types";

export async function getRunStatus(eventId: string): Promise<InngestRun | null> {
  const res = await fetch(`/api/inngest-run/${eventId}`);
  if (!res.ok) return null;

  const data = await res.json();
  const run = data?.data?.[0];
  if (!run) return null;

  return {
    status: run.status,
    output: run.output ?? undefined,
  };
}
