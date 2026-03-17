export const VIDEO_STYLE_VALUES = ["skeleton", "history"] as const;

export type VideoStyle = (typeof VIDEO_STYLE_VALUES)[number];

export type StyleOption = {
  value: VideoStyle;
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  selectedClassName: string;
  iconClassName: string;
};

export type VideoPromptResult = {
  script: { content: string; scenes: string[] };
  imagePrompts: string[];
  audioBase64: string;
  caption: string;
};

export type RunStatus = "Running" | "Completed" | "Failed" | "Cancelled";

export type InngestRun =
  | { status: "Running" }
  | { status: "Completed"; output: VideoPromptResult }
  | { status: "Failed"; error?: string }
  | { status: "Cancelled" };
