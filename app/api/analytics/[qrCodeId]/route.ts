import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ qrCodeId: string }> }) {
  try {
    const { qrCodeId } = await params
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify QR code belongs to user
    const { data: qrCode, error: qrError } = await supabase
      .from("qr_codes")
      .select("id, name, url")
      .eq("id", qrCodeId)
      .eq("user_id", user.id)
      .single()

    if (qrError || !qrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 })
    }

    // Get analytics data
    const { data: scans, error: scansError } = await supabase
      .from("scans")
      .select("*")
      .eq("qr_code_id", qrCodeId)
      .order("scanned_at", { ascending: false })

    if (scansError) {
      return NextResponse.json({ error: scansError.message }, { status: 500 })
    }

    // Process analytics data
    const totalScans = scans?.length || 0

    // Group by date for timeline
    const scansByDate =
      scans?.reduce((acc: Record<string, number>, scan) => {
        const date = new Date(scan.scanned_at).toISOString().split("T")[0]
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {}) || {}

    // Group by country
    const scansByCountry =
      scans?.reduce((acc: Record<string, number>, scan) => {
        const country = scan.country || "Unknown"
        acc[country] = (acc[country] || 0) + 1
        return acc
      }, {}) || {}

    // Group by device type
    const scansByDevice =
      scans?.reduce((acc: Record<string, number>, scan) => {
        const device = scan.device_type || "Unknown"
        acc[device] = (acc[device] || 0) + 1
        return acc
      }, {}) || {}

    // Group by browser
    const scansByBrowser =
      scans?.reduce((acc: Record<string, number>, scan) => {
        const browser = scan.browser || "Unknown"
        acc[browser] = (acc[browser] || 0) + 1
        return acc
      }, {}) || {}

    return NextResponse.json({
      qrCode,
      totalScans,
      scansByDate,
      scansByCountry,
      scansByDevice,
      scansByBrowser,
      recentScans: scans?.slice(0, 10) || [],
    })
  } catch (error) {
    console.error("Analytics API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
