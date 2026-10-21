"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UploadCloud,
  ImagePlus,
  FileImage,
  ShieldCheck,
  Sparkles,
  Loader2,
  ArrowUpRight,
  SlidersHorizontal,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { SAMPLE_IMAGES, SampleImage } from "@/lib/sampleImages";
import { ActiveTool } from "@/types";

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoadingSample?: boolean;
  onSelectSample: (sample: SampleImage) => void;
  activeTool?: ActiveTool;
  onSelectTool?: (tool: ActiveTool) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  isLoadingSample = false,
  onSelectSample,
  activeTool: propActiveTool,
  onSelectTool,
}) => {
  const pathname = usePathname();
  const activeTool: ActiveTool = pathname
    ? pathname.startsWith("/convert")
      ? "converter"
      : "compressor"
    : propActiveTool || "compressor";

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        onFilesSelected(files);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, [onFilesSelected]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
      e.target.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Embedded Action Bar: Clean Routing Switcher */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-surface-card border border-surface-border">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span>Active Studio Tool:</span>
        </div>

        <nav aria-label="Tool selection" className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/"
            onClick={() => onSelectTool?.("compressor")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTool === "compressor"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-surface-subtle hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Compress Images</span>
          </Link>

          <Link
            href="/convert"
            onClick={() => onSelectTool?.("converter")}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTool === "converter"
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-surface-subtle hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Convert Formats</span>
          </Link>
        </nav>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative rounded-3xl border-2 border-dashed transition-all duration-200 cursor-pointer p-8 sm:p-12 lg:p-14 text-center flex flex-col items-center justify-center ${
          isDragging
            ? "border-blue-500 bg-blue-950/20"
            : "border-surface-border hover:border-slate-500 bg-surface-card hover:bg-surface-card/90"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp,image/tiff,image/svg+xml"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Central Icon */}
        <div className="mb-5 flex items-center justify-center w-20 h-20 rounded-2xl bg-surface-subtle border border-surface-border group-hover:border-slate-600 transition-all shadow-sm">
          {activeTool === "converter" ? (
            <RefreshCw className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
          ) : (
            <UploadCloud className="w-10 h-10 text-blue-400 group-hover:text-blue-300 transition-colors" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2.5 tracking-tight">
          {activeTool === "converter"
            ? "Drag & Drop Images to Convert"
            : "Drag & Drop Images to Compress"}
        </h3>

        <p className="text-sm text-slate-300 max-w-xl mb-6 leading-relaxed">
          {activeTool === "converter"
            ? "Batch convert photos & graphics to JPG, PNG, WebP, AVIF, PDF, ICO, or BMP. 100% private in your browser."
            : "Shrink image file size up to 85% with 300 DPI print clarity, modern WebP/AVIF, or target KB limits."}
        </p>

        {/* Clear Primary Action Button: Solid Blue */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm sm:text-base font-semibold shadow-md transition-all flex items-center gap-2.5 cursor-pointer mb-6"
        >
          <ImagePlus className="w-5 h-5" />
          <span>
            {activeTool === "converter" ? "Select Images to Convert" : "Select Images to Compress"}
          </span>
          <ArrowUpRight className="w-4 h-4 opacity-80" />
        </button>

        {/* Quick Switcher Link inside Dropzone */}
        <Link
          href={activeTool === "compressor" ? "/convert" : "/"}
          onClick={(e) => {
            e.stopPropagation();
            onSelectTool?.(activeTool === "compressor" ? "converter" : "compressor");
          }}
          className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {activeTool === "compressor" ? (
            <>
              <span className="text-slate-400">Need to convert formats instead?</span>
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                Switch to Image Converter <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </>
          ) : (
            <>
              <span className="text-slate-400">Need to shrink file size without converting?</span>
              <span className="text-blue-400 font-semibold flex items-center gap-1">
                Switch to Image Compressor <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </>
          )}
        </Link>

        {/* Informational badges bar */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle border border-surface-border">
            <FileImage className="w-4 h-4 text-slate-400" />
            <span>JPG · PNG · WebP · AVIF · PDF · ICO · BMP</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle border border-surface-border">
            <span className="font-mono bg-surface-base px-1.5 py-0.5 rounded text-[10px] text-slate-300 border border-surface-border">
              Ctrl+V
            </span>
            <span>Paste from clipboard</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% In-Browser · Zero Uploads</span>
          </span>
        </div>
      </div>

      {/* Sample Selector Bar */}
      <div className="mt-4 p-3.5 rounded-2xl bg-surface-card border border-surface-border flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Don&apos;t have an image ready? Test with high-resolution sample photos:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              disabled={isLoadingSample}
              onClick={() => onSelectSample(sample)}
              className="px-3.5 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-200 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer text-xs font-medium"
            >
              {isLoadingSample ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-blue-500" />
              )}
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
