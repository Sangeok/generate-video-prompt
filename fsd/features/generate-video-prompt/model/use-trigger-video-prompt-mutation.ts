import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { triggerVideoPrompt } from "../api/trigger-video-prompt";
import type { VideoStyle } from "./types";

type TriggerVideoPromptVariables = {
  topic: string;
  videoStyle: VideoStyle;
};

export function useTriggerVideoPromptMutation() {
  return useMutation({
    mutationFn: ({ topic, videoStyle }: TriggerVideoPromptVariables) =>
      triggerVideoPrompt(topic, videoStyle),
    onSuccess: () => {
      toast.success("파이프라인이 시작되었습니다.");
    },
    onError: (err) => {
      toast.error("파이프라인 실행 중 오류가 발생했습니다.", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
}
