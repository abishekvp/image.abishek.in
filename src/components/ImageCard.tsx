"use client";

import React from "react";
import {
  Download,
  Trash2,
  SlidersHorizontal,
  Eye,
  CheckCircle,
  Loader2,
  Printer,
  FileImage,
  ArrowRight,
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
    const filename = getOutputFilename(image.name, targetMime);
    downloadBlob(image.compressedBlob, filename);
  };

  const printDim = getPrintDimensions(
    image.compressedWidth || image.originalWidth,
    image.compressedHeight || image.originalHeight,
    dpi
  );

  return (
    <div className="group relative bg-surface-card hover:bg-surface-card/90 border border-surface-border hover:border-surface-hover rounded-xl p-3.5 sm:p-4 transition-all shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
        {/* Thumbnail Preview */}
        <div
          onClick={() => isDone && onCompare(image)}
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-surface-subtle border border-surface-border flex-shrink-0 cursor-pointer ${
            isDone ? "group-hover:border-brand-500/50" : ""
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.compressedUrl || image.originalUrl}
            alt={image.name}
            className="w-full h-full object-cover"
          />

          {isProcessing && (
            <div className="absolute inset-0 bg-surface-base/70 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-5 h-5 text-brand-400 animate-spin" />
            </div>
          )}

          {isDone && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Eye className="w-5 h-5 text-white drop-shadow" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4
              className="text-sm font-semibold text-white truncate max-w-[200px] sm:max-w-xs"
              title={image.name}
            >
              {image.name}
            </h4>
            {isDone && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle className="w-3 h-3" />
                <span>{image.compressionRatio}% saved</span>
              </span>
            )}
          </div>

          {/* Dimensions & Print specs */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="font-mono">
              {image.compressedWidth || image.originalWidth} × {image.compressedHeight || image.originalHeight} px
            </span>

            <span className="inline-flex items-center gap-1 text-amber-300/90 font-mono">
              <Printer className="w-3 h-3 text-amber-400" />
              {printDim.inches} ({dpi} DPI)
            </span>

            {image.processingTimeMs && (
              <span className="text-slate-500 font-mono">{image.processingTimeMs}ms</span>
            )}
          </div>

          {/* Size Comparison */}
          <div className="mt-1.5 flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">{formatBytes(image.originalSize)}</span>
            {isDone && image.compressedSize !== undefined && (
              <>
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span className="font-bold text-white">
                  {formatBytes(image.compressedSize)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-surface-border">
        {isDone && (
          <button
            onClick={() => onCompare(image)}
            className="px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Inspect Before / After"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Compare</span>
          </button>
        )}

        <button
          onClick={handleDownload}
          disabled={!isDone}
          className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/20 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
          title="Download single compressed image"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download</span>
        </button>

        <button
          onClick={() => onRemove(image.id)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Remove from queue"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
