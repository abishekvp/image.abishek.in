"use client";

import React from "react";
import {
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Loader2,
  Printer,
  FileImage,
  ArrowRight,
  Maximize2,
} from "lucide-react";
import { ProcessedImage } from "@/types";
import { formatBytes, getOutputFilename, getPrintDimensions, downloadBlob } from "@/lib/utils";

interface ImageCardProps {
  image: ProcessedImage;
  onRemove: (id: string) => void;
  onCompare: (image: ProcessedImage) => void;
  targetMime: string;
  dpi: number;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onRemove,
  onCompare,
  targetMime,
  dpi,
}) => {
  const isDone = image.status === "done" && image.compressedBlob;
  const isProcessing = image.status === "processing";

  const handleDownload = () => {
    if (!image.compressedBlob) return;
    const filename = getOutputFilename(
      image.name,
      targetMime,
      dpi === 300 ? "_300dpi_print" : "_compressed"
    );
    downloadBlob(image.compressedBlob, filename);
  };

  const printDim = getPrintDimensions(
    image.compressedWidth || image.originalWidth,
    image.compressedHeight || image.originalHeight,
    dpi
  );

  return (
    <div className="group relative bg-surface-card hover:bg-surface-card/90 border border-surface-border/90 hover:border-brand-500/50 rounded-2xl p-4 sm:p-5 transition-all shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      {/* Left: Thumbnail & High-res Details */}
      <div className="flex items-center gap-4 sm:gap-5 min-w-0 w-full md:w-auto">
        {/* Large Thumbnail */}
        <div
          onClick={() => isDone && onCompare(image)}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-surface-subtle border-2 border-surface-border flex-shrink-0 cursor-pointer shadow-md ${
            isDone ? "group-hover:border-brand-400 group-hover:scale-105 transition-all" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.compressedUrl || image.originalUrl}
            alt={image.name}
            className="w-full h-full object-cover"
          />

          {isProcessing && (
            <div className="absolute inset-0 bg-surface-base/80 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
            </div>
          )}

          {isDone && (
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Eye className="w-5 h-5 text-white drop-shadow" />
              <span className="text-[10px] text-white font-bold uppercase tracking-wider">
                Compare
              </span>
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
            <h4
              className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-lg"
              title={image.name}
            >
              {image.name}
            </h4>
            {isDone && (
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{image.compressionRatio}% saved</span>
              </span>
            )}
          </div>

          {/* Dimension specs & HD Print Indicator */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-xs text-slate-300">
            <span className="font-mono bg-surface-subtle px-2 py-0.5 rounded-md border border-surface-border text-slate-300">
              {image.compressedWidth || image.originalWidth} × {image.compressedHeight || image.originalHeight} px
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono font-medium">
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {printDim.inches} ({dpi} DPI)
              </span>
            </span>

            {image.processingTimeMs && (
              <span className="text-slate-500 font-mono text-[11px]">
                Processed in {image.processingTimeMs}ms
              </span>
            )}
          </div>

          {/* Size Comparison Bar */}
          <div className="mt-2.5 flex items-center gap-2.5 text-xs sm:text-sm font-mono">
            <span className="text-slate-500 font-medium">
              Original: {formatBytes(image.originalSize)}
            </span>
            {isDone && image.compressedSize !== undefined && (
              <>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="font-bold text-white bg-brand-500/20 px-2 py-0.5 rounded border border-brand-500/30">
                  {formatBytes(image.compressedSize)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5 self-end md:self-center w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-surface-border">
        {isDone && (
          <button
            onClick={() => onCompare(image)}
            className="px-4 py-2.5 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Compare Slider</span>
          </button>
        )}

        <button
          onClick={handleDownload}
          disabled={!isDone}
          className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-600/25 transition-all flex items-center gap-2 disabled:opacity-40 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        <button
          onClick={() => onRemove(image.id)}
          className="p-2.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Remove image from queue"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
