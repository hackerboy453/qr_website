import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Testing scan database connection")
    
    const supabase = await createClient()
    
    // Test if we can connect to the database
    const { data: qrCodes, error: qrError } = await supabase
      .from("qr_codes")
      .select("id, name, url, hash")
      .limit(1)
    
    if (qrError) {
      console.error("[v0] QR codes query error:", qrError)
      return NextResponse.json({ error: "QR codes query failed", details: qrError }, { status: 500 })
    }
    
    console.log("[v0] QR codes found:", qrCodes?.length || 0)
    
    // Test if we can query scans table
    const { data: scans, error: scansError } = await supabase
      .from("scans")
      .select("*")
      .limit(1)
    
    if (scansError) {
      console.error("[v0] Scans query error:", scansError)
      return NextResponse.json({ error: "Scans query failed", details: scansError }, { status: 500 })
    }
    
    console.log("[v0] Scans found:", scans?.length || 0)
    
    // Test inserting a sample scan if we have a QR code
    if (qrCodes && qrCodes.length > 0) {
      const testScanData = {
        qr_code_id: qrCodes[0].id,
        ip_address: "127.0.0.1",
        user_agent: "Test User Agent",
        referer: null,
        country: "Test Country",
        city: "Test City",
        device_type: "desktop",
        browser: "chrome",
        os: "windows",
      }
      
      console.log("[v0] Testing scan insert with data:", testScanData)
      
      const { data: insertedData, error: insertError } = await supabase
        .from("scans")
        .insert(testScanData)
        .select()
      
      if (insertError) {
        console.error("[v0] Scan insert test failed:", insertError)
        return NextResponse.json({ 
          error: "Scan insert test failed", 
          details: insertError,
          qrCodes: qrCodes.length,
          scans: scans?.length || 0
        }, { status: 500 })
      }
      
      console.log("[v0] Scan insert test successful:", insertedData)
      
      return NextResponse.json({ 
        success: true,
        qrCodes: qrCodes.length,
        scans: scans?.length || 0,
        testScanInserted: insertedData
      })
    }
    
    return NextResponse.json({ 
      success: true,
      qrCodes: qrCodes?.length || 0,
      scans: scans?.length || 0,
      message: "No QR codes found to test scan insertion"
    })
    
  } catch (error) {
    console.error("[v0] Test scan error:", error)
    return NextResponse.json({ 
      error: "Test failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
