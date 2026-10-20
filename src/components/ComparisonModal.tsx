"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Split,
  Columns,
  Printer,
  Sparkles,
} from "lucide-react";
import { ProcessedImage } from "@/types";
import { formatBytes, getOutputFilename, getPrintDimensions, downloadBlob } from "@/lib/utils";

interface ComparisonModalProps {
  image: ProcessedImage | null;
  onClose: () => void;
  targetMime: string;
  dpi: number;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  image,
  onClose,
  targetMime,
  dpi,
}) => {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<"split" | "sideBySide">("split");
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = fit, 2 = 200%, 3 = 300%
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handlePointerMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPos(pos);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove);
      window.addEventListener("touchend", handlePointerUp);
    }
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  if (!image || !image.compressedUrl) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[90vh] bg-surface-card border border-surface-border rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border bg-surface-base/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-sm text-white truncate max-w-xs sm:max-w-md">
              {image.name}
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              {image.compressionRatio}% saved
            </span>
          </div>

          {/* Center: Controls */}
          <div className="hidden md:flex items-center gap-1.5 bg-surface-subtle p-1 rounded-xl border border-surface-border">
            <button
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "split" ? "bg-brand-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Split Slider</span>
            </button>
            <button
              onClick={() => setViewMode("sideBySide")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "sideBySide"
                  ? "bg-brand-600 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>

            <div className="h-4 w-px bg-surface-border mx-1" />

            {/* Zoom */}
            <button
              onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-slate-300 w-10 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-surface-subtle transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 bg-surface-base/95 overflow-hidden flex items-center justify-center p-4">
          {viewMode === "split" ? (
            /* Split Slider Comparison */
            <div
              ref={containerRef}
              className="relative max-w-full max-h-full select-none overflow-hidden rounded-xl border border-surface-border shadow-2xl flex items-center justify-center cursor-ew-resize"
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              {/* Zoom wrapper */}
              <div
                className="relative transition-transform duration-100 ease-out flex items-center justify-center"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: "center center",
                }}
              >
                {/* 1. Base Image: Compressed (Right side) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.compressedUrl}
                  alt="Compressed"
                  className="max-h-[70vh] max-w-full object-contain pointer-events-none block"
                  draggable={false}
                />

                {/* 2. Overlay Image: Original (Left side), clipped by sliderPos */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPos}%` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.originalUrl}
                    alt="Original"
                    className="max-h-[70vh] max-w-none object-contain pointer-events-none"
                    style={{
                      width: containerRef.current
                        ? `${containerRef.current.clientWidth}px`
                        : "100%",
                      height: "100%",
                    }}
                    draggable={false}
                  />
                </div>

                {/* Vertical Divider Line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-xl pointer-events-none z-20"
                  style={{ left: `${sliderPos}%` }}
                >
                  {/* Circular Handle */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-surface-base shadow-2xl flex items-center justify-center border-2 border-brand-500">
                    <Split className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Floating Labels */}
              <div className="absolute top-3 left-3 pointer-events-none z-30 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-slate-200">
                Original: <strong className="text-white">{formatBytes(image.originalSize)}</strong>
              </div>

              <div className="absolute top-3 right-3 pointer-events-none z-30 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
                Compressed:{" "}
                <strong className="text-white">
                  {formatBytes(image.compressedSize || 0)}
                </strong>{" "}
                (-{image.compressionRatio}%)
              </div>
            </div>
          ) : (
            /* Side by Side Mode */
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-2 overflow-auto">
              {/* Original Side */}
              <div className="flex flex-col bg-surface-card border border-surface-border rounded-xl p-3 overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border text-xs mb-2">
                  <span className="font-semibold text-slate-300">Original</span>
                  <span className="font-mono text-slate-400">
                    {formatBytes(image.originalSize)} · {image.originalWidth} × {image.originalHeight} px
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.originalUrl}
                    alt="Original"
                    className="max-h-[60vh] max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed Side */}
              <div className="flex flex-col bg-surface-card border border-emerald-500/30 rounded-xl p-3 overflow-hidden">
                <div className="flex items-center justify-between pb-2 border-b border-surface-border text-xs mb-2">
                  <span className="font-semibold text-emerald-400">Compressed Output</span>
                  <span className="font-mono text-emerald-300">
                    {formatBytes(image.compressedSize || 0)} (-{image.compressionRatio}%)
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.compressedUrl}
                    alt="Compressed"
                    className="max-h-[60vh] max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Details Footer */}
        <div className="px-5 py-3 border-t border-surface-border bg-surface-card flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-amber-300">
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              <span>
                HD Print Size: <strong>{printDim.inches}</strong> ({printDim.cm}) at{" "}
                <strong>{dpi} DPI</strong>
              </span>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              Format: <strong className="text-white uppercase">{targetMime.replace("image/", "")}</strong>
            </span>
            <span className="hidden sm:inline">·</span>
            <span>
              Processing Speed: <strong className="text-white">{image.processingTimeMs || 25}ms</strong>
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Drag the slider to compare fine pixel edges and noise clarity.
          </div>
        </div>
      </div>
    </div>
  );
};
