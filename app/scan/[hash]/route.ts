import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as UAParser from "ua-parser-js"
import { getLocationFromIP } from "@/lib/analytics"

export async function GET(request: NextRequest, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params
    const supabase = await createClient()

    // Find the QR code by hash
    const { data: qrCode, error: qrError } = await supabase
      .from("qr_codes")
      .select("id, url, url2")
      .eq("hash", hash)
      .single()

    if (qrError || !qrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 })
    }

    // Get request info
    const userAgent = request.headers.get("user-agent") || ""
    const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                    request.headers.get("x-real-ip") || 
                    "unknown"
    // Use ua-parser-js for accurate browser, OS, and device type
    const parser = new UAParser.UAParser(userAgent)
    const device = parser.getDevice()
    const deviceType = device.type || "desktop"
    const browser = parser.getBrowser()
    const os = parser.getOS()
    const browserName = browser.name || "Unknown"
    const osName = os.name || "Unknown"

    // Determine target URL: use url2 for non-desktop devices when available
    const targetUrl = deviceType !== "desktop" && qrCode.url2 ? qrCode.url2 : qrCode.url

    // Validate target URL
    try {
      new URL(targetUrl)
    } catch {
      return NextResponse.json({ error: "Invalid target URL" }, { status: 400 })
    }

    // Only attempt geo-IP lookup if not localhost
    let country = "Unknown"
    let city = "Unknown"
    if (clientIP !== "127.0.0.1" && clientIP !== "::1" && clientIP !== "unknown") {
      try {
        const location = await getLocationFromIP(clientIP)
        country = location.country || country
        city = location.city || city
      } catch {}
    }

    // Build scan data
    const scanData = {
      qr_code_id: qrCode.id,
      ip_address: clientIP,
      user_agent: userAgent,
      referer: request.headers.get("referer") || null,
      accept_language: request.headers.get("accept-language") || null,
      country,
      city,
      device_type: deviceType,
      browser: browserName,
      os: osName,
    }

    // Fire-and-forget analytics insert to avoid delaying the redirect
    void supabase.from("scans").insert(scanData)

    // Optionally increment a counter via RPC if available; ignore failures
    void supabase.rpc("increment_scan_count", { target_id: qrCode.id })

    // Redirect to chosen target URL immediately
    return NextResponse.redirect(targetUrl, { status: 302 })
  } catch (error) {
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
