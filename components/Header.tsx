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

        // Kredi bilgisini profiles tablosundan çek
        supabase
          .from("profiles")
          .select("credits")
          .eq("id", data.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) setCredits(profile.credits);
          });
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

  // Dışarı tıklanınca kapat
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
    <header className="w-full border-b border-white/10 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Instant<span className="text-violet-400">API</span>
          </span>
        </Link>

        {/* Sağ taraf */}
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 hover:bg-white/5 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {getInitials(displayName)}
              </div>
              <span className="text-sm text-white/80 max-w-35 truncate hidden sm:block">
                {displayName}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-52 bg-[#141414] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                {/* API'lerim */}
                <Link
                  href="/my-apis"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <LayoutList className="w-4 h-4 text-violet-400 shrink-0" />
                  API'lerim
                </Link>

                {/* Kredi */}
                <div className="flex items-center gap-3 px-4 py-3 border-t border-white/5">
                  <Coins className="w-4 h-4 text-yellow-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs text-white/40">Kredi</span>
                    <span className="text-sm font-semibold text-white">
                      {credits !== null ? credits : "—"}
                    </span>
                  </div>
                </div>

                {/* Çıkış Yap */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-white/5"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Çıkış Yap
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="text-sm bg-violet-600 hover:bg-violet-500 text-white font-medium rounded-lg px-4 py-1.5 transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
