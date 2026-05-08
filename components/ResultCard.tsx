"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  url: string;
  preview: unknown;
}

export default function ResultCard({ url, preview }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyUrl() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const previewJson = JSON.stringify(preview, null, 2);
  // İlk 20 satırı göster
  const lines = previewJson.split("\n");
  const truncated = lines.length > 20;
  const displayJson = truncated ? lines.slice(0, 20).join("\n") + "\n  ..." : previewJson;

  return (
    <div className="w-full rounded-xl border border-violet-500/30 bg-white/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* URL Bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-violet-500/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="flex-1 text-xs text-violet-300 font-mono truncate">{url}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:border-violet-500 text-white/60 hover:text-white transition"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-green-400" />
                Kopyalandı
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Kopyala
              </>
            )}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition"
          >
            <ExternalLink className="w-3 h-3" />
            Aç
          </a>
        </div>
      </div>

      {/* JSON Preview */}
      <div className="relative">
        <pre className="p-4 text-xs text-green-300/80 font-mono overflow-x-auto leading-relaxed">
          {displayJson}
        </pre>
        {truncated && (
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-900 to-transparent pointer-events-none" />
        )}
      </div>

      {truncated && (
        <div className="px-4 pb-4 text-center">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2"
          >
            Tüm veriyi görüntüle →
          </a>
        </div>
      )}
    </div>
  );
}
