"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Copy, Check, ExternalLink, Zap, LayoutList, AlertCircle, Plus } from "lucide-react";
import Header from "@/components/Header";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

interface MockEndpoint {
  id: string;
  slug: string;
  prompt: string;
  created_at: string;
}

function SkeletonCard() {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.06)",
        background: "#111111",
      }}
    >
      <div className="px-5 py-4 space-y-3">
        <div className="skeleton h-3.5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-8 w-full rounded-lg" />
      </div>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <div className="skeleton h-2.5 w-24 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-7 w-20 rounded-lg" />
          <div className="skeleton h-7 w-14 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function EndpointCard({ endpoint }: { endpoint: MockEndpoint }) {
  const [copied, setCopied] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/api/v1/${endpoint.slug}`;

  async function copyUrl() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const date = new Date(endpoint.created_at).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200 group"
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#111111",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(139,92,246,0.3)";
        (e.currentTarget as HTMLDivElement).style.background = "#131318";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 24px rgba(139,92,246,0.05)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.background = "#111111";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">
          {endpoint.prompt}
        </p>
        <div
          className="flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-lg truncate transition-colors duration-200"
          style={{
            color: "rgba(167,139,250,0.7)",
            background: "rgba(139,92,246,0.06)",
            border: "1px solid rgba(139,92,246,0.12)",
          }}
        >
          {url}
        </div>
      </div>
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
      >
        <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.22)" }}>
          {date}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={copyUrl}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
            style={{
              border: "1px solid rgba(255,255,255,0.09)",
              color: "rgba(255,255,255,0.38)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(139,92,246,0.4)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.09)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.38)";
            }}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" style={{ color: "#34d399" }} />
                <span style={{ color: "#34d399" }}>Kopyalandı</span>
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
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-white font-medium transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              boxShadow: "0 0 10px rgba(139,92,246,0.2)",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 18px rgba(139,92,246,0.38)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 0 10px rgba(139,92,246,0.2)")
            }
          >
            <ExternalLink className="w-3 h-3" />
            Aç
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MyApisPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [endpoints, setEndpoints] = useState<MockEndpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error: dbError } = await supabase
        .from("mock_endpoints")
        .select("id, slug, prompt, created_at")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (dbError) {
        setError("API'ler yüklenirken bir hata oluştu.");
      } else {
        setEndpoints(data ?? []);
      }
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-60" />
      {/* Top glow */}
      <div
        className="fixed left-1/2 -top-20 -translate-x-1/2 pointer-events-none"
        style={{
          width: 500,
          height: 300,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.09) 0%, transparent 70%)",
          filter: "blur(24px)",
        }}
      />
      <Header />
      <main className="relative flex-1 px-4 py-12">
        <div className="max-w-3xl mx-auto animate-fade-up">
          {/* Page header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "rgba(139,92,246,0.1)",
                  border: "1px solid rgba(139,92,246,0.2)",
                }}
              >
                <LayoutList className="w-4.5 h-4.5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">API&apos;lerim</h1>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                  Oluşturduğun tüm mock endpoint&apos;ler
                </p>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl text-white font-medium transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                boxShadow: "0 0 16px rgba(139,92,246,0.25)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 28px rgba(139,92,246,0.45)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 16px rgba(139,92,246,0.25)")
              }
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni API
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : error ? (
            <div
              className="flex items-center gap-3 rounded-xl px-5 py-4 text-sm"
              style={{
                border: "1px solid rgba(239,68,68,0.2)",
                background: "rgba(239,68,68,0.06)",
                color: "#f87171",
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          ) : endpoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-center gap-6">
              <div
                className="w-18 h-18 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(139,92,246,0.08)",
                  border: "1px solid rgba(139,92,246,0.15)",
                  boxShadow: "0 0 32px rgba(139,92,246,0.08)",
                }}
              >
                <Zap className="w-8 h-8" style={{ color: "rgba(139,92,246,0.65)" }} />
              </div>
              <div className="space-y-2">
                <p className="text-white/55 text-sm font-medium">
                  Henüz hiç API oluşturmadın.
                </p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.22)" }}>
                  Ana sayfadan bir prompt yaz ve ilk endpoint&apos;ini oluştur.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white font-medium transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                  boxShadow: "0 0 20px rgba(139,92,246,0.3)",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 32px rgba(139,92,246,0.5)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                    "0 0 20px rgba(139,92,246,0.3)")
                }
              >
                <Zap className="w-4 h-4" />
                İlk API&apos;ni Oluştur
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs pb-2" style={{ color: "rgba(255,255,255,0.22)" }}>
                {endpoints.length} endpoint
              </p>
              {endpoints.map((ep) => (
                <EndpointCard key={ep.id} endpoint={ep} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
