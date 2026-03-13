import type { VideoStyle } from "../model/types";

export type GenerateYoutubeScriptRequest = {
  topic: string;
  videoStyle: VideoStyle;
};

export type GenerateYoutubeScriptResponse = {
  [key: string]: unknown;
};

export async function generateYoutubeScript(
  body: GenerateYoutubeScriptRequest
): Promise<GenerateYoutubeScriptResponse> {
  const res = await fetch("/api/generate-youtubeScript", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "요청에 실패했습니다.");
  }

  return res.json();
}
