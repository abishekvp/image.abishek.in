"use strict";
import React from "react";
import { ShieldCheck, Printer, Zap, Sparkles, Layers } from "lucide-react";

interface HeaderProps {
  onOpenPrintGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPrintGuide }) => {
  return (
    <header className="border-b border-surface-border/60 bg-surface-base/80 backdrop-blur-xl sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-brand-500/20">
            <div className="w-full h-full bg-surface-base rounded-[11px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Compressor<span className="text-brand-400">Pro</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300">
                HD Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              image.abishek.in · Lossless & Lossy Compression
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% In-Browser Privacy</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium">
            <Zap className="w-3.5 h-3.5" />
            <span>WebP · AVIF · JPG · PNG</span>
          </div>

          <button
            onClick={onOpenPrintGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>300 DPI Print Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
