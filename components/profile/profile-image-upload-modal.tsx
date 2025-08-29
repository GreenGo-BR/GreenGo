"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { Upload, X, Camera, Loader2 } from "lucide-react"
import Image from "next/image"

interface ProfileImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  currentImage: string | null
  onImageUpdate: (imageUrl: string) => void
}

export function ProfileImageUploadModal({
  isOpen,
  onClose,
  currentImage,
  onImageUpdate,
}: ProfileImageUploadModalProps) {
  const { language } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith("image/")) {
      if (file.size > 5 * 1024 * 1024) {
        alert(language === "pt-BR" ? "Arquivo muito grande. Máximo 5MB." : "File too large. Maximum 5MB.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      alert(language === "pt-BR" ? "Por favor, selecione uma imagem." : "Please select an image file.")
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedImage) return

    setIsUploading(true)

    try {
      // Simulação de upload
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simular URL da imagem uploadada
      const uploadedImageUrl = selectedImage

      onImageUpdate(uploadedImageUrl)
      onClose()
      setSelectedImage(null)
    } catch (error) {
      alert(language === "pt-BR" ? "Erro ao fazer upload da imagem." : "Error uploading image.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{language === "pt-BR" ? "Alterar foto do perfil" : "Change profile picture"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {selectedImage ? (
            <div className="space-y-4">
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src={selectedImage || "/placeholder.svg"}
                  alt="Preview"
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleRemoveImage} className="flex-1 bg-transparent">
                  <X className="mr-2 h-4 w-4" />
                  {language === "pt-BR" ? "Remover" : "Remove"}
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-[#40A578] hover:bg-[#348c65]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {language === "pt-BR" ? "Enviando..." : "Uploading..."}
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      {language === "pt-BR" ? "Salvar" : "Save"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-[#40A578] bg-[#40A578]/10" : "border-gray-300 hover:border-[#40A578]"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-4">
                {language === "pt-BR"
                  ? "Arraste uma imagem aqui ou clique para selecionar"
                  : "Drag an image here or click to select"}
              </p>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                {language === "pt-BR" ? "Selecionar arquivo" : "Select file"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <p className="text-xs text-gray-500 mt-2">{language === "pt-BR" ? "Máximo 5MB" : "Maximum 5MB"}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
