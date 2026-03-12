import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

import type { StyleOption, VideoStyle } from "../model/types";

type StyleCardProps = {
  option: StyleOption;
  isSelected: boolean;
  onSelect: (style: VideoStyle) => void;
};

export function StyleCard({
  option,
  isSelected,
  onSelect,
}: StyleCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={isSelected}
      className={cn(
        "group relative aspect-video overflow-hidden rounded-2xl border-2 text-left transition-all duration-300",
        isSelected
          ? option.selectedClassName
          : "border-white/10 hover:scale-[1.01] hover:border-white/30"
      )}
    >
      <Image
        src={option.imageSrc}
        alt={option.imageAlt}
        fill
        className={cn(
          "object-cover transition-transform duration-700",
          isSelected ? "scale-105" : "group-hover:scale-110"
        )}
        priority
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/40 to-transparent transition-opacity duration-300",
          isSelected ? "opacity-100" : "opacity-80 group-hover:opacity-60"
        )}
      />
      <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-6">
        <div>
          <h3 className="mb-1 text-xl font-bold text-white drop-shadow-lg">
            {option.title}
          </h3>
          <p className="text-sm text-neutral-300 drop-shadow-md">
            {option.description}
          </p>
        </div>
        {isSelected && (
          <CheckCircle2
            className={cn(
              "h-8 w-8 animate-in zoom-in duration-200",
              option.iconClassName
            )}
          />
        )}
      </div>
    </button>
  );
}
