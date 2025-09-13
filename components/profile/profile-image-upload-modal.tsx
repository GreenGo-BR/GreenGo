"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Camera, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { api } from "@/lib/api";

interface ProfileImageUploadModalProps {
  onClose: () => void;
  onUpload: (imageUrl: string) => void;
  token: string;
  userId: number;
}

export function ProfileImageUploadModal({
  token,
  userId,
  onClose,
  onUpload,
}: ProfileImageUploadModalProps) {
  const { t, language } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    setError("");

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError(
        language === "pt-BR"
          ? "Por favor, selecione apenas arquivos de imagem"
          : "Please select only image files"
      );
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(
        language === "pt-BR"
          ? "A imagem deve ter no máximo 5MB"
          : "Image must be no larger than 5MB"
      );
      return;
    }

    setSelectedFile(file);

    // Create preview URL
    const url = URL.createObjectURL(file);

    setPreviewUrl(url);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError("");

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random error (5% chance)
      if (Math.random() < 0.05) {
        throw new Error(
          language === "pt-BR"
            ? "Erro ao fazer upload da imagem"
            : "Error uploading image"
        );
      }

      const formData = new FormData();
      formData.append("id", String(userId));
      formData.append("avatar", selectedFile);

      // Create a mock URL for the uploaded image
      /*     const mockUploadedUrl = `/placeholder.svg?height=80&width=80&text=${encodeURIComponent(
        selectedFile.name.slice(0, 2).toUpperCase()
      )}`; */

      const res = await api().post("/profile/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        onUpload(res.data.avatarUrl);
        onClose();
      } else {
        setError(res.data.message || "Upload failed");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "pt-BR"
          ? "Erro inesperado"
          : "Unexpected error"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-[#40A578]" />
            {language === "pt-BR"
              ? "Alterar Foto do Perfil"
              : "Change Profile Picture"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-[#40A578] transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                {language === "pt-BR"
                  ? "Arraste uma imagem aqui ou clique para selecionar"
                  : "Drag an image here or click to select"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {language === "pt-BR"
                  ? "PNG, JPG, GIF até 5MB"
                  : "PNG, JPG, GIF up to 5MB"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={previewUrl! || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                  <strong>{language === "pt-BR" ? "Arquivo:" : "File:"}</strong>{" "}
                  {selectedFile.name}
                </p>
                <p>
                  <strong>{language === "pt-BR" ? "Tamanho:" : "Size:"}</strong>{" "}
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            {selectedFile && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="flex-1 bg-[#40A578] hover:bg-[#348c65] text-white"
              >
                {isUploading ? (
                  <span>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "pt-BR" ? "Enviando..." : "Uploading..."}
                  </span>
                ) : (
                  "Upload"
                )}
              </Button>
            )}
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              <X className="mr-2 h-4 w-4" />
              {language === "pt-BR" ? "Cancelar" : "Cancel"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
