"use client";

import { useState } from "react";
import { Sparkles, AlertCircle } from "lucide-react";

const EXAMPLES = [
  "50 e-ticaret müşterisi: isim, email, şehir, toplam_harcama",
  "20 ürün: ad, fiyat, kategori, stok_adedi, puan",
  "10 blog yazısı: başlık, yazar, tarih, etiketler, özet",
  "30 çalışan: isim, departman, maaş, işe_giriş_tarihi",
];

interface Props {
  onResult: (data: { slug: string; url: string; preview: unknown }) => void;
}

function GeneratingSkeleton() {
  return (
    <div
      className="w-full rounded-xl overflow-hidden animate-fade-up"
      style={{
        border: "1px solid rgba(139,92,246,0.2)",
        background: "#0f0f13",
        boxShadow: "0 0 40px rgba(139,92,246,0.06)",
      }}
    >
      {/* Fake URL bar */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(139,92,246,0.04)",
        }}
      >
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.07]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.07]" />
          <span className="w-2.5 h-2.5 rounded-full bg-white/[0.07]" />
        </div>
        <div className="skeleton h-3 w-52 rounded-md" />
      </div>
      {/* Fake JSON lines */}
      <div className="p-5 space-y-2.5">
        {[92, 68, 82, 55, 78, 62, 88, 50].map((w, i) => (
          <div key={i} className="skeleton h-3 rounded-md" style={{ width: `${w}%` }} />
        ))}
      </div>
      {/* Status */}
      <div
        className="flex items-center gap-2.5 px-5 pb-5 text-xs"
        style={{ color: "#a78bfa" }}
      >
        <span className="inline-flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:300ms]" />
        </span>
        AI endpoint oluşturuluyor…
      </div>
    </div>
  );
}

export default function PromptForm({ onResult }: Props) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Bir hata oluştu.");
      onResult(data);
      window.dispatchEvent(new CustomEvent("credits-updated"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = !loading && prompt.trim().length >= 5;

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Textarea */}
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Bana 50 kişilik e-ticaret müşteri verisi dönen bir endpoint ver..."
            rows={4}
            maxLength={500}
            disabled={loading}
            className="w-full resize-none rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/22 focus:outline-none transition-all duration-200 disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.border = "1px solid rgba(139,92,246,0.45)";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.border = "1px solid rgba(255,255,255,0.09)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <span className="absolute bottom-3 right-3 text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.18)" }}>
            {prompt.length}/500
          </span>
        </div>

        {/* Example prompts */}
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setPrompt(ex)}
              disabled={loading}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-40"
              style={{
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.38)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.4)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(139,92,246,0.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.38)";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              {ex.length > 42 ? ex.slice(0, 42) + "…" : ex}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div
            className="flex items-start gap-2.5 text-sm rounded-xl px-4 py-3"
            style={{
              color: "#f87171",
              background: "rgba(239,68,68,0.07)",
              border: "1px solid rgba(239,68,68,0.18)",
            }}
          >
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full flex items-center justify-center gap-2.5 rounded-xl text-white font-semibold py-3.5 text-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={
            loading
              ? {
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  cursor: "not-allowed",
                }
              : canSubmit
              ? {
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  boxShadow: "0 0 24px rgba(139,92,246,0.3), 0 4px 16px rgba(0,0,0,0.4)",
                }
              : {
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                }
          }
          onMouseEnter={(e) => {
            if (!canSubmit || loading) return;
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 36px rgba(139,92,246,0.45), 0 6px 20px rgba(0,0,0,0.5)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            if (!canSubmit || loading) return;
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 0 24px rgba(139,92,246,0.3), 0 4px 16px rgba(0,0,0,0.4)";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          {loading ? (
            <>
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce [animation-delay:300ms]" />
              </span>
              Endpoint oluşturuluyor…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Endpoint Oluştur
            </>
          )}
        </button>
      </form>

      {/* Skeleton while loading */}
      {loading && <GeneratingSkeleton />}
    </div>
  );
}
