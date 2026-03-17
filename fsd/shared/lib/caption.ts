import { DeepgramClient } from "@deepgram/sdk";

const apiKey = process.env.DEEPGRAM_API_KEY;
if (!apiKey) {
  throw new Error("DEEPGRAM_API_KEY 환경 변수가 설정되지 않았습니다.");
}

const deepgram = new DeepgramClient({ apiKey });

export async function generateCaptionFromBuffer(buffer: Buffer): Promise<string> {
  const response = await deepgram.listen.v1.media.transcribeFile(buffer, {
    model: "nova-3",
    language: "en",
    smart_format: true,
  });

  if (!("results" in response)) return "";
  return response.results?.channels[0]?.alternatives?.[0]?.transcript ?? "";
}
