import React from "react";
import { Sparkles, Heart, ShieldCheck, Printer } from "lucide-react";

interface FooterProps {
  onOpenPrintGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrintGuide }) => {
  return (
    <footer className="mt-24 border-t border-surface-border/70 bg-surface-card/40">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-8 xl:px-12 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-7 h-7 rounded-xl bg-brand-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white">
                Compressor<span className="text-brand-400">Pro</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">image.abishek.in</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
              High-definition image compression studio. Zero server uploads, instant batch processing, and true 300 DPI HD Print export.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-400">
            <button
              onClick={onOpenPrintGuide}
              className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>300 DPI Guide</span>
            </button>
            <span className="text-slate-600">·</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Privacy</span>
            </div>
            <span className="text-slate-600">·</span>
            <span>Vercel Optimized</span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} image.abishek.in. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with modern Next.js 15, Canvas & WebCodecs
          </p>
        </div>
      </div>
    </footer>
  );
};
