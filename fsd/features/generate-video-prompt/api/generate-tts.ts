export type GenerateTTSRequest = {
  text: string;
  voice: string;
};

export async function generateTTS(
  body: GenerateTTSRequest
): Promise<Blob> {
  const res = await fetch("/api/generate-tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error ?? "요청에 실패했습니다.");
  }

  return res.blob();
}
