"use client";

import { useForm } from "react-hook-form";
import type { FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  generateVideoPromptSchema,
  type GenerateVideoPromptInput,
} from "./generate-video-prompt-schema";
import { useGenerateImageScriptMutation } from "./use-generate-image-script-mutation";

export function useGenerateVideoPromptForm() {
  const { mutate, isPending, data } = useGenerateImageScriptMutation();

  const form = useForm<GenerateVideoPromptInput>({
    resolver: zodResolver(generateVideoPromptSchema),
    mode: "onChange",
    defaultValues: {
      topic: "",
      selectedStyle: undefined,
    },
  });

  const onSubmit = (data: GenerateVideoPromptInput) => {
    mutate({
      scene_description: data.topic,
      videoStyle: data.selectedStyle,
    });
  };

  const onError = (errors: FieldErrors<GenerateVideoPromptInput>) => {
    if (errors.topic && errors.selectedStyle) {
      toast.error("입력값을 확인해 주세요.", {
        description: "주제를 입력하고 비주얼 스타일을 선택해 주세요.",
      });
      return;
    }

    if (errors.topic) {
      toast.error(errors.topic.message ?? "주제를 입력해 주세요.");
      return;
    }

    if (errors.selectedStyle) {
      toast.error(errors.selectedStyle.message ?? "비주얼 스타일을 선택해 주세요.");
      return;
    }
  };

  return {
    form,
    handleSubmit: form.handleSubmit(onSubmit, onError),
    isPending,
    result: data,
  };
}
