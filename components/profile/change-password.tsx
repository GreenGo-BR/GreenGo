"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import { FormMessage } from "@/components/auth/form-message";
import { useLanguage } from "@/contexts/language-context";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import {
  newPasswordSchema,
  type NewPasswordFormValues,
} from "@/lib/validators/auth";
import { api } from "@/lib/api";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface ChangePasswordProps {
  token: string;
  onBack: () => void;
  onClose: () => void;
}

export function ChangePassword({ token, onBack }: ChangePasswordProps) {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      oldpassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error("No authenticated user found");
      }

      const credential = EmailAuthProvider.credential(
        user.email,
        data.oldpassword
      );
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, data.password);

      setMessage({
        type: "success",
        text:
          language === "pt-BR"
            ? "Senha alterada com sucesso!"
            : "Password changed successfully!",
      });

      setTimeout(() => {
        onBack();
      }, 2000);
      /* let payload = {
        newpass: data.password,
        confirmpass: data.confirmPassword,
      };
      const res = await api().post("/profile/changepassword", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setMessage({
          type: "success",
          text:
            language === "pt-BR"
              ? "Senha alterada com sucesso!"
              : "Password changed successfully!",
        });

        reset();

        setTimeout(() => {
          onBack();
        }, 2000);
      } else {
        throw new Error("Erro ao alterar senha");
      } */
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setMessage({
          type: "error",
          text:
            language === "pt-BR"
              ? "Senha atual incorreta."
              : "Current password is incorrect.",
        });
      } else if (error.code === "auth/weak-password") {
        setMessage({
          type: "error",
          text:
            language === "pt-BR"
              ? "A nova senha é muito fraca."
              : "The new password is too weak.",
        });
      } else {
        setMessage({
          type: "error",
          text:
            language === "pt-BR"
              ? "Erro ao alterar senha. Tente novamente."
              : "Error changing password. Try again.",
        });
      }
    } finally {
      setIsLoading(false);
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
              {language === "pt-BR" ? "Alterar Senha" : "Change Password"}
            </h2>
          </div>

          <GlassCard>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "pt-BR" ? "Nova Senha" : "Old Password"}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("oldpassword")}
                  className={errors.oldpassword ? "border-red-300" : ""}
                />
                {errors.oldpassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {t(
                      `auth.validation.oldpassword.${
                        errors.oldpassword.message || "min"
                      }`
                    )}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "pt-BR" ? "Nova Senha" : "New Password"}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-red-300" : ""}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">
                    {t(
                      `auth.validation.password.${
                        errors.password.message || "min"
                      }`
                    )}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  {language === "pt-BR"
                    ? "Confirmar Nova Senha"
                    : "Confirm New Password"}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className={errors.confirmPassword ? "border-red-300" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {t("auth.validation.password.match")}
                  </p>
                )}
              </div>

              {message && (
                <FormMessage type={message.type} message={message.text} />
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#40A578] hover:bg-[#348c65]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {language === "pt-BR" ? "Alterando..." : "Changing..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {language === "pt-BR" ? "Alterar Senha" : "Change Password"}
                  </>
                )}
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
