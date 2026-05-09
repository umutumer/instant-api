"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";

interface Props {
  url: string;
  preview: unknown;
}

export default function ResultCard({ url, preview }: Props) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  async function copyUrl() {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  }

  async function copyJson() {
    await navigator.clipboard.writeText(JSON.stringify(preview, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  }

  const previewJson = JSON.stringify(preview, null, 2);
  const lines = previewJson.split("\n");
  const truncated = lines.length > 22;
  const displayJson = truncated ? lines.slice(0, 22).join("\n") + "\n  …" : previewJson;

  return (
    <div
      className="w-full rounded-xl overflow-hidden animate-fade-up"
      style={{
        border: "1px solid rgba(139,92,246,0.22)",
        background: "#0d0d10",
        boxShadow:
          "0 0 48px rgba(139,92,246,0.07), 0 24px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02)",
      }}
    >
      {/* URL Bar */}
      <div
        className="flex items-center gap-3 px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(139,92,246,0.05)",
        }}
      >
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(239,68,68,0.5)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(245,158,11,0.5)" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(16,185,129,0.5)" }} />
        </div>
        <span
          className="flex-1 text-xs truncate font-mono"
          style={{ color: "rgba(167,139,250,0.85)" }}
        >
          {url}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.45)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.45)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.85)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.09)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.45)";
            }}
          >
            {copiedUrl ? (
              <>
                <Check className="w-3 h-3" style={{ color: "#34d399" }} />
                <span style={{ color: "#34d399" }}>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                URL Kopyala
              </>
            )}
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              boxShadow: "0 0 12px rgba(139,92,246,0.25)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 20px rgba(139,92,246,0.4)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 12px rgba(139,92,246,0.25)")
            }
          >
            <ExternalLink className="w-3 h-3" />
            Aç
          </a>
        </div>
      </div>

      {/* Code block header */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "#0b0b0e",
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: "rgba(52,211,153,0.7)" }}
          />
          <span className="text-xs font-mono" style={{ color: "rgba(52,211,153,0.7)" }}>
            200 OK
          </span>
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
            application/json
          </span>
        </div>
        <button
          onClick={copyJson}
          className="flex items-center gap-1.5 text-xs transition-colors duration-200"
          style={{ color: "rgba(255,255,255,0.28)" }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.28)")
          }
        >
          {copiedJson ? (
            <>
              <Check className="w-3 h-3" style={{ color: "#34d399" }} />
              <span style={{ color: "#34d399" }}>Kopyalandı</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              JSON Kopyala
            </>
          )}
        </button>
      </div>

      {/* JSON Preview */}
      <div className="relative" style={{ background: "#0b0b0e" }}>
        <pre
          className="p-5 text-xs overflow-x-auto leading-relaxed tracking-wide font-mono"
          style={{ color: "rgba(110,231,183,0.75)" }}
        >
          {displayJson}
        </pre>
        {truncated && (
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background: "linear-gradient(to top, #0b0b0e 0%, transparent 100%)",
            }}
          />
        )}
      </div>

      {truncated && (
        <div
          className="px-5 py-3.5 text-center"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            background: "#0b0b0e",
          }}
        >
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-colors duration-200 underline underline-offset-3"
            style={{ color: "rgba(139,92,246,0.75)" }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(167,139,250,1)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(139,92,246,0.75)")
            }
          >
            Tüm veriyi görüntüle →
          </a>
        </div>
      )}
    </div>
  );
}