import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { headers } from "next/headers"
import AnalyticsCharts from "@/components/analytics-charts"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"

interface AnalyticsPageProps {
  params: Promise<{ qrCodeId: string }>
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { qrCodeId } = await params
  const supabase = await createClient()
  const hdrs = await headers()
  const host = hdrs.get("host") || "localhost:3000"
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https"

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.log("[v0] User authentication failed:", userError?.message)
    redirect("/auth/login")
  }

  const { data: qrCode, error: qrError } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("id", qrCodeId)
    .eq("user_id", user.id)
    .single()

  if (qrError || !qrCode) {
    console.log("[v0] QR code not found:", qrError?.message)
    notFound()
  }

  const { data: scans, error: scansError } = await supabase
    .from("scans")
    .select("*")
    .eq("qr_code_id", Number(qrCodeId))
    .order("scanned_at", { ascending: false })

  if (scansError) {
    console.error("[v0] Failed to fetch scans:", scansError.message)
  }

  const analyticsData = {
    qrCode,
    scans: scans || [],
    totalScans: scans?.length || 0,
  }

  const origin = `${protocol}://${host}`
  const trackingUrl = `${origin}/scan/${analyticsData.qrCode.hash}`

<<<<<<< HEAD
=======
  // Verify if stored QR image URL is actually reachable to avoid dead links
  const storedImageUrl: string | undefined = qrCode.data?.image_url
  let imageIsReachable = false
  if (storedImageUrl) {
    try {
      const resp = await fetch(storedImageUrl, { method: "HEAD", cache: "no-store" })
      imageIsReachable = resp.ok
    } catch {
      imageIsReachable = false
    }
  }

>>>>>>> 82b3fa0 (your message)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{analyticsData.qrCode.name}</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span>{analyticsData.qrCode.url}</span>
              {analyticsData.qrCode.url2 && (
                <>
                  <span className="mx-2">|</span>
                  <span>{analyticsData.qrCode.url2}</span>
                </>
              )}
              <a
                href={analyticsData.qrCode.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
<<<<<<< HEAD
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(trackingUrl)}&size=200x200`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-500 hover:text-blue-700 border px-2 py-1 rounded"
              >
                View QR Code
              </a>
=======
              {imageIsReachable ? (
                <a
                  href={qrCode.data.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-500 hover:text-blue-700 border px-2 py-1 rounded"
                >
                  View QR Code
                </a>
              ) : (
                <Link
                  href={`/preview?data=${encodeURIComponent(trackingUrl)}&bg=${encodeURIComponent(qrCode.background_color || '#ffffff')}&fg=${encodeURIComponent(qrCode.color || '#000000')}&pattern=${encodeURIComponent(qrCode.data?.patternStyle || 'square')}&eye=${encodeURIComponent(qrCode.data?.eyeStyle || 'square')}&eyeColor=${encodeURIComponent(qrCode.data?.eyeColor || qrCode.color || '#000000')}`}
                  className="ml-2 text-blue-500 hover:text-blue-700 border px-2 py-1 rounded"
                >
                  View QR Code
                </Link>
              )}
>>>>>>> 82b3fa0 (your message)
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {analyticsData.totalScans} total scans
              </span>
            </div>
          </div>
        </div>

        <AnalyticsCharts data={analyticsData} />
      </div>
    </div>
  )
}
