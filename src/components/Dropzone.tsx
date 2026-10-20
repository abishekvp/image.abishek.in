"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, ImagePlus, FileImage, ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { SAMPLE_IMAGES, SampleImage } from "@/lib/sampleImages";

interface DropzoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoadingSample?: boolean;
  onSelectSample: (sample: SampleImage) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({
  onFilesSelected,
  isLoadingSample = false,
  onSelectSample,
}) => {
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
      e.target.value = ""; // Reset for re-selection
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer p-8 sm:p-12 text-center flex flex-col items-center justify-center ${
          isDragging
            ? "border-brand-400 bg-brand-500/10 shadow-2xl shadow-brand-500/20 scale-[1.01]"
            : "border-surface-border hover:border-brand-500/60 bg-surface-card/60 hover:bg-surface-card/90"
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

        {/* Ambient background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-brand-500/15 transition-all" />

        {/* Animated icon circle */}
        <div className="relative mb-5 flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-b from-surface-subtle to-surface-card border border-surface-border group-hover:border-brand-500/50 group-hover:scale-105 transition-all shadow-xl">
          <UploadCloud className="w-10 h-10 text-brand-400 group-hover:text-brand-300 transition-colors" />
          <div className="absolute -bottom-1 -right-1 p-1 bg-brand-600 rounded-lg shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 tracking-tight">
          Drop your images here, or{" "}
          <span className="text-brand-400 underline decoration-brand-400/40 underline-offset-4 group-hover:text-brand-300">
            browse files
          </span>
        </h3>

        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          Supports JPEG, PNG, WebP, AVIF, GIF, BMP, TIFF. Lossless & Lossy compression with 300 DPI HD Print export.
        </p>

        {/* Badges bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border">
            <FileImage className="w-3.5 h-3.5 text-cyan-400" />
            Batch upload unlimited files
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-subtle border border-surface-border">
            <ImagePlus className="w-3.5 h-3.5 text-indigo-400" />
            Paste from clipboard (Ctrl+V)
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero server uploads (100% Private)
          </span>
        </div>
      </div>

      {/* Quick Sample Selector */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs text-slate-400">
        <span className="font-medium text-slate-500 uppercase tracking-wider text-[11px]">
          No images on hand? Test with 4K samples:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              disabled={isLoadingSample}
              onClick={() => onSelectSample(sample)}
              className="px-3 py-1.5 rounded-lg bg-surface-card hover:bg-surface-hover border border-surface-border text-slate-300 hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer text-xs"
            >
              {isLoadingSample ? (
                <Loader2 className="w-3 h-3 animate-spin text-brand-400" />
              ) : (
                <Sparkles className="w-3 h-3 text-brand-400" />
              )}
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
