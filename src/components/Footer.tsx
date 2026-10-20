import React from "react";
import { Sparkles, Heart, ShieldCheck, Printer } from "lucide-react";

interface FooterProps {
  onOpenPrintGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrintGuide }) => {
  return (
    <footer className="mt-20 border-t border-surface-border/60 bg-surface-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-brand-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm text-white">
                Compressor<span className="text-brand-400">Pro</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">image.abishek.in</span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm">
              High-definition image compression studio. Zero server uploads, instant batch processing, and true 300 DPI HD Print export.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <button
              onClick={onOpenPrintGuide}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>300 DPI Guide</span>
            </button>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Privacy</span>
            </div>
            <span className="text-slate-600">·</span>
            <span>Vercel Optimized</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} image.abishek.in. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with modern Next.js & Web APIs
          </p>
        </div>
      </div>
    </footer>
  );
};
