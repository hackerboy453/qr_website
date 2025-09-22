// QR code generation utility using QR Server API
export interface QRCodeOptions {
  size?: number
  format?: "png" | "svg"
  errorCorrectionLevel?: "L" | "M" | "Q" | "H"
  margin?: number
  color?: string
  backgroundColor?: string
}

export function generateQRCodeUrl(data: string, options: QRCodeOptions = {}): string {
  const {
    size = 200,
    format = "png",
    errorCorrectionLevel = "M",
    margin = 1,
    color = "000000",
    backgroundColor = "ffffff",
  } = options

  const params = new URLSearchParams({
    data: data, // Don't encode the data - QR codes should contain raw URLs
    size: size.toString(),
    format,
    ecc: errorCorrectionLevel,
    margin: margin.toString(),
    color: color.replace("#", ""),
    bgcolor: backgroundColor.replace("#", ""),
  })

  return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`
}

export function downloadQRCode(url: string, filename: string): void {
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
