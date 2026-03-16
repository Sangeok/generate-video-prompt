"use client";

import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/fsd/shared/ui/button";
import { Input } from "@/fsd/shared/ui/input";

import { STYLE_OPTIONS } from "../config/style-options";
import { useGenerateVideoPromptForm } from "../model/use-generate-video-prompt-form";
import { StyleCard } from "./style-card";
import { VideoPromptResult } from "./video-prompt-result";

export function GenerateVideoPromptForm() {
  const { form, handleSubmit, isPending, isPolling, runResult } = useGenerateVideoPromptForm();
  const {
    register,
    watch,
    setValue,
    formState: { isValid },
  } = form;

  const isLoading = isPending || isPolling;
  const selectedStyle = watch("selectedStyle");

  return (
    <div className="space-y-6">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="relative space-y-10 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl sm:p-10"
      >
        <div className="pointer-events-none absolute top-[-50%] left-[-10%] h-[100%] w-[60%] rounded-full bg-purple-500/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-[-10%] bottom-[-50%] h-[100%] w-[60%] rounded-full bg-pink-500/10 blur-[120px]" />

        <div className="relative z-10 space-y-4">
          <label
            htmlFor="topic"
            className="block text-sm font-medium tracking-wider text-neutral-300 uppercase"
          >
            1. Enter Your Topic
          </label>
          <div className="group relative">
            <Input
              id="topic"
              type="text"
              {...register("topic")}
              required
              placeholder="e.g., A futuristic city in the clouds..."
              className="h-auto rounded-2xl border-white/10 bg-neutral-900/50 px-6 py-5 text-lg text-white shadow-inner transition-all duration-300 placeholder:text-neutral-500 focus-visible:border-purple-500/50 focus-visible:ring-purple-500/50 sm:text-xl"
            />
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-20" />
          </div>
        </div>

        <fieldset className="relative z-10">
          <legend className="block text-sm font-medium tracking-wider text-neutral-300 uppercase">
            2. Select Visual Style
          </legend>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {STYLE_OPTIONS.map((option) => (
              <StyleCard
                key={option.value}
                option={option}
                isSelected={selectedStyle === option.value}
                onSelect={(style) => setValue("selectedStyle", style, { shouldValidate: true })}
              />
            ))}
          </div>
        </fieldset>

        <div className="relative z-10 flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isLoading}
            aria-disabled={!isValid || isLoading}
            className={
              isValid && !isLoading
                ? "h-auto gap-3 rounded-xl border-transparent bg-white px-8 py-4 text-lg font-bold text-neutral-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 hover:-translate-y-1 hover:bg-neutral-200 hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                : "h-auto gap-3 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-bold text-neutral-300 transition-all duration-300 hover:bg-white/10"
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                {isPending ? "Starting..." : "Generating..."}
              </>
            ) : (
              <>
                Generate Prompt
                <Sparkles className="size-5" />
              </>
            )}
          </Button>
        </div>
      </form>

      {runResult?.status === "Completed" && runResult.output && (
        <VideoPromptResult result={runResult.output} />
      )}
    </div>
  );
}
