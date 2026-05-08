"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

const EXAMPLES = [
  "50 e-ticaret müşterisi: isim, email, şehir, toplam_harcama",
  "20 ürün: ad, fiyat, kategori, stok_adedi, puan",
  "10 blog yazısı: başlık, yazar, tarih, etiketler, özet",
  "30 çalışan: isim, departman, maaş, işe_giriş_tarihi",
];

interface Props {
  onResult: (data: { slug: string; url: string; preview: unknown }) => void;
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Bana 50 kişilik e-ticaret müşteri verisi dönen bir endpoint ver..."
          rows={4}
          maxLength={500}
          className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
        />
        <span className="absolute bottom-3 right-3 text-xs text-white/20">
          {prompt.length}/500
        </span>
      </div>

      {/* Örnek promptlar */}
      <div className="flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setPrompt(ex)}
            className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-violet-500 transition"
          >
            {ex.length > 40 ? ex.slice(0, 40) + "…" : ex}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || prompt.trim().length < 5}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 transition"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Endpoint oluşturuluyor...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Generate Endpoint
          </>
        )}
      </button>
    </form>
  );
}
