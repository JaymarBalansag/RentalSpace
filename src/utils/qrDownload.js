export async function downloadQrImage(qrCodeUrl, filename = "renta-hub-qr.png") {
  const safeUrl = String(qrCodeUrl || "").trim();
  if (!safeUrl) {
    throw new Error("QR code is not available.");
  }

  const link = document.createElement("a");
  link.download = filename;

  if (safeUrl.startsWith("data:")) {
    link.href = safeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  try {
    const response = await fetch(safeUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch QR image.");
    }

    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    link.href = objectUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch (_) {
    link.href = safeUrl;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
