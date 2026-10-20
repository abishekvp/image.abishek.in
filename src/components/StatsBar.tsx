"use client";

import React from "react";
import { Download, Trash2, HardDrive, ArrowDownRight, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { CompressionStats } from "@/types";
import { formatBytes } from "@/lib/utils";

interface StatsBarProps {
  stats: CompressionStats;
  onDownloadAllZip: () => void;
  onClearAll: () => void;
  isZipping: boolean;
  zipProgress?: number;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  onDownloadAllZip,
  onClearAll,
  isZipping,
  zipProgress,
}) => {
  if (stats.processedCount === 0) return null;

  return (
    <div className="w-full bg-gradient-to-r from-surface-card via-surface-card to-surface-subtle border border-brand-500/30 rounded-2xl p-4 sm:p-5 shadow-xl mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Summary Metrics */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          {/* Total Saved */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Total Saved
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                  {formatBytes(stats.totalSavedBytes)}
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  -{stats.savedPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Size Reduction */}
          <div className="hidden sm:block h-8 w-px bg-surface-border" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                Size Reduction
              </p>
              <p className="text-xs sm:text-sm font-mono text-slate-200">
                <span className="line-through text-slate-500">
                  {formatBytes(stats.totalOriginalBytes)}
                </span>{" "}
                → <span className="font-bold text-white">{formatBytes(stats.totalCompressedBytes)}</span>
              </p>
            </div>
          </div>

          <div className="hidden lg:block h-8 w-px bg-surface-border" />

          {/* Processed Count */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>
              <strong className="text-white">{stats.processedCount}</strong> images processed
            </span>
          </div>
        </div>

        {/* Right: Master Actions */}
        <div className="flex items-center gap-2.5 sm:self-center">
          <button
            onClick={onClearAll}
            className="px-3.5 py-2.5 rounded-xl border border-surface-border bg-surface-subtle hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-400 text-slate-400 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Clear all images"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>

          <button
            onClick={onDownloadAllZip}
            disabled={isZipping || stats.processedCount === 0}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  Creating ZIP {zipProgress !== undefined ? `(${zipProgress}%)` : "..."}
                </span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download All as ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
