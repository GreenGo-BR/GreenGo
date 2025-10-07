"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { FormMessage } from "@/components/auth/form-message";
import { useLanguage } from "@/contexts/language-context";
import { ArrowLeft, Shield, Smartphone, QrCode } from "lucide-react";
import { api } from "@/lib/api";

interface TwoFactorAuthProps {
  token: string;
  onBack: () => void;
  onClose: () => void;
}

export function TwoFactorAuth({ token, onBack }: TwoFactorAuthProps) {
  const { t, language } = useLanguage();
  const [isEnabled, setIsEnabled] = useState(false);
  const [step, setStep] = useState(1);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const { data } = await api().get("/profile/twofa/status", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (data?.success) {
          setIsEnabled(data.enabled);
        }
      } catch (error) {
        console.error("Error checking 2FA status:", error);
      }
    };

    fetch2FAStatus();
  }, [token]);

  const handleEnable2FA = async () => {
    setStep(2);
    setMessage(null);

    try {
      const payload = {
        action: "generate",
        code: "",
      };

      const { data } = await api().post("/profile/twofa", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.success) {
        setQrCodeUrl(data.qrCode);
      } else {
        setMessage({
          type: "error",
          text: language
            ? "Erro ao ativar 2fa. Tente novamente."
            : "Error enable 2fa. Try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: language
          ? "Erro ao verificar código. Tente novamente."
          : "Error verifying code. Try again.",
      });
    }
  };

  const handleVerifyCode = async () => {
    const isPT = language === "pt-BR";

    if (verificationCode.length !== 6) {
      setMessage({
        type: "error",
        text: isPT ? "Código inválido" : "Invalid code",
      });
      return;
    }

    try {
      const payload = {
        action: "verify",
        code: verificationCode,
      };

      const { data } = await api().post("/profile/twofa", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.success) {
        setIsEnabled(true);
        setMessage({
          type: "success",
          text: isPT
            ? "Verificação em duas etapas ativada com sucesso!"
            : "Two-factor authentication enabled successfully!",
        });
        setStep(3);
      } else {
        setMessage({
          type: "error",
          text: data?.message || (isPT ? "Código inválido" : "Invalid code"),
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: isPT
          ? "Erro ao verificar código. Tente novamente."
          : "Error verifying code. Try again.",
      });
    }
  };

  const handleDisable2FA = async () => {
    try {
      const payload = {
        action: "disabled",
        code: "",
      };
      const { data } = await api().post("/profile/twofa", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.success) {
        setIsEnabled(false);
        setStep(1);
        setMessage({
          type: "success",
          text: language
            ? "Verificação em duas etapas desativada"
            : "Two-factor authentication disabled",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: language
          ? "Erro ao verificar código. Tente novamente."
          : "Error disabled two-factor. Try again.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="mr-2"
            >
              <ArrowLeft size={20} />
            </Button>
            <h2 className="text-xl font-semibold">
              {language === "pt-BR"
                ? "Verificação em Duas Etapas"
                : "Two-Factor Authentication"}
            </h2>
          </div>

          <GlassCard>
            {step === 1 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="text-lg font-semibold">
                  {language === "pt-BR"
                    ? "Proteja sua conta"
                    : "Protect your account"}
                </h3>

                <p className="text-muted-foreground">
                  {language === "pt-BR"
                    ? "Adicione uma camada extra de segurança à sua conta com a verificação em duas etapas."
                    : "Add an extra layer of security to your account with two-factor authentication."}
                </p>

                {!isEnabled ? (
                  <Button
                    onClick={handleEnable2FA}
                    className="w-full bg-[#40A578] hover:bg-[#348c65]"
                  >
                    <Smartphone className="mr-2 h-4 w-4" />
                    {language === "pt-BR" ? "Ativar 2FA" : "Enable 2FA"}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-green-600 font-medium">
                      {language === "pt-BR" ? "2FA Ativado" : "2FA Enabled"}
                    </p>
                    <Button
                      onClick={handleDisable2FA}
                      variant="outline"
                      className="w-full"
                    >
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
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        className="w-32 h-32 mx-auto rounded-md border"
                      />
                    ) : (
                      <div className="w-32 h-32 mx-auto flex items-center justify-center bg-gray-100 rounded-md">
                        <QrCode className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">
                    {language === "pt-BR"
                      ? "Escaneie o QR Code"
                      : "Scan QR Code"}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "pt-BR"
                      ? "Use um app autenticador como Google Authenticator ou Authy para escanear este código."
                      : "Use an authenticator app like Google Authenticator or Authy to scan this code."}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    {language === "pt-BR"
                      ? "Código de Verificação"
                      : "Verification Code"}
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

                {message && (
                  <FormMessage type={message.type} message={message.text} />
                )}

                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6}
                  className="w-full bg-[#40A578] hover:bg-[#348c65]"
                >
                  {language === "pt-BR"
                    ? "Verificar e Ativar"
                    : "Verify and Enable"}
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
      </div>
    </div>
  );
}
