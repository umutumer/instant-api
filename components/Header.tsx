import { Zap } from "lucide-react";

export default function Header() {
  return (
    <header className="w-full border-b border-white/10 px-6 py-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white">
            Instant<span className="text-violet-400">API</span>
          </span>
        </div>
        <span className="text-xs text-white/40 border border-white/10 rounded-full px-3 py-1">
          Free while in beta
        </span>
      </div>
    </header>
  );
}
