"use client";

import React from "react";
import {
  Sparkles,
  Zap,
  Minimize2,
  Target,
  Sliders,
  Printer,
  FileCheck,
  RefreshCw,
  Lock,
  Unlock,
  Info,
} from "lucide-react";
import { CompressionOptions, CompressionPreset, OutputFormat, ResizeMode } from "@/types";

interface CompressionSettingsProps {
  options: CompressionOptions;
  onChange: (options: CompressionOptions) => void;
  onApplyAll: () => void;
  isProcessing: boolean;
  imageCount: number;
}

export const CompressionSettings: React.FC<CompressionSettingsProps> = ({
  options,
  onChange,
  onApplyAll,
  isProcessing,
  imageCount,
}) => {
  const handlePresetSelect = (preset: CompressionPreset) => {
    let updated: CompressionOptions = { ...options, preset };

    if (preset === "hd-print") {
      updated = {
        ...updated,
        format: "image/jpeg",
        quality: 95,
        resizeMode: "none",
        scalePercent: 100,
        dpi: 300,
        sharpen: true,
        stripMetadata: false,
      };
    } else if (preset === "balanced") {
      updated = {
        ...updated,
        format: "image/webp",
        quality: 82,
        resizeMode: "none",
        scalePercent: 100,
        dpi: 72,
        sharpen: false,
        stripMetadata: true,
      };
    } else if (preset === "extreme") {
      updated = {
        ...updated,
        format: "image/webp",
        quality: 62,
        resizeMode: "none",
        scalePercent: 100,
        dpi: 72,
        sharpen: false,
        stripMetadata: true,
      };
    } else if (preset === "target-size") {
      updated = {
        ...updated,
        format: "image/jpeg",
        targetSizeKb: updated.targetSizeKb || 500,
        resizeMode: "none",
        dpi: 72,
        sharpen: false,
      };
    }

    onChange(updated);
  };

  const updateOption = <K extends keyof CompressionOptions>(
    key: K,
    val: CompressionOptions[K]
  ) => {
    onChange({
      ...options,
      preset: options.preset === "target-size" && key === "targetSizeKb" ? "target-size" : "custom",
      [key]: val,
    });
  };

  return (
    <div className="w-full bg-surface-card border border-surface-border rounded-2xl p-5 sm:p-6 shadow-xl mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-surface-border">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-brand-400" />
            Compression & Export Studio
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Choose a professional preset or customize format, resolution, DPI and sharpening.
          </p>
        </div>

        {imageCount > 0 && (
          <button
            onClick={onApplyAll}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-lg shadow-brand-600/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
            <span>Apply to All ({imageCount})</span>
          </button>
        )}
      </div>

      {/* Preset Buttons */}
      <div className="pt-5">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-3">
          Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* HD Print */}
          <button
            type="button"
            onClick={() => handlePresetSelect("hd-print")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "hd-print"
                ? "bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/10"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                HD Print (300 DPI)
              </span>
              {options.preset === "hd-print" && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              300 DPI injection, unsharp sharpening & 95% quality for photo prints.
            </p>
          </button>

          {/* Web Balanced */}
          <button
            type="button"
            onClick={() => handlePresetSelect("balanced")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "balanced"
                ? "bg-brand-500/10 border-brand-500/60 shadow-lg shadow-brand-500/10"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-brand-400" />
                Web Balanced
              </span>
              {options.preset === "balanced" && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              WebP at 82% quality. Ideal balance of crispness & low bandwidth.
            </p>
          </button>

          {/* Extreme Shrink */}
          <button
            type="button"
            onClick={() => handlePresetSelect("extreme")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "extreme"
                ? "bg-cyan-500/10 border-cyan-500/60 shadow-lg shadow-cyan-500/10"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                <Minimize2 className="w-3.5 h-3.5 text-cyan-400" />
                Max Shrink
              </span>
              {options.preset === "extreme" && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Aggressive compression saving up to 85-90% file size.
            </p>
          </button>

          {/* Target File Size */}
          <button
            type="button"
            onClick={() => handlePresetSelect("target-size")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "target-size"
                ? "bg-emerald-500/10 border-emerald-500/60 shadow-lg shadow-emerald-500/10"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-400" />
                Target Size (KB)
              </span>
              {options.preset === "target-size" && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Binary search solver to guarantee max KB threshold (visa/portals).
            </p>
          </button>

          {/* Custom Pro */}
          <button
            type="button"
            onClick={() => handlePresetSelect("custom")}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "custom"
                ? "bg-violet-500/10 border-violet-500/60 shadow-lg shadow-violet-500/10"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border"
            }`}
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="font-semibold text-xs text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                Custom Studio
              </span>
              {options.preset === "custom" && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Fine-tune every aspect: quality, format, resize, DPI & filters.
            </p>
          </button>
        </div>
      </div>

      {/* Target Size Input when Target Size is active */}
      {options.preset === "target-size" && (
        <div className="mt-4 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white">Target Maximum File Size</p>
              <p className="text-[11px] text-slate-400">
                The algorithm will iteratively solve for the highest quality below this limit.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={10}
              max={50000}
              value={options.targetSizeKb || 500}
              onChange={(e) => updateOption("targetSizeKb", parseInt(e.target.value) || 100)}
              className="w-28 px-3 py-1.5 rounded-lg bg-surface-base border border-emerald-500/40 text-emerald-300 font-mono text-sm text-right focus:outline-none focus:border-emerald-400"
            />
            <span className="text-xs text-slate-400 font-semibold">KB</span>
            <div className="flex gap-1 ml-2">
              {[200, 500, 1000, 2000].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => updateOption("targetSizeKb", kb)}
                  className="px-2 py-1 rounded bg-surface-subtle hover:bg-surface-hover text-[11px] text-slate-300 border border-surface-border cursor-pointer"
                >
                  {kb >= 1000 ? `${kb / 1000}MB` : `${kb}KB`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Granular Controls */}
      <div className="mt-6 pt-6 border-t border-surface-border/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Format Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
            <span>Output Format</span>
            <span className="text-[10px] text-slate-500 uppercase">Encoder</span>
          </label>
          <div className="grid grid-cols-3 gap-1.5 bg-surface-subtle/80 p-1 rounded-xl border border-surface-border">
            {(
              [
                { label: "Original", val: "original" },
                { label: "WebP", val: "image/webp" },
                { label: "AVIF", val: "image/avif" },
                { label: "JPEG", val: "image/jpeg" },
                { label: "PNG", val: "image/png" },
              ] as { label: string; val: OutputFormat }[]
            ).map((fmt) => (
              <button
                key={fmt.val}
                type="button"
                onClick={() => updateOption("format", fmt.val)}
                className={`py-1.5 px-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  options.format === fmt.val
                    ? "bg-brand-600 text-white shadow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Quality Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">
              Quality:{" "}
              <span
                className={`font-mono font-bold ${
                  options.quality >= 85
                    ? "text-emerald-400"
                    : options.quality >= 60
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {options.quality}%
              </span>
            </label>
            <span className="text-[10px] text-slate-500">
              {options.quality >= 90
                ? "Near-Lossless"
                : options.quality >= 75
                ? "High Fidelity"
                : "High Compression"}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={options.quality}
            onChange={(e) => updateOption("quality", parseInt(e.target.value))}
            className="w-full h-2 bg-surface-subtle rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>Tiny size (1%)</span>
            <span>Balanced (80%)</span>
            <span>Pristine (100%)</span>
          </div>
        </div>

        {/* 3. Resize Mode & Scaling */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
            <span>Dimensions & Scale</span>
            <span className="text-[10px] font-mono text-cyan-400">
              {options.resizeMode === "scale" ? `${options.scalePercent}%` : "Original 1:1"}
            </span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={options.resizeMode}
              onChange={(e) => updateOption("resizeMode", e.target.value as ResizeMode)}
              className="w-1/2 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            >
              <option value="none">Original (100%)</option>
              <option value="scale">Scale %</option>
              <option value="dimensions">Max Dimensions</option>
            </select>

            {options.resizeMode === "scale" && (
              <input
                type="number"
                min={10}
                max={100}
                step={5}
                value={options.scalePercent}
                onChange={(e) => updateOption("scalePercent", parseInt(e.target.value) || 100)}
                className="w-1/2 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-200 text-center focus:outline-none"
              />
            )}

            {options.resizeMode === "dimensions" && (
              <div className="flex items-center gap-1 w-1/2">
                <input
                  type="number"
                  placeholder="Max W"
                  value={options.maxWidth || ""}
                  onChange={(e) =>
                    updateOption("maxWidth", parseInt(e.target.value) || undefined)
                  }
                  className="w-full px-2 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-200 text-center"
                />
              </div>
            )}

            {options.resizeMode === "none" && (
              <div className="w-1/2 text-[11px] text-slate-500 flex items-center justify-center">
                Full Resolution
              </div>
            )}
          </div>
        </div>

        {/* 4. Print DPI & Clarity Filter */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1">
              <Printer className="w-3.5 h-3.5 text-amber-400" />
              Print Resolution (DPI)
            </span>
            <span className="text-[10px] text-amber-400 font-mono font-semibold">
              {options.dpi} DPI
            </span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={options.dpi}
              onChange={(e) => updateOption("dpi", parseInt(e.target.value))}
              className="w-1/2 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-200 focus:outline-none"
            >
              <option value={72}>72 DPI (Web)</option>
              <option value={150}>150 DPI (Draft)</option>
              <option value={300}>300 DPI (HD Print)</option>
              <option value={600}>600 DPI (Fine Art)</option>
            </select>

            {/* Sharpen filter toggle */}
            <label className="w-1/2 flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-300 cursor-pointer hover:bg-surface-hover">
              <input
                type="checkbox"
                checked={options.sharpen}
                onChange={(e) => updateOption("sharpen", e.target.checked)}
                className="rounded accent-brand-500"
              />
              <span className="text-[11px] font-medium">Crisp Edges</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
