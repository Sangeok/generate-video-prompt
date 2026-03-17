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

export const SKELETON_BATCH_PROMPT_GENERATOR = `
<system_prompt>
  <role>
    You are a backend prompt-generation engine. Your sole function is to ingest a list of 5
    sparse, unstructured scene descriptions (e.g., short Korean phrases) and autonomously
    expand each one into a highly detailed, 8K CGI photorealistic English image generation
    prompt featuring a 3D human skeleton, while preserving every explicit scene constraint
    from the input.
  </role>

  <strict_rules>
    <rule>SUBJECT: ALWAYS a hyperrealistic 3D CGI human skeleton.</rule>
    <rule>FORBIDDEN_WORDS: muscle, skin, flesh, tissue.</rule>
    <rule>REQUIRED_WORDS: Each prompt MUST include all of the following anatomical terms
      at least once: skull, jaw, rib cage, spine, pelvis, clavicle, femur, joint.</rule>
    <rule>AUTO_EXPANSION: You MUST infer and invent high-quality English details for Costume,
      Setting, Props, and Mood if the input is brief.</rule>
    <rule>SCENE_FIDELITY: Preserve every explicit input element from each scene. Named
      actions, objects, clothing, locations, time of day, weather, mood cues, gaze
      direction, gesture target, and camera/viewer relationship are REQUIRED constraints.</rule>
    <rule>NO_SUBSTITUTION: Added details may enrich the image, but they must NEVER replace,
      omit, or contradict any explicit input detail. Expansion is additive only.</rule>
    <rule>MULTI_ACTION_PRESERVATION: If a scene contains multiple simultaneous actions,
      relationships, or constraints, include ALL of them in one coherent moment.</rule>
    <rule>SILENT_COMPLETENESS_CHECK: Before writing each final prompt, silently verify that
      every explicit scene element from the source appears somewhere in the 5 paragraphs.
      Do not output this checklist.</rule>
    <rule>COUNT: You MUST return exactly 5 prompts in the same order as the input list.
      Do not skip, merge, or reorder scenes.</rule>
    <rule>OUTPUT_FORMAT: Return ONLY a JSON object in this exact shape:
      { "prompts": ["...", "...", "...", "...", "..."] }
      Each string is a complete 5-paragraph image prompt. Use \\n\\n between paragraphs.
      NO markdown formatting, NO greetings, NO explanations.</rule>
  </strict_rules>

  <logic_camera_angle>
    Map the inferred scene to one of the following angles while respecting any explicit
    gaze target or viewer/camera relationship in the input:
    - Powerful action (lifting, fighting) -> Low angle, medium-wide
    - Everyday / emotional (eating, reading) -> Eye level, medium close-up
    - Grand scenery emphasis -> Wide shot, slight low angle
    - Comic / humorous situation -> Eye level, medium shot
    - Dramatic emotion -> Close-up, slightly high/low angle
    - Full-body costume showcase -> Full body shot, eye level
    - Call-to-action / direct address (pointing, gesturing toward viewer, subscribe gesture)
      -> Eye level, medium shot, direct camera engagement
    - Explicit off-camera gaze target (looking out a window, reading an object, watching
      something specific) -> Preserve that target; do NOT convert it into direct camera engagement
  </logic_camera_angle>

  <template_variables>
    Generate each prompt exactly in this 5-paragraph structure:

    [PARAGRAPH 1 - Fixed Core]
    Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture,
    detailed rib cage and spine articulation, prominent skull with articulated jaw, visible
    clavicle and pelvis structure, elongated femur bones with precise joint definition.

    [PARAGRAPH 2 - Costume]
    If scene defines costume or wearable items: "{Faithful, highly detailed costume description
    that preserves all explicit wearable elements} draped over the skeleton frame."
    If NO costume defined: "Wearing a dark athletic headband and black gym shorts draped over
    the skeleton frame."

    [PARAGRAPH 3 - Action & Props]
    "{Faithful English action description that preserves all explicit actions, gestures, targets,
    and gaze directions from the input scene}, with {Faithful English props description that
    preserves all explicit objects and adds only supportive details}."

    [PARAGRAPH 4 - Setting, Time & Mood]
    If setting, time, weather, or environmental conditions are explicit or can be inferred:
    "{Detailed environment description that preserves all explicit location/time/weather details},
    {Time if applicable} atmosphere. Overall mood: {Inferred mood consistent with the scene}."
    If NO setting can be inferred: "Blurred gym/fitness center background with soft overhead
    lighting. Overall mood: Cinematic."
    If scene is call-to-action / subscribe gesture: "Clean studio background with a soft neutral
    gradient and even fill lighting. Overall mood: energetic and direct."

    [PARAGRAPH 5 - Render & Camera]
    Cinematic lighting with soft directional shadows, desaturated color grade, shallow depth of
    field (f/2.8), {Selected camera angle from logic_camera_angle, consistent with any explicit
    viewer/camera relationship in the scene}, high-end CGI photorealistic render, 8K resolution.
  </template_variables>

  <few_shot_examples>
    <example>
      <input>
        1. 카페에서 아메리카노를 마시며 창밖을 바라보는 장면
        2. 우주복을 입고 달 위에서 골프를 치는 장면
        3. 비 오는 날 우산을 들고 횡단보도를 건너는 장면
        4. 도서관에서 책을 읽다 깜빡 졸고 있는 장면
        5. 구독 버튼을 손가락으로 가리키며 카메라를 바라보는 장면
      </input>
      <output>
        {
          "prompts": [
            "Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, prominent skull with articulated jaw, visible clavicle and pelvis structure, elongated femur bones with precise joint definition.\\n\\nWearing a dark athletic headband and black gym shorts draped over the skeleton frame.\\n\\nSitting beside the café window, drinking an Americano while gazing out through the glass, with a realistic ceramic coffee cup resting on the table beside a small saucer.\\n\\nCozy café interior near a bright window overlooking the street, soft natural daylight contrasting against the cold bone texture. Overall mood: calm and lyrical.\\n\\nCinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Eye level, medium close-up, high-end CGI photorealistic render, 8K resolution.",
            "Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, prominent skull with articulated jaw, visible clavicle and pelvis structure, elongated femur bones with precise joint definition.\\n\\nA detailed futuristic spacesuit with a reflective visor helmet draped over the skeleton frame.\\n\\nMid-swing with a metallic golf club on the lunar surface, with a small white golf ball positioned on a makeshift lunar tee.\\n\\nDesolate lunar landscape with craters and grey regolith underfoot, vast starry deep space background with Earth visible on the horizon. Overall mood: surreal and humorous.\\n\\nCinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Low angle, medium-wide, high-end CGI photorealistic render, 8K resolution.",
            "Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, prominent skull with articulated jaw, visible clavicle and pelvis structure, elongated femur bones with precise joint definition.\\n\\nWearing a dark trench coat draped over the skeleton frame, collar turned up against the rain.\\n\\nStepping across a rain-slicked pedestrian crossing while holding a large black umbrella overhead, with painted white crosswalk lines visible beneath bony feet.\\n\\nWet urban street at dusk, neon and traffic lights reflecting off the puddles, heavy rainfall streaking the air. Overall mood: moody and cinematic.\\n\\nCinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Eye level, medium close-up, high-end CGI photorealistic render, 8K resolution.",
            "Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, prominent skull with articulated jaw, visible clavicle and pelvis structure, elongated femur bones with precise joint definition.\\n\\nWearing a dark athletic headband and black gym shorts draped over the skeleton frame.\\n\\nSlumped slightly forward in a wooden library chair, skull tilted downward over an open hardcover book, phalanges loosely resting on the pages mid-doze.\\n\\nQuiet library interior with tall wooden bookshelves lining the walls, warm amber desk lamp casting a soft pool of light, muffled silence. Overall mood: peaceful and gently humorous.\\n\\nCinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Eye level, medium close-up, high-end CGI photorealistic render, 8K resolution.",
            "Hyperrealistic 3D CGI human skeleton character with photorealistic aged bone texture, detailed rib cage and spine articulation, prominent skull with articulated jaw, visible clavicle and pelvis structure, elongated femur bones with precise joint definition.\\n\\nWearing a dark athletic headband and black gym shorts draped over the skeleton frame.\\n\\nPointing directly at the viewer with one extended phalange finger, engaging the camera with a direct frontal gaze, with a bold glowing subscribe button graphic implied just off-frame.\\n\\nClean studio background with a soft neutral gradient and even fill lighting. Overall mood: energetic and direct.\\n\\nCinematic lighting with soft directional shadows, desaturated color grade, shallow depth of field (f/2.8), Eye level, medium shot, direct camera engagement, high-end CGI photorealistic render, 8K resolution."
          ]
        }
      </output>
    </example>
  </few_shot_examples>
</system_prompt>

Scene Descriptions:
{scenes}
`;

export const HISTORY_BATCH_PROMPT_GENERATOR = `
<system_prompt>
  <role>
    You are a backend prompt-generation engine. Your sole function is to ingest a list of 5
    sparse, unstructured scene descriptions and autonomously expand each one into a highly
    detailed, 8K photorealistic English image generation prompt depicting an epic historical
    painting or illustration style, while preserving every explicit scene constraint from
    the input.
  </role>

  <strict_rules>
    <rule>STYLE: ALWAYS an epic historical painting or vintage illustration aesthetic —
      oil-painting textures, rich earthy tones, dramatic chiaroscuro lighting.</rule>
    <rule>SUBJECT: Human figures rendered in a classical, monumental style reminiscent of
      Romantic-era history paintings (e.g., Delacroix, David, Friedrich).</rule>
    <rule>FORBIDDEN_ELEMENTS: modern technology, neon lights, futuristic materials,
      cartoon/anime style.</rule>
    <rule>REQUIRED_QUALITIES: Each prompt MUST convey grandeur, historical weight,
      and cinematic drama through composition, lighting, and costume details.</rule>
    <rule>AUTO_EXPANSION: You MUST infer and invent high-quality English details for Period
      Costume, Historical Setting, Props, and Atmospheric Mood if the input is brief.</rule>
    <rule>SCENE_FIDELITY: Preserve every explicit input element from each scene. Named
      actions, objects, clothing, locations, time of day, weather, mood cues, gaze
      direction, gesture target, and camera/viewer relationship are REQUIRED constraints.</rule>
    <rule>NO_SUBSTITUTION: Added details may enrich the image, but they must NEVER replace,
      omit, or contradict any explicit input detail. Expansion is additive only.</rule>
    <rule>MULTI_ACTION_PRESERVATION: If a scene contains multiple simultaneous actions,
      relationships, or constraints, include ALL of them in one coherent moment.</rule>
    <rule>SILENT_COMPLETENESS_CHECK: Before writing each final prompt, silently verify that
      every explicit scene element from the source appears somewhere in the 5 paragraphs.
      Do not output this checklist.</rule>
    <rule>COUNT: You MUST return exactly 5 prompts in the same order as the input list.
      Do not skip, merge, or reorder scenes.</rule>
    <rule>OUTPUT_FORMAT: Return ONLY a JSON object in this exact shape:
      { "prompts": ["...", "...", "...", "...", "..."] }
      Each string is a complete 5-paragraph image prompt. Use \\n\\n between paragraphs.
      NO markdown formatting, NO greetings, NO explanations.</rule>
  </strict_rules>

  <logic_camera_angle>
    Map the inferred scene to one of the following compositions while respecting any
    explicit gaze target or viewer/camera relationship in the input:
    - Powerful action (battle, conquest) -> Low angle, wide panoramic
    - Everyday / emotional (reading, mourning) -> Eye level, medium close-up
    - Grand scenery emphasis (landscapes, cityscapes) -> Ultra-wide shot, slight low angle
    - Ceremonial / political (coronation, speech) -> Slightly low angle, medium-wide
    - Dramatic emotion (grief, triumph) -> Close-up, slightly high/low angle
    - Full-body costume showcase -> Full body shot, eye level
    - Direct address (pointing, commanding) -> Eye level, medium shot
  </logic_camera_angle>

  <template_variables>
    Generate each prompt exactly in this 5-paragraph structure:

    [PARAGRAPH 1 - Fixed Core]
    Epic historical painting in the style of 19th-century Romantic oil paintings,
    photorealistic yet painterly with visible brushstroke texture, rich warm color
    palette of deep golds, burgundy, and aged ivory, dramatic chiaroscuro lighting
    with volumetric god-rays.

    [PARAGRAPH 2 - Costume & Character]
    If scene defines costume or wearable items: "{Faithful, highly detailed period
    costume description that preserves all explicit wearable elements}, rendered with
    oil-painting fabric texture and historical accuracy."
    If NO costume defined: "Wearing a weathered period-appropriate tunic and leather
    boots, rendered with oil-painting fabric texture and historical accuracy."

    [PARAGRAPH 3 - Action & Props]
    "{Faithful English action description that preserves all explicit actions, gestures,
    targets, and gaze directions from the input scene}, with {Faithful English props
    description that preserves all explicit objects and adds only supportive historical
    details}."

    [PARAGRAPH 4 - Setting, Time & Mood]
    If setting, time, weather, or environmental conditions are explicit or can be inferred:
    "{Detailed historical environment description}, {Time if applicable} atmosphere.
    Overall mood: {Inferred mood — monumental, sweeping, grand}."
    If NO setting can be inferred: "Ancient stone hall with towering columns and warm
    torchlight casting long shadows. Overall mood: monumental and reverent."

    [PARAGRAPH 5 - Render & Composition]
    Dramatic Renaissance-style lighting with rich directional shadows, warm desaturated
    color grade reminiscent of aged oil paintings, shallow depth of field (f/2.8),
    {Selected composition from logic_camera_angle}, fine-art photorealistic render,
    8K resolution, visible canvas texture overlay.
  </template_variables>

  <few_shot_examples>
    <example>
      <input>
        1. A general rallying troops before a decisive battle at dawn
        2. A scholar studying ancient manuscripts by candlelight
        3. A coronation ceremony in a grand cathedral
        4. Explorers discovering a lost temple deep in the jungle
        5. A philosopher addressing the crowd in a sunlit forum
      </input>
      <output>
        {
          "prompts": [
            "Epic historical painting in the style of 19th-century Romantic oil paintings, photorealistic yet painterly with visible brushstroke texture, rich warm color palette of deep golds, burgundy, and aged ivory, dramatic chiaroscuro lighting with volumetric god-rays.\\n\\nWearing a gleaming suit of plate armor with a crimson cape billowing in the dawn wind, ornate sword raised high, rendered with oil-painting fabric texture and historical accuracy.\\n\\nStanding atop a rocky ridge rallying a vast army below, arm extended forward in a commanding gesture, with rows of soldiers holding spears and banners stretching into the misty distance.\\n\\nRolling battlefield at dawn, golden sunlight breaking through heavy clouds, mist rising from the valley floor, distant mountains silhouetted against the brightening sky. Overall mood: monumental and heroic.\\n\\nDramatic Renaissance-style lighting with rich directional shadows, warm desaturated color grade reminiscent of aged oil paintings, shallow depth of field (f/2.8), Low angle, wide panoramic, fine-art photorealistic render, 8K resolution, visible canvas texture overlay.",
            "Epic historical painting in the style of 19th-century Romantic oil paintings, photorealistic yet painterly with visible brushstroke texture, rich warm color palette of deep golds, burgundy, and aged ivory, dramatic chiaroscuro lighting with volumetric god-rays.\\n\\nWearing a dark scholarly robe with a velvet collar and ink-stained fingers, rendered with oil-painting fabric texture and historical accuracy.\\n\\nHunched over a heavy oak desk reading an ancient manuscript, quill pen in one hand and magnifying glass in the other, with stacks of leather-bound books and rolled parchments surrounding the workspace.\\n\\nDimly lit medieval study chamber, single candle flame casting warm dancing shadows across stone walls lined with bookshelves, dust motes visible in the amber light. Overall mood: contemplative and intimate.\\n\\nDramatic Renaissance-style lighting with rich directional shadows, warm desaturated color grade reminiscent of aged oil paintings, shallow depth of field (f/2.8), Eye level, medium close-up, fine-art photorealistic render, 8K resolution, visible canvas texture overlay.",
            "Epic historical painting in the style of 19th-century Romantic oil paintings, photorealistic yet painterly with visible brushstroke texture, rich warm color palette of deep golds, burgundy, and aged ivory, dramatic chiaroscuro lighting with volumetric god-rays.\\n\\nWearing an elaborate royal coronation gown of white silk and gold embroidery with an ermine-trimmed mantle, rendered with oil-painting fabric texture and historical accuracy.\\n\\nKneeling at the altar as a jeweled crown is placed upon their head by a robed archbishop, with attendants holding ceremonial objects on either side.\\n\\nGrand Gothic cathedral interior with soaring ribbed vaults, stained glass windows casting prismatic light across the stone floor, hundreds of onlookers filling the nave. Overall mood: solemn and majestic.\\n\\nDramatic Renaissance-style lighting with rich directional shadows, warm desaturated color grade reminiscent of aged oil paintings, shallow depth of field (f/2.8), Slightly low angle, medium-wide, fine-art photorealistic render, 8K resolution, visible canvas texture overlay.",
            "Epic historical painting in the style of 19th-century Romantic oil paintings, photorealistic yet painterly with visible brushstroke texture, rich warm color palette of deep golds, burgundy, and aged ivory, dramatic chiaroscuro lighting with volumetric god-rays.\\n\\nWearing weathered khaki expedition clothing with a wide-brimmed hat and leather satchel, rendered with oil-painting fabric texture and historical accuracy.\\n\\nPushing through dense jungle foliage to reveal a massive moss-covered stone temple entrance, with one hand parting vines and the other holding a worn map.\\n\\nDense tropical jungle with towering ancient trees and hanging vines, shafts of golden sunlight piercing the canopy to illuminate the crumbling temple facade, exotic birds perched on stone carvings. Overall mood: awe-inspiring and adventurous.\\n\\nDramatic Renaissance-style lighting with rich directional shadows, warm desaturated color grade reminiscent of aged oil paintings, shallow depth of field (f/2.8), Ultra-wide shot, slight low angle, fine-art photorealistic render, 8K resolution, visible canvas texture overlay.",
            "Epic historical painting in the style of 19th-century Romantic oil paintings, photorealistic yet painterly with visible brushstroke texture, rich warm color palette of deep golds, burgundy, and aged ivory, dramatic chiaroscuro lighting with volumetric god-rays.\\n\\nWearing a flowing white toga draped over one shoulder with leather sandals, rendered with oil-painting fabric texture and historical accuracy.\\n\\nStanding on the steps of a marble forum gesturing passionately toward a gathered crowd, one hand raised in rhetorical emphasis, with scrolls tucked under the other arm.\\n\\nSunlit Roman forum with towering marble columns and classical architecture, blue sky with wispy clouds, crowd of citizens in togas gathered in a semicircle below. Overall mood: intellectual and commanding.\\n\\nDramatic Renaissance-style lighting with rich directional shadows, warm desaturated color grade reminiscent of aged oil paintings, shallow depth of field (f/2.8), Eye level, medium shot, fine-art photorealistic render, 8K resolution, visible canvas texture overlay."
          ]
        }
      </output>
    </example>
  </few_shot_examples>
</system_prompt>

Scene Descriptions:
{scenes}
`;

import type { VideoStyle } from "../model/types";

const IMAGE_PROMPTS_BY_STYLE: Record<VideoStyle, string> = {
  skeleton: SKELETON_BATCH_PROMPT_GENERATOR,
  history: HISTORY_BATCH_PROMPT_GENERATOR,
};

export function getImagePromptByStyle(style: VideoStyle): string {
  return IMAGE_PROMPTS_BY_STYLE[style];
}
