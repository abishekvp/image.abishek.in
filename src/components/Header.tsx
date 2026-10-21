"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  Printer,
  SlidersHorizontal,
  RefreshCw,
  Layers,
} from "lucide-react";
import { ActiveTool } from "@/types";

interface HeaderProps {
  onOpenPrintGuide: () => void;
  activeTool?: ActiveTool;
  onSelectTool?: (tool: ActiveTool) => void;
}

export const Header: React.FC<HeaderProps> = ({
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
    <header className="border-b border-surface-border bg-surface-base/90 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white shadow-sm group-hover:bg-blue-500 transition-colors">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                Image<span className="text-blue-400">Pro</span>
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-subtle text-slate-300 border border-surface-border">
                Studio
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden md:block">
              image.abishek.in · Compressor & Converter
            </p>
          </div>
        </Link>

        {/* Center: Clean Segmented Tool Switcher using Real Routing */}
        <nav aria-label="Tool Navigation" className="flex items-center p-1 bg-surface-card border border-surface-border rounded-xl">
          <Link
            href="/"
            onClick={() => onSelectTool?.("compressor")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === "compressor"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-surface-subtle"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compressor</span>
          </Link>

          <Link
            href="/convert"
            onClick={() => onSelectTool?.("converter")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeTool === "converter"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-surface-subtle"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Converter</span>
          </Link>
        </nav>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-card border border-surface-border text-slate-300 text-xs font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% In-Browser</span>
          </div>

          <button
            onClick={onOpenPrintGuide}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-200 hover:text-white text-xs font-medium transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">300 DPI Print Guide</span>
            <span className="sm:hidden">Print Guide</span>
          </button>
        </div>
      </div>
    </header>
  );
};
