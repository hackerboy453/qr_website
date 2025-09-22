import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Checking database schema")
    
    const supabase = await createClient()
    
    // Get the actual table structure by querying information_schema
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'scans' })
      .catch(async () => {
        // Fallback: try to describe the table structure by attempting to select all columns
        const { data, error } = await supabase
          .from("scans")
          .select("*")
          .limit(0)
        
        if (error) {
          return { data: null, error }
        }
        
        // If successful, we know the table exists but we can't get column info this way
        return { data: [], error: null }
      })
    
    if (columnsError) {
      console.log("[v0] Could not get column info:", columnsError.message)
    }
    
    // Try to insert a minimal record to see what columns are actually available
    const { data: qrCodes, error: qrError } = await supabase
      .from("qr_codes")
      .select("id")
      .limit(1)
    
    if (qrError || !qrCodes || qrCodes.length === 0) {
      return NextResponse.json({ 
        error: "No QR codes found to test with",
        qrError: qrError?.message 
      }, { status: 400 })
    }
    
    // Test with absolute minimal data
    const minimalData = {
      qr_code_id: qrCodes[0].id
    }
    
    console.log("[v0] Testing minimal insert with:", minimalData)
    
    const { data: insertedData, error: insertError } = await supabase
      .from("scans")
      .insert(minimalData)
      .select()
    
    if (insertError) {
      console.log("[v0] Minimal insert failed:", insertError.message)
      
      // Try with just the basic columns from the original schema
      const basicData = {
        qr_code_id: qrCodes[0].id,
        ip_address: "127.0.0.1",
        user_agent: "Test",
        referer: null,
        country: "Test",
        city: "Test",
        device_type: "desktop",
        browser: "chrome",
        os: "windows"
      }
      
      console.log("[v0] Testing basic insert with:", basicData)
      
      const { data: basicInserted, error: basicError } = await supabase
        .from("scans")
        .insert(basicData)
        .select()
      
      if (basicError) {
        return NextResponse.json({ 
          error: "Both minimal and basic inserts failed",
          minimalError: insertError.message,
          basicError: basicError.message,
          suggestion: "The scans table may not exist or have the wrong structure"
        }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: true,
        message: "Basic insert worked",
        insertedData: basicInserted,
        workingColumns: Object.keys(basicData)
      })
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Minimal insert worked",
      insertedData: insertedData,
      workingColumns: Object.keys(minimalData)
    })
    
  } catch (error) {
    console.error("[v0] Schema check error:", error)
    return NextResponse.json({ 
      error: "Schema check failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 })
  }
}
