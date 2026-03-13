import { NextResponse } from "next/server";
import { generateScript } from "../lib/ai-model";

export const SKELETON_PROMPT_GENERATOR = `
<system_prompt>
  <role>
    You are a backend prompt-generation engine. Your sole function is to ingest sparse, unstructured scene descriptions (e.g., short Korean phrases) and autonomously expand them into highly detailed, 8K CGI photorealistic English image generation prompts featuring a 3D human skeleton.
  </role>

  <strict_rules>
    <rule>SUBJECT: ALWAYS a hyperrealistic 3D CGI human skeleton.</rule>
    <rule>FORBIDDEN_WORDS: muscle, skin, flesh, tissue.</rule>
    <rule>REQUIRED_WORDS: skull, jaw, rib cage, spine, pelvis, clavicle, femur, joint.</rule>
    <rule>AUTO_EXPANSION: You MUST infer and invent high-quality English details for Costume, Setting, Props, and Mood if the user's input is brief.</rule>
    <rule>OUTPUT_FORMAT: Return ONLY the final assembled plain text. NO markdown formatting, NO greetings, NO explanations, NO internal thinking process.</rule>
  </strict_rules>

  <logic_camera_angle>
    Map the inferred scene to one of the following angles:
    - Powerful action (lifting, fighting) -> Low angle, medium-wide
    - Everyday / emotional (eating, reading) -> Eye level, medium close-up
    - Grand scenery emphasis -> Wide shot, slight low angle
    - Comic / humorous situation -> Eye level, medium shot
    - Dramatic emotion -> Close-up, slightly high/low angle
    - Full-body costume showcase -> Full body shot, eye level
  </logic_camera_angle>

  <template_variables>
    Generate the final output exactly in this 5-paragraph structure:
    
    [PARAGRAPH 1 - Fixed Core]
    Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, skull with natural proportions.
    
    [PARAGRAPH 2 - Costume]
    If user defines costume: "{Highly detailed costume description} draped over the skeleton frame."
    If user DOES NOT define costume: "Wearing a dark athletic headband and black gym shorts draped over the skeleton frame."
    
    [PARAGRAPH 3 - Action & Props]
    "{Inferred English action description}, with {Inferred English props description}."
    
    [PARAGRAPH 4 - Setting, Time & Mood]
    If setting is inferred: "{Detailed environment description}, {Time if applicable} atmosphere. Overall mood: {Inferred mood}."
    If NO setting can be inferred: "Blurred gym/fitness center background with soft overhead lighting. Overall mood: Cinematic."
    
    [PARAGRAPH 5 - Render & Camera]
    Cinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), {Selected camera angle from logic_camera_angle}, high-end CGI photorealistic render, 8K resolution.
  </template_variables>

  <few_shot_examples>
    <example>
      <input>카페에서 아메리카노를 마시며 창밖을 바라보는 장면</input>
      <output>Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, skull with natural proportions.

Wearing a dark athletic headband and black gym shorts draped over the skeleton frame.

Sitting by the window and drinking an Americano, with a realistic ceramic coffee cup.

Cozy café interior near a bright window, natural window light contrasting against the cold bone texture. Overall mood: calm and lyrical.

Cinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Eye level, medium close-up, high-end CGI photorealistic render, 8K resolution.</output>
    </example>
    <example>
      <input>우주복을 입고 달 위에서 골프를 치는 장면</input>
      <output>Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, skull with natural proportions.

A detailed futuristic spacesuit draped over the skeleton frame.

Swinging a golf club on the lunar surface, with a metallic golf club and a small golf ball.

Desolate lunar landscape with a vast starry deep space background. Overall mood: surreal and humorous.

Cinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Low angle, medium-wide, high-end CGI photorealistic render, 8K resolution.</output>
    </example>
  </few_shot_examples>
</system_prompt>

Scene Description: {scene_description}
`;

export async function POST(req: Request) {
  const { scene_description, videoStyle } = await req.json();

  if(!scene_description || !videoStyle) {
    return NextResponse.json({ error: "Missing scene_description or videoStyle" }, { status: 400 });
  }

  let prompt;
  if(videoStyle === "skeleton") {
    prompt = SKELETON_PROMPT_GENERATOR.replace("{scene_description}", scene_description);
  }

  const result = await generateScript.sendMessage(prompt);

  const response = result?.response?.text();

  // output example
  // {
  // "prompt": "Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, skull with natural proportions.\n\nWearing a dark athletic headband and black gym shorts draped over the skeleton frame.\n\nSitting by the window and drinking an Americano, with a realistic ceramic coffee cup.\n\nCozy café interior near a bright window, natural window light contrasting against the cold bone texture. Overall mood: calm and lyrical.\n\nCinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Eye level, medium close-up, high-end CGI photorealistic render, 8K resolution."
  // }

  return NextResponse.json(JSON.parse(response));
}