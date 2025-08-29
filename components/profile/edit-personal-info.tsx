"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { FormMessage } from "@/components/auth/form-message"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, Save, X } from "lucide-react"

interface UserData {
  name: string
  email: string
  phone: string
  address: string
}

interface EditPersonalInfoProps {
  userData: UserData
  onCancel: () => void
  onSave: (data: UserData) => void
}

export function EditPersonalInfo({ userData, onCancel, onSave }: EditPersonalInfoProps) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      address: userData.address || "",
    },
  })

  const onSubmit = async (data: UserData) => {
    setIsLoading(true)
    setMessage(null)

    try {
      // Simulação de API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simular possível erro (10% de chance)
      if (Math.random() < 0.1) {
        throw new Error("Erro simulado")
      }

      onSave(data)
      setMessage({
        type: "success",
        text: t("profile.updateSuccess") || "Informações atualizadas com sucesso!",
      })

      setTimeout(() => {
        onCancel()
      }, 1500)
    } catch (error) {
      setMessage({
        type: "error",
        text: t("profile.updateError") || "Erro ao atualizar informações. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <GlassCard>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{t("profile.editPersonalInfo") || "Editar Informações Pessoais"}</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X size={16} />
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">{t("profile.name") || "Nome"}</label>
          <Input
            {...register("name", { required: "Nome é obrigatório" })}
            className={errors.name ? "border-red-300" : ""}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("profile.email") || "Email"}</label>
          <Input
            type="email"
            {...register("email", {
              required: "Email é obrigatório",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email inválido",
              },
            })}
            className={errors.email ? "border-red-300" : ""}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("profile.phone") || "Telefone"}</label>
          <Input
            {...register("phone", { required: "Telefone é obrigatório" })}
            className={errors.phone ? "border-red-300" : ""}
          />
          {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("profile.address") || "Endereço"}</label>
          <Input
            {...register("address", { required: "Endereço é obrigatório" })}
            className={errors.address ? "border-red-300" : ""}
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address.message}</p>}
        </div>

        {message && <FormMessage type={message.type} message={message.text} />}

        <div className="flex gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            {t("common.cancel") || "Cancelar"}
          </Button>
          <Button type="submit" disabled={isLoading} className="flex-1 bg-[#40A578] hover:bg-[#348c65]">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.saving") || "Salvando..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("common.save") || "Salvar"}
              </>
            )}
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
