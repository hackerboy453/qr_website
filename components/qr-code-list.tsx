"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, BarChart3, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"

interface QRCode {
  id: string
  name: string
  url: string
  hash: string
  scan_count: number
  created_at: string
}

export default function QRCodeList() {
  const [qrCodes, setQrCodes] = useState<QRCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchQRCodes()
  }, [])

  const fetchQRCodes = async () => {
    try {
      console.log("[v0] Fetching QR codes...")
      setIsLoading(true)
      setError("")

      const response = await fetch("/api/qr-codes", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const contentType = response.headers.get("content-type")
        console.log("[v0] Response content type:", contentType)

        let errorMessage = `Failed to fetch QR codes: ${response.status}`

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

      const data = await response.json()
      console.log("[v0] Fetched QR codes:", data)
      setQrCodes(data)
    } catch (err) {
      console.error("[v0] Fetch error:", err)
      setError(err instanceof Error ? err.message : "Failed to load QR codes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this QR code?")) return

    try {
      console.log("[v0] Deleting QR code:", id)

      const response = await fetch(`/api/qr-codes?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete QR code")
      }

      setQrCodes(qrCodes.filter((qr) => qr.id !== id))
      console.log("[v0] QR code deleted successfully")
    } catch (err) {
      console.error("[v0] Delete error:", err)
      setError(err instanceof Error ? err.message : "Failed to delete QR code")
    }
  }

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 font-medium mb-2">Error Loading QR Codes</p>
              <p className="text-sm text-red-500">{error}</p>
              {error.includes("Unauthorized") && (
                <p className="text-xs text-red-400 mt-2">Please make sure you're logged in and try again.</p>
              )}
              {error.includes("Database error") && (
                <p className="text-xs text-red-400 mt-2">
                  Make sure the database tables are created by running the SQL scripts.
                </p>
              )}
            </div>
            <Button onClick={fetchQRCodes} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (qrCodes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-500 mb-4">No QR codes created yet.</p>
          <Link href="/">
            <Button>Create Your First QR Code</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {qrCodes.map((qr) => (
        <Card key={qr.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg truncate">{qr.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{qr.scan_count} scans</Badge>
              <Badge variant="outline">{new Date(qr.created_at).toLocaleDateString()}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Target URL:</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm truncate flex-1">{qr.url}</p>
                  <a
                    href={qr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">QR Hash:</p>
                <p className="text-xs font-mono bg-gray-100 p-1 rounded">{qr.hash}</p>
              </div>

              <div className="flex gap-2">
                <Link href={`/analytics/${qr.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(qr.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
