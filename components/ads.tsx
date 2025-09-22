"use client"

import { useEffect } from "react"

export default function Ads() {
  useEffect(() => {
    // Avoid injecting multiple times
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-ads="revenuecpmgate-2b862c55cfa5526f39d41eec496a7dc2"]',
    )
    if (existing) return

    const script = document.createElement("script")
    script.async = true
    script.dataset.cfasync = "false"
    script.dataset.ads = "revenuecpmgate-2b862c55cfa5526f39d41eec496a7dc2"
    // Use the exact embed URL pattern (protocol-relative)
    script.src = "//pl27699682.revenuecpmgate.com/2b862c55cfa5526f39d41eec496a7dc2/invoke.js"
    document.body.appendChild(script)

    const BOTTOM_HEIGHT = 120
    const BOTTOM_GAP = 8

    const bottomEl = document.getElementById("container-2b862c55cfa5526f39d41eec496a7dc2") as HTMLDivElement | null

    const applyLayout = () => {
      if (bottomEl) bottomEl.style.display = "block"
      // Reserve space so ads don't overlap content (bottom banner)
      const spacer = document.getElementById("ad-bottom-spacer") as HTMLDivElement | null
      if (spacer) {
        spacer.style.height = `${BOTTOM_HEIGHT + BOTTOM_GAP}px`
      } else {
        document.body.style.paddingBottom = `${BOTTOM_HEIGHT + BOTTOM_GAP}px`
      }
    }

    applyLayout()
    window.addEventListener("resize", applyLayout)

    return () => {
      window.removeEventListener("resize", applyLayout)
    }
  }, [])

  return (
    <>
      <div
        id="container-2b862c55cfa5526f39d41eec496a7dc2"
        style={{ position: "fixed", left: 0, right: 0, bottom: 0, margin: "0 auto", width: 728, maxWidth: "100vw", zIndex: 40 }}
      />
    </>
  )
}


