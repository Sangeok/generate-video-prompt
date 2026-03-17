import { DeepgramClient } from "@deepgram/sdk";

const apiKey = process.env.DEEPGRAM_API_KEY;
if (!apiKey) {
  throw new Error("DEEPGRAM_API_KEY 환경 변수가 설정되지 않았습니다.");
}

const deepgram = new DeepgramClient({ apiKey });

export const DEFAULT_TTS_VOICE = "aura-2-draco-en";

export async function generateTTSBuffer(
  text: string,
  voice: string = DEFAULT_TTS_VOICE
): Promise<Buffer> {
  const response = await deepgram.speak.v1.audio.generate({
    text,
    model: voice,
  });

  return Buffer.from(await response.arrayBuffer());
}
