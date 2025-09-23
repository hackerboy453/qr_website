"use client"

import React, { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PreviewPage() {
  const params = useSearchParams()
  const data = params.get("data") || ""
  const bg = params.get("bg") || "#ffffff"
  const fg = params.get("fg") || "#000000"
  const pattern = params.get("pattern") || "square"
  const eye = params.get("eye") || "square"
  const eyeColor = params.get("eyeColor") || fg
  const qrRef = useRef<HTMLDivElement | null>(null)
  const [instance, setInstance] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    async function build() {
      if (!qrRef.current || !data) return
      const { default: QRCodeStyling } = await import("qr-code-styling")
      const q = new QRCodeStyling({
        width: 260,
        height: 260,
        data,
        backgroundOptions: { color: bg },
        dotsOptions: { type: pattern as any, color: fg },
        cornersSquareOptions: { type: eye === 'circle' ? 'extra-rounded' : 'square', color: eyeColor },
        cornersDotOptions: { type: eye === 'circle' ? 'dot' : 'square', color: eyeColor },
      })
      if (!isMounted) return
      qrRef.current.innerHTML = ""
      q.append(qrRef.current)
      setInstance(q)
    }
    build()
    return () => { isMounted = false }
  }, [data, bg, fg, pattern, eye, eyeColor])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>QR Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div ref={qrRef} className="bg-white p-2 rounded border" />
            <Button onClick={() => instance?.download({ name: "qr-code", extension: "png" })} disabled={!instance}>
              Download PNG
            </Button>
            <div className="mt-2 text-center text-sm text-gray-600 max-w-xs">
              <img
                src="https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif"
                alt="Sorry"
                className="mx-auto mb-2 rounded"
                width={120}
                height={120}
              />
              <p>
                Sorry! Please download the customized QR at generation time. This website is still in development.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


