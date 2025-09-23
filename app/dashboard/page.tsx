import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import QRCodeList from "@/components/qr-code-list"
import { Button } from "@/components/ui/button"
import UserNav from "@/components/user-nav"
import Link from "next/link"
import { Plus, LogOut } from "lucide-react"
import LogoutButton from "@/components/logout-button"
import QRCreateToggle from "@/components/qr-create-toggle"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <h1 className="text-3xl font-bold text-gray-900 hover:text-gray-700 cursor-pointer">QR Analytics</h1>
            </Link>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
              <p className="text-gray-600">Manage your QR codes and view analytics</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LogoutButton />
            <Link href="/theme">
              <Button variant="outline">Theme Center</Button>
            </Link>
            <Link href="/dashboard/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create QR Code
              </Button>
            </Link>
            <UserNav />
          </div>
        </div>

        {/* QRCreateToggle renders the form when toggled */}
        <QRCodeList />
      </div>
    </div>
  )
}
