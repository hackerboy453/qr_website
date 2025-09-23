import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createHash } from "crypto"

function generateShortCode(length = 7): string {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let code = ""
  for (let i = 0; i < length; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return code
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] POST /api/qr-codes - Starting QR code creation")

    const { name, url, type = "STATIC", color, background_color } = await request.json()
    console.log("[v0] Request data:", { name, url, type, color, background_color })

    if (!name || !url) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Name and URL are required" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch {
      console.log("[v0] Invalid URL format")
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("[v0] User auth check:", { user: user?.id, error: userError?.message })

    if (userError || !user) {
      console.log("[v0] Authentication failed")
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 })
    }

    // Generate unique hash for the QR code
    const hash = createHash("sha256").update(`${user.id}-${url}-${Date.now()}`).digest("hex").substring(0, 12)
    console.log("[v0] Generated hash:", hash)

    // Prepare dynamic short code if requested
    let shortCode: string | null = null
    if (String(type).toUpperCase() === "DYNAMIC") {
      // Try a few times to avoid rare collisions
      for (let i = 0; i < 3; i++) {
        const candidate = generateShortCode(7)
        const { data: existing } = await supabase.from("qr_codes").select("id").eq("short_code", candidate).maybeSingle()
        if (!existing) {
          shortCode = candidate
          break
        }
      }
      if (!shortCode) shortCode = generateShortCode(8)
    }

    // Insert QR code with hash (and short_code/type when provided)
    const { data: qrCode, error } = await supabase
      .from("qr_codes")
      .insert({
        name,
        url,
        hash,
        user_id: user.id,
        type: String(type).toUpperCase(),
        short_code: shortCode,
        color: color || null,
        background_color: background_color || null,
      })
      .select()
      .single()

    console.log("[v0] Database insert result:", { qrCode, error: error?.message })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json(
        {
          error: `Database error: ${error.message}. Make sure the database tables are created.`,
        },
        { status: 500 },
      )
    }

    console.log("[v0] QR code created successfully")
    return NextResponse.json(qrCode)
  } catch (error) {
    console.error("[v0] Create QR Code API Error:", error)
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] GET /api/qr-codes - Fetching QR codes")

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("[v0] User auth check:", { user: user?.id, error: userError?.message })

    if (userError || !user) {
      console.log("[v0] Authentication failed")
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 })
    }

    // Get user's QR codes with scan counts
    const { data: qrCodes, error } = await supabase
      .from("qr_codes")
      .select(`
        *,
        scans(count)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    console.log("[v0] Database query result:", { count: qrCodes?.length, error: error?.message })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json(
        {
          error: `Database error: ${error.message}. Make sure the database tables are created.`,
        },
        { status: 500 },
      )
    }

    // Transform the data to include scan counts
    const qrCodesWithCounts =
      qrCodes?.map((qr) => ({
        ...qr,
        scan_count: qr.scans?.[0]?.count || 0,
      })) || []

    console.log("[v0] Returning QR codes:", qrCodesWithCounts.length)
    return NextResponse.json(qrCodesWithCounts)
  } catch (error) {
    console.error("[v0] GET API Error:", error)
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log("[v0] DELETE /api/qr-codes - Starting QR code deletion")

    const { searchParams } = new URL(request.url)
    const qrCodeId = searchParams.get("id")
    console.log("[v0] Request data:", { qrCodeId })

    if (!qrCodeId) {
      console.log("[v0] Missing QR Code ID")
      return NextResponse.json({ error: "QR Code ID required" }, { status: 400 })
    }

    const supabase = await createClient()
    console.log("[v0] Supabase client created")

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("[v0] User auth check:", { user: user?.id, error: userError?.message })

    if (userError || !user) {
      console.log("[v0] Authentication failed")
      return NextResponse.json({ error: "Unauthorized. Please log in first." }, { status: 401 })
    }

    // Delete QR code (scans will be deleted automatically due to CASCADE)
    const { error } = await supabase.from("qr_codes").delete().eq("id", qrCodeId).eq("user_id", user.id)

    console.log("[v0] Database delete result:", { error: error?.message })

    if (error) {
      console.error("[v0] Database error:", error)
      return NextResponse.json(
        {
          error: `Database error: ${error.message}. Make sure the database tables are created.`,
        },
        { status: 500 },
      )
    }

    console.log("[v0] QR code deleted successfully")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete API Error:", error)
    return NextResponse.json(
      {
        error: `Internal server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    )
  }
}
