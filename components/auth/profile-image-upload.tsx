"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface ProfileImageUploadProps {
  onChange: (files: FileList | null) => void
}

export function ProfileImageUpload({ onChange }: ProfileImageUploadProps) {
  const { t } = useLanguage()
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files && files.length > 0) {
      const file = files[0]
      onChange(files)

      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onChange(null)
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        <div
          className={`w-24 h-24 rounded-full overflow-hidden flex items-center justify-center ${preview ? "" : "bg-gray-100"}`}
        >
          {preview ? (
            <Image
              src={preview || "/placeholder.svg"}
              alt="Profile preview"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          ) : (
            <Camera className="h-8 w-8 text-gray-400" />
          )}
        </div>

        {preview && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="profile-image"
      />

      <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
        {preview
          ? t("auth.register.changeImage") || "Alterar imagem"
          : t("auth.register.uploadImage") || "Adicionar imagem"}
      </Button>
    </div>
  )
}
