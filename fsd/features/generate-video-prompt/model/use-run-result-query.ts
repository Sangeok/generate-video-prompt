import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { getRunStatus } from "../api/get-run-status";
import type { RunStatus } from "./types";

const TERMINAL_STATUSES: RunStatus[] = ["Completed", "Failed", "Cancelled"];
const MAX_NULL_RETRIES = 3;

export function useRunResultQuery(eventId: string | null) {
  const nullCountRef = useRef(0);

  // eventId가 변경되면 null 카운터를 초기화한다
  useEffect(() => {
    nullCountRef.current = 0;
  }, [eventId]);

  return useQuery({
    queryKey: ["inngest-run", eventId],
    queryFn: async () => {
      const result = await getRunStatus(eventId!);
      if (result === null) {
        nullCountRef.current += 1;
      } else {
        nullCountRef.current = 0;
      }
      return result;
    },
    enabled: !!eventId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status && TERMINAL_STATUSES.includes(status)) return false;
      if (nullCountRef.current >= MAX_NULL_RETRIES) return false;
      return 2000;
    },
  });
}
