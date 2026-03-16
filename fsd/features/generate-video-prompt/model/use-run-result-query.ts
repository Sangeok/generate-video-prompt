import { useQuery } from "@tanstack/react-query";

import { getRunStatus } from "../api/get-run-status";
import type { RunStatus } from "./types";

const TERMINAL_STATUSES: RunStatus[] = ["Completed", "Failed", "Cancelled"];

export function useRunResultQuery(eventId: string | null) {
  return useQuery({
    queryKey: ["inngest-run", eventId],
    queryFn: () => getRunStatus(eventId!),
    enabled: !!eventId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      return 2000;
    },
  });
}
