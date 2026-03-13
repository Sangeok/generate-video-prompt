const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite",
});

// 매 요청마다 독립된 세션을 생성하는 팩토리 함수
export function createChatSession() {
  return model.startChat({
    generationConfig,
    history: [],
  });
}

// 하위 호환: 기존 단일 route.ts가 참조하는 경우 제거 전까지 유지
export const generateScript = model.startChat({
  generationConfig,
  history: [],
});