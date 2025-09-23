"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { MapPin, Smartphone, Globe, Clock } from "lucide-react"
import React from "react"

interface Scan {
  id: string
  scanned_at: string
  country?: string
  city?: string
  state?: string
  device_type?: string
  browser?: string
  os?: string
  ip_address?: string
  timezone?: string
  latitude?: number
  longitude?: number
}

interface AnalyticsData {
  qrCode: {
    id: string
    name: string
    url: string
  }
  scans: Scan[]
  totalScans: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d", "#ffc658"]

export default function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  const processAnalyticsData = () => {
    const scansByDate: Record<string, number> = {}
    const scansByCountry: Record<string, number> = {}
    const scansByDevice: Record<string, number> = {}
    const scansByBrowser: Record<string, number> = {}
    const scansByOS: Record<string, number> = {}

    data.scans.forEach((scan) => {
      // Group by date
      const date = new Date(scan.scanned_at).toLocaleDateString('en-US')
      scansByDate[date] = (scansByDate[date] || 0) + 1

      // Group by country
      const country = scan.country || "Unknown"
      scansByCountry[country] = (scansByCountry[country] || 0) + 1

      // Group by device
      const device = scan.device_type || "Unknown"
      scansByDevice[device] = (scansByDevice[device] || 0) + 1

      // Group by browser
      const browser = scan.browser || "Unknown"
      scansByBrowser[browser] = (scansByBrowser[browser] || 0) + 1

      // Group by OS
      const os = scan.os || "Unknown"
      scansByOS[os] = (scansByOS[os] || 0) + 1
    })

    return { scansByDate, scansByCountry, scansByDevice, scansByBrowser, scansByOS }
  }

  const { scansByDate, scansByCountry, scansByDevice, scansByBrowser, scansByOS } = processAnalyticsData()

  // Prepare data for charts
  const dateData = Object.entries(scansByDate)
    .map(([date, count]) => ({ date, scans: count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30) // Last 30 days

  const countryData = Object.entries(scansByCountry)
    .map(([country, count]) => ({ name: country, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10) // Top 10 countries

  const deviceData = Object.entries(scansByDevice).map(([device, count]) => ({ name: device, value: count }))

  const browserData = Object.entries(scansByBrowser)
    .map(([browser, count]) => ({ name: browser, value: count }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5) // Top 5 browsers

  const osData = Object.entries(scansByOS).map(([os, count]) => ({ name: os, value: count }))

  const recentScans = data.scans
    .sort((a, b) => new Date(b.scanned_at).getTime() - new Date(a.scanned_at).getTime())
    .slice(0, 10)

  // Add state for view more
  const [showAllCountries, setShowAllCountries] = React.useState(false)
  const [showAllDevices, setShowAllDevices] = React.useState(false)
  const [showAllBrowsers, setShowAllBrowsers] = React.useState(false)
  const [showAllOS, setShowAllOS] = React.useState(false)
  const [showAllScans, setShowAllScans] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Total Scans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalScans}</div>
            <p className="text-xs text-muted-foreground">All time scans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{countryData.length}</div>
            <p className="text-xs text-muted-foreground">Unique countries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Devices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deviceData.length}</div>
            <p className="text-xs text-muted-foreground">Device types</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scansByDate[new Date().toLocaleDateString('en-US')] || 0}</div>
            <p className="text-xs text-muted-foreground">Scans today</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Scans Over Time */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Scans Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scans" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
            <button className="text-xs text-blue-500 ml-2" onClick={() => setShowAllCountries((v) => !v)}>
              {showAllCountries ? "View Less" : "View More"}
            </button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={showAllCountries ? Object.entries(scansByCountry).map(([country, value]) => ({ name: country, value })) : countryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Types */}
        <Card>
          <CardHeader>
            <CardTitle>Device Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Browsers</CardTitle>
            <button className="text-xs text-blue-500 ml-2" onClick={() => setShowAllBrowsers((v) => !v)}>
              {showAllBrowsers ? "View Less" : "View More"}
            </button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={showAllBrowsers ? Object.entries(scansByBrowser).map(([browser, value]) => ({ name: browser, value })) : browserData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="value" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operating Systems */}
        <Card>
          <CardHeader>
            <CardTitle>Operating Systems</CardTitle>
            <button className="text-xs text-blue-500 ml-2" onClick={() => setShowAllOS((v) => !v)}>
              {showAllOS ? "View Less" : "View More"}
            </button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={showAllOS ? Object.entries(scansByOS).map(([os, value]) => ({ name: os, value })) : osData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {osData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <button className="text-xs text-blue-500 ml-2" onClick={() => setShowAllScans((v) => !v)}>
              {showAllScans ? "View Less" : "View More"}
            </button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {showAllScans ? data.scans.map((scan) => (
                <div key={scan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {scan.city && scan.country ? `${scan.city}, ${scan.country}` : scan.country || "Unknown Location"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {scan.device_type} • {scan.browser} • {scan.os}
                    </p>
                    {scan.ip_address && (
                      <p className="text-xs text-gray-500">IP: {scan.ip_address}</p>
                    )}
                    {scan.timezone && <p className="text-xs text-gray-400">{scan.timezone}</p>}
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>{new Date(scan.scanned_at).toLocaleDateString('en-US')}</div>
                    <div>{new Date(scan.scanned_at).toLocaleTimeString('en-US')}</div>
                  </div>
                </div>
              )) : recentScans.map((scan) => (
                <div key={scan.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {scan.city && scan.country ? `${scan.city}, ${scan.country}` : scan.country || "Unknown Location"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {scan.device_type} • {scan.browser} • {scan.os}
                    </p>
                    {scan.ip_address && (
                      <p className="text-xs text-gray-500">IP: {scan.ip_address}</p>
                    )}
                    {scan.timezone && <p className="text-xs text-gray-400">{scan.timezone}</p>}
                  </div>
                  <div className="text-xs text-gray-500 text-right">
                    <div>{new Date(scan.scanned_at).toLocaleDateString('en-US')}</div>
                    <div>{new Date(scan.scanned_at).toLocaleTimeString('en-US')}</div>
                  </div>
                </div>
              ))}
              {recentScans.length === 0 && (
                <div className="text-center py-8">
                  <Globe className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No scans yet</p>
                  <p className="text-sm text-gray-400">Share your QR code to start collecting analytics</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
