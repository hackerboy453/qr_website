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
    script.src = "https://pl27699682.revenuecpmgate.com/2b862c55cfa5526f39d41eec496a7dc2/invoke.js"
    document.body.appendChild(script)

    const RIGHT_WIDTH = 320
    const RIGHT_GAP = 16
    const BOTTOM_HEIGHT = 90
    const BOTTOM_GAP = 8

    const rightEl = document.getElementById("container-2b862c55cfa5526f39d41eec496a7dc2") as HTMLDivElement | null
    const bottomEl = document.getElementById("container-2b862c55cfa5526f39d41eec496a7dc2-bottom") as HTMLDivElement | null

    const applyLayout = () => {
      const vw = window.innerWidth
      const showRight = vw >= 1024 // lg and up

      if (rightEl) rightEl.style.display = showRight ? "block" : "none"
      if (bottomEl) bottomEl.style.display = "block"

      // Reserve space so ads don't overlap content
      document.body.style.paddingRight = showRight ? `${RIGHT_WIDTH + RIGHT_GAP}px` : "0px"
      document.body.style.paddingBottom = `${BOTTOM_HEIGHT + BOTTOM_GAP}px`
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
        style={{ position: "fixed", right: 8, top: 80, width: 320, maxWidth: "90vw", zIndex: 40 }}
      />
      <div
        id="container-2b862c55cfa5526f39d41eec496a7dc2-bottom"
        style={{ position: "fixed", left: 0, right: 0, bottom: 0, margin: "0 auto", width: 728, maxWidth: "100vw", zIndex: 40 }}
      />
    </>
  )
}


