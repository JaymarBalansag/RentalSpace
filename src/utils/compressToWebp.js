function stripExtension(filename) {
  const name = String(filename || "image");
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0) return name;
  return name.slice(0, lastDot);
}

function blobToFile(blob, filename) {
  try {
    return new File([blob], filename, { type: blob.type, lastModified: Date.now() });
  } catch {
    // Older browsers: File constructor may not exist; fall back to Blob with name-like props.
    blob.name = filename;
    return blob;
  }
}

async function loadImageBitmap(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      return await createImageBitmap(file);
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function computeTargetSize(width, height, maxWidth, maxHeight) {
  const safeWidth = Math.max(1, Number(width) || 1);
  const safeHeight = Math.max(1, Number(height) || 1);
  const wLimit = Math.max(1, Number(maxWidth) || safeWidth);
  const hLimit = Math.max(1, Number(maxHeight) || safeHeight);
  const scale = Math.min(1, wLimit / safeWidth, hLimit / safeHeight);
  return { width: Math.max(1, Math.round(safeWidth * scale)), height: Math.max(1, Math.round(safeHeight * scale)) };
}

async function canvasToBlob(canvas, type, quality) {
  if (canvas.convertToBlob) {
    return await canvas.convertToBlob({ type, quality });
  }
  return await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Compress an image file into a WebP `File` (best-effort).
 * Returns the original file when input is not an image or WebP encoding isn't available.
 */
export async function compressImageToWebpFile(
  inputFile,
  {
    quality = 0.82,
    maxWidth = 1600,
    maxHeight = 1600,
    filenameSuffix = "",
    keepOriginalIfLarger = true,
  } = {}
) {
  const file = inputFile;
  if (!file || !file.type || !String(file.type).startsWith("image/")) {
    return { file, converted: false, reason: "not-image" };
  }

  // If already webp, still allow resizing/re-encoding for size reduction.
  const bitmap = await loadImageBitmap(file);
  const srcWidth = bitmap.width;
  const srcHeight = bitmap.height;
  const { width, height } = computeTargetSize(srcWidth, srcHeight, maxWidth, maxHeight);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return { file, converted: false, reason: "no-canvas" };

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, 0, 0, width, height);

  // Avoid leaking ImageBitmap resources when supported.
  if (typeof bitmap.close === "function") bitmap.close();

  const blob = await canvasToBlob(canvas, "image/webp", quality);
  if (!blob) return { file, converted: false, reason: "webp-encode-failed" };

  const base = stripExtension(file.name);
  const suffix = filenameSuffix ? `-${filenameSuffix}` : "";
  const outName = `${base}${suffix}.webp`;
  const outFile = blobToFile(blob, outName);

  // If the output is larger than input, keep original.
  if (keepOriginalIfLarger && blob.size && file.size && blob.size >= file.size) {
    return { file, converted: false, reason: "not-smaller" };
  }

  return { file: outFile, converted: true, reason: null };
}
