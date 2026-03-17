import { inngest } from "@/fsd/shared/lib/inngest";
import { createChatSession } from "@/fsd/shared/lib/ai-model";
import { parseGeminiJsonResponse } from "@/fsd/shared/lib/parse-gemini";
import { SCRIPT_PROMPT_EN, getImagePromptByStyle } from "../config/prompts";
import { generateTTSBuffer } from "@/fsd/shared/lib/tts";
import { generateCaptionFromBuffer } from "@/fsd/shared/lib/caption";

export const createVideoPrompt = inngest.createFunction(
  { id: "create-video-prompt" },
  { event: "create/video.prompt" },
  async ({ event, step }) => {
    const { topic, videoStyle } = event.data;

    // step 내부에서 scenes 개수를 검증한다.
    // step 바깥에서 throw하면 Inngest가 함수 전체를 재시도하지만
    // 완료된 step은 메모이즈된 결과를 그대로 반환하므로 무한 재시도 루프가 발생한다.
    const scriptResult = await step.run("generate-youtube-script", async () => {
      const session = createChatSession();
      const result = await session.sendMessage(
        SCRIPT_PROMPT_EN.replace("{topic}", topic)
      );
      const parsed = parseGeminiJsonResponse<{ content: string; scenes: string[] }>(
        result.response.text()
      );

      if (parsed.scenes.length !== 5) {
        // step 내부 throw → 해당 step만 재시도됨 (메모이즈 무효화)
        throw new Error(`Expected 5 scenes, got ${parsed.scenes.length}`);
      }

      return parsed;
    });

    // Step 2 + 3: 이미지 프롬프트 & TTS 병렬 실행
    const [imageResult, audioBase64] = await Promise.all([
      step.run("generate-all-image-prompts", async () => {
        const sceneList = scriptResult.scenes
          .map((s: string, i: number) => `${i + 1}. ${s}`)
          .join("\n");
        const session = createChatSession();
        const imagePromptTemplate = getImagePromptByStyle(videoStyle);
        const res = await session.sendMessage(
          imagePromptTemplate.replace("{scenes}", sceneList)
        );
        return parseGeminiJsonResponse<{ prompts: string[] }>(res.response.text());
      }),

      step.run("generate-tts-audio", async () => {
        const buffer = await generateTTSBuffer(scriptResult.content);
        return buffer.toString("base64");
      }),
    ]);

    // Step 4: caption 생성 (audioBase64 의존, sequential)
    const caption = await step.run("generate-caption", async () => {
      const audioBuffer = Buffer.from(audioBase64, "base64");
      return generateCaptionFromBuffer(audioBuffer);
    });

    return {
      script: scriptResult,
      imagePrompts: imageResult.prompts,
      audioBase64,
      caption,
    };
  },
);
