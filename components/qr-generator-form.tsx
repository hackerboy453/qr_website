"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
// Import the type for better type-safety
import type QRCodeStyling from "qr-code-styling"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateQRCodeUrl, downloadQRCode, type QRCodeOptions } from "@/lib/qr-generator"
import { createClient } from "@/lib/supabase/client"

export default function QRGeneratorForm() {
  const [name, setName] = useState("")
  const [url, setUrl] = useState("")
  const [contentType, setContentType] = useState<"URL" | "TEXT">("URL")
  const [qrOptions, setQrOptions] = useState<QRCodeOptions>({
    size: 200,
    format: "png",
    errorCorrectionLevel: "M",
    margin: 1,
    backgroundColor: "ffffff",
  })
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [patternColor, setPatternColor] = useState<string>("#000000")
  const [eyeColor, setEyeColor] = useState<string>("#000000")
  const [patternStyle, setPatternStyle] = useState<"square" | "dots" | "rounded">("square")
  const [eyeStyle, setEyeStyle] = useState<"square" | "circle">("square")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
<<<<<<< HEAD
=======

  const [qrData, setQrData] = useState<string>("")
  const qrContainerRef = useRef<HTMLDivElement | null>(null)
  // Use the imported type for the QRCodeStyling instance state
  const [qrInstance, setQrInstance] = useState<QRCodeStyling | null>(null)
>>>>>>> 82b3fa0 (your message)

  const router = useRouter()

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setQrInstance(null) // Clear previous instance

    try {
<<<<<<< HEAD
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
      // Reset form
=======
      if (contentType === "TEXT") {
        const generatedQrUrl = generateQRCodeUrl(url, qrOptions)
        setQrCodeUrl(generatedQrUrl)
        setQrData(url)
      } else {
        const response = await fetch("/api/qr-codes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name,
            url,
            type: "DYNAMIC",
            color: patternColor,
            background_color: `#${qrOptions.backgroundColor}`
          }),
        })

        if (!response.ok) {
          let errorMessage = "Failed to create QR code"
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch {
            errorMessage = `Server error (${response.status})`
          }
          throw new Error(errorMessage)
        }

        const qrCode = await response.json()
        const trackingUrl = qrCode.short_code
          ? `${window.location.origin}/r/${qrCode.short_code}`
          : `${window.location.origin}/scan/${qrCode.hash}`
        const generatedQrUrl = generateQRCodeUrl(trackingUrl, qrOptions)
        setQrCodeUrl(generatedQrUrl)
        setQrData(trackingUrl)

        // Build a styled QR image and upload to Supabase Storage, then save URL on the QR row
        try {
          const { default: QRCodeStyling } = await import("qr-code-styling")
          const tempInstance = new QRCodeStyling({
            width: qrOptions.size,
            height: qrOptions.size,
            data: trackingUrl,
            backgroundOptions: { color: `#${qrOptions.backgroundColor}` },
            qrOptions: { errorCorrectionLevel: qrOptions.errorCorrectionLevel },
            dotsOptions: { type: patternStyle, color: patternColor },
            cornersSquareOptions: { type: eyeStyle === "circle" ? "extra-rounded" : "square", color: eyeColor },
            cornersDotOptions: { type: eyeStyle === "circle" ? "dot" : "square", color: eyeColor },
            image: logoFile ? URL.createObjectURL(logoFile) : undefined,
          })
          const raw = await tempInstance.getRawData("png")
          if (!raw) throw new Error("QR render returned empty data")
          const blob: Blob = raw as Blob
          const supabase = createClient()
          const filePath = `qr/${qrCode.id}.png`
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("qr-images")
            .upload(filePath, blob, { upsert: true, contentType: "image/png" })

          if (uploadError) {
            throw new Error(`Failed to upload QR image: ${uploadError.message}`)
          }

          const { data: pub } = await supabase.storage.from("qr-images").getPublicUrl(filePath)

          // Best-effort verify the object is accessible to avoid broken links
          try {
            const headResp = await fetch(pub.publicUrl, { method: "HEAD", cache: "no-store" })
            if (!headResp.ok) {
              throw new Error(`QR image not reachable (status ${headResp.status})`)
            }
          } catch {
            // Retry once by re-uploading
            await supabase.storage.from("qr-images").upload(filePath, blob, { upsert: true, contentType: "image/png" })
          }

          await supabase
            .from("qr_codes")
            .update({
              data: { ...(qrCode.data || {}), image_url: pub.publicUrl, image_path: filePath, patternStyle, eyeStyle, eyeColor },
              color: patternColor,
              background_color: `#${qrOptions.backgroundColor}`,
            })
            .eq("id", qrCode.id)
        } catch (e) {
          console.warn("Failed to persist styled QR image:", e)
        }
      }

      // Reset form fields after successful generation
>>>>>>> 82b3fa0 (your message)
      setName("")
      setUrl("")
    } catch (err) {
      console.error("QR Generation Error:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (qrInstance) {
      qrInstance.download({ name: name || "qr-code", extension: qrOptions.format })
    } else if (qrCodeUrl) {
      // Fallback for non-styled QR codes
      downloadQRCode(qrCodeUrl, `${name || "qr-code"}.${qrOptions.format}`)
    }
  }

  // Live preview as you type (shows raw URL/text before Generate)
  useEffect(() => {
    if (!url) return
    setQrData(url)
  }, [url, contentType])

  // Effect to build the styled QR code whenever its data or options change
  useEffect(() => {
    if (!qrContainerRef.current || !qrData) return

    let isMounted = true

    const buildStyledQRCode = async () => {
      // Dynamically import the library on the client-side
      const { default: QRCodeStyling } = await import("qr-code-styling")
      const image = logoFile ? URL.createObjectURL(logoFile) : undefined

      const instance = new QRCodeStyling({
        width: qrOptions.size,
        height: qrOptions.size,
        data: qrData,
        image,
        qrOptions: {
          errorCorrectionLevel: qrOptions.errorCorrectionLevel,
        },
        backgroundOptions: { color: `#${qrOptions.backgroundColor}` },
        dotsOptions: {
          type: patternStyle,
          color: patternColor,
        },
        cornersSquareOptions: {
          type: eyeStyle === "circle" ? "extra-rounded" : "square",
          color: eyeColor,
        },
        cornersDotOptions: {
          type: eyeStyle === "circle" ? "dot" : "square",
          color: eyeColor,
        },
      })

      if (isMounted && qrContainerRef.current) {
        qrContainerRef.current.innerHTML = "" // Clear previous QR code
        instance.append(qrContainerRef.current)
        setQrInstance(instance)
      }
    }

    buildStyledQRCode()

    return () => {
      isMounted = false
    }
  }, [qrData, qrOptions, patternStyle, patternColor, eyeStyle, eyeColor, logoFile])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            {contentType === "TEXT" && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
                Text mode generates a static QR code that is not trackable and is not saved to your account.
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">QR Code Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., My Website Link"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Content Type</Label>
              <Select value={contentType} onValueChange={(v) => setContentType(v as "URL" | "TEXT")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="URL">URL (Trackable)</SelectItem>
                  <SelectItem value="TEXT">Text / Data (Static)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="url">{contentType === "URL" ? "Target URL" : "Text to Encode"}</Label>
              <Input
                id="url"
                type="text"
                placeholder={contentType === "URL" ? "https://example.com" : "Hello World!"}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

<<<<<<< HEAD
            <div className="grid gap-2">
              <Label htmlFor="qrOptions">QR Code Options</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    type="number"
                    value={qrOptions.size}
                    onChange={(e) => setQrOptions({...qrOptions, size: parseInt(e.target.value) || 200})}
                    min="100"
                    max="1000"
                  />
                </div>
                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select value={qrOptions.format} onValueChange={v => setQrOptions({...qrOptions, format: v as "png" | "svg"})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG</SelectItem>
                      <SelectItem value="svg">SVG</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
=======
            <h3 className="text-lg font-medium pt-4 border-t">Customization</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Pattern Style</Label>
                <Select value={patternStyle} onValueChange={(v) => setPatternStyle(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="dots">Dots</SelectItem>
                    <SelectItem value="rounded">Rounded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Eye Style</Label>
                <Select value={eyeStyle} onValueChange={(v) => setEyeStyle(v as any)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="patternColor">Pattern Color</Label>
                <Input id="patternColor" type="color" value={patternColor} onChange={(e) => setPatternColor(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="eyeColor">Eye Color</Label>
                <Input id="eyeColor" type="color" value={eyeColor} onChange={(e) => setEyeColor(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="bg">Background Color</Label>
                <Input id="bg" type="color" value={`#${qrOptions.backgroundColor}`} onChange={(e) => setQrOptions({ ...qrOptions, backgroundColor: e.target.value.replace("#", "") })} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logo">Upload Logo (Optional)</Label>
              <Input id="logo" type="file" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => setLogoFile(e.target.files?.[0] || null)} />
            </div>

            <h3 className="text-lg font-medium pt-4 border-t">Advanced Options</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size">Size (px)</Label>
                <Input id="size" type="number" value={qrOptions.size} onChange={(e) => setQrOptions({ ...qrOptions, size: parseInt(e.target.value) || 200 })} min="100" max="1000" />
              </div>
              <div>
                <Label htmlFor="margin">Margin (modules)</Label>
                <Input id="margin" type="number" value={qrOptions.margin} onChange={(e) => setQrOptions({ ...qrOptions, margin: parseInt(e.target.value) || 0 })} min="0" max="20" />
              </div>
              <div>
                <Label htmlFor="format">Download Format</Label>
                <Select value={qrOptions.format} onValueChange={(v) => setQrOptions({ ...qrOptions, format: v as "png" | "svg" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="svg">SVG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ecc">Error Correction</Label>
                <Select value={qrOptions.errorCorrectionLevel} onValueChange={(v) => setQrOptions({ ...qrOptions, errorCorrectionLevel: v as "L" | "M" | "Q" | "H" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="L">Low</SelectItem>
                    <SelectItem value="M">Medium</SelectItem>
                    <SelectItem value="Q">Quartile</SelectItem>
                    <SelectItem value="H">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
>>>>>>> 82b3fa0 (your message)
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                <p className="font-medium">Error: {error}</p>
                {error.includes("Unauthorized") && <p className="text-xs mt-1">Please log in and try again.</p>}
              </div>
            )}

             <Button type="submit" className="w-full" disabled={isLoading || !url}>
              {isLoading ? "Saving..." : "Generate & Add in Analytics"}
            </Button>
             <Button type="button" className="w-full" variant="outline" onClick={() => setQrData(url)} disabled={!url}>
               Preview Only (don’t save)
             </Button>
          </form>
        </CardContent>
      </Card>

      {qrData && (
        <Card>
          <CardHeader>
<<<<<<< HEAD
            <CardTitle>Generated QR Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <img src={qrCodeUrl || "/placeholder.svg"} alt="Generated QR Code" className="mx-auto border rounded-lg bg-white" />
            <div className="flex gap-2 justify-center">
              <Button onClick={() => {
                const link = document.createElement("a")
                link.href = qrCodeUrl
                link.download = `${name || "qr-code"}.${qrOptions.format}`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
              }} variant="outline">
=======
            <CardTitle>Your QR Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div ref={qrContainerRef} className="mx-auto inline-block bg-white p-2 rounded-lg border" />
            <div className="flex gap-2 justify-center">
              <Button onClick={handleDownload} disabled={!qrInstance}>
>>>>>>> 82b3fa0 (your message)
                Download
              </Button>
              {contentType === "URL" && (
                <Button onClick={() => router.push("/dashboard")} variant="outline">
                  View in Dashboard
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}