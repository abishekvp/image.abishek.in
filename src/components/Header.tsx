"use client";

import React from "react";
import { ShieldCheck, Printer, Zap, Sparkles, Monitor, Layers } from "lucide-react";

interface HeaderProps {
  onOpenPrintGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPrintGuide }) => {
  return (
    <header className="border-b border-surface-border/70 bg-surface-base/85 backdrop-blur-xl sticky top-0 z-30 transition-all">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 xl:px-12 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-xl shadow-brand-500/20">
            <div className="w-full h-full bg-surface-base rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Compressor<span className="text-brand-400">Pro</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300">
                Studio HD
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              image.abishek.in · High-Definition Print & Web Compression
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% In-Browser Privacy</span>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold">
            <Zap className="w-4 h-4" />
            <span>WebP · AVIF · JPEG · PNG</span>
          </div>

          <button
            onClick={onOpenPrintGuide}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>300 DPI Print Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
