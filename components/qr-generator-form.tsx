"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateQRCodeUrl, downloadQRCode, type QRCodeOptions } from "@/lib/qr-generator"
import { useRouter } from "next/navigation"

export default function QRGeneratorForm() {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    size: 200,
    format: "png",
    errorCorrectionLevel: "M",
    color: "000000",
    backgroundColor: "ffffff",
  })
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [codeType, setCodeType] = useState<"qr" | "barcode">("qr")
  const [barcodeType, setBarcodeType] = useState("code128")

  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (codeType === "qr") {
        console.log("[v0] Starting QR code generation:", { name, url })

        const response = await fetch("/api/qr-codes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Added credentials for authentication
          body: JSON.stringify({ name, url }),
        })

        console.log("[v0] API response status:", response.status)
        console.log("[v0] API response headers:", Object.fromEntries(response.headers.entries()))

        if (!response.ok) {
          const contentType = response.headers.get("content-type")
          console.log("[v0] Response content type:", contentType)

          let errorMessage = "Failed to create QR code"

          if (contentType && contentType.includes("application/json")) {
            try {
              const errorData = await response.json()
              console.log("[v0] Error data:", errorData)
              errorMessage = errorData.error || errorMessage
            } catch (jsonError) {
              console.error("[v0] Failed to parse error JSON:", jsonError)
              const errorText = await response.text()
              console.log("[v0] Error text:", errorText)
              errorMessage = `Server error (${response.status}): ${errorText.substring(0, 100)}...`
            }
          } else {
            const errorText = await response.text()
            console.log("[v0] Error text:", errorText)
            errorMessage = `Server error (${response.status}): ${errorText.substring(0, 100)}...`
          }

          throw new Error(errorMessage)
        }

        const qrCode = await response.json()
        console.log("[v0] QR code created:", qrCode)

        // Create tracking URL using hash
        const trackingUrl = `${window.location.origin}/scan/${qrCode.hash}`
        console.log("[v0] Tracking URL:", trackingUrl)

        // Generate QR code
        const generatedQrUrl = generateQRCodeUrl(trackingUrl, qrOptions)
        console.log("[v0] Generated QR URL:", generatedQrUrl)
        setQrCodeUrl(generatedQrUrl)
      } else {
        // Barcode logic
        // Use barcodeapi.org for demo (supports code128, ean13, etc)
        // For barcode, just use the url field as the value
        const barcodeUrl = `https://barcodeapi.org/api/${barcodeType}/${encodeURIComponent(url)}`
        setQrCodeUrl(barcodeUrl)
      }
      // Reset form
      setName("")
      setUrl("")
    } catch (err) {
      console.error("[v0] QR Generation Error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate code")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (qrCodeUrl) {
      downloadQRCode(qrCodeUrl, `${name || "qr-code"}.${qrOptions.format}`)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">QR Code Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="My QR Code"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="codeType">Code Type</Label>
              <Select value={codeType} onValueChange={v => setCodeType(v as "qr" | "barcode")}> 
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qr">2D QR Code</SelectItem>
                  <SelectItem value="barcode">1D Barcode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {codeType === "barcode" && (
              <div className="grid gap-2">
                <Label htmlFor="barcodeType">Barcode Type</Label>
                <Select value={barcodeType} onValueChange={v => setBarcodeType(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code128">Code128</SelectItem>
                    <SelectItem value="ean13">EAN-13</SelectItem>
                    <SelectItem value="ean8">EAN-8</SelectItem>
                    <SelectItem value="upc">UPC</SelectItem>
                    <SelectItem value="itf">ITF</SelectItem>
                    <SelectItem value="codabar">Codabar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 font-medium">Error:</p>
                <p className="text-sm text-red-500">{error}</p>
                {error.includes("Unauthorized") && (
                  <p className="text-xs text-red-400 mt-1">Please make sure you're logged in and try again.</p>
                )}
                {error.includes("Database error") && (
                  <p className="text-xs text-red-400 mt-1">
                    Make sure the database tables are created by running the SQL scripts.
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate QR Code"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {qrCodeUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Generated {codeType === "qr" ? "QR Code" : "Barcode"}</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="Generated Code" className="mx-auto border rounded-lg bg-white" />
            <div className="flex gap-2 justify-center">
              <Button onClick={() => {
                const link = document.createElement("a")
                link.href = qrCodeUrl
                link.download = `${name || (codeType === "qr" ? "qr-code" : "barcode")}.${codeType === "qr" ? qrOptions.format : "png"}`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }} variant="outline">
                Download
              </Button>
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                View Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
