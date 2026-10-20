/**
 * DPI Metadata Injector for HD Print
 * Injects 300 DPI (or custom DPI) metadata into JPEG and PNG image blobs
 * so operating systems, InDesign, Photoshop, and photo print labs recognize
 * the correct physical print resolution.
 */

// CRC32 implementation for PNG chunks
const crcTable: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf: Uint8Array, offset: number, length: number): number {
  let c = 0xffffffff;
  for (let i = 0; i < length; i++) {
    c = crcTable[(c ^ buf[offset + i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

/**
 * Injects or updates JFIF APP0 segment with specified DPI into a JPEG Blob.
 */
export async function injectJpegDpi(blob: Blob, dpi: number = 300): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Validate SOI (Start of Image 0xFF, 0xD8)
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return blob; // Not a valid JPEG
  }

  const dpiInt = Math.max(1, Math.min(65535, Math.round(dpi)));
  const dpiHigh = (dpiInt >> 8) & 0xff;
  const dpiLow = dpiInt & 0xff;

  // Check if JFIF APP0 marker (0xFF, 0xE0) already exists right after SOI
  if (
    bytes[2] === 0xff &&
    bytes[3] === 0xe0 &&
    bytes[6] === 0x4a && // 'J'
    bytes[7] === 0x46 && // 'F'
    bytes[8] === 0x49 && // 'I'
    bytes[9] === 0x46 && // 'F'
    bytes[10] === 0x00
  ) {
    // Modify existing JFIF header in-place
    // Byte 13: Units (1 = dots per inch)
    // Byte 14-15: Xdensity
    // Byte 16-17: Ydensity
    const modified = new Uint8Array(bytes);
    modified[13] = 0x01; // DPI units
    modified[14] = dpiHigh;
    modified[15] = dpiLow;
    modified[16] = dpiHigh;
    modified[17] = dpiLow;
    return new Blob([modified], { type: blob.type || 'image/jpeg' });
  }

  // Construct a fresh 18-byte JFIF APP0 segment
  const jfif = new Uint8Array([
    0xff, 0xe0, // Marker
    0x00, 0x10, // Length = 16 bytes
    0x4a, 0x46, 0x49, 0x46, 0x00, // 'JFIF\0'
    0x01, 0x02, // Version 1.02
    0x01, // Units: 1 = dots per inch
    dpiHigh, dpiLow, // Xdensity
    dpiHigh, dpiLow, // Ydensity
    0x00, // Xthumbnail
    0x00, // Ythumbnail
  ]);

  // Combine: SOI (2 bytes) + JFIF (18 bytes) + Rest of image (from index 2)
  const result = new Uint8Array(2 + jfif.length + (bytes.length - 2));
  result[0] = 0xff;
  result[1] = 0xd8;
  result.set(jfif, 2);
  result.set(bytes.subarray(2), 2 + jfif.length);

  return new Blob([result], { type: blob.type || 'image/jpeg' });
}

/**
 * Injects or updates pHYs chunk with specified DPI into a PNG Blob.
 * 1 inch = 0.0254 meters -> pixels per meter = Math.round(dpi / 0.0254)
 */
export async function injectPngDpi(blob: Blob, dpi: number = 300): Promise<Blob> {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Validate PNG signature: 89 50 4E 47 0D 0A 1A 0A
  const pngSig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < 8; i++) {
    if (bytes[i] !== pngSig[i]) {
      return blob; // Not a valid PNG
    }
  }

  // Calculate pixels per meter for the given DPI
  const ppm = Math.round(dpi * 39.3700787402);
  const ppmBytes = [
    (ppm >>> 24) & 0xff,
    (ppm >>> 16) & 0xff,
    (ppm >>> 8) & 0xff,
    ppm & 0xff,
  ];

  // Build the 21-byte pHYs chunk:
  // 4 bytes length (9)
  // 4 bytes chunk type ("pHYs")
  // 4 bytes X pixels per unit
  // 4 bytes Y pixels per unit
  // 1 byte unit (1 = meter)
  // 4 bytes CRC
  const physChunk = new Uint8Array(4 + 4 + 9 + 4);
  const view = new DataView(physChunk.buffer);
  view.setUint32(0, 9); // length = 9

  // 'pHYs' = 0x70, 0x48, 0x59, 0x73
  physChunk[4] = 0x70;
  physChunk[5] = 0x48;
  physChunk[6] = 0x59;
  physChunk[7] = 0x73;

  // X pixels per meter
  physChunk.set(ppmBytes, 8);
  // Y pixels per meter
  physChunk.set(ppmBytes, 12);
  // Unit = meter (1)
  physChunk[16] = 1;

  // CRC of chunk type + data (indices 4 to 17, total 13 bytes)
  const chunkCrc = crc32(physChunk, 4, 13);
  view.setUint32(17, chunkCrc);

  // We need to insert this pHYs chunk right after IHDR chunk
  // IHDR is 8 bytes signature + 4 bytes length + 4 bytes type + 13 bytes data + 4 bytes CRC = index 33
  // Verify IHDR:
  let insertPos = 8;
  const ihdrLen = new DataView(bytes.buffer).getUint32(insertPos);
  insertPos += 4 + 4 + ihdrLen + 4; // Skip length + 'IHDR' + data + CRC

  // Check if existing pHYs chunk is already there: if so, we can replace it, else insert after IHDR
  let foundPhysPos = -1;
  let pos = insertPos;
  while (pos < bytes.length - 8) {
    const chunkLen = new DataView(bytes.buffer).getUint32(pos);
    const tag = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
    if (tag === 'pHYs') {
      foundPhysPos = pos;
      break;
    }
    if (tag === 'IDAT') break; // pHYs must precede IDAT
    pos += 4 + 4 + chunkLen + 4;
  }

  if (foundPhysPos !== -1) {
    // Replace existing pHYs chunk
    const chunkLen = new DataView(bytes.buffer).getUint32(foundPhysPos);
    const totalOldChunkLen = 4 + 4 + chunkLen + 4;
    const result = new Uint8Array(bytes.length - totalOldChunkLen + physChunk.length);
    result.set(bytes.subarray(0, foundPhysPos), 0);
    result.set(physChunk, foundPhysPos);
    result.set(bytes.subarray(foundPhysPos + totalOldChunkLen), foundPhysPos + physChunk.length);
    return new Blob([result], { type: 'image/png' });
  }

  // Insert fresh pHYs chunk directly after IHDR
  const result = new Uint8Array(bytes.length + physChunk.length);
  result.set(bytes.subarray(0, insertPos), 0);
  result.set(physChunk, insertPos);
  result.set(bytes.subarray(insertPos), insertPos + physChunk.length);

  return new Blob([result], { type: 'image/png' });
}

/**
 * Apply DPI injection based on image format.
 */
export async function injectDpiMetadata(blob: Blob, dpi: number = 300): Promise<Blob> {
  if (blob.type === 'image/jpeg' || blob.type === 'image/jpg') {
    return injectJpegDpi(blob, dpi);
  }
  if (blob.type === 'image/png') {
    return injectPngDpi(blob, dpi);
  }
  return blob;
}
