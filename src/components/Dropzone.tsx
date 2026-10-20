"use client";

import React, { useRef, useState, useEffect } from "react";
import { UploadCloud, ImagePlus, FileImage, ShieldCheck, Sparkles, Loader2, ArrowUpRight } from "lucide-react";
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
      e.target.value = "";
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer p-8 sm:p-14 lg:p-16 text-center flex flex-col items-center justify-center ${
          isDragging
            ? "border-brand-400 bg-brand-500/15 shadow-2xl shadow-brand-500/25 scale-[1.01]"
            : "border-surface-border/90 hover:border-brand-500/80 bg-surface-card/70 hover:bg-surface-card/95 shadow-xl"
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

        {/* Dynamic backdrop ambient lighting */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-brand-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none group-hover:from-brand-500/30 transition-all" />

        {/* Central Icon */}
        <div className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-surface-subtle via-surface-card to-surface-base border border-surface-border group-hover:border-brand-500/60 group-hover:scale-105 transition-all shadow-2xl">
          <UploadCloud className="w-12 h-12 text-brand-400 group-hover:text-brand-300 transition-colors" />
          <div className="absolute -bottom-2 -right-2 p-2 bg-gradient-to-tr from-brand-600 to-cyan-500 rounded-xl shadow-lg">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-3 tracking-tight">
          Drag & Drop Images Here
        </h3>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mb-7 leading-relaxed">
          Batch compress unlimited photos directly on your machine. Or click the button below to browse your files.
        </p>

        {/* Clear Primary Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-500 hover:from-brand-500 hover:to-cyan-400 active:scale-95 text-white text-sm sm:text-base font-bold shadow-xl shadow-brand-500/30 transition-all flex items-center gap-3 cursor-pointer mb-7"
        >
          <ImagePlus className="w-5 h-5" />
          <span>Select Images from Computer</span>
          <ArrowUpRight className="w-4 h-4 opacity-75" />
        </button>

        {/* Informational badges bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-subtle border border-surface-border">
            <FileImage className="w-4 h-4 text-cyan-400" />
            <span>JPG · PNG · WebP · AVIF · GIF · BMP</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-subtle border border-surface-border">
            <span className="font-mono bg-surface-card px-1.5 py-0.5 rounded text-[10px] text-brand-300 border border-brand-500/30">
              Ctrl+V
            </span>
            <span>Paste from clipboard</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>100% In-Browser · No Uploads</span>
          </span>
        </div>
      </div>

      {/* 4K Sample Selector Bar */}
      <div className="mt-5 p-4 rounded-2xl bg-surface-card/60 border border-surface-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>Don&apos;t have an image ready? Test with high-resolution 4K samples:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {SAMPLE_IMAGES.map((sample) => (
            <button
              key={sample.name}
              type="button"
              disabled={isLoadingSample}
              onClick={() => onSelectSample(sample)}
              className="px-4 py-2 rounded-xl bg-surface-subtle hover:bg-surface-hover border border-surface-border text-slate-200 hover:text-white transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer text-xs font-semibold"
            >
              {isLoadingSample ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-400" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-brand-400" />
              )}
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
