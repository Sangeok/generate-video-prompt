import { inngest } from "../client";
import { createChatSession } from "../../app/api/lib/ai-model";
import { parseGeminiJsonResponse } from "../../app/api/lib/parse-gemini";
import { SCRIPT_PROMPT_EN } from "../../app/api/generate-youtubeScript/route";
import { SKELETON_BATCH_PROMPT_GENERATOR } from "../../app/api/generate-imageScript/route";

export const createVideoPrompt = inngest.createFunction(
  { id: "create-video-prompt" },
  { event: "create/video.prompt" },
  async ({ event, step }) => {
    const { topic } = event.data;

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

    const imageResult = await step.run("generate-all-image-prompts", async () => {
      const sceneList = scriptResult.scenes
        .map((s: string, i: number) => `${i + 1}. ${s}`)
        .join("\n");
      const session = createChatSession();
      const res = await session.sendMessage(
        SKELETON_BATCH_PROMPT_GENERATOR.replace("{scenes}", sceneList)
      );
      return parseGeminiJsonResponse<{ prompts: string[] }>(res.response.text());
    });

    return {
      script: scriptResult,
      imagePrompts: imageResult.prompts,
    };
  },
);
