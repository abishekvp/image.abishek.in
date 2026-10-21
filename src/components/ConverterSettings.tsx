"use client";

import React, { useState } from "react";
import {
  FileImage,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  FileCode,
  FileText,
  Layers,
  Palette,
  Maximize2,
  Check,
} from "lucide-react";
import { ConvertOptions, ConvertFormat, IcoSizeOption } from "@/types";

interface ConverterSettingsProps {
  options: ConvertOptions;
  onChange: (options: ConvertOptions) => void;
  onConvertAll: () => void;
  isConverting: boolean;
  imageCount: number;
}

const FORMAT_OPTIONS: {
  format: ConvertFormat;
  label: string;
  badge: string;
  desc: string;
  alpha: boolean;
}[] = [
  {
    format: "image/jpeg",
    label: "JPG / JPEG",
    badge: "Universal",
    desc: "Best compatibility, photography, and standard sharing.",
    alpha: false,
  },
  {
    format: "image/png",
    label: "PNG",
    badge: "Lossless",
    desc: "Pristine crisp graphics, logos & transparent background.",
    alpha: true,
  },
  {
    format: "image/webp",
    label: "WebP",
    badge: "Web Standard",
    desc: "High compression and full alpha transparency.",
    alpha: true,
  },
  {
    format: "image/avif",
    label: "AVIF",
    badge: "Next-Gen",
    desc: "Modern high-efficiency compression.",
    alpha: true,
  },
  {
    format: "application/pdf",
    label: "PDF",
    badge: "Document",
    desc: "Single or multi-page PDF document for printing.",
    alpha: false,
  },
  {
    format: "image/x-icon",
    label: "ICO",
    badge: "Favicon",
    desc: "Windows icon and website favicon.ico file.",
    alpha: true,
  },
  {
    format: "image/bmp",
    label: "BMP",
    badge: "Bitmap",
    desc: "Uncompressed raw Windows bitmap format.",
    alpha: false,
  },
];

const PRESETS = [
  {
    name: "PNG to JPG",
    format: "image/jpeg" as ConvertFormat,
    desc: "Convert transparent graphics into universal JPG with solid background.",
    bg: "#FFFFFF",
    quality: 92,
  },
  {
    name: "JPG to PNG",
    format: "image/png" as ConvertFormat,
    desc: "Convert photos into crisp, lossless PNG format.",
    bg: "#FFFFFF",
    quality: 100,
  },
  {
    name: "Any to WebP",
    format: "image/webp" as ConvertFormat,
    desc: "Modern web standard slashing up to 80% file size.",
    bg: "#FFFFFF",
    quality: 85,
  },
  {
    name: "Image to PDF",
    format: "application/pdf" as ConvertFormat,
    desc: "Turn images or receipts into printable PDF documents.",
    bg: "#FFFFFF",
    quality: 95,
  },
  {
    name: "Image to Favicon / ICO",
    format: "image/x-icon" as ConvertFormat,
    desc: "Generate website favicon or Windows app icon.",
    bg: "#FFFFFF",
    quality: 100,
  },
];

const BG_COLOR_PRESETS = [
  { label: "White", val: "#FFFFFF" },
  { label: "Black", val: "#000000" },
  { label: "Off-White", val: "#F8FAFC" },
  { label: "Dark Gray", val: "#0F172A" },
];

export const ConverterSettings: React.FC<ConverterSettingsProps> = ({
  options,
  onChange,
  onConvertAll,
  isConverting,
  imageCount,
}) => {
  const updateOption = <K extends keyof ConvertOptions>(
    key: K,
    val: ConvertOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: val,
    });
  };

  const isLossy =
    options.targetFormat === "image/jpeg" ||
    options.targetFormat === "image/webp" ||
    options.targetFormat === "image/avif";

  const isIco = options.targetFormat === "image/x-icon";
  const isPdf = options.targetFormat === "application/pdf";

  return (
    <div className="w-full bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8 transition-all">
      {/* Top Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-surface-border">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-surface-border flex items-center justify-center text-blue-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Image Converter Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Convert photos & graphics between JPG, PNG, WebP, AVIF, PDF, ICO & BMP formats. 100% private in your browser.
              </p>
            </div>
          </div>
        </div>

        {/* Global Action Button */}
        <div className="flex items-center gap-3">
          {imageCount > 0 && (
            <button
              onClick={onConvertAll}
              disabled={isConverting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isConverting ? "animate-spin" : ""}`} />
              <span>Convert All ({imageCount} images)</span>
            </button>
          )}
        </div>
      </div>

      {/* STEP 1: Quick Presets */}
      <div className="pt-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-3">
          <span className="w-5 h-5 rounded-md bg-surface-subtle text-blue-400 text-xs flex items-center justify-center font-bold border border-surface-border">
            1
          </span>
          Popular Conversion Presets
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {PRESETS.map((preset) => {
            const isSelected = options.targetFormat === preset.format;
            return (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  onChange({
                    ...options,
                    targetFormat: preset.format,
                    quality: preset.quality,
                    backgroundColor: preset.bg,
                  });
                }}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-surface-card border-2 border-blue-500 shadow-sm"
                    : "bg-surface-subtle/70 hover:bg-surface-subtle border-surface-border hover:border-slate-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{preset.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                    {preset.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 2: Choose Target Format */}
      <div className="mt-7 pt-6 border-t border-surface-border">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span className="w-5 h-5 rounded-md bg-surface-subtle text-blue-400 text-xs flex items-center justify-center font-bold border border-surface-border">
              2
            </span>
            Target Format for All Images
          </label>
          <span className="text-xs text-slate-400 hidden sm:inline">
            You can also change format per image in the queue below
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {FORMAT_OPTIONS.map((item) => {
            const isSelected = options.targetFormat === item.format;
            return (
              <button
                key={item.format}
                type="button"
                onClick={() => updateOption("targetFormat", item.format)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                    : "bg-surface-subtle/70 hover:bg-surface-subtle border-surface-border text-slate-300 hover:border-slate-500"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold tracking-tight">{item.label}</span>
                    <span
                      className={`text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-surface-card text-slate-400 border border-surface-border"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] leading-relaxed ${
                      isSelected ? "text-slate-100" : "text-slate-400"
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: Format Specific Settings Grid */}
      <div className="mt-7 pt-6 border-t border-surface-border grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Panel 1: Quality Control (when lossy) */}
        {isLossy ? (
          <div className="bg-surface-subtle/50 border border-surface-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                  Compression Quality
                </label>
                <span className="text-sm font-bold font-mono text-blue-400">
                  {options.quality}%
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Adjust output fidelity. 85-92% produces high visual clarity with optimal file size.
              </p>
              <input
                type="range"
                min={5}
                max={100}
                value={options.quality}
                onChange={(e) => updateOption("quality", parseInt(e.target.value))}
                className="w-full h-2.5 bg-surface-base rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono mt-1.5">
                <span>Tiny (5%)</span>
                <span>Balanced (75%)</span>
                <span>High (90%)</span>
                <span>Max (100%)</span>
              </div>
            </div>

            <div className="mt-3.5 flex flex-wrap gap-1.5 pt-3 border-t border-surface-border">
              {[60, 75, 85, 95].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => updateOption("quality", q)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                    options.quality === q
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-surface-base text-slate-400 hover:text-white border border-surface-border"
                  }`}
                >
                  {q}%
                </button>
              ))}
            </div>
          </div>
        ) : isIco ? (
          /* ICO Specific Sizes */
          <div className="bg-surface-subtle/50 border border-surface-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-amber-400" />
                  Icon Resolution (ICO)
                </label>
                <span className="text-xs font-mono font-bold text-amber-400">
                  {options.icoSize === "multi" ? "Multi (16+32+48+64)" : `${options.icoSize}×${options.icoSize}px`}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Choose standard favicon resolution or export multi-size ICO for browser tabs and desktop icons.
              </p>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { label: "16×16", val: 16 as IcoSizeOption },
                    { label: "32×32 (Favicon)", val: 32 as IcoSizeOption },
                    { label: "48×48", val: 48 as IcoSizeOption },
                    { label: "64×64", val: 64 as IcoSizeOption },
                    { label: "128×128", val: 128 as IcoSizeOption },
                    { label: "Multi-Size", val: "multi" as IcoSizeOption },
                  ]
                ).map((size) => (
                  <button
                    key={size.val.toString()}
                    type="button"
                    onClick={() => updateOption("icoSize", size.val)}
                    className={`p-2 rounded-lg text-center border text-xs font-semibold cursor-pointer transition-all ${
                      options.icoSize === size.val
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-surface-base text-slate-300 hover:bg-surface-hover border-surface-border"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : isPdf ? (
          /* PDF Page Configuration */
          <div className="bg-surface-subtle/50 border border-surface-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  PDF Page Layout
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase">
                  {options.pdfPageSize}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Fit page to exact image dimensions or format into standard printable paper sheets.
              </p>

              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { label: "Fit Image", val: "fit" as const },
                    { label: "A4 Sheet", val: "a4" as const },
                    { label: "US Letter", val: "letter" as const },
                  ]
                ).map((pg) => (
                  <button
                    key={pg.val}
                    type="button"
                    onClick={() => updateOption("pdfPageSize", pg.val)}
                    className={`p-2 rounded-lg text-center border text-xs font-semibold cursor-pointer transition-all ${
                      options.pdfPageSize === pg.val
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-surface-base text-slate-300 hover:bg-surface-hover border-surface-border"
                    }`}
                  >
                    {pg.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Lossless PNG Info */
          <div className="bg-surface-subtle/50 border border-surface-border rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Lossless Fidelity (PNG)
                </label>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  100% Lossless
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                PNG compresses pixel data losslessly with complete transparency support. Every pixel is preserved identically.
              </p>
            </div>
            <div className="mt-3.5 p-2.5 rounded-lg bg-surface-base border border-surface-border text-xs text-slate-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Alpha Channel Transparency Preserved</span>
            </div>
          </div>
        )}

        {/* Panel 2: Transparent Background Color */}
        <div className="bg-surface-subtle/50 border border-surface-border rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-300" />
                Background Color (Alpha Fill)
              </label>
              <div className="flex items-center gap-1.5">
                <div
                  className="w-4 h-4 rounded border border-white/40 shadow-sm"
                  style={{ backgroundColor: options.backgroundColor }}
                />
                <span className="text-xs font-mono text-slate-300 uppercase">
                  {options.backgroundColor}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              When converting transparent PNGs or SVGs into formats without transparency (like JPG or BMP), this color fills the background.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {BG_COLOR_PRESETS.map((bg) => (
                <button
                  key={bg.val}
                  type="button"
                  onClick={() => updateOption("backgroundColor", bg.val)}
                  className={`p-2 rounded-lg text-center border text-xs font-medium cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
                    options.backgroundColor.toLowerCase() === bg.val.toLowerCase()
                      ? "bg-surface-card border-blue-500 text-white font-semibold"
                      : "bg-surface-base text-slate-300 hover:bg-surface-hover border-surface-border"
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded border border-white/30"
                    style={{ backgroundColor: bg.val }}
                  />
                  <span>{bg.label}</span>
                </button>
              ))}
            </div>

            {/* Custom Color Input */}
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={options.backgroundColor}
                onChange={(e) => updateOption("backgroundColor", e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={options.backgroundColor}
                onChange={(e) => updateOption("backgroundColor", e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1 bg-surface-base px-3 py-1.5 rounded-lg border border-surface-border text-xs font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Panel 3: Dimension Scaling */}
        <div className="bg-surface-subtle/50 border border-surface-border rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-slate-300" />
                Resolution Scaling
              </label>
              <span className="text-xs font-mono text-slate-300 font-semibold">
                {options.scalePercent}% Size
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Optionally resize image dimensions during format conversion.
            </p>

            <div className="grid grid-cols-4 gap-2">
              {[100, 75, 50, 25].map((scale) => (
                <button
                  key={scale}
                  type="button"
                  onClick={() => updateOption("scalePercent", scale)}
                  className={`p-2 rounded-lg text-center border text-xs font-semibold cursor-pointer transition-all ${
                    options.scalePercent === scale
                      ? "bg-blue-600 border-blue-500 text-white shadow-sm"
                      : "bg-surface-base text-slate-300 hover:bg-surface-hover border-surface-border"
                  }`}
                >
                  {scale}%
                </button>
              ))}
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => updateOption("scalePercent", 150)}
                className="flex-1 py-1.5 rounded-lg bg-surface-base hover:bg-surface-hover border border-surface-border text-xs text-slate-300 cursor-pointer"
              >
                150% (Enlarge)
              </button>
              <button
                type="button"
                onClick={() => updateOption("scalePercent", 200)}
                className="flex-1 py-1.5 rounded-lg bg-surface-base hover:bg-surface-hover border border-surface-border text-xs text-slate-300 cursor-pointer"
              >
                200% (2x Scale)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
