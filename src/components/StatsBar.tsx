"use client";

import React from "react";
import {
  Download,
  Trash2,
  HardDrive,
  ArrowDownRight,
  CheckCircle2,
  Loader2,
  FolderArchive,
} from "lucide-react";
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
    <div className="w-full bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 items-center">
          {/* Total Saved */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-emerald-400 flex-shrink-0">
              <ArrowDownRight className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Total Saved
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                  {formatBytes(stats.totalSavedBytes)}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                  -{stats.savedPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Size Reduction */}
          <div className="flex items-center gap-3.5 border-l border-surface-border pl-6">
            <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-blue-400 flex-shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
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
            <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-slate-300 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
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
            className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface-subtle hover:bg-rose-950/20 hover:border-rose-700 hover:text-rose-300 text-slate-300 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Clear all images"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Queue</span>
          </button>

          <button
            onClick={onDownloadAllZip}
            disabled={isZipping || stats.processedCount === 0}
            className="flex-1 lg:flex-initial px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>
                  Packaging ZIP {zipProgress !== undefined ? `(${zipProgress}%)` : "..."}
                </span>
              </>
            ) : (
              <>
                <FolderArchive className="w-4 h-4" />
                <span>Download All as ZIP</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
