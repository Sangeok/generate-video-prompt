import { Sparkles } from "lucide-react";

import { GenerateVideoPromptForm } from "@/fsd/features/generate-video-prompt";

export function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 p-4 text-white selection:bg-purple-500/30 sm:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-12">
        <div className="space-y-4 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-white/5 p-3 ring-1 ring-white/10 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
            <Sparkles className="size-8 text-purple-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
            Video Prompt{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-400">
            Transform your ideas into stunning video prompts. Choose a topic
            and a visual style to begin.
          </p>
        </div>

        <GenerateVideoPromptForm />
      </div>
    </main>
  );
}
