"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const THEMES = ["red", "blue", "green", "orange", "yellow"] as const
type ThemeName = typeof THEMES[number]

function applyTheme(theme: ThemeName) {
  const root = document.documentElement
  // Simple themed accents via CSS variables
  const map: Record<ThemeName, { primary: string; primaryFg: string; accent: string }> = {
    red: { primary: "#dc2626", primaryFg: "#ffffff", accent: "#fecaca" },
    blue: { primary: "#2563eb", primaryFg: "#ffffff", accent: "#bfdbfe" },
    green: { primary: "#16a34a", primaryFg: "#ffffff", accent: "#bbf7d0" },
    orange: { primary: "#ea580c", primaryFg: "#ffffff", accent: "#fed7aa" },
    yellow: { primary: "#ca8a04", primaryFg: "#0a0a0a", accent: "#fde68a" },
  }
  const cfg = map[theme]
  root.style.setProperty("--primary", cfg.primary)
  root.style.setProperty("--primary-foreground", cfg.primaryFg)
  root.style.setProperty("--accent", cfg.accent)
  localStorage.setItem("qa-theme", theme)
}

export default function ThemeCenterPage() {
  const [current, setCurrent] = useState<ThemeName>("blue")

  useEffect(() => {
    const saved = (localStorage.getItem("qa-theme") as ThemeName) || "blue"
    setCurrent(saved)
    applyTheme(saved)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <span className="text-2xl font-bold text-gray-900">QR Analytics</span>
          </Link>
          <Link href="/dashboard"><Button variant="outline">Back to Dashboard</Button></Link>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Theme Center</h1>
        <p className="text-gray-600">Pick a color theme. We save it in your browser.</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {THEMES.map((t) => (
            <button
              key={t}
              onClick={() => { setCurrent(t); applyTheme(t) }}
              className={`rounded-xl p-4 border transition ${current === t ? "ring-2 ring-offset-2" : ""}`}
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
              }}
            >
              <div className="h-12 w-full rounded" style={{ background: t }} />
              <div className="mt-2 font-medium capitalize">{t}</div>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl border bg-white">
          <div className="flex items-center justify-between">
            <span className="font-medium">Preview</span>
            <Button>Primary Button</Button>
          </div>
          <div className="mt-4 p-4 rounded-lg" style={{ background: "var(--accent)" }}>
            Accent surface using current theme
          </div>
        </div>
      </div>
    </div>
  )
}


