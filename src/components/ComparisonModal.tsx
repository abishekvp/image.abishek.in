"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Split,
  Columns,
  Printer,
  Sparkles,
  ArrowRight,
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full ${
          isFullscreen
            ? "w-screen h-screen rounded-none max-w-none"
            : "w-[98vw] max-w-[1700px] h-[94vh] rounded-3xl"
        } bg-surface-card border border-surface-border flex flex-col overflow-hidden shadow-2xl transition-all`}
      >
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-surface-border bg-surface-base/80 backdrop-blur-md gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-base sm:text-lg text-white truncate max-w-xs sm:max-w-md lg:max-w-xl">
              {image.name}
            </h3>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono">
              -{image.compressionRatio}% saved
            </span>
          </div>

          {/* Center: View Controls */}
          <div className="flex items-center gap-2 bg-surface-subtle p-1.5 rounded-2xl border border-surface-border">
            <button
              onClick={() => setViewMode("split")}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === "split"
                  ? "bg-brand-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Split className="w-4 h-4" />
              <span>Split Slider</span>
            </button>
            <button
              onClick={() => setViewMode("sideBySide")}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === "sideBySide"
                  ? "bg-brand-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Columns className="w-4 h-4" />
              <span>Side-by-Side</span>
            </button>

            <div className="h-5 w-px bg-surface-border mx-1" />

            {/* Zoom Controls */}
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.25))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-bold text-slate-200 w-12 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(3, z + 0.25))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <button
              onClick={() => setZoomLevel(1)}
              className="px-2 py-1 rounded text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-surface-hover cursor-pointer"
              title="Reset Zoom to 100%"
            >
              Fit
            </button>

            <div className="h-5 w-px bg-surface-border mx-1" />

            {/* Fullscreen Toggle */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-hover cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Full Screen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download {dpi === 300 ? "HD Print (300 DPI)" : "Image"}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-surface-subtle transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Area */}
        <div className="relative flex-1 bg-surface-base/95 overflow-hidden flex items-center justify-center p-4">
          {viewMode === "split" ? (
            /* Split Slider View */
            <div
              ref={containerRef}
              className="relative max-w-full max-h-full select-none overflow-hidden rounded-2xl border-2 border-surface-border shadow-2xl flex items-center justify-center cursor-ew-resize"
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              {/* Zoom container */}
              <div
                className="relative transition-transform duration-75 ease-out flex items-center justify-center"
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
                  className="max-h-[76vh] max-w-full object-contain pointer-events-none block"
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
                    className="max-h-[76vh] max-w-none object-contain pointer-events-none"
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
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none z-20"
                  style={{ left: `${sliderPos}%` }}
                >
                  {/* Central Draggable Handle */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white text-surface-base shadow-2xl flex items-center justify-center border-2 border-brand-500 cursor-ew-resize">
                    <Split className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Floating Labels */}
              <div className="absolute top-4 left-4 pointer-events-none z-30 px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs font-mono text-slate-200">
                Original: <strong className="text-white">{formatBytes(image.originalSize)}</strong>
              </div>

              <div className="absolute top-4 right-4 pointer-events-none z-30 px-3.5 py-1.5 rounded-xl bg-emerald-950/85 backdrop-blur-md border border-emerald-500/40 text-xs font-mono text-emerald-300">
                Compressed:{" "}
                <strong className="text-white">
                  {formatBytes(image.compressedSize || 0)}
                </strong>{" "}
                (-{image.compressionRatio}%)
              </div>
            </div>
          ) : (
            /* Side-by-Side View */
            <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-6 p-4 overflow-auto">
              {/* Original Side */}
              <div className="flex flex-col bg-surface-card border border-surface-border rounded-2xl p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border text-xs sm:text-sm mb-3">
                  <span className="font-bold text-slate-300">Original Source</span>
                  <span className="font-mono text-slate-400">
                    {formatBytes(image.originalSize)} · {image.originalWidth} × {image.originalHeight} px
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.originalUrl}
                    alt="Original"
                    className="max-h-[66vh] max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed Side */}
              <div className="flex flex-col bg-surface-card border-2 border-emerald-500/40 rounded-2xl p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border text-xs sm:text-sm mb-3">
                  <span className="font-bold text-emerald-400">Compressed Output</span>
                  <span className="font-mono text-emerald-300">
                    {formatBytes(image.compressedSize || 0)} (-{image.compressionRatio}%) ·{" "}
                    {image.compressedWidth} × {image.compressedHeight} px
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.compressedUrl}
                    alt="Compressed"
                    className="max-h-[66vh] max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Details Footer */}
        <div className="px-6 py-4 border-t border-surface-border bg-surface-card flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-300">
          <div className="flex flex-wrap items-center gap-6">
            <span className="inline-flex items-center gap-2 text-amber-300">
              <Printer className="w-4 h-4 text-amber-400" />
              <span>
                HD Print Size: <strong>{printDim.inches}</strong> ({printDim.cm}) at{" "}
                <strong>{dpi} DPI</strong>
              </span>
            </span>

            <span>
              Format: <strong className="text-white uppercase">{targetMime.replace("image/", "")}</strong>
            </span>

            <span>
              Processing Speed: <strong className="text-white">{image.processingTimeMs || 25}ms</strong>
            </span>
          </div>

          <div className="text-xs text-slate-500">
            Drag slider left/right or use zoom controls to inspect microscopic pixel fidelity.
          </div>
        </div>
      </div>
    </div>
  );
};
