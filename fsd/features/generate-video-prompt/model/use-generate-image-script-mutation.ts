import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  generateImageScript,
  type GenerateImageScriptRequest,
} from "../api/generate-image-script";

export function useGenerateImageScriptMutation() {
  return useMutation({
    mutationFn: (body: GenerateImageScriptRequest) => generateImageScript(body),
    onSuccess: (_, variables) => {
      const topic = variables.scene_description;
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
