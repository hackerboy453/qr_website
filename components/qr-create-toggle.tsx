"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import QRGeneratorForm from "@/components/qr-generator-form"

export default function QRCreateToggle() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Button onClick={() => setShowForm((v) => !v)}>
        <Plus className="h-4 w-4 mr-2" />
        Create QR Code
      </Button>
      {showForm && (
        <div className="mb-8 mt-4">
          <QRGeneratorForm />
        </div>
      )}
    </>
  )
}


