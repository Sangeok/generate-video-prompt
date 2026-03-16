import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  generateTTS,
  type GenerateTTSRequest,
} from "../api/generate-tts";

export function useGenerateTTSMutation() {
  return useMutation({
    mutationFn: (body: GenerateTTSRequest) => generateTTS(body),
    onSuccess: () => {
      toast.success("음성이 생성되었습니다.");
    },
    onError: (err) => {
      toast.error("음성 생성 중 오류가 발생했습니다.", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });
}
