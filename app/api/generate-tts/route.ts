import { DeepgramClient } from "@deepgram/sdk";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // const { text, voice } = await request.json();
    const { text } = await request.json();
    const voiceModel = "aura-2-draco-en";

    if (!text) {
      return NextResponse.json({ error: "text가 없습니다." }, { status: 400 });
    }
    if (!voiceModel) {
      return NextResponse.json({ error: "voice가 없습니다." }, { status: 400 });
    }

    const deepgram = new DeepgramClient({ apiKey: process.env.DEEPGRAM_API_KEY });

    // v5: speak.v1.audio.generate()
    const response = await deepgram.speak.v1.audio.generate(
      { text, model: voiceModel }
    );

    // BinaryResponse.arrayBuffer()로 직접 변환
    const buffer = Buffer.from(await response.arrayBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("DEPPGRAM API 오류:", error);
    return NextResponse.json({ error: "음성 생성 중 오류가 발생했습니다" }, { status: 500 });
  }
}
