import jsPDF from "jspdf";
import { ConvertOptions, ConvertFormat, ConvertedImage } from "@/types";

/**
 * Check if the browser supports canvas export for a given MIME type
 */
function isMimeSupported(canvas: HTMLCanvasElement, mimeType: string): boolean {
  try {
    const dataUrl = canvas.toDataURL(mimeType);
    return dataUrl.startsWith(`data:${mimeType}`);
  } catch {
    return false;
  }
}

/**
 * Generate a standard 24-bit uncompressed Windows BMP Blob from ImageData
 */
export function createBmpBlob(imageData: ImageData): Blob {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // Each row in BMP must be padded to a multiple of 4 bytes
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize; // 14-byte file header + 40-byte DIB header

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // --- BMP File Header (14 bytes) ---
  view.setUint16(0, 0x4d42, false); // 'BM'
  view.setUint32(2, fileSize, true); // Total file size
  view.setUint16(6, 0, true); // Reserved 1
  view.setUint16(8, 0, true); // Reserved 2
  view.setUint32(10, 54, true); // Pixel array offset

  // --- DIB Header (BITMAPINFOHEADER - 40 bytes) ---
  view.setUint32(14, 40, true); // Header size
  view.setInt32(18, width, true); // Image width
  view.setInt32(22, height, true); // Positive height = bottom-up bitmap
  view.setUint16(26, 1, true); // Number of color planes
  view.setUint16(28, 24, true); // Bits per pixel (24-bit RGB)
  view.setUint32(30, 0, true); // Compression (0 = BI_RGB, uncompressed)
  view.setUint32(34, pixelArraySize, true); // Image size
  view.setInt32(38, 2835, true); // Horizontal resolution: 72 DPI (~2835 px/meter)
  view.setInt32(42, 2835, true); // Vertical resolution: 72 DPI
  view.setUint32(46, 0, true); // Colors in palette
  view.setUint32(50, 0, true); // Important colors

  const bytes = new Uint8Array(buffer);
  let offset = 54;

  // BMP pixels are stored bottom-to-top, left-to-right, BGR order
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      bytes[offset++] = data[i + 2]; // Blue
      bytes[offset++] = data[i + 1]; // Green
      bytes[offset++] = data[i]; // Red
    }
    // Zero padding for 4-byte row alignment
    const padding = rowSize - width * 3;
    for (let p = 0; p < padding; p++) {
      bytes[offset++] = 0;
    }
  }

  return new Blob([buffer], { type: "image/bmp" });
}

/**
 * Generate a standard Windows .ICO Blob containing PNG-encoded icon data.
 * Fully compatible with modern browsers, Windows icons, and favicon.ico standards.
 */
export async function createIcoBlob(
  canvas: HTMLCanvasElement,
  sizes: number[] = [32]
): Promise<Blob> {
  const entries: { width: number; height: number; pngBytes: Uint8Array }[] = [];

  for (const size of sizes) {
    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = size;
    iconCanvas.height = size;
    const ctx = iconCanvas.getContext("2d");
    if (!ctx) continue;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(canvas, 0, 0, size, size);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      iconCanvas.toBlob((b) => (b ? resolve(b) : reject()), "image/png");
    });
    const pngBuffer = await pngBlob.arrayBuffer();
    entries.push({
      width: size,
      height: size,
      pngBytes: new Uint8Array(pngBuffer),
    });
  }

  if (entries.length === 0) {
    throw new Error("Failed to render icon sizes");
  }

  // ICO header: 6 bytes
  // Directory entry per image: 16 bytes each
  const headerSize = 6;
  const dirSize = 16 * entries.length;
  let totalDataSize = 0;
  for (const entry of entries) {
    totalDataSize += entry.pngBytes.length;
  }

  const totalFileSize = headerSize + dirSize + totalDataSize;
  const buffer = new ArrayBuffer(totalFileSize);
  const view = new DataView(buffer);

  // --- ICO Header ---
  view.setUint16(0, 0, true); // Reserved (must be 0)
  view.setUint16(2, 1, true); // Resource Type (1 = ICO)
  view.setUint16(4, entries.length, true); // Number of images

  let dirOffset = headerSize;
  let dataOffset = headerSize + dirSize;

  for (const entry of entries) {
    // Width & height: 0 means 256px according to ICO spec
    view.setUint8(dirOffset, entry.width >= 256 ? 0 : entry.width);
    view.setUint8(dirOffset + 1, entry.height >= 256 ? 0 : entry.height);
    view.setUint8(dirOffset + 2, 0); // Palette count (0 = no palette)
    view.setUint8(dirOffset + 3, 0); // Reserved
    view.setUint16(dirOffset + 4, 1, true); // Color planes
    view.setUint16(dirOffset + 6, 32, true); // Bits per pixel (32-bit RGBA)
    view.setUint32(dirOffset + 8, entry.pngBytes.length, true); // Resource size
    view.setUint32(dirOffset + 12, dataOffset, true); // Data offset

    // Copy PNG bytes into the buffer
    const dest = new Uint8Array(buffer, dataOffset, entry.pngBytes.length);
    dest.set(entry.pngBytes);

    dataOffset += entry.pngBytes.length;
    dirOffset += 16;
  }

  return new Blob([buffer], { type: "image/x-icon" });
}

/**
 * Generate a PDF document from an array of images
 */
export async function createPdfFromImages(
  images: { dataUrl: string; width: number; height: number; format: string }[],
  options: {
    pageSize: "fit" | "a4" | "letter";
    orientation: "auto" | "portrait" | "landscape";
  }
): Promise<Blob> {
  if (images.length === 0) {
    throw new Error("No images provided for PDF conversion");
  }

  let doc: jsPDF | null = null;

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    const isLandscape = img.width > img.height;
    const orientation =
      options.orientation === "auto"
        ? isLandscape
          ? "landscape"
          : "portrait"
        : options.orientation;

    if (i === 0) {
      if (options.pageSize === "fit") {
        doc = new jsPDF({
          orientation,
          unit: "pt",
          format: [img.width, img.height],
        });
        doc.addImage(img.dataUrl, img.format === "image/png" ? "PNG" : "JPEG", 0, 0, img.width, img.height);
      } else {
        doc = new jsPDF({
          orientation,
          unit: "pt",
          format: options.pageSize === "a4" ? "a4" : "letter",
        });
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const scale = Math.min(pageWidth / img.width, pageHeight / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const x = (pageWidth - drawW) / 2;
        const y = (pageHeight - drawH) / 2;
        doc.addImage(img.dataUrl, img.format === "image/png" ? "PNG" : "JPEG", x, y, drawW, drawH);
      }
    } else if (doc) {
      if (options.pageSize === "fit") {
        doc.addPage([img.width, img.height], orientation);
        doc.addImage(img.dataUrl, img.format === "image/png" ? "PNG" : "JPEG", 0, 0, img.width, img.height);
      } else {
        doc.addPage(options.pageSize === "a4" ? "a4" : "letter", orientation);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const scale = Math.min(pageWidth / img.width, pageHeight / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const x = (pageWidth - drawW) / 2;
        const y = (pageHeight - drawH) / 2;
        doc.addImage(img.dataUrl, img.format === "image/png" ? "PNG" : "JPEG", x, y, drawW, drawH);
      }
    }
  }

  if (!doc) {
    throw new Error("PDF generation failed");
  }

  return doc.output("blob");
}

/**
 * Calculate dimensions based on ConvertOptions
 */
export function calculateConvertDimensions(
  origWidth: number,
  origHeight: number,
  options: ConvertOptions
): { width: number; height: number } {
  let width = origWidth;
  let height = origHeight;

  if (options.scalePercent && options.scalePercent !== 100) {
    const factor = options.scalePercent / 100;
    width = Math.max(1, Math.round(origWidth * factor));
    height = Math.max(1, Math.round(origHeight * factor));
  } else if (options.maxWidth || options.maxHeight) {
    const maxW = options.maxWidth || origWidth;
    const maxH = options.maxHeight || origHeight;

    if (options.maintainAspectRatio) {
      const ratio = Math.min(maxW / origWidth, maxH / origHeight, 1);
      width = Math.max(1, Math.round(origWidth * ratio));
      height = Math.max(1, Math.round(origHeight * ratio));
    } else {
      width = Math.max(1, Math.round(maxW));
      height = Math.max(1, Math.round(maxH));
    }
  }

  return { width, height };
}

/**
 * Convert a single image to the specified target format
 */
export async function convertImage(
  imageSource: Blob | File | HTMLImageElement,
  options: ConvertOptions,
  sourceMimeType: string = "image/jpeg"
): Promise<{
  blob: Blob;
  width: number;
  height: number;
  mimeType: string;
  durationMs: number;
}> {
  const startTime = performance.now();

  // Load image
  let img: HTMLImageElement;
  let objectUrlToRevoke: string | null = null;

  if (imageSource instanceof HTMLImageElement) {
    img = imageSource;
  } else {
    img = new Image();
    objectUrlToRevoke = URL.createObjectURL(imageSource);
    img.src = objectUrlToRevoke;
    await new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load source image for conversion"));
    });
  }

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  const targetFormat = options.targetFormat;
  let { width, height } = calculateConvertDimensions(origWidth, origHeight, options);

  // Setup Canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
    throw new Error("Could not initialize 2D canvas context");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Check if target format supports transparency
  const formatHasAlpha =
    targetFormat === "image/png" ||
    targetFormat === "image/webp" ||
    targetFormat === "image/avif" ||
    targetFormat === "image/x-icon";

  // For formats that do not support alpha (e.g. JPEG, BMP), fill background
  if (!formatHasAlpha) {
    ctx.fillStyle = options.backgroundColor || "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }

  // Draw source image
  ctx.drawImage(img, 0, 0, width, height);

  let finalBlob: Blob;
  const qualityDecimal = Math.max(0.01, Math.min(1, options.quality / 100));

  if (targetFormat === "image/bmp") {
    // BMP Conversion
    const imgData = ctx.getImageData(0, 0, width, height);
    finalBlob = createBmpBlob(imgData);
  } else if (targetFormat === "image/x-icon") {
    // ICO Conversion
    let icoSizes: number[] = [32];
    if (options.icoSize === "multi") {
      icoSizes = [16, 32, 48, 64];
    } else if (typeof options.icoSize === "number") {
      icoSizes = [options.icoSize];
    }
    finalBlob = await createIcoBlob(canvas, icoSizes);
  } else if (targetFormat === "application/pdf") {
    // PDF Conversion
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    finalBlob = await createPdfFromImages(
      [
        {
          dataUrl,
          width,
          height,
          format: "image/jpeg",
        },
      ],
      {
        pageSize: options.pdfPageSize,
        orientation: options.pdfOrientation,
      }
    );
  } else {
    // Standard Canvas toBlob conversion
    let exportMime = targetFormat;
    if (exportMime === "image/avif" && !isMimeSupported(canvas, "image/avif")) {
      exportMime = "image/webp"; // Graceful fallback
    }

    finalBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error(`Failed to convert image to ${exportMime}`));
        },
        exportMime,
        exportMime === "image/png" ? undefined : qualityDecimal
      );
    });
  }

  if (objectUrlToRevoke) {
    URL.revokeObjectURL(objectUrlToRevoke);
  }

  const durationMs = Math.round(performance.now() - startTime);

  return {
    blob: finalBlob,
    width,
    height,
    mimeType: targetFormat,
    durationMs,
  };
}

/**
 * Merge multiple converted images into a single combined PDF document
 */
export async function mergeImagesToPdf(
  images: ConvertedImage[],
  options: ConvertOptions
): Promise<Blob> {
  const readyImages = images.filter((img) => img.convertedBlob || img.originalUrl);
  if (readyImages.length === 0) {
    throw new Error("No images available to create merged PDF");
  }

  const loadedImages: {
    dataUrl: string;
    width: number;
    height: number;
    format: string;
  }[] = [];

  for (const item of readyImages) {
    const img = new Image();
    const sourceUrl = item.convertedUrl || item.originalUrl;
    img.src = sourceUrl;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;

    // Draw to canvas to get standard JPEG dataURL
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    ctx.fillStyle = options.backgroundColor || "#FFFFFF";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    loadedImages.push({
      dataUrl,
      width: w,
      height: h,
      format: "image/jpeg",
    });
  }

  return createPdfFromImages(loadedImages, {
    pageSize: options.pdfPageSize,
    orientation: options.pdfOrientation,
  });
}
