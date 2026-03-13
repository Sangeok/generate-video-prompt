import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  generateYoutubeScript,
  type GenerateYoutubeScriptRequest,
} from "../api/generate-youtube-script";

export function useGenerateYoutubeScriptMutation() {
  return useMutation({
    mutationFn: (body: GenerateYoutubeScriptRequest) => generateYoutubeScript(body),
    onSuccess: (_, variables) => {
      const topic = variables.topic;
      const topicPreview =
        topic.length > 48 ? `${topic.slice(0, 48).trimEnd()}...` : topic;

      toast.success("프롬프트가 생성되었습니다.", {
        description: `${variables.videoStyle} style for "${topicPreview}"`,
      });
    },
    onError: (err) => {
      toast.error("생성 중 오류가 발생했습니다.", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
}
