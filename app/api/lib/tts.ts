import { DeepgramClient } from "@deepgram/sdk";

export const DEFAULT_TTS_VOICE = "aura-2-draco-en";

export async function generateTTSBuffer(
  text: string,
  voice: string = DEFAULT_TTS_VOICE
): Promise<Buffer> {
  const deepgram = new DeepgramClient({
    apiKey: process.env.DEEPGRAM_API_KEY,
  });

  const response = await deepgram.speak.v1.audio.generate({
    text,
    model: voice,
  });

  return Buffer.from(await response.arrayBuffer());
}
