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

// ==========================================
// IMAGE CONVERTER TYPES
// ==========================================

export type ConvertFormat =
  | 'image/jpeg'
  | 'image/png'
  | 'image/webp'
  | 'image/avif'
  | 'image/bmp'
  | 'image/x-icon'
  | 'application/pdf'
  | 'image/gif';

export type IcoSizeOption = 16 | 32 | 48 | 64 | 128 | 256 | 'multi';

export interface ConvertOptions {
  targetFormat: ConvertFormat;
  quality: number; // 1 - 100 (for lossy formats: jpeg, webp, avif)
  backgroundColor: string; // for jpeg / non-alpha target formats, e.g. '#FFFFFF'
  icoSize: IcoSizeOption;
  scalePercent: number; // 10 - 200
  maintainAspectRatio: boolean;
  maxWidth?: number;
  maxHeight?: number;
  pdfPageSize: 'fit' | 'a4' | 'letter';
  pdfOrientation: 'auto' | 'portrait' | 'landscape';
}

export interface ConvertedImage {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalType: string;
  originalUrl: string;

  // Conversion target & options override
  targetFormat: ConvertFormat;
  customOptions?: Partial<ConvertOptions>;

  // State
  status: 'idle' | 'converting' | 'done' | 'error';
  progress: number;
  error?: string;

  // Results
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  convertedWidth?: number;
  convertedHeight?: number;
  conversionTimeMs?: number;
}

export interface ConverterStats {
  totalOriginalBytes: number;
  totalConvertedBytes: number;
  totalFiles: number;
  convertedCount: number;
}

export type ActiveTool = 'compressor' | 'converter';

