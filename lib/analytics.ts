// Analytics utility functions
export interface ScanData {
  qrCodeId: string
  ipAddress?: string
  userAgent?: string
  referer?: string
  country?: string
  city?: string
  deviceType?: string
  browser?: string
  os?: string
}

export function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()

  // Device type detection
  let deviceType = "desktop"
  if (/mobile|android|iphone|ipad|tablet/.test(ua)) {
    if (/ipad|tablet/.test(ua)) {
      deviceType = "tablet"
    } else {
      deviceType = "mobile"
    }
  }

  // Browser detection
  let browser = "unknown"
  if (ua.includes("chrome")) browser = "chrome"
  else if (ua.includes("firefox")) browser = "firefox"
  else if (ua.includes("safari")) browser = "safari"
  else if (ua.includes("edge")) browser = "edge"
  else if (ua.includes("opera")) browser = "opera"

  // OS detection
  let os = "unknown"
  if (ua.includes("windows")) os = "windows"
  else if (ua.includes("mac")) os = "macos"
  else if (ua.includes("linux")) os = "linux"
  else if (ua.includes("android")) os = "android"
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad")) os = "ios"

  return { deviceType, browser, os }
}

export interface LocationData {
  country?: string
  city?: string
  state?: string
  region?: string
  timezone?: string
  latitude?: number
  longitude?: number
}

export async function getLocationFromIP(ip: string): Promise<LocationData> {
  try {
    console.log("[v0] Getting location for IP:", ip)

    // Using ip-api.com with more detailed fields
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=country,regionName,city,timezone,lat,lon,status,message`,
    )

    if (response.ok) {
      const data = await response.json()
      console.log("[v0] Location API response:", data)

      if (data.status === "success") {
        return {
          country: data.country || undefined,
          city: data.city || undefined,
          state: data.regionName || undefined,
          region: data.regionName || undefined,
          timezone: data.timezone || undefined,
          latitude: data.lat || undefined,
          longitude: data.lon || undefined,
        }
      } else {
        console.log("[v0] Location API error:", data.message)
      }
    } else {
      console.log("[v0] Location API request failed:", response.status)
    }
  } catch (error) {
    console.error("[v0] Failed to get location from IP:", error)
  }
  return {}
}

export function getClientIP(request: Request): string | undefined {
  // Try various headers that might contain the real IP
  const headers = request.headers

  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-client-ip") ||
    undefined
  )
}
