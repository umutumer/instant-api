"use client";

import { useState } from "react";
import Header from "@/components/Header";
import PromptForm from "@/components/PromptForm";
import ResultCard from "@/components/ResultCard";

interface Result {
  slug: string;
  url: string;
  preview: unknown;
}

export default function Home() {
  const [result, setResult] = useState<Result | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-12 space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs text-violet-400 border border-violet-500/30 rounded-full px-4 py-1.5 bg-violet-500/10">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Instant mock APIs — no backend required
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Describe your API.
            <br />
            <span className="text-violet-400">Get it live in seconds.</span>
          </h1>
          <p className="text-white/50 text-lg">
            Type what data you need, get a real shareable JSON endpoint instantly.
          </p>
        </div>
        <div className="w-full max-w-2xl space-y-8">
          <PromptForm onResult={setResult} />
          {result && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/30">Live Endpoint</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <ResultCard url={result.url} preview={result.preview} />
            </>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-xs text-white/20">
        Built with Next.js + OpenAI + Supabase
      </footer>
    </div>
  );
}
