"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, ShieldCheck, Printer, RefreshCw, SlidersHorizontal } from "lucide-react";
import { ActiveTool } from "@/types";

interface FooterProps {
  onOpenPrintGuide: () => void;
  activeTool?: ActiveTool;
  onSelectTool?: (tool: ActiveTool) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrintGuide,
  activeTool: propActiveTool,
  onSelectTool,
}) => {
  const pathname = usePathname();
  const activeTool: ActiveTool = pathname
    ? pathname.startsWith("/convert")
      ? "converter"
      : "compressor"
    : propActiveTool || "compressor";

  return (
    <footer className="mt-20 border-t border-surface-border/60 bg-surface-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-1.5 group">
              <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm text-white">
                Image<span className="text-blue-400">Pro</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">image.abishek.in</span>
            </Link>
            <p className="text-xs text-slate-400 max-w-md">
              High-definition image compression & format converter studio. Zero server uploads, instant client-side batch processing, true 300 DPI HD Print export, and universal format conversion.
            </p>
          </div>

          {/* Quick Tools & Links */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400">
            <Link
              href="/"
              onClick={() => onSelectTool?.("compressor")}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                activeTool === "compressor" ? "text-blue-400 font-bold" : ""
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Compressor</span>
            </Link>

            <Link
              href="/convert"
              onClick={() => onSelectTool?.("converter")}
              className={`hover:text-white transition-colors cursor-pointer flex items-center gap-1 ${
                activeTool === "converter" ? "text-cyan-400 font-bold" : ""
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Converter</span>
            </Link>

            <span className="text-slate-600">·</span>

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
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} image.abishek.in. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Free, fast & private image processing powered by modern Web APIs
          </p>
        </div>
      </div>
    </footer>
  );
};
