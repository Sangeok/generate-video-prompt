"use client";

import { useState } from "react";
import { Copy, Check, Download, Music } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/fsd/shared/ui/button";
import type { VideoPromptResult as VideoPromptResultType } from "../model/types";

interface Props {
  result: VideoPromptResultType;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("복사되었습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="h-8 gap-1.5 rounded-lg border-white/10 bg-white/5 px-3 text-xs text-white/70 hover:bg-white/10 hover:text-white"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? "복사됨" : "복사"}
    </Button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-medium uppercase tracking-wider text-white/50">
      {children}
    </h3>
  );
}

export function VideoPromptResult({ result }: Props) {
  const srtContent = `1\n00:00:00,000 --> 00:00:30,000\n${result.caption}`;
  const audioSrc = `data:audio/mp3;base64,${result.audioBase64}`;

  const handleSrtDownload = () => {
    const blob = new Blob([srtContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "caption.srt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Caption / SRT */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Caption (SRT)</SectionTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSrtDownload}
            className="h-8 gap-1.5 rounded-lg border-white/10 bg-white/5 px-3 text-xs text-white/70 hover:bg-white/10 hover:text-white"
          >
            <Download className="size-3" />
            SRT 다운로드
          </Button>
        </div>
        <pre className="overflow-auto rounded-xl bg-neutral-900/50 p-4 text-sm text-neutral-300 whitespace-pre-wrap">
          {srtContent}
        </pre>
      </div>

      {/* Audio */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Audio</SectionTitle>
          <a
            href={audioSrc}
            download="audio.mp3"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Download className="size-3" />
            MP3 다운로드
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Music className="size-4 shrink-0 text-purple-400" />
          <audio controls src={audioSrc} className="w-full" />
        </div>
      </div>

      {/* Image Prompts */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-3">
          <SectionTitle>Image Prompts</SectionTitle>
        </div>
        <div className="space-y-3">
          {result.imagePrompts.map((prompt, i) => (
            <div
              key={i}
              className="flex items-start justify-between gap-4 rounded-xl bg-neutral-900/50 p-4"
            >
              <p className="text-sm text-neutral-300 leading-relaxed">{prompt}</p>
              <CopyButton text={prompt} />
            </div>
          ))}
        </div>
      </div>

      {/* Script */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Script</SectionTitle>
          <CopyButton text={result.script.content} />
        </div>

        {result.script.scenes.length > 0 && (
          <div className="mb-4 space-y-3">
            {result.script.scenes.map((scene, i) => (
              <div
                key={i}
                className="flex items-start justify-between gap-4 rounded-xl bg-neutral-900/50 p-4"
              >
                <div>
                  <span className="mb-1 block text-xs font-medium text-purple-400">
                    Scene {i + 1}
                  </span>
                  <p className="text-sm text-neutral-300 leading-relaxed">{scene}</p>
                </div>
                <CopyButton text={scene} />
              </div>
            ))}
          </div>
        )}

        <div className="rounded-xl bg-neutral-900/50 p-4">
          <p className="text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Full Script</p>
          <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
            {result.script.content}
          </p>
        </div>
      </div>
    </div>
  );
}
