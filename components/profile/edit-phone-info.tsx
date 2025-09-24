"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { type PhoneInfoFormValues } from "@/lib/validators/auth";
import { api } from "@/lib/api";

interface EditPhoneInfoProps {
  initialData: {
    phone: string;
  };
  token: string;
  onSave: (data: PhoneInfoFormValues) => void;
  onCancel: () => void;
}

const countries = [
  { code: "BR", name: { "pt-BR": "Brasil", "en-US": "Brazil" } },
  { code: "US", name: { "pt-BR": "Estados Unidos", "en-US": "United States" } },
  { code: "CA", name: { "pt-BR": "Canadá", "en-US": "Canada" } },
  { code: "PT", name: { "pt-BR": "Portugal", "en-US": "Portugal" } },
  { code: "ES", name: { "pt-BR": "Espanha", "en-US": "Spain" } },
];

export function EditPhoneInfo({ initialData, onCancel }: EditPhoneInfoProps) {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");

  console.log("auth instance:", auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PhoneInfoFormValues>({
    defaultValues: initialData,
  });

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }
  };

  const onSubmit = async (data: PhoneInfoFormValues) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (step === "phone") {
        setupRecaptcha();
        const appVerifier = (window as any).recaptchaVerifier;
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          data.phone,
          appVerifier
        );
        (window as any).confirmationResult = confirmationResult;

        setStep("otp");
        setSuccess("OTP sent! Please check your phone.");
      } else {
        // Step 2: Verify OTP and link phone
        const confirmationResult = (window as any).confirmationResult;
        if (!confirmationResult) throw new Error("No OTP request in progress.");

        const result = await confirmationResult.confirm(data.otp);
        const user = result.user;

        setSuccess("Phone number linked successfully!");
        console.log("Phone linked to user:", user.phoneNumber);
      }
      /*  let payload = {
        phone: data.phone,
      };
      const res = await api().post("/profile/edit", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setSuccess(
          language === "pt-BR"
            ? "Informações atualizadas com sucesso!"
            : "Information updated successfully!"
        );
        setTimeout(() => {
          onSave(data);
        }, 1500);
      } */
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {step === "phone" ? (
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("profile.phone")}
            </label>
            <Input
              id="phone"
              type="text"
              placeholder={
                language === "pt-BR"
                  ? "Seu número de telefone"
                  : "Your phone number"
              }
              {...register("phone", { required: "Phone number is required" })}
              className={errors.phone ? "border-red-300" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
        ) : (
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {t("profile.phoneotp")}
            </label>
            <Input
              id="otp"
              type="text"
              placeholder={
                language === "pt-BR" ? "Digite o código OTP" : "Enter OTP"
              }
              {...register("otp", { required: "OTP is required" })}
              className={errors.otp ? "border-red-300" : ""}
            />
            {errors.otp && (
              <p className="text-sm text-red-500 mt-1">{errors.otp.message}</p>
            )}
          </div>
        )}
        <div id="recaptcha-container"></div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400">
            {success}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#40A578] hover:bg-[#348c65] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === "pt-BR"
                ? step === "phone"
                  ? "Enviando código..."
                  : "Confirmando código..."
                : step === "phone"
                ? "Sending code..."
                : "Confirming code..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {language === "pt-BR"
                ? step === "phone"
                  ? "Enviar código"
                  : "Confirmar código"
                : step === "phone"
                ? "Send code"
                : "Confirm code"}
            </>
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          {language === "pt-BR" ? "Cancelar" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
