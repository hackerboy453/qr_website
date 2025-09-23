import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-8 py-6 bg-transparent">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-indigo-700 tracking-tight">QR Analytics</span>
        </div>
        <div className="flex gap-4">
          {user ? (
            <Link href="/dashboard">
              <Button className="bg-indigo-700 text-white font-semibold hover:bg-indigo-800">Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-indigo-700 font-semibold">Login</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-indigo-700 text-white font-semibold hover:bg-indigo-800">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Effortless <span className="text-indigo-700">QR Code</span> Generation & <span className="text-indigo-700">Analytics</span>
        </h1>
        <p className="text-lg md:text-2xl text-gray-600 max-w-2xl mb-8">
          Instantly create, share, and track QR codes with real-time analytics. Gain insights into your audience and optimize your campaigns with ease.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg" className="bg-indigo-700 text-white font-semibold hover:bg-indigo-800 text-lg px-8 py-4">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-indigo-700 text-white font-semibold hover:bg-indigo-800 text-lg px-8 py-4">Get Started Free</Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-indigo-700 border-indigo-700 text-lg px-8 py-4">Login</Button>
              </Link>
            </>
          )}
        </div>
      </main>

      {/* How to Use QR Analytics Section */}
      <section className="max-w-5xl mx-auto py-16 px-4 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">How to use QR Analytics</h2>
        <div className="aspect-video w-full max-w-2xl mx-auto">
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube.com/embed/nytGUnKZX14"
            title="Hero (slowed)"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto py-16 px-4 grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <BarChart3 className="h-10 w-10 text-indigo-700 mb-4" />
          <h3 className="text-xl font-bold mb-2">Real-Time Analytics</h3>
          <p className="text-gray-600">Track scans, locations, devices, and more with beautiful, interactive dashboards.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <svg className="h-10 w-10 text-indigo-700 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/></svg>
          <h3 className="text-xl font-bold mb-2">Easy QR Code Generation</h3>
          <p className="text-gray-600">Create custom QR codes for any URL in seconds. Download and share instantly.</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
          <svg className="h-10 w-10 text-indigo-700 mb-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4"/></svg>
          <h3 className="text-xl font-bold mb-2">Secure & Reliable</h3>
          <p className="text-gray-600">Your data is protected with industry-leading security and privacy best practices.</p>
        </div>
      </section>

      {/* SEO Section */}
      <section className="bg-white/70 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto py-16 px-4 space-y-8">
          <h2 className="text-3xl font-extrabold text-gray-900">QR Code Tracking & Analytics That Drive Results</h2>
          <p className="text-gray-700">
            Our platform makes it easy to generate QR codes and measure performance with detailed analytics. Track total scans,
            countries and cities, device type (mobile, tablet, desktop), top browsers, operating systems, and the exact time of
            each scan. Use these insights to optimize campaigns, improve conversions, and understand your audience.
          </p>
          <h3 className="text-2xl font-bold text-gray-900">Why Choose Our QR Analytics?</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Instant QR code creation with shareable tracking links</li>
            <li>Real-time dashboards for scans, countries, device type, browser and OS</li>
            <li>Secure, privacy-conscious infrastructure powered by modern web technology</li>
            <li>Team-ready: collaborate and monitor performance across campaigns</li>
          </ul>
          <h3 className="text-2xl font-bold text-gray-900">Common Use Cases</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Marketing campaigns and flyers</li>
            <li>Product packaging and retail</li>
            <li>Event tickets and check-ins</li>
            <li>Restaurant menus and contactless experiences</li>
          </ul>
          <h3 className="text-2xl font-bold text-gray-900">FAQs</h3>
          <div className="space-y-4 text-gray-700">
            <div>
              <p className="font-semibold">How do I track QR code scans?</p>
              <p>Generate a QR code in the dashboard. Share the tracking link. Every scan records device, browser, OS, location and time.</p>
            </div>
            <div>
              <p className="font-semibold">Can I see where scans come from?</p>
              <p>Yes, we show countries and cities so you can localize your campaigns.</p>
            </div>
            <div>
              <p className="font-semibold">Do you support mobile vs desktop URLs?</p>
              <p>Yes, add a secondary URL to send mobile users to a different destination.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'How do I track QR code scans?',
                acceptedAnswer: { '@type': 'Answer', text: 'Generate a QR code in the dashboard. Share the tracking link. Every scan records device, browser, OS, location and time.' }
              },
              {
                '@type': 'Question',
                name: 'Can I see where scans come from?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes, we show countries and cities so you can localize your campaigns.' }
              },
              {
                '@type': 'Question',
                name: 'Do you support mobile vs desktop URLs?',
                acceptedAnswer: { '@type': 'Answer', text: 'Yes, add a secondary URL to send mobile users to a different destination.' }
              }
            ]
          })
        }}
      />

      {/* Footer */}
      <footer className="w-full text-center py-6 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} QR Analytics. All rights reserved.
      </footer>
    </div>
  )
}