import { CompressionOptions } from "@/types";
import { injectDpiMetadata } from "./dpiMetadata";

/**
 * Check if the current browser supports canvas export for a given MIME type
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
 * Apply subtle unsharp mask sharpening filter for HD print crispness
 */
function applySharpenFilter(ctx: CanvasRenderingContext2D, width: number, height: number, strength: number = 0.3) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    // 3x3 Sharpen Kernel:
    // [  0, -1,  0 ]
    // [ -1,  5, -1 ]
    // [  0, -1,  0 ]
    const w = width;
    const h = height;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const i = (y * w + x) * 4;

        for (let c = 0; c < 3; c++) {
          const center = copy[i + c];
          const top = copy[((y - 1) * w + x) * 4 + c];
          const bottom = copy[((y + 1) * w + x) * 4 + c];
          const left = copy[(y * w + (x - 1)) * 4 + c];
          const right = copy[(y * w + (x + 1)) * 4 + c];

          // Laplacian high-pass
          const laplacian = 4 * center - (top + bottom + left + right);
          const sharpened = center + laplacian * strength;

          data[i + c] = Math.max(0, Math.min(255, sharpened));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // If security or tainted canvas happens, silently skip filter
  }
}

/**
 * Calculate output dimensions based on options
 */
export function calculateDimensions(
  origWidth: number,
  origHeight: number,
  options: CompressionOptions
): { width: number; height: number } {
  let width = origWidth;
  let height = origHeight;

  if (options.resizeMode === "scale" && options.scalePercent < 100) {
    const factor = options.scalePercent / 100;
    width = Math.max(1, Math.round(origWidth * factor));
    height = Math.max(1, Math.round(origHeight * factor));
  } else if (options.resizeMode === "dimensions" && (options.maxWidth || options.maxHeight)) {
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
 * Core image compressor engine
 */
export async function compressImage(
  imageSource: Blob | File | HTMLImageElement,
  options: CompressionOptions,
  sourceMimeType: string = "image/jpeg"
): Promise<{
  blob: Blob;
  width: number;
  height: number;
  mimeType: string;
  durationMs: number;
}> {
  const startTime = performance.now();

  // Load image element
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
      img.onerror = () => reject(new Error("Failed to load image"));
    });
  }

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  // Determine target dimensions
  let { width, height } = calculateDimensions(origWidth, origHeight, options);

  // Setup canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    if (objectUrlToRevoke) URL.revokeObjectURL(objectUrlToRevoke);
    throw new Error("Canvas context could not be created");
  }

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // Determine output MIME type
  let targetMime: string = options.format;
  if (targetMime === "original") {
    targetMime = sourceMimeType;
    // If source is SVG, GIF, BMP, fallback to WebP or PNG for best compression
    if (["image/svg+xml", "image/gif", "image/bmp", "image/tiff"].includes(targetMime)) {
      targetMime = "image/webp";
    }
  }

  // Handle transparent background for JPEG
  if (targetMime === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }

  // Draw image
  ctx.drawImage(img, 0, 0, width, height);

  // Apply sharpening if requested (ideal for print & downscaled images)
  if (options.sharpen) {
    applySharpenFilter(ctx, width, height, 0.35);
  }

  // Verify format support
  if (targetMime === "image/avif" && !isMimeSupported(canvas, "image/avif")) {
    targetMime = "image/webp"; // Fallback to WebP if AVIF canvas encoding is not yet enabled
  }

  // Function to create blob with given quality
  const createBlobAtQuality = async (q: number): Promise<Blob> => {
    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas blob conversion failed"));
        },
        targetMime,
        targetMime === "image/png" ? undefined : q
      );
    });
  };

  let finalBlob: Blob;
  const initialQuality = options.quality / 100;

  // Check if Target Size mode is active
  if (options.preset === "target-size" && options.targetSizeKb && options.targetSizeKb > 0) {
    const targetBytes = options.targetSizeKb * 1024;
    let minQ = 0.05;
    let maxQ = 0.98;
    let bestBlob: Blob | null = null;

    // Binary search over quality up to 6 iterations
    for (let iter = 0; iter < 6; iter++) {
      const midQ = (minQ + maxQ) / 2;
      const testBlob = await createBlobAtQuality(midQ);

      if (testBlob.size <= targetBytes) {
        bestBlob = testBlob;
        minQ = midQ; // try higher quality
      } else {
        maxQ = midQ; // reduce quality
      }
    }

    // If still larger than target even at lowest quality, scale down resolution
    if (!bestBlob || bestBlob.size > targetBytes) {
      let scale = 0.9;
      let currentBlob = bestBlob || (await createBlobAtQuality(0.2));

      while (currentBlob.size > targetBytes && scale >= 0.25) {
        const nextW = Math.max(50, Math.round(width * scale));
        const nextH = Math.max(50, Math.round(height * scale));

        const scaleCanvas = document.createElement("canvas");
        scaleCanvas.width = nextW;
        scaleCanvas.height = nextH;
        const scaleCtx = scaleCanvas.getContext("2d");
        if (scaleCtx) {
          scaleCtx.imageSmoothingEnabled = true;
          scaleCtx.imageSmoothingQuality = "high";
          if (targetMime === "image/jpeg") {
            scaleCtx.fillStyle = "#FFFFFF";
            scaleCtx.fillRect(0, 0, nextW, nextH);
          }
          scaleCtx.drawImage(canvas, 0, 0, nextW, nextH);

          currentBlob = await new Promise<Blob>((res, rej) => {
            scaleCanvas.toBlob(
              (b) => (b ? res(b) : rej()),
              targetMime,
              0.5
            );
          });
          width = nextW;
          height = nextH;
        }
        scale -= 0.15;
      }
      finalBlob = currentBlob;
    } else {
      finalBlob = bestBlob;
    }
  } else {
    // Normal single-pass compression
    finalBlob = await createBlobAtQuality(initialQuality);
  }

  // Inject DPI metadata if print resolution is selected
  if (options.dpi && options.dpi > 72) {
    try {
      finalBlob = await injectDpiMetadata(finalBlob, options.dpi);
    } catch {
      // DPI injection fallback
    }
  }

  if (objectUrlToRevoke) {
    URL.revokeObjectURL(objectUrlToRevoke);
  }

  const durationMs = Math.round(performance.now() - startTime);

  return {
    blob: finalBlob,
    width,
    height,
    mimeType: targetMime,
    durationMs,
  };
}
