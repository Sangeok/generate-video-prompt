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
