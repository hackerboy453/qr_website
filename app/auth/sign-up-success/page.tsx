import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">QRAnalyticsHub</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome to QRAnalyticsHub!</CardTitle>
            <CardDescription>Your account is ready to go</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <img
                src="https://media.giphy.com/media/OkJat1YNdoD3W/giphy.gif"
                alt="Welcome"
                className="rounded-lg border shadow-sm max-h-48 object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">We&apos;re excited to have you on board.</p>
            <Link href="/auth/login" className="block">
              <Button className="w-full">Back to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
