"use client";

import React, { useState } from "react";
import {
  Printer,
  Zap,
  Minimize2,
  Target,
  Sliders,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Check,
  HelpCircle,
  Maximize2,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
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
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Quick preset selections with clear friendly defaults
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
        quality: 60,
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

  // Helper for human quality description
  const getQualityLabel = (q: number) => {
    if (q >= 92) return { text: "Ultra HD Print Quality (Virtually Lossless)", color: "text-emerald-400" };
    if (q >= 80) return { text: "High Clarity (Recommended for Web & Social)", color: "text-cyan-400" };
    if (q >= 60) return { text: "Balanced (Smaller file, slight compression)", color: "text-amber-400" };
    return { text: "Maximum Compression (Smallest file size)", color: "text-rose-400" };
  };

  const qualityInfo = getQualityLabel(options.quality);

  return (
    <div className="w-full bg-surface-card border border-surface-border/80 rounded-3xl p-6 sm:p-8 xl:p-10 shadow-2xl mb-8 transition-all">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-surface-border/80">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Compression & Output Settings
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Select a preset goal below or customize quality, dimensions, format, and 300 DPI print options.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-3">
          {imageCount > 0 && (
            <button
              onClick={onApplyAll}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 active:scale-[0.98] text-white text-sm font-semibold shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? "animate-spin" : ""}`} />
              <span>Recompress All ({imageCount} images)</span>
            </button>
          )}
        </div>
      </div>

      {/* STEP 1: Presets Cards */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-3.5">
          <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 text-xs flex items-center justify-center font-bold">
              1
            </span>
            Choose Your Compression Goal
          </label>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Active: <strong className="text-white capitalize">{options.preset.replace("-", " ")}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* HD Print */}
          <button
            type="button"
            onClick={() => handlePresetSelect("hd-print")}
            className={`group p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "hd-print"
                ? "bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/50"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border hover:border-slate-600"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Printer className="w-4 h-4" />
                </div>
                {options.preset === "hd-print" ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-amber-400/80 uppercase">
                    300 DPI
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                HD Print (300 DPI)
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Injected 300 DPI tags, 95% quality & edge sharpening for photo paper.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-amber-300/80 font-mono">
              <span>95% Quality</span>
              <span>Photo Lab Ready</span>
            </div>
          </button>

          {/* Web Balanced */}
          <button
            type="button"
            onClick={() => handlePresetSelect("balanced")}
            className={`group p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "balanced"
                ? "bg-brand-500/10 border-brand-500 shadow-xl shadow-brand-500/10 ring-1 ring-brand-500/50"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border hover:border-slate-600"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                {options.preset === "balanced" ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-brand-300 bg-brand-500/20 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-brand-400 uppercase">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                Web Balanced
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Modern WebP at 82% quality. Super fast page loading with sharp graphics.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-brand-300 font-mono">
              <span>82% Quality</span>
              <span>~70% Saved</span>
            </div>
          </button>

          {/* Max Shrink */}
          <button
            type="button"
            onClick={() => handlePresetSelect("extreme")}
            className={`group p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "extreme"
                ? "bg-cyan-500/10 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border hover:border-slate-600"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Minimize2 className="w-4 h-4" />
                </div>
                {options.preset === "extreme" && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Maximum Shrink
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Maximum reduction up to 90% file size reduction for thumbnails & mobile.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-cyan-300 font-mono">
              <span>60% Quality</span>
              <span>~85% Saved</span>
            </div>
          </button>

          {/* Target File Size */}
          <button
            type="button"
            onClick={() => handlePresetSelect("target-size")}
            className={`group p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "target-size"
                ? "bg-emerald-500/10 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500/50"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border hover:border-slate-600"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                {options.preset === "target-size" && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Target File Size
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Guaranteed size limit for visa applications, government forms, and portals.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-emerald-300 font-mono">
              <span>Exact Limit</span>
              <span>{options.targetSizeKb || 500} KB max</span>
            </div>
          </button>

          {/* Custom Studio */}
          <button
            type="button"
            onClick={() => handlePresetSelect("custom")}
            className={`group p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              options.preset === "custom"
                ? "bg-violet-500/10 border-violet-500 shadow-xl shadow-violet-500/10 ring-1 ring-violet-500/50"
                : "bg-surface-subtle/50 hover:bg-surface-subtle border-surface-border hover:border-slate-600"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                {options.preset === "custom" && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                Custom Studio
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Fine-tune every parameter: format, custom resolution, DPI, and filters.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-violet-300 font-mono">
              <span>Full Control</span>
              <span>Manual Tuning</span>
            </div>
          </button>
        </div>
      </div>

      {/* Target Size Dedicated Banner (when Target Size mode is active) */}
      {options.preset === "target-size" && (
        <div className="mt-6 p-5 rounded-2xl bg-emerald-950/25 border-2 border-emerald-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Target Maximum File Size</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Our binary solver compresses iteratively until the output file fits strictly below this threshold.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-surface-base px-3 py-1.5 rounded-xl border border-emerald-500/40">
              <input
                type="number"
                min={10}
                max={50000}
                step={50}
                value={options.targetSizeKb || 500}
                onChange={(e) => updateOption("targetSizeKb", parseInt(e.target.value) || 100)}
                className="w-24 bg-transparent text-emerald-300 font-mono text-base font-bold text-right focus:outline-none"
              />
              <span className="text-xs font-semibold text-slate-400">KB</span>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5">
              {[100, 200, 500, 1000, 2000].map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => updateOption("targetSizeKb", kb)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    options.targetSizeKb === kb
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                      : "bg-surface-subtle hover:bg-surface-hover text-slate-300 border border-surface-border"
                  }`}
                >
                  {kb >= 1000 ? `${kb / 1000} MB` : `${kb} KB`}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Clear & Simple Primary Controls Grid */}
      <div className="mt-8 pt-8 border-t border-surface-border/80 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Card A: Output Format */}
        <div className="bg-surface-subtle/40 border border-surface-border/70 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center font-bold">
                  A
                </span>
                Output Format
              </label>
              <span className="text-[11px] text-cyan-400 font-mono">
                {options.format === "original" ? "Original Ext" : options.format.replace("image/", "").toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
              Choose the image format encoder. WebP is best for web, JPEG for print and universal sharing.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(
                [
                  { label: "Original", val: "original", hint: "Keep Type" },
                  { label: "WebP", val: "image/webp", hint: "★ Best Web" },
                  { label: "JPEG", val: "image/jpeg", hint: "★ Best Print" },
                  { label: "AVIF", val: "image/avif", hint: "Next-Gen" },
                  { label: "PNG", val: "image/png", hint: "Lossless" },
                ] as { label: string; val: OutputFormat; hint: string }[]
              ).map((fmt) => (
                <button
                  key={fmt.val}
                  type="button"
                  onClick={() => updateOption("format", fmt.val)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    options.format === fmt.val
                      ? "bg-brand-600 border-brand-400 text-white shadow-lg shadow-brand-600/30"
                      : "bg-surface-base/60 hover:bg-surface-hover border-surface-border text-slate-300"
                  }`}
                >
                  <div className="font-bold text-xs">{fmt.label}</div>
                  <div className="text-[10px] opacity-75">{fmt.hint}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card B: Quality & Compression Level */}
        <div className="bg-surface-subtle/40 border border-surface-border/70 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] flex items-center justify-center font-bold">
                  B
                </span>
                Quality Level
              </label>
              <span className={`text-base font-bold font-mono ${qualityInfo.color}`}>
                {options.quality}%
              </span>
            </div>

            <p className={`text-xs font-medium mb-4 ${qualityInfo.color}`}>
              {qualityInfo.text}
            </p>

            {/* Range Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={1}
                max={100}
                value={options.quality}
                onChange={(e) => updateOption("quality", parseInt(e.target.value))}
                className="w-full h-3 bg-surface-base rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>1% (Tiny)</span>
                <span>60%</span>
                <span>80% (Web)</span>
                <span>95% (Print)</span>
                <span>100%</span>
              </div>
            </div>

            {/* Quick Quality Shortcuts */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {[
                { q: 95, label: "95% (Print)" },
                { q: 85, label: "85% (Web)" },
                { q: 75, label: "75% (Medium)" },
                { q: 60, label: "60% (Max Small)" },
              ].map((item) => (
                <button
                  key={item.q}
                  type="button"
                  onClick={() => updateOption("quality", item.q)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    options.quality === item.q
                      ? "bg-brand-500 text-white"
                      : "bg-surface-base text-slate-400 hover:text-white border border-surface-border"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card C: Dimension Scaling & Sizing */}
        <div className="bg-surface-subtle/40 border border-surface-border/70 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-violet-500/20 text-violet-400 text-[10px] flex items-center justify-center font-bold">
                  C
                </span>
                Dimension Scaling
              </label>
              <span className="text-[11px] font-mono text-violet-400">
                {options.resizeMode === "scale" ? `${options.scalePercent}% Size` : "Original 1:1"}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3.5 leading-relaxed">
              Downscale high-resolution images to match standard screen or print resolutions.
            </p>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  updateOption("resizeMode", "none");
                  updateOption("scalePercent", 100);
                }}
                className={`p-2 rounded-xl text-center border text-xs font-semibold cursor-pointer transition-all ${
                  options.resizeMode === "none"
                    ? "bg-violet-600 border-violet-400 text-white shadow"
                    : "bg-surface-base/60 hover:bg-surface-hover border-surface-border text-slate-300"
                }`}
              >
                100% Original
              </button>

              <button
                type="button"
                onClick={() => {
                  updateOption("resizeMode", "scale");
                  updateOption("scalePercent", 75);
                }}
                className={`p-2 rounded-xl text-center border text-xs font-semibold cursor-pointer transition-all ${
                  options.resizeMode === "scale" && options.scalePercent === 75
                    ? "bg-violet-600 border-violet-400 text-white shadow"
                    : "bg-surface-base/60 hover:bg-surface-hover border-surface-border text-slate-300"
                }`}
              >
                75% Scale
              </button>

              <button
                type="button"
                onClick={() => {
                  updateOption("resizeMode", "scale");
                  updateOption("scalePercent", 50);
                }}
                className={`p-2 rounded-xl text-center border text-xs font-semibold cursor-pointer transition-all ${
                  options.resizeMode === "scale" && options.scalePercent === 50
                    ? "bg-violet-600 border-violet-400 text-white shadow"
                    : "bg-surface-base/60 hover:bg-surface-hover border-surface-border text-slate-300"
                }`}
              >
                50% Scale
              </button>
            </div>

            {/* Preset Resolution Buttons */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  updateOption("resizeMode", "dimensions");
                  updateOption("maxWidth", 3840);
                }}
                className="px-2 py-1 rounded bg-surface-base hover:bg-surface-hover border border-surface-border text-[11px] text-slate-300 cursor-pointer"
              >
                4K UHD (3840px)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOption("resizeMode", "dimensions");
                  updateOption("maxWidth", 1920);
                }}
                className="px-2 py-1 rounded bg-surface-base hover:bg-surface-hover border border-surface-border text-[11px] text-slate-300 cursor-pointer"
              >
                Full HD (1920px)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateOption("resizeMode", "dimensions");
                  updateOption("maxWidth", 1280);
                }}
                className="px-2 py-1 rounded bg-surface-base hover:bg-surface-hover border border-surface-border text-[11px] text-slate-300 cursor-pointer"
              >
                720p HD (1280px)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Print & Clarity Options Toggle */}
      <div className="mt-6 pt-5 border-t border-surface-border/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          {showAdvanced ? (
            <ChevronUp className="w-4 h-4 text-brand-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-brand-400" />
          )}
          <span>
            {showAdvanced ? "Hide" : "Show"} Advanced Print & Fine-Tuning Options (300 DPI, Sharpening Filter)
          </span>
        </button>

        {showAdvanced && (
          <div className="mt-4 p-5 rounded-2xl bg-surface-subtle/30 border border-surface-border/80 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
            {/* Print DPI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-amber-400" />
                  Print Density Tag (DPI)
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {options.dpi} DPI
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Embeds physical density tags in the JFIF/PNG header. Photo labs require 300 DPI for sharp prints.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[72, 150, 300, 600].map((dpiVal) => (
                  <button
                    key={dpiVal}
                    type="button"
                    onClick={() => updateOption("dpi", dpiVal)}
                    className={`py-2 px-3 rounded-xl text-center text-xs font-bold transition-all cursor-pointer ${
                      options.dpi === dpiVal
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                        : "bg-surface-base text-slate-300 hover:bg-surface-hover border border-surface-border"
                    }`}
                  >
                    {dpiVal} DPI
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Sharpening */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Unsharp Mask Sharpening
                </label>
                <span className="text-xs font-mono text-cyan-400">
                  {options.sharpen ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Restores high-frequency edge clarity lost when downscaling or printing on paper.
              </p>
              <label className="flex items-center gap-3 p-3 rounded-xl bg-surface-base border border-surface-border cursor-pointer hover:border-slate-500 transition-colors">
                <input
                  type="checkbox"
                  checked={options.sharpen}
                  onChange={(e) => updateOption("sharpen", e.target.checked)}
                  className="w-4 h-4 rounded accent-brand-500 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-200">
                  Apply subtle 3×3 convolution sharpening pass
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
