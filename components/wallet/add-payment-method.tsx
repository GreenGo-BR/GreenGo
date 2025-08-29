"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GlassCard } from "@/components/ui/glass-card"
import { FormMessage } from "@/components/auth/form-message"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, Save, X, CreditCard, Smartphone } from "lucide-react"

interface AddPaymentMethodProps {
  onCancel: () => void
  onSuccess: (method: any) => void
}

export function AddPaymentMethod({ onCancel, onSuccess }: AddPaymentMethodProps) {
  const { t, language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [paymentType, setPaymentType] = useState<string>("")

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch("/api/add-payment-method", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          type: paymentType,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao adicionar método de pagamento")
      }

      const newMethod = await response.json()
      onSuccess(newMethod)

      setMessage({
        type: "success",
        text:
          language === "pt-BR" ? "Método de pagamento adicionado com sucesso!" : "Payment method added successfully!",
      })

      setTimeout(() => {
        onCancel()
      }, 2000)
    } catch (error) {
      setMessage({
        type: "error",
        text: language === "pt-BR" ? "Erro ao adicionar método de pagamento" : "Error adding payment method",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          {language === "pt-BR" ? "Adicionar Método de Pagamento" : "Add Payment Method"}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {language === "pt-BR" ? "Tipo de Pagamento" : "Payment Type"}
          </label>
          <Select value={paymentType} onValueChange={(value) => setPaymentType(value)}>
            <SelectTrigger>
              <SelectValue placeholder={language === "pt-BR" ? "Selecione o tipo" : "Select type"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pix">
                <div className="flex items-center">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Pix
                </div>
              </SelectItem>
              <SelectItem value="bank">
                <div className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  {language === "pt-BR" ? "Conta Bancária" : "Bank Account"}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paymentType === "pix" && (
          <div>
            <label className="block text-sm font-medium mb-1">{language === "pt-BR" ? "Chave Pix" : "Pix Key"}</label>
            <Input
              {...register("pixKey", { required: true })}
              placeholder={language === "pt-BR" ? "Digite sua chave Pix" : "Enter your Pix key"}
              className={errors.pixKey ? "border-red-300" : ""}
            />
            {errors.pixKey && <p className="text-sm text-red-500 mt-1">{t("auth.validation.required")}</p>}
          </div>
        )}

        {paymentType === "bank" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">{language === "pt-BR" ? "Banco" : "Bank"}</label>
              <Input
                {...register("bankName", { required: true })}
                placeholder={language === "pt-BR" ? "Nome do banco" : "Bank name"}
                className={errors.bankName ? "border-red-300" : ""}
              />
              {errors.bankName && <p className="text-sm text-red-500 mt-1">{t("auth.validation.required")}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{language === "pt-BR" ? "Agência" : "Branch"}</label>
              <Input
                {...register("branch", { required: true })}
                placeholder={language === "pt-BR" ? "Número da agência" : "Branch number"}
                className={errors.branch ? "border-red-300" : ""}
              />
              {errors.branch && <p className="text-sm text-red-500 mt-1">{t("auth.validation.required")}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{language === "pt-BR" ? "Conta" : "Account"}</label>
              <Input
                {...register("account", { required: true })}
                placeholder={language === "pt-BR" ? "Número da conta" : "Account number"}
                className={errors.account ? "border-red-300" : ""}
              />
              {errors.account && <p className="text-sm text-red-500 mt-1">{t("auth.validation.required")}</p>}
            </div>
          </>
        )}

        {message && <FormMessage type={message.type} message={message.text} />}

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={isLoading || !paymentType} className="flex-1 bg-[#40A578] hover:bg-[#348c65]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "pt-BR" ? "Salvando..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("common.save")}
              </>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
