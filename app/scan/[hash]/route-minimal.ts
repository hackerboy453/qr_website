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

    // Try different levels of data insertion
    let scanData: any = {
      qr_code_id: qrCode.id,
    }

    // Try to add more fields one by one
    try {
      scanData.ip_address = clientIP
      scanData.user_agent = userAgent
      scanData.referer = request.headers.get("referer") || null
      scanData.country = "Unknown"
      scanData.city = "Unknown"
      scanData.device_type = "desktop"
      scanData.browser = "unknown"
      scanData.os = "unknown"
    } catch (e) {
      console.log("[v0] Error building scan data:", e)
    }

    console.log("[v0] Inserting scan data:", scanData)

    // Insert scan data
    const { data: insertedData, error: scanError } = await supabase
      .from("scans")
      .insert(scanData)
      .select()

    if (scanError) {
      console.error("[v0] Failed to record scan:", scanError)
      
      // Try with minimal data if the full insert fails
      const minimalData = {
        qr_code_id: qrCode.id,
        ip_address: clientIP,
        user_agent: userAgent,
      }
      
      console.log("[v0] Trying minimal insert:", minimalData)
      
      const { data: minimalInserted, error: minimalError } = await supabase
        .from("scans")
        .insert(minimalData)
        .select()
      
      if (minimalError) {
        console.error("[v0] Minimal insert also failed:", minimalError)
        // Still redirect even if tracking fails
      } else {
        console.log("[v0] Minimal scan recorded successfully:", minimalInserted)
      }
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
