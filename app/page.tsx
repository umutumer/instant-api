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
    <div className="flex flex-col min-h-screen bg-background">
      {/* Dot-grid layer */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-70" />
      {/* Bottom vignette */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 100%, rgba(10,10,10,0.95) 0%, transparent 100%)",
        }}
      />
      {/* Top center violet glow */}
      <div
        className="fixed left-1/2 -top-20 -translate-x-1/2 pointer-events-none"
        style={{
          width: 700,
          height: 480,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.13) 0%, rgba(139,92,246,0.04) 50%, transparent 75%)",
          filter: "blur(30px)",
        }}
      />

      <Header />

      <main className="relative flex-1 flex flex-col items-center justify-center px-4 py-16">
        {/* Hero section */}
        <div className="text-center mb-12 space-y-6 max-w-2xl animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 text-xs font-medium text-violet-300 border border-violet-500/20 rounded-full px-4 py-1.5 bg-violet-500/[0.07] backdrop-blur-sm badge-glow">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-violet-400" />
            </span>
            Yapay zeka destekli anlık endpointler — backend gerekmez
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
            API&apos;nizi tanımlayın.
            <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #7c3aed 100%)",
              }}
            >
              Saniyeler içinde yayında.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-[#a1a1aa] text-base md:text-lg leading-relaxed max-w-lg mx-auto">
            İhtiyacınız olan veriyi yazın, anında gerçek ve paylaşılabilir bir JSON endpoint alın.
            Kurulum yok, backend yok, bekleme yok.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {["Gerçek JSON endpointler", "Anlık oluşturma", "Kopyala ve her yerde kullan"].map((f) => (
              <span
                key={f}
                className="text-xs text-white/35 border border-white/8 rounded-full px-3 py-1"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Form + Result */}
        <div className="relative w-full max-w-2xl space-y-8 animate-fade-up animate-fade-up-delay-1">
          <PromptForm onResult={setResult} />
          {result && (
            <>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/6" />
                <span className="text-xs text-white/20 tracking-widest uppercase font-medium">
                  Canlı Endpoint
                </span>
                <div className="flex-1 h-px bg-white/6" />
              </div>
              <ResultCard url={result.url} preview={result.preview} />
            </>
          )}
        </div>
      </main>

      <footer className="relative text-center py-6 text-xs text-white/12 tracking-wide">
        Built with Next.js · OpenAI · Supabase
      </footer>
    </div>
  );
}

