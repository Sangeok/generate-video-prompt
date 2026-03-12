import type { VideoStyle } from "../model/types";

export type GenerateImageScriptRequest = {
  scene_description: string;
  videoStyle: VideoStyle;
};

export type GenerateImageScriptResponse = {
  [key: string]: unknown;
};

export async function generateImageScript(
  body: GenerateImageScriptRequest
): Promise<GenerateImageScriptResponse> {
  const res = await fetch("/api/generate-imageScript", {
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
