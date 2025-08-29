"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"

interface PaymentMethod {
  id: string
  type: "email" | "phone" | "cpf" | "random"
  key: string
  label?: string
  isDefault: boolean
}

interface EditPaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  onEdit: (method: PaymentMethod) => void
  paymentMethod: PaymentMethod
}

export function EditPaymentMethodModal({ isOpen, onClose, onEdit, paymentMethod }: EditPaymentMethodModalProps) {
  const { language } = useLanguage()
  const [key, setKey] = useState(paymentMethod.key)
  const [label, setLabel] = useState(paymentMethod.label || "")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setKey(paymentMethod.key)
    setLabel(paymentMethod.label || "")
  }, [paymentMethod])

  const validateKey = (type: string, value: string) => {
    switch (type) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case "phone":
        return /^$$\d{2}$$\s\d{4,5}-\d{4}$/.test(value)
      case "cpf":
        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)
      case "random":
        return value.length >= 32
      default:
        return false
    }
  }

  const formatInput = (type: string, value: string) => {
    switch (type) {
      case "phone":
        const digits = value.replace(/\D/g, "")
        if (digits.length <= 11) {
          return digits.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3")
        }
        return value
      case "cpf":
        const cpfDigits = value.replace(/\D/g, "")
        if (cpfDigits.length <= 11) {
          return cpfDigits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
        }
        return value
      default:
        return value
    }
  }

  const handleKeyChange = (value: string) => {
    const formatted = formatInput(paymentMethod.type, value)
    setKey(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateKey(paymentMethod.type, key)) {
      alert(language === "pt-BR" ? "Por favor, insira uma chave válida." : "Please enter a valid key.")
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onEdit({
        ...paymentMethod,
        key,
        label: label || undefined,
      })
    } catch (error) {
      console.error("Failed to edit payment method:", error)
      alert(language === "pt-BR" ? "Erro ao editar método de pagamento." : "Failed to edit payment method.")
    } finally {
      setIsLoading(false)
    }
  }

  const getPlaceholder = (type: string) => {
    switch (type) {
      case "email":
        return "exemplo@email.com"
      case "phone":
        return "(11) 99999-9999"
      case "cpf":
        return "000.000.000-00"
      case "random":
        return language === "pt-BR" ? "Cole aqui a chave aleatória do seu banco" : "Paste your bank's random key here"
      default:
        return ""
    }
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      email: language === "pt-BR" ? "Email" : "Email",
      phone: language === "pt-BR" ? "Telefone" : "Phone",
      cpf: language === "pt-BR" ? "CPF" : "CPF",
      random: language === "pt-BR" ? "Chave Aleatória" : "Random Key",
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{language === "pt-BR" ? "Editar Chave Pix" : "Edit Pix Key"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>{language === "pt-BR" ? "Tipo de Chave" : "Key Type"}</Label>
            <div className="p-2 bg-muted rounded-md text-sm">
              {getTypeLabel(paymentMethod.type)}{" "}
              {paymentMethod.type === "email"
                ? "📧"
                : paymentMethod.type === "phone"
                  ? "📱"
                  : paymentMethod.type === "cpf"
                    ? "🆔"
                    : "🔑"}
            </div>
          </div>

          <div>
            <Label htmlFor="key">{language === "pt-BR" ? "Chave" : "Key"}</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={getPlaceholder(paymentMethod.type)}
              required
            />
          </div>

          <div>
            <Label htmlFor="label">{language === "pt-BR" ? "Nome (opcional)" : "Label (optional)"}</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={
                language === "pt-BR" ? "Ex: Email principal, Celular pessoal..." : "Ex: Main email, Personal phone..."
              }
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? language === "pt-BR"
                  ? "Salvando..."
                  : "Saving..."
                : language === "pt-BR"
                  ? "Salvar"
                  : "Save"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              {language === "pt-BR" ? "Cancelar" : "Cancel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
