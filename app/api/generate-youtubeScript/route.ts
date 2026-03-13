import { NextResponse } from "next/server";
import { generateScript } from "../lib/ai-model";

export const SCRIPT_PROMPT_EN = `
Write one YouTube narration script for a 30 second video.

Topic: {topic}

Objective:
Create a single short-form script that is clear, engaging, and easy to read aloud.

Guidelines:
- Return exactly one script
- Write in natural spoken English
- Keep the script approximately 65-85 words for a 30 second delivery
- Start with a strong hook directly related to the topic
- Keep one clear angle from beginning to end
- Do not add scene descriptions
- Do not add camera directions
- Do not add anything in braces, brackets, or parentheses
- Do not include greetings, introductions, or speaker indicators such as "Narrator:"
- Do not include a title
- Do not use markdown, bullet points, or extra explanations
- If the topic is broad, choose one interesting angle and stay focused on it
- Return only the script content as plain text inside JSON
- Also extract 5 key visual scenes from the script in chronological order.

Response format (JSON):
{
  "content": "Final script content here",
  "scenes": [
    "Scene 1 description",
    "Scene 2 description",
    "Scene 3 description",
    "Scene 4 description",
    "Scene 5 description"
  ]
}
`;

// const SCRIPT_PROMPT_KO = `
// Write two different scripts for a 30 second video.

// Topic: {topic}

// Guidelines:
// - Return exactly one script
// - Write in natural spoken English
// - Keep the script approximately 65-85 words for a 30 second delivery
// - Start with a strong hook directly related to the topic
// - Keep one clear angle from beginning to end
// - Do not add scene descriptions
// - Do not add camera directions
// - Do not add anything in braces, brackets, or parentheses
// - Do not include greetings, introductions, or speaker indicators such as "Narrator:"
// - Do not include a title
// - Do not use markdown, bullet points, or extra explanations
// - If the topic is broad, choose one interesting angle and stay focused on it
// - Return only the script content as plain text inside JSON
// - Conclude with the call to action: "마지막까지 봤다면 구독 부탁드립니다."
// - Also extract 5 key visual scenes from the script in chronological order.

// Response format (JSON):
// {
//   "content": "First script content here",
//   "translatedContent": "First script translated to {language}",
//   "scenes": [
//     "Scene 1 description",
//     "Scene 2 description",
//     "Scene 3 description",
//     "Scene 4 description",
//     "Scene 5 description"
//   ]
// }
// `;

export async function POST(req: Request) {
    const { topic, videoStyle } = await req.json();

    let prompt;

    if(videoStyle === "skeleton") {
        prompt = SCRIPT_PROMPT_EN.replace("{topic}", topic);
    }

    const result = await generateScript.sendMessage(prompt);

    const response = result?.response?.text();

    console.log("response", response)

    return NextResponse.json(JSON.parse(response));

}
