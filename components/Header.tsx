"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, ChevronDown, Coins, LogOut, LayoutList } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export default function Header() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user);
        const name =
          data.user.user_metadata?.display_name ||
          data.user.user_metadata?.full_name ||
          data.user.email?.split("@")[0] ||
          null;
        setDisplayName(name);

        refreshCredits(data.user.id);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const name =
          session.user.user_metadata?.display_name ||
          session.user.user_metadata?.full_name ||
          session.user.email?.split("@")[0] ||
          null;
        setDisplayName(name);
      } else {
        setUser(null);
        setDisplayName(null);
        setCredits(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const refreshCredits = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();
    if (profile) setCredits(profile.credits);
  };

  useEffect(() => {
    const handler = () => {
      if (user) refreshCredits(user.id);
    };
    window.addEventListener("credits-updated", handler);
    return () => window.removeEventListener("credits-updated", handler);
  }, [user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-40 w-full border-b px-6 py-3.5"
      style={{
        borderColor: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(10,10,10,0.85)",
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
              boxShadow: "0 0 16px rgba(139,92,246,0.3), 0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-[17px] tracking-tight text-white">
            Instant<span className="text-violet-400">API</span>
          </span>
        </Link>

        {/* Right side */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 transition-all duration-200 hover:bg-white/5"
              style={{ border: "1px solid transparent" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              {/* Avatar */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                style={{
                  background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                  boxShadow: "0 0 0 2px rgba(139,92,246,0.25)",
                }}
              >
                {getInitials(displayName)}
              </div>
              <span className="text-sm text-white/65 max-w-36 truncate hidden sm:block">
                {displayName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/25 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden z-50"
                style={{
                  background: "#111111",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
                }}
              >
                {/* User info */}
                <div
                  className="px-4 py-3.5"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <p className="text-xs font-semibold text-white/75 truncate">{displayName}</p>
                  <p className="text-xs text-white/30 truncate mt-0.5">
                    {user.email}
                  </p>
                </div>

                {/* My APIs */}
                <Link
                  href="/my-apis"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/55 hover:bg-white/4 hover:text-white/90 transition-all duration-150"
                >
                  <LayoutList className="w-4 h-4 text-violet-400 shrink-0" />
                  API&apos;lerim
                </Link>

                {/* Credits */}
                <div
                  className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-sm text-white/55">Kredi</span>
                  </div>
                  <span
                    className="text-sm font-bold tabular-nums px-2 py-0.5 rounded-md"
                    style={{
                      background: "rgba(245,158,11,0.08)",
                      color: "#fbbf24",
                      border: "1px solid rgba(245,158,11,0.15)",
                    }}
                  >
                    {credits !== null ? credits : "—"}
                  </span>
                </div>

                {/* Sign out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400/80 hover:bg-red-500/[0.07] hover:text-red-400 transition-all duration-150"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-sm text-white/45 hover:text-white/80 transition-colors duration-200 px-3 py-1.5"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="text-sm text-white font-medium rounded-lg px-4 py-1.5 transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                boxShadow: "0 0 14px rgba(139,92,246,0.25), 0 2px 8px rgba(0,0,0,0.3)",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 22px rgba(139,92,246,0.4), 0 2px 10px rgba(0,0,0,0.35)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.boxShadow =
                  "0 0 14px rgba(139,92,246,0.25), 0 2px 8px rgba(0,0,0,0.3)")
              }
            >
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
