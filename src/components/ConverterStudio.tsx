"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import JSZip from "jszip";
import { Header } from "@/components/Header";
import { Dropzone } from "@/components/Dropzone";
import { ConverterSettings } from "@/components/ConverterSettings";
import { ConverterStatsBar } from "@/components/ConverterStatsBar";
import { ConverterCard } from "@/components/ConverterCard";
import { ComparisonModal } from "@/components/ComparisonModal";
import { PrintGuideModal } from "@/components/PrintGuideModal";
import { FeaturesSection } from "@/components/FeaturesSection";
import { FaqSection } from "@/components/FaqSection";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { Footer } from "@/components/Footer";
import {
  ConvertedImage,
  ConvertOptions,
  ConverterStats,
  ConvertFormat,
  ProcessedImage,
} from "@/types";
import { convertImage, mergeImagesToPdf } from "@/lib/imageConverter";
import { getConvertedFilename, downloadBlob } from "@/lib/utils";
import { SampleImage } from "@/lib/sampleImages";
import {
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const DEFAULT_OPTIONS: ConvertOptions = {
  targetFormat: "image/webp",
  quality: 85,
  backgroundColor: "#FFFFFF",
  icoSize: 32,
  scalePercent: 100,
  maintainAspectRatio: true,
  pdfPageSize: "fit",
  pdfOrientation: "auto",
};

export const ConverterStudio: React.FC = () => {
  const router = useRouter();
  const [images, setImages] = useState<ConvertedImage[]>([]);
  const [options, setOptions] = useState<ConvertOptions>(DEFAULT_OPTIONS);
  const [isConverting, setIsConverting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState<number>(0);
  const [isMergingPdf, setIsMergingPdf] = useState(false);
  const [inspectImage, setInspectImage] = useState<ProcessedImage | null>(null);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
        if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      });
    };
  }, [images]);

  // Compute aggregate converter statistics
  const stats: ConverterStats = useMemo(() => {
    let totalOrig = 0;
    let totalConverted = 0;
    let doneCount = 0;

    images.forEach((img) => {
      if (img.status === "done" && img.convertedSize !== undefined) {
        totalOrig += img.originalSize;
        totalConverted += img.convertedSize;
        doneCount++;
      }
    });

    return {
      totalOriginalBytes: totalOrig,
      totalConvertedBytes: totalConverted,
      totalFiles: images.length,
      convertedCount: doneCount,
    };
  }, [images]);

  // Convert a single image
  const processSingleConvert = useCallback(
    async (item: ConvertedImage, currentOptions: ConvertOptions): Promise<ConvertedImage> => {
      try {
        const itemOptions: ConvertOptions = {
          ...currentOptions,
          targetFormat: item.targetFormat || currentOptions.targetFormat,
          ...(item.customOptions || {}),
        };

        const result = await convertImage(item.file, itemOptions, item.originalType);
        const convUrl = URL.createObjectURL(result.blob);

        return {
          ...item,
          status: "done",
          progress: 100,
          convertedBlob: result.blob,
          convertedUrl: convUrl,
          convertedSize: result.blob.size,
          convertedWidth: result.width,
          convertedHeight: result.height,
          conversionTimeMs: result.durationMs,
        };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Conversion failed";
        return {
          ...item,
          status: "error",
          error: message,
        };
      }
    },
    []
  );

  // Convert all images to selected target format
  const handleConvertAll = useCallback(async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        targetFormat: options.targetFormat,
        status: "converting",
      }))
    );

    const converted = await Promise.all(
      images.map((img) =>
        processSingleConvert(
          { ...img, targetFormat: options.targetFormat },
          options
        )
      )
    );
    setImages(converted);
    setIsConverting(false);
  }, [images, options, processSingleConvert]);

  // Change individual card target format
  const handleChangeCardFormat = useCallback(
    async (id: string, newFormat: ConvertFormat) => {
      const target = images.find((img) => img.id === id);
      if (!target) return;

      setImages((prev) =>
        prev.map((img) =>
          img.id === id ? { ...img, targetFormat: newFormat, status: "converting" } : img
        )
      );

      const updated = await processSingleConvert(
        { ...target, targetFormat: newFormat },
        options
      );

      setImages((prev) => prev.map((img) => (img.id === id ? updated : img)));
    },
    [images, options, processSingleConvert]
  );

  // Add new files from dropzone
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setIsConverting(true);

      const newItems: ConvertedImage[] = await Promise.all(
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
            // fallback
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
            targetFormat: options.targetFormat,
            status: "converting" as const,
            progress: 0,
          };
        })
      );

      setImages((prev) => [...newItems, ...prev]);

      const converted = await Promise.all(
        newItems.map((item) => processSingleConvert(item, options))
      );

      setImages((prev) =>
        prev.map((img) => converted.find((p) => p.id === img.id) || img)
      );
      setIsConverting(false);
    },
    [options, processSingleConvert]
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
      if (target?.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      if (target?.originalUrl) URL.revokeObjectURL(target.originalUrl);
      return prev.filter((img) => img.id !== id);
    });
  };

  // Clear all images
  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.convertedUrl) URL.revokeObjectURL(img.convertedUrl);
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
    });
    setImages([]);
  };

  // Download all converted as ZIP
  const handleDownloadAllZip = async () => {
    const ready = images.filter((i) => i.status === "done" && i.convertedBlob);
    if (ready.length === 0) return;

    try {
      setIsZipping(true);
      setZipProgress(0);

      const zip = new JSZip();

      ready.forEach((img) => {
        if (img.convertedBlob) {
          const fname = getConvertedFilename(img.name, img.targetFormat);
          zip.file(fname, img.convertedBlob);
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

      downloadBlob(zipBlob, "converted_images.zip");
    } catch {
      alert("Failed to build ZIP archive. Please try downloading individual files.");
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // Merge converted images to PDF
  const handleMergeToPdf = async () => {
    const ready = images.filter((i) => i.status === "done" && i.convertedBlob);
    if (ready.length === 0) return;

    try {
      setIsMergingPdf(true);
      const pdfBlob = await mergeImagesToPdf(ready, options);
      downloadBlob(pdfBlob, "converted_collection.pdf");
    } catch {
      alert("Failed to generate merged PDF. Please ensure all images are loaded properly.");
    } finally {
      setIsMergingPdf(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-slate-100">
      <Header
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        activeTool="converter"
      />

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12">
        {/* 2-IN-1 STUDIO BANNER: Direct Routing Link to Compressor */}
        <div className="mb-8 p-3 sm:p-4 rounded-2xl bg-surface-card border border-surface-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white font-semibold text-xs uppercase tracking-wider">
              2-IN-1 STUDIO
            </span>
            <p className="text-xs sm:text-sm text-slate-300">
              Switch anytime between <strong>Universal Image Converter</strong> (JPG, PNG, WebP, PDF, ICO) and <strong>Image Compressor</strong> (300 DPI Print & Web).
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-subtle hover:bg-surface-hover border border-surface-border text-xs font-semibold text-blue-400 hover:text-white transition-all cursor-pointer self-end sm:self-auto"
          >
            <span>Switch to Compressor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-surface-border text-slate-300 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Client-Side Universal Image & Document Converter</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3 leading-tight">
            Universal Image Converter for{" "}
            <span className="text-blue-400">Web, Print & PDF</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Convert photos and graphics between JPG, PNG, WebP, AVIF, PDF, ICO, and BMP with intelligent transparency background replacement, custom quality, and batch ZIP or multi-page PDF export.
          </p>

          {/* DUAL-MODE SHOWCASE SELECTOR: Using Clean Route Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
            {/* Card 1: Compressor (Routes to /) */}
            <Link
              href="/"
              className="p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between bg-surface-card/60 hover:bg-surface-card border-surface-border hover:border-slate-500 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-subtle text-slate-300 group-hover:bg-blue-600/20 group-hover:text-blue-400 transition-colors">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        Image Compressor
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">300 DPI Print & Web Optimizer</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-subtle text-slate-400 border border-surface-border group-hover:text-white">
                    Select
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
                  Switch to size optimization
                </span>
                <span className="font-semibold text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors">
                  Open Compressor ➔
                </span>
              </div>
            </Link>

            {/* Card 2: Converter (Active) */}
            <div className="p-5 sm:p-6 rounded-2xl border-2 transition-all bg-surface-card border-blue-500 shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-600 text-white">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-white">
                        Image Converter
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">JPG, PNG, WebP, PDF, ICO & BMP</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-blue-600 text-white shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
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
                  {images.length > 0 ? `${images.length} images loaded` : "No images yet"}
                </span>
                <span className="font-semibold text-blue-400 flex items-center gap-1">
                  Currently Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Converter Settings */}
        <ConverterSettings
          options={options}
          onChange={setOptions}
          onConvertAll={handleConvertAll}
          isConverting={isConverting}
          imageCount={images.length}
        />

        {/* Dropzone */}
        <Dropzone
          onFilesSelected={handleFilesSelected}
          isLoadingSample={isLoadingSample}
          onSelectSample={handleSelectSample}
          activeTool="converter"
        />

        {/* Stats & Batch Actions Bar */}
        <div className="mt-8">
          <ConverterStatsBar
            stats={stats}
            onDownloadAllZip={handleDownloadAllZip}
            onMergeToPdf={handleMergeToPdf}
            onClearAll={handleClearAll}
            isZipping={isZipping}
            zipProgress={zipProgress}
            isMergingPdf={isMergingPdf}
          />
        </div>

        {/* Converter Image Queue */}
        {images.length > 0 && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                Conversion Queue ({images.length})
              </h3>
              <span className="text-xs text-slate-400">
                Individual target formats can be adjusted per card
              </span>
            </div>

            <div className="space-y-3">
              {images.map((img) => (
                <ConverterCard
                  key={img.id}
                  image={img}
                  onRemove={handleRemoveImage}
                  onCompare={setInspectImage}
                  onChangeFormat={handleChangeCardFormat}
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
        image={inspectImage}
        onClose={() => setInspectImage(null)}
        targetMime={options.targetFormat}
        dpi={72}
      />

      {/* Print Guide Modal (Navigates to Compressor if activated) */}
      <PrintGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
        onApplyPrintPreset={() => {
          setIsPrintGuideOpen(false);
          router.push("/?preset=hd-print");
        }}
      />

      <Footer
        onOpenPrintGuide={() => setIsPrintGuideOpen(true)}
        activeTool="converter"
      />
    </div>
  );
};
