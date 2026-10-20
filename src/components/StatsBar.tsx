"use client";

import React from "react";
import { Download, Trash2, HardDrive, ArrowDownRight, CheckCircle2, Loader2, Sparkles, FolderArchive } from "lucide-react";
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
    <div className="w-full bg-gradient-to-r from-surface-card via-surface-card to-surface-subtle border-2 border-brand-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 items-center">
          {/* Total Saved */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ArrowDownRight className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Total Saved
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                  {formatBytes(stats.totalSavedBytes)}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  -{stats.savedPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Size Reduction */}
          <div className="flex items-center gap-3.5 border-l border-surface-border pl-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 flex-shrink-0">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Size Comparison
              </p>
              <p className="text-xs sm:text-sm font-mono text-slate-200 mt-0.5">
                <span className="line-through text-slate-500 font-medium">
                  {formatBytes(stats.totalOriginalBytes)}
                </span>{" "}
                → <span className="font-bold text-white">{formatBytes(stats.totalCompressedBytes)}</span>
              </p>
            </div>
          </div>

          {/* Processed Count */}
          <div className="hidden sm:flex items-center gap-3.5 border-l border-surface-border pl-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Batch Progress
              </p>
              <p className="text-xs sm:text-sm font-mono text-white font-bold mt-0.5">
                {stats.processedCount} images ready
              </p>
            </div>
          </div>
        </div>

        {/* Right: Master Action Buttons */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onClearAll}
            className="px-5 py-3.5 rounded-2xl border border-surface-border bg-surface-subtle hover:bg-rose-500/10 hover:border-rose-500/40 hover:text-rose-400 text-slate-300 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Clear all images"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Queue</span>
          </button>

          <button
            onClick={onDownloadAllZip}
            disabled={isZipping || stats.processedCount === 0}
            className="flex-1 lg:flex-initial px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 active:scale-95 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>
                  Packaging ZIP {zipProgress !== undefined ? `(${zipProgress}%)` : "..."}
                </span>
              </>
            ) : (
              <>
                <FolderArchive className="w-5 h-5" />
                <span>Download All as ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
