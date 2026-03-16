import { DeepgramClient } from "@deepgram/sdk";

export async function generateCaptionFromBuffer(buffer: Buffer): Promise<string> {
  const deepgram = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
  });

  const response = await deepgram.listen.v1.media.transcribeFile(buffer, {
    model: "nova-3",
    language: "en",
    smart_format: true,
  });

  if (!("results" in response)) return "";
  return response.results?.channels[0]?.alternatives?.[0]?.transcript ?? "";
}
