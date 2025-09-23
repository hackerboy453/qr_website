import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as UAParser from "ua-parser-js"
import { getLocationFromIP } from "@/lib/analytics"

export async function GET(request: NextRequest, { params }: { params: Promise<{ shortCode: string }> }) {
  try {
    const { shortCode } = await params
    const supabase = await createClient()

    // Find the dynamic QR code by short_code
    const { data: qrCode, error: qrError } = await supabase
      .from("qr_codes")
      .select("id, url, url2, is_active")
      .eq("short_code", shortCode)
      .single()

    if (qrError || !qrCode) {
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 })
    }

    if (qrCode.is_active === false) {
      return NextResponse.json({ error: "QR Code is inactive" }, { status: 410 })
    }

    // Request info
    const userAgent = request.headers.get("user-agent") || ""
    const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
                    request.headers.get("x-real-ip") ||
                    "unknown"

    const parser = new UAParser.UAParser(userAgent)
    const device = parser.getDevice()
    const deviceType = device.type || "desktop"
    const browserName = parser.getBrowser().name || "Unknown"
    const osName = parser.getOS().name || "Unknown"

    // Choose target URL respecting mobile fallback, like /scan/[hash]
    const targetUrl = deviceType !== "desktop" && qrCode.url2 ? qrCode.url2 : qrCode.url
    try { new URL(targetUrl) } catch { return NextResponse.json({ error: "Invalid target URL" }, { status: 400 }) }

    // Geo lookup (best-effort)
    let country = "Unknown"
    let city = "Unknown"
    if (clientIP !== "127.0.0.1" && clientIP !== "::1" && clientIP !== "unknown") {
      try {
        const location = await getLocationFromIP(clientIP)
        country = location.country || country
        city = location.city || city
      } catch {}
    }

    // Fire-and-forget: increment scan_count and insert scan
    const insertScan = supabase.from("scans").insert({
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
    })

    const incCount = supabase.rpc("increment_scan_count", { target_id: qrCode.id })

    // Prefer RPC to avoid race conditions if available
    // If you have a Postgres function like: update qr_codes set scan_count = scan_count + 1 where id = $1
    // You can call it here instead of the update above.

    // Run concurrently but don't block redirect on failures
    void Promise.allSettled([insertScan, incCount])

    return NextResponse.redirect(targetUrl, { status: 302 })
  } catch (error) {
    return NextResponse.json({ error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 500 })
  }
}


