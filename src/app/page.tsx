"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import { Sparkles, Image as ImageIcon, Layers, SlidersHorizontal } from "lucide-react";

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

export default function Home() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [options, setOptions] = useState<CompressionOptions>(DEFAULT_OPTIONS);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState<number>(0);
  const [inspectImage, setInspectImage] = useState<ProcessedImage | null>(null);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);

  // Compute aggregate stats
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

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
        if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
      });
    };
  }, [images]);

  // Compress a single item
  const processSingleImage = useCallback(
    async (item: ProcessedImage, currentOptions: CompressionOptions): Promise<ProcessedImage> => {
      try {
        const result = await compressImage(item.file, currentOptions, item.originalType);
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

  // Add new files from dropzone
  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      setIsProcessing(true);

      // Preload image dimensions & build items
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
            status: "processing",
            progress: 0,
          };
        })
      );

      // Add to state immediately
      setImages((prev) => [...newItems, ...prev]);

      // Compress all newly added files in parallel
      const processedResults = await Promise.all(
        newItems.map((item) => processSingleImage(item, options))
      );

      // Update state with results
      setImages((prev) =>
        prev.map((img) => {
          const match = processedResults.find((p) => p.id === img.id);
          return match || img;
        })
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

  // Re-compress all images with updated options
  const handleApplyAll = useCallback(async () => {
    if (images.length === 0) return;

    setIsProcessing(true);

    // Set all to processing
    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        status: "processing",
      }))
    );

    const recompressed = await Promise.all(
      images.map((img) => processSingleImage(img, options))
    );

    setImages(recompressed);
    setIsProcessing(false);
  }, [images, options, processSingleImage]);

  // Remove individual image
  const handleRemoveImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        if (target.originalUrl) URL.revokeObjectURL(target.originalUrl);
        if (target.compressedUrl) URL.revokeObjectURL(target.compressedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });

    if (inspectImage?.id === id) {
      setInspectImage(null);
    }
  };

  // Clear all images
  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.originalUrl) URL.revokeObjectURL(img.originalUrl);
      if (img.compressedUrl) URL.revokeObjectURL(img.compressedUrl);
    });
    setImages([]);
    setInspectImage(null);
  };

  // Batch ZIP Download
  const handleDownloadAllZip = async () => {
    const readyImages = images.filter((i) => i.status === "done" && i.compressedBlob);
    if (readyImages.length === 0) return;

    try {
      setIsZipping(true);
      setZipProgress(0);

      const zip = new JSZip();
      const targetMime = options.format === "original" ? "image/jpeg" : options.format;

      readyImages.forEach((img) => {
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
        (metadata) => {
          setZipProgress(Math.round(metadata.percent));
        }
      );

      const zipName =
        options.preset === "hd-print"
          ? "hd_print_images_300dpi.zip"
          : "compressed_images.zip";

      downloadBlob(zipBlob, zipName);
    } catch {
      alert("Failed to build ZIP archive. Please try downloading individual files.");
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-slate-100">
      {/* Sticky Top Header */}
      <Header onOpenPrintGuide={() => setIsPrintGuideOpen(true)} />

      {/* Main Wide-Screen Content Container */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-8 xl:px-12 2xl:px-16 py-8 sm:py-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs sm:text-sm font-semibold mb-4 shadow-sm animate-in fade-in duration-300">
            <Sparkles className="w-4 h-4 text-brand-400" />
            <span>Professional In-Browser Image Compression & Print Studio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-5 leading-tight">
            Compress Images with Precision.{" "}
            <span className="bg-gradient-to-r from-brand-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent block sm:inline">
              Download 300 DPI HD Print.
            </span>
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Lossless and lossy compression for WebP, AVIF, JPEG, and PNG. Inject 300 DPI tags for physical photo printing, specify exact target sizes, or inspect pixel clarity with our split-screen comparison slider.
          </p>
        </div>

        {/* Compression Configuration Studio */}
        <CompressionSettings
          options={options}
          onChange={setOptions}
          onApplyAll={handleApplyAll}
          isProcessing={isProcessing}
          imageCount={images.length}
        />

        {/* Expansive Wide Dropzone */}
        <Dropzone
          onFilesSelected={handleFilesSelected}
          isLoadingSample={isLoadingSample}
          onSelectSample={handleSelectSample}
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

        {/* Image Queue List */}
        {images.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-brand-400" />
                Image Queue ({images.length})
              </h3>
              <span className="text-xs text-slate-400">
                Click <strong className="text-white">Compare Slider</strong> on any image to inspect fine pixel details
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

        {/* AdSense Unit */}
        <AdPlaceholder className="mt-14" />

        {/* Features & Architecture Grid */}
        <FeaturesSection />

        {/* Dedicated AdSense Banner Unit (Mid/Bottom) */}
        <AdPlaceholder slot="2000000002" className="mt-12 mb-6" />

        {/* Comprehensive FAQ Section */}
        <FaqSection />
      </main>

      {/* Interactive Split Comparison Modal */}
      <ComparisonModal
        image={inspectImage}
        onClose={() => setInspectImage(null)}
        targetMime={
          options.format === "original"
            ? inspectImage?.originalType || "image/jpeg"
            : options.format
        }
        dpi={options.dpi}
      />

      {/* 300 DPI Print Mastery Guide Modal */}
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

      {/* Footer */}
      <Footer onOpenPrintGuide={() => setIsPrintGuideOpen(true)} />
    </div>
  );
}
