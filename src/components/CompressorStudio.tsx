"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import JSZip from "jszip";
import { Header } from "@/components/Header";
import { Dropzone } from "@/components/Dropzone";
import { CompressionSettings } from "@/components/CompressionSettings";
import { StatsBar } from "@/components/StatsBar";
import { ImageCard } from "@/components/ImageCard";
import { ComparisonModal } from "@/components/ComparisonModal";
import { PrintGuideModal } from "@/components/PrintGuideModal";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FaqSection } from "@/components/FaqSection";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { Footer } from "@/components/Footer";
import {
  ProcessedImage,
  CompressionOptions,
  CompressionStats,
} from "@/types";
import { compressImage } from "@/lib/imageCompressor";
import { getOutputFilename, downloadBlob } from "@/lib/utils";
import { SampleImage } from "@/lib/sampleImages";
import {
  Sparkles,
  Image as ImageIcon,
  SlidersHorizontal,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const DEFAULT_OPTIONS: CompressionOptions = {
  preset: "hd-print",
  format: "original",
  quality: 95,
  resizeMode: "none",
  scalePercent: 100,
  maintainAspectRatio: true,
  dpi: 300,
  sharpen: true,
  stripMetadata: false,
};

export const CompressorStudio: React.FC = () => {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState<number>(0);
  const [inspectImage, setInspectImage] = useState<ProcessedImage | null>(null);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Auto-apply preset if passed in query param
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preset") === "hd-print") {
        setOptions((prev) => ({
          ...prev,
          preset: "hd-print",
          format: "image/jpeg",
          quality: 95,
          dpi: 300,
          sharpen: true,
        }));
      }
    }
  }, []);

  // Clean up object URLs on unmount
  const imagesRef = useRef(images);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
        if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
      });
    };
  }, []);

  // Compute aggregate compression statistics
  const stats: CompressionStats = useMemo(() => {
    let totalOrig = 0;
    let totalComp = 0;
    let doneCount = 0;

    images.forEach((img) => {
      if (img.status === "done" && img.compressedSize !== undefined) {
        totalOrig += img.originalSize;
        totalComp += img.compressedSize;
        doneCount++;
      }
    });

    const saved = Math.max(0, totalOrig - totalComp);
    const pct = totalOrig > 0 ? Math.round((saved / totalOrig) * 100) : 0;

    return {
      totalOriginalBytes: totalOrig,
      totalCompressedBytes: totalComp,
      totalSavedBytes: saved,
      savedPercentage: pct,
      processedCount: doneCount,
    };
  }, [images]);

  // Compress a single image
  const processSingleImage = useCallback(
    async (item: ProcessedImage, currentOptions: CompressionOptions): Promise<ProcessedImage> => {
      try {
        const result = await compressImage(item.file, currentOptions, item.originalType);
        if (item.compressedUrl) {
          URL.revokeObjectURL(item.compressedUrl);
        }
        const compUrl = URL.createObjectURL(result.blob);
        const ratio = Math.max(
          0,
          Math.round(((item.originalSize - result.blob.size) / item.originalSize) * 100)
        );

        return {
          ...item,
          status: "done",
          progress: 100,
          compressedBlob: result.blob,
          compressedUrl: compUrl,
          compressedSize: result.blob.size,
          compressedWidth: result.width,
          compressedHeight: result.height,
          compressionRatio: ratio,
          processingTimeMs: result.durationMs,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Compression failed";
        return {
          ...item,
          status: "error",
          error: message,
        };
      }
    },
    []
  );

  // Apply compression options to all images
  const handleApplyAll = useCallback(async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setImages((prev) => prev.map((img) => ({ ...img, status: "processing" })));

    const recompressed = await Promise.all(
      images.map((img) => processSingleImage(img, options))
    );
    setImages(recompressed);
    setIsProcessing(false);
  }, [images, options, processSingleImage]);

  // Add new files from dropzone
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setIsProcessing(true);

      const newItems: ProcessedImage[] = await Promise.all(
        files.map(async (file) => {
          const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
          const origUrl = URL.createObjectURL(file);

          let width = 0;
          let height = 0;

          try {
            const img = new Image();
            img.src = origUrl;
            await new Promise((res) => {
              img.onload = () => {
                width = img.naturalWidth;
                height = img.naturalHeight;
                res(true);
              };
              img.onerror = () => res(false);
            });
          } catch {
            // fallback dimensions
          }

          return {
            id,
            file,
            name: file.name,
            originalSize: file.size,
            originalWidth: width,
            originalHeight: height,
            originalType: file.type || "image/jpeg",
            originalUrl: origUrl,
            status: "processing" as const,
            progress: 0,
          };
        })
      );

      setImages((prev) => [...newItems, ...prev]);

      const processed = await Promise.all(
        newItems.map((item) => processSingleImage(item, options))
      );

      setImages((prev) =>
        prev.map((img) => processed.find((p) => p.id === img.id) || img)
      );
      setIsProcessing(false);
    },
    [options, processSingleImage]
  );

  // Load sample image
  const handleSelectSample = async (sample: SampleImage) => {
    try {
      setIsLoadingSample(true);
      const res = await fetch(sample.url);
      const blob = await res.blob();
      const file = new File([blob], sample.name, { type: sample.type });
      await handleFilesSelected([file]);
    } catch {
      alert("Could not load sample image. Please try uploading your own image.");
    } finally {
      setIsLoadingSample(false);
    }
  };

  // Remove single image
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  // Clear all images
  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
    });
    setImages([]);
  };

  // Download all as ZIP
  const handleDownloadAllZip = async () => {
    const ready = images.filter((i) => i.status === "done" && i.compressedBlob);
    if (ready.length === 0) return;

    try {
      setIsZipping(true);
      setZipProgress(0);

      const zip = new JSZip();
      const targetMime = options.format === "original" ? "image/jpeg" : options.format;

      ready.forEach((img) => {
        if (img.compressedBlob) {
          const fname = getOutputFilename(
            img.name,
            targetMime,
            options.preset === "hd-print" ? "_300dpi_print" : "_compressed"
          );
          zip.file(fname, img.compressedBlob);
        }
      });

      const zipBlob = await zip.generateAsync(
        {
          type: "blob",
          compression: "DEFLATE",
          compressionOptions: { level: 6 },
        },
        (metadata) => setZipProgress(Math.round(metadata.percent))
      );

      const zipName =
        options.preset === "hd-print"
          ? "hd_print_images_300dpi.zip"
          : "compressed_images.zip";

      downloadBlob(zipBlob, zipName);
    } catch {
      alert("Failed to build ZIP archive. Please download individual files.");
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // Keep inspectImage in sync with images array if recompressed
  const activeInspectImage = useMemo(() => {
    if (!inspectImage) return null;
    return images.find((i) => i.id === inspectImage.id) || inspectImage;
  }, [images, inspectImage]);

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-slate-100">
      <Header
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        activeTool="compressor"
      />

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12">
        {/* 2-IN-1 STUDIO BANNER: Direct Routing Link to Converter */}
        <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-surface-card border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider">
              2-IN-1 STUDIO
            </span>
            <p className="text-xs sm:text-sm text-slate-300">
              Switch anytime between <strong>Image Compressor</strong> (300 DPI Print & Web) and <strong>Universal Image Converter</strong> (JPG, PNG, WebP, PDF, ICO).
            </p>
          </div>
          <Link
            href="/convert"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border text-xs font-semibold text-blue-400 hover:text-white transition-all cursor-pointer self-end sm:self-auto"
          >
            <span>Switch to Converter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-slate-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>In-Browser High-Definition Image Optimizer</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3 leading-tight">
            The Best Image Compressor for{" "}
            <span className="text-blue-400">Web & HD Print</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Shrink image file sizes by up to 85% without sacrificing quality. Download pristine 300 DPI print-ready photos or lightning-fast WebP & AVIF for modern web apps. 100% private in your browser.
          </p>

          {/* DUAL-MODE SHOWCASE SELECTOR: Using Clean Route Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            {/* Card 1: Compressor (Active) */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 transition-all bg-surface-card border-blue-500 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 text-white">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Image Compressor
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">300 DPI Print & Web Optimizer</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                  Shrink image sizes up to 85% with zero quality loss. Inject 300 DPI metadata for photo printing or export WebP.
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-300">
                    300 DPI Print
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-300">
                    WebP & AVIF
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-300">
                    Target KB Solver
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {images.length > 0 ? `${images.length} images loaded` : "No images yet"}
                </span>
                <span className="font-semibold text-blue-400 flex items-center gap-1">
                  Currently Active
                </span>
              </div>
            </div>

            {/* Card 2: Converter (Routes to /convert) */}
            <Link
              href="/convert"
              className="p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between bg-surface-card/60 hover:bg-surface-card border-surface-border hover:border-slate-500 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-subtle text-slate-300 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        Image Converter
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">JPG, PNG, WebP, PDF, ICO & BMP</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-subtle text-slate-400 border border-surface-border group-hover:text-white">
                    Select
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">
                  Convert between any format. Replace transparent backgrounds with solid colors, build multi-page PDFs, or generate favicons.
                </p>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-300">
                    PNG ⇄ JPG
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-300">
                    Merge to PDF
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-surface-subtle border border-surface-border text-slate-300">
                    Favicon .ICO
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Switch to format conversion
                </span>
                <span className="font-semibold text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors">
                  Open Converter ➔
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Compression Settings */}
        <CompressionSettings
          options={options}
          onChange={setOptions}
          onApplyAll={handleApplyAll}
          isProcessing={isProcessing}
          imageCount={images.length}
        />

        {/* Dropzone */}
        <Dropzone
          onFilesSelected={handleFilesSelected}
          isLoadingSample={isLoadingSample}
          onSelectSample={handleSelectSample}
          activeTool="compressor"
        />

        {/* Stats & Batch Actions Bar */}
        <div className="mt-8">
          <StatsBar
            stats={stats}
            onDownloadAllZip={handleDownloadAllZip}
            onClearAll={handleClearAll}
            isZipping={isZipping}
            zipProgress={zipProgress}
          />
        </div>

        {/* Compressor Image Queue */}
        {images.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-blue-400" />
                Compression Queue ({images.length})
              </h3>
              <span className="text-xs text-slate-400">
                Click <strong className="text-white">Compare Slider</strong> to inspect quality
              </span>
            </div>

            <div className="space-y-3">
              {images.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  onRemove={handleRemoveImage}
                  onCompare={setInspectImage}
                  targetMime={options.format === "original" ? img.originalType : options.format}
                  dpi={options.dpi}
                />
              ))}
            </div>
          </div>
        )}

        <AdPlaceholder className="mt-14" />
        <FeaturesSection />
        <AdPlaceholder slot="2000000002" className="mt-12 mb-6" />
        <FaqSection />
      </main>

      {/* Comparison Modal */}
      <ComparisonModal
        image={activeInspectImage}
        onClose={() => setInspectImage(null)}
        targetMime={
          options.format === "original"
            ? activeInspectImage?.originalType || "image/jpeg"
            : options.format
        }
        dpi={options.dpi}
      />

      {/* Print Guide Modal */}
      <PrintGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
        onApplyPrintPreset={() => {
          setOptions({
            ...options,
            preset: "hd-print",
            format: "image/jpeg",
            quality: 95,
            resizeMode: "none",
            scalePercent: 100,
            dpi: 300,
            sharpen: true,
            stripMetadata: false,
          });
          handleApplyAll();
        }}
      />

      <Footer
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        activeTool="compressor"
      />
    </div>
  );
};
