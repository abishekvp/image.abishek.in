"use client";

import React from "react";
import {
  Download,
  Trash2,
  HardDrive,
  CheckCircle2,
  Loader2,
  FolderArchive,
  FileText,
} from "lucide-react";
import { ConverterStats } from "@/types";
import { formatBytes } from "@/lib/utils";

interface ConverterStatsBarProps {
  stats: ConverterStats;
  onDownloadAllZip: () => void;
  onMergeToPdf?: () => void;
  onClearAll: () => void;
  isZipping: boolean;
  isMergingPdf?: boolean;
  zipProgress?: number;
}

export const ConverterStatsBar: React.FC<ConverterStatsBarProps> = ({
  stats,
  onDownloadAllZip,
  onMergeToPdf,
  onClearAll,
  isZipping,
  isMergingPdf = false,
  zipProgress,
}) => {
  if (stats.convertedCount === 0) return null;

  return (
    <div className="w-full bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 shadow-sm mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 items-center">
          {/* Converted Count */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-blue-400 flex-shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Batch Ready
              </p>
              <p className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
                {stats.convertedCount} Files
              </p>
            </div>
          </div>

          {/* Size Comparison */}
          <div className="flex items-center gap-3.5 border-l border-surface-border pl-6">
            <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-slate-300 flex-shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Output File Size
              </p>
              <p className="text-xs sm:text-sm font-mono text-slate-200 mt-0.5">
                <span className="line-through text-slate-500 font-medium">
                  {formatBytes(stats.totalOriginalBytes)}
                </span>{" "}
                → <span className="font-bold text-white">{formatBytes(stats.totalConvertedBytes)}</span>
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="hidden sm:flex items-center gap-3.5 border-l border-surface-border pl-6">
            <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-emerald-400 flex-shrink-0">
              <span className="text-xs font-bold font-mono">100%</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Browser Processed
              </p>
              <p className="text-xs text-emerald-400 font-medium mt-0.5">
                Zero Cloud Uploads
              </p>
            </div>
          </div>
        </div>

        {/* Right: Master Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onClearAll}
            className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface-subtle hover:bg-rose-950/20 hover:border-rose-700 hover:text-rose-300 text-slate-300 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Clear all images"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>

          {/* Optional Merge to 1 PDF button */}
          {onMergeToPdf && stats.convertedCount > 1 && (
            <button
              onClick={onMergeToPdf}
              disabled={isMergingPdf}
              className="px-4 py-2.5 rounded-xl border border-surface-border bg-surface-subtle hover:bg-surface-hover text-slate-200 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              title="Combine all converted images into a single multi-page PDF document"
            >
              {isMergingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span>Merging PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Merge into 1 PDF</span>
                </>
              )}
            </button>
          )}

          {/* Download All as ZIP: Solid Blue */}
          <button
            onClick={onDownloadAllZip}
            disabled={isZipping || stats.convertedCount === 0}
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
