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
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <header className="w-full border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Instant<span className="text-violet-400">API</span>
            </span>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && (
              <p className="text-white/50 mt-2 text-sm">{subtitle}</p>
            )}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
