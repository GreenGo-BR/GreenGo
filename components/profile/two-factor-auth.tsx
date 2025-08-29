"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GlassCard } from "@/components/ui/glass-card"
import { FormMessage } from "@/components/auth/form-message"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft, Shield, Smartphone, QrCode } from "lucide-react"

interface TwoFactorAuthProps {
  onBack: () => void
}

export function TwoFactorAuth({ onBack }: TwoFactorAuthProps) {
  const { language } = useLanguage()
  const [isEnabled, setIsEnabled] = useState(false)
  const [step, setStep] = useState(1)
  const [verificationCode, setVerificationCode] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleEnable2FA = () => {
    setStep(2)
  }

  const handleVerifyCode = () => {
    if (verificationCode.length === 6) {
      setIsEnabled(true)
      setMessage({
        type: "success",
        text:
          language === "pt-BR"
            ? "Verificação em duas etapas ativada com sucesso!"
            : "Two-factor authentication enabled successfully!",
      })
      setStep(3)
    } else {
      setMessage({
        type: "error",
        text: language === "pt-BR" ? "Código inválido" : "Invalid code",
      })
    }
  }

  const handleDisable2FA = () => {
    setIsEnabled(false)
    setStep(1)
    setMessage({
      type: "success",
      text: language === "pt-BR" ? "Verificação em duas etapas desativada" : "Two-factor authentication disabled",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-xl font-semibold">
          {language === "pt-BR" ? "Verificação em Duas Etapas" : "Two-Factor Authentication"}
        </h2>
      </div>

      <GlassCard>
        {step === 1 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>

            <h3 className="text-lg font-semibold">
              {language === "pt-BR" ? "Proteja sua conta" : "Protect your account"}
            </h3>

            <p className="text-muted-foreground">
              {language === "pt-BR"
                ? "Adicione uma camada extra de segurança à sua conta com a verificação em duas etapas."
                : "Add an extra layer of security to your account with two-factor authentication."}
            </p>

            {!isEnabled ? (
              <Button onClick={handleEnable2FA} className="w-full bg-[#40A578] hover:bg-[#348c65]">
                <Smartphone className="mr-2 h-4 w-4" />
                {language === "pt-BR" ? "Ativar 2FA" : "Enable 2FA"}
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">{language === "pt-BR" ? "2FA Ativado" : "2FA Enabled"}</p>
                <Button onClick={handleDisable2FA} variant="outline" className="w-full">
                  {language === "pt-BR" ? "Desativar 2FA" : "Disable 2FA"}
                </Button>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <QrCode className="h-16 w-16 text-gray-400" />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {language === "pt-BR" ? "Escaneie o QR Code" : "Scan QR Code"}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                {language === "pt-BR"
                  ? "Use um app autenticador como Google Authenticator ou Authy para escanear este código."
                  : "Use an authenticator app like Google Authenticator or Authy to scan this code."}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {language === "pt-BR" ? "Código de Verificação" : "Verification Code"}
              </label>
              <Input
                type="text"
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                className="text-center text-lg tracking-widest"
              />
            </div>

            {message && <FormMessage type={message.type} message={message.text} />}

            <Button
              onClick={handleVerifyCode}
              disabled={verificationCode.length !== 6}
              className="w-full bg-[#40A578] hover:bg-[#348c65]"
            >
              {language === "pt-BR" ? "Verificar e Ativar" : "Verify and Enable"}
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="h-8 w-8 text-green-600" />
            </div>

            <h3 className="text-lg font-semibold text-green-600">
              {language === "pt-BR" ? "2FA Ativado!" : "2FA Enabled!"}
            </h3>

            <p className="text-muted-foreground">
              {language === "pt-BR"
                ? "Sua conta agora está protegida com verificação em duas etapas."
                : "Your account is now protected with two-factor authentication."}
            </p>

            <Button onClick={() => onBack()} className="w-full">
              {language === "pt-BR" ? "Concluir" : "Done"}
            </Button>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
