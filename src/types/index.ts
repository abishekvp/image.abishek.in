export type OutputFormat = 'original' | 'image/jpeg' | 'image/webp' | 'image/png' | 'image/avif';

export type CompressionPreset = 'hd-print' | 'balanced' | 'extreme' | 'target-size' | 'custom';

export type ResizeMode = 'none' | 'scale' | 'dimensions' | 'preset-screen' | 'preset-print';

export interface CompressionOptions {
  preset: CompressionPreset;
  format: OutputFormat;
  quality: number; // 1 - 100
  resizeMode: ResizeMode;
  scalePercent: number; // 10 - 100
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
  targetSizeKb?: number; // for target-size mode
  dpi: number; // e.g. 72, 150, 300, 600
  sharpen: boolean; // unsharp mask filter for crisp prints
  stripMetadata: boolean;
}

export interface ProcessedImage {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  originalUrl: string;

  // Processed state
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  error?: string;
  
  // Results
  compressedBlob?: Blob;
  compressedUrl?: string;
  compressedSize?: number;
  compressedWidth?: number;
  compressedHeight?: number;
  compressionRatio?: number; // % saved
  processingTimeMs?: number;

  // Specific options override (if user configures individual item)
  customOptions?: CompressionOptions;
}

export interface CompressionStats {
  totalOriginalBytes: number;
  totalCompressedBytes: number;
  totalSavedBytes: number;
  savedPercentage: number;
  processedCount: number;
}
