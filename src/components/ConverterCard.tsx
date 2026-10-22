"use client";

import React, { useState } from "react";
import {
  Download,
  Trash2,
  Eye,
  CheckCircle,
  Loader2,
  Copy,
  Check,
  ArrowRight,
  FileText,
  FileCode,
} from "lucide-react";
import { ConvertedImage, ConvertFormat, ProcessedImage } from "@/types";
import {
  formatBytes,
  getConvertedFilename,
  getFormatLabel,
  downloadBlob,
  copyBlobToClipboard,
} from "@/lib/utils";

interface ConverterCardProps {
  image: ConvertedImage;
  onRemove: (id: string) => void;
  onCompare: (image: ProcessedImage) => void;
  onChangeFormat: (id: string, format: ConvertFormat) => void;
}

const AVAILABLE_FORMATS: { format: ConvertFormat; label: string }[] = [
  { format: "image/jpeg", label: "JPG" },
  { format: "image/png", label: "PNG" },
  { format: "image/webp", label: "WEBP" },
  { format: "image/avif", label: "AVIF" },
  { format: "application/pdf", label: "PDF" },
  { format: "image/x-icon", label: "ICO" },
  { format: "image/bmp", label: "BMP" },
];

export const ConverterCard: React.FC<ConverterCardProps> = ({
  image,
  onRemove,
  onCompare,
  onChangeFormat,
}) => {
  const [copied, setCopied] = useState(false);
  const isDone = image.status === "done" && image.convertedBlob;
  const isConverting = image.status === "converting";

  const handleDownload = () => {
    if (!image.convertedBlob) return;
    const filename = getConvertedFilename(image.name, image.targetFormat);
    downloadBlob(image.convertedBlob, filename);
  };

  const handleCopy = async () => {
    if (!image.convertedBlob) return;
    const success = await copyBlobToClipboard(image.convertedBlob);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCompareClick = () => {
    if (!isDone || !image.convertedBlob) return;
    const ratio =
      image.convertedSize && image.originalSize
        ? Math.max(
            0,
            Math.round(
              ((image.originalSize - image.convertedSize) / image.originalSize) * 100
            )
          )
        : 0;
    const processedWrapper: ProcessedImage = {
      id: image.id,
      file: image.file,
      name: image.name,
      originalSize: image.originalSize,
      originalWidth: image.originalWidth,
      originalHeight: image.originalHeight,
      originalType: image.originalType,
      originalUrl: image.originalUrl,
      status: "done",
      progress: 100,
      compressedBlob: image.convertedBlob,
      compressedUrl: image.convertedUrl,
      compressedSize: image.convertedSize,
      compressedWidth: image.convertedWidth,
      compressedHeight: image.convertedHeight,
      compressionRatio: ratio,
      processingTimeMs: image.conversionTimeMs,
    };
    onCompare(processedWrapper);
  };

  const origFormatLabel = getFormatLabel(image.originalType);

  const sizeDiff =
    image.convertedSize && image.originalSize
      ? Math.round(((image.originalSize - image.convertedSize) / image.originalSize) * 100)
      : 0;

  return (
    <div className="group relative bg-surface-card hover:bg-surface-card/90 border border-surface-border hover:border-slate-500 rounded-2xl p-4 sm:p-5 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      {/* Left: Thumbnail & Details */}
      <div className="flex items-center gap-4 sm:gap-5 min-w-0 w-full md:w-auto">
        {/* Large Thumbnail */}
        <div
          onClick={handleCompareClick}
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-surface-subtle border border-surface-border flex-shrink-0 cursor-pointer ${
            isDone ? "group-hover:border-slate-400 group-hover:scale-105 transition-all" : ""
          }`}
        >
          {image.targetFormat === "application/pdf" ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-base text-slate-300 p-2 text-center">
              <FileText className="w-7 h-7 mb-1 text-slate-400" />
              <span className="text-[10px] font-bold">PDF DOC</span>
            </div>
          ) : image.targetFormat === "image/x-icon" ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-surface-base text-slate-300 p-2 text-center">
              <FileCode className="w-7 h-7 mb-1 text-slate-400" />
              <span className="text-[10px] font-bold">ICO ICON</span>
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={image.convertedUrl || image.originalUrl}
              alt={image.name}
              className="w-full h-full object-cover"
            />
          )}

          {isConverting && (
            <div className="absolute inset-0 bg-surface-base/80 backdrop-blur-xs flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          )}

          {isDone && image.targetFormat !== "application/pdf" && (
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
              <Eye className="w-5 h-5 text-white" />
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
              className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl"
              title={image.name}
            >
              {image.name}
            </h4>

            {isDone && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Ready</span>
              </span>
            )}
          </div>

          {/* Format Transition Badge: e.g. PNG -> JPG */}
          <div className="flex flex-wrap items-center gap-2 text-xs mb-2">
            <span className="font-mono font-semibold px-2 py-0.5 rounded bg-surface-subtle text-slate-300 border border-surface-border">
              {origFormatLabel}
            </span>

            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />

            {/* Inline Target Format Selector */}
            <div className="relative inline-flex items-center">
              <select
                value={image.targetFormat}
                onChange={(e) => onChangeFormat(image.id, e.target.value as ConvertFormat)}
                className="bg-surface-subtle hover:bg-surface-hover border border-surface-border text-white font-mono font-bold text-xs rounded-lg px-2.5 py-1 appearance-none pr-6 cursor-pointer focus:outline-none focus:border-blue-500"
              >
                {AVAILABLE_FORMATS.map((fmt) => (
                  <option key={fmt.format} value={fmt.format} className="bg-slate-900 text-white">
                    {fmt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {image.convertedWidth && image.convertedHeight && (
              <span className="font-mono text-slate-400 text-[11px]">
                ({image.convertedWidth} × {image.convertedHeight} px)
              </span>
            )}

            {image.conversionTimeMs && (
              <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">
                · {image.conversionTimeMs}ms
              </span>
            )}
          </div>

          {/* Size Comparison Bar */}
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-mono">
            <span className="text-slate-400">
              Original: {formatBytes(image.originalSize)}
            </span>
            {isDone && image.convertedSize !== undefined && (
              <>
                <ArrowRight className="w-3 h-3 text-slate-600" />
                <span className="font-bold text-white bg-surface-subtle px-2 py-0.5 rounded border border-surface-border">
                  {formatBytes(image.convertedSize)}
                </span>
                {sizeDiff > 0 ? (
                  <span className="text-[11px] font-semibold text-emerald-400">
                    (-{sizeDiff}%)
                  </span>
                ) : sizeDiff < 0 ? (
                  <span className="text-[11px] font-medium text-slate-400">
                    (+{Math.abs(sizeDiff)}%)
                  </span>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end md:self-center w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-surface-border">
        {/* Compare */}
        {isDone && image.targetFormat !== "application/pdf" && (
          <button
            onClick={handleCompareClick}
            className="px-3 py-2 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Inspect Before / After"
          >
            <Eye className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Compare</span>
          </button>
        )}

        {/* Copy to Clipboard */}
        {isDone && image.targetFormat !== "application/pdf" && (
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer"
            title="Copy converted image to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        )}

        {/* Download: Solid Blue */}
        <button
          onClick={handleDownload}
          disabled={!isDone}
          className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-40 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>

        {/* Remove */}
        <button
          onClick={() => onRemove(image.id)}
          className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
          title="Remove from converter queue"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
