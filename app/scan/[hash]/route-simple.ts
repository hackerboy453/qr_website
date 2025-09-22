import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ hash: string }> }) {
  try {
    const { hash } = await params
    const supabase = await createClient()

    console.log("[v0] Processing scan for hash:", hash)

    // Find the QR code by hash
    const { data: qrCode, error: qrError } = await supabase
      .from("qr_codes")
      .select("id, url")
      .eq("hash", hash)
      .single()

    if (qrError || !qrCode) {
      console.log("[v0] QR Code not found for hash:", hash, "Error:", qrError?.message)
      return NextResponse.json({ error: "QR Code not found" }, { status: 404 })
    }

    console.log("[v0] Found QR code:", qrCode)

    // Validate target URL
    try {
      new URL(qrCode.url)
    } catch {
      console.log("[v0] Invalid target URL:", qrCode.url)
      return NextResponse.json({ error: "Invalid target URL" }, { status: 400 })
    }

    // Get basic request info
    const userAgent = request.headers.get("user-agent") || ""
    const clientIP = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                    request.headers.get("x-real-ip") || 
                    "unknown"

    console.log("[v0] Request info:", { userAgent, clientIP })

    // Create simple scan data with only basic fields
    const scanData = {
      qr_code_id: qrCode.id,
      ip_address: clientIP,
      user_agent: userAgent,
      device_type: "desktop", // Default value
      browser: "unknown", // Default value
      os: "unknown", // Default value
    }

    console.log("[v0] Inserting scan data:", scanData)

    // Insert scan data
    const { data: insertedData, error: scanError } = await supabase
      .from("scans")
      .insert(scanData)
      .select()

    if (scanError) {
      console.error("[v0] Failed to record scan:", scanError)
      console.error("[v0] Scan error details:", {
        message: scanError.message,
        details: scanError.details,
        hint: scanError.hint,
        code: scanError.code
      })
      // Still redirect even if tracking fails
    } else {
      console.log("[v0] Scan recorded successfully:", insertedData)
    }

    // Redirect to target URL
    console.log("[v0] Redirecting to:", qrCode.url)
    return NextResponse.redirect(qrCode.url)
  } catch (error) {
    console.error("[v0] Scan tracking error:", error)
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
