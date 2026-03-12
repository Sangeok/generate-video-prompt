import type { StyleOption } from "../model/types";

export const STYLE_OPTIONS = [
  {
    value: "skeleton",
    title: "Skeleton",
    description: "Moody, anatomical, cinematic",
    imageSrc: "/skeleton_style_bg.png",
    imageAlt: "Skeleton Style",
    selectedClassName:
      "border-purple-500 ring-4 ring-purple-500/20 scale-[1.02] shadow-[0_0_40px_rgba(168,85,247,0.3)]",
    iconClassName:
      "text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]",
  },
  {
    value: "history",
    title: "Epic History",
    description: "Monumental, vintage, sweepingly grand",
    imageSrc: "/history_style_bg.png",
    imageAlt: "History Style",
    selectedClassName:
      "border-pink-500 ring-4 ring-pink-500/20 scale-[1.02] shadow-[0_0_40px_rgba(236,72,153,0.3)]",
    iconClassName:
      "text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]",
  },
] as const satisfies readonly StyleOption[];
