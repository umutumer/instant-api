"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Dot-grid */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none opacity-60" />
      {/* Top violet glow */}
      <div
        className="fixed left-1/2 -top-32 -translate-x-1/2 pointer-events-none"
        style={{
          width: 500,
          height: 400,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(139,92,246,0.12) 0%, rgba(139,92,246,0.03) 55%, transparent 75%)",
          filter: "blur(24px)",
        }}
      />

      {/* Mini header */}
      <header
        className="relative z-10 w-full px-6 py-3.5"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(16px)",
          backgroundColor: "rgba(10,10,10,0.85)",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
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
        </div>
      </header>

      {/* Centered content */}
      <main className="relative flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md animate-fade-up">
          {/* Title */}
          <div className="text-center mb-8 space-y-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
            {subtitle && (
              <p className="text-sm" style={{ color: "#a1a1aa" }}>
                {subtitle}
              </p>
            )}
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: "rgba(17,17,17,0.85)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.02), 0 0 48px rgba(139,92,246,0.04)",
              backdropFilter: "blur(8px)",
            }}
          >
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

