import { GoogleGenerativeAI, type ChatSession } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
  generationConfig: {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  },
});

// 매 요청마다 독립된 세션을 생성하는 팩토리 함수
export function createChatSession(): ChatSession {
  return model.startChat({ history: [] });
}
