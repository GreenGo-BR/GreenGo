"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/auth/form-message";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  type ResetPasswordFormValues,
  resetPasswordSchema,
} from "@/lib/validators/auth";
import { api } from "@/lib/api";

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      const res = api().post("reset_password", data);
      router.push("/reset-password/confirm");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.reset.title")}
      subtitle={t("auth.reset.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t("auth.reset.email")}
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu.email@exemplo.com"
            {...register("email")}
            className={errors.email ? "border-red-300" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">
              {t("auth.validation.email")}
            </p>
          )}
        </div>

        {error && <FormMessage type="error" message={error} />}

        <Button
          type="submit"
          className="w-full bg-[#40A578] hover:bg-[#348c65]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.reset.loading")}
            </>
          ) : (
            t("auth.reset.button")
          )}
        </Button>

        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-[#40A578] hover:underline text-sm"
          >
            {t("auth.reset.backToLogin")}
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
