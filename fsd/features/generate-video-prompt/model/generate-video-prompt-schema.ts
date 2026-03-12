import { z } from "zod";

import { VIDEO_STYLE_VALUES } from "./types";

export const generateVideoPromptSchema = z.object({
  topic: z.string().trim().min(1, "주제를 입력해 주세요."),
  selectedStyle: z.enum(VIDEO_STYLE_VALUES, {
    error: "비주얼 스타일을 선택해 주세요.",
  }),
});

export type GenerateVideoPromptInput = z.infer<
  typeof generateVideoPromptSchema
>;
