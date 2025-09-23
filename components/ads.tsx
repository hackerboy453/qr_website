<<<<<<< HEAD
"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function Ads() {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Ensure the ad script exists once
  useEffect(() => {
    const scriptId = "adsterra-loader"
    if (document.getElementById(scriptId)) return
    const script = document.createElement("script")
    script.id = scriptId
    script.async = true
    script.src = "//pl27699682.revenuecpmgate.com/2b862c55cfa5526f39d41eec496a7dc2/invoke.js"
    document.head.appendChild(script)
  }, [])

  // Re-request a fill on route change by reinjecting a short-lived script
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // Clear previous creative so a new impression can load
    container.innerHTML = ""

    const tempScript = document.createElement("script")
    tempScript.async = true
    tempScript.src = "//pl27699682.revenuecpmgate.com/2b862c55cfa5526f39d41eec496a7dc2/invoke.js"
    // Insert right before the container as most networks expect
    container.parentElement?.insertBefore(tempScript, container)

    return () => {
      tempScript.remove()
    }
  }, [pathname])

  // In-flow responsive banner that sits under page content
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 0 }}>
      <div
        id="container-2b862c55cfa5526f39d41eec496a7dc2"
        ref={containerRef}
        style={{ width: "100%", maxWidth: 728, minHeight: 50 }}
      />
    </div>
  )
}
=======
"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export default function Ads() {
  const pathname = usePathname()
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Ensure the ad script exists once
  useEffect(() => {
    const scriptId = "adsterra-loader"
    if (document.getElementById(scriptId)) return
    const script = document.createElement("script")
    script.id = scriptId
    script.async = true
    script.src = "//pl27699682.revenuecpmgate.com/2b862c55cfa5526f39d41eec496a7dc2/invoke.js"
    document.head.appendChild(script)
  }, [])

  // Re-request a fill on route change by reinjecting a short-lived script
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    // Clear previous creative so a new impression can load
    container.innerHTML = ""

    const tempScript = document.createElement("script")
    tempScript.async = true
    tempScript.src = "//pl27699682.revenuecpmgate.com/2b862c55cfa5526f39d41eec496a7dc2/invoke.js"
    // Insert right before the container as most networks expect
    container.parentElement?.insertBefore(tempScript, container)

    return () => {
      tempScript.remove()
    }
  }, [pathname])

  // In-flow responsive banner that sits under page content
  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center", marginTop: 16, marginBottom: 0 }}>
      <div
        id="container-2b862c55cfa5526f39d41eec496a7dc2"
        ref={containerRef}
        style={{ width: "100%", maxWidth: 728, minHeight: 50 }}
      />
    </div>
  )
}
>>>>>>> 82b3fa0 (your message)
