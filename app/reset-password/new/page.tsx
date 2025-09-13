"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/auth/form-message";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  type NewPasswordFormValues,
  newPasswordSchema,
} from "@/lib/validators/auth";
import { api } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token: string) {
  try {
    const decoded: any = jwtDecode(token);
    if (!decoded.exp) return true;

    return decoded.exp < Date.now() / 1000;
  } catch {
    return true;
  }
}

export default function NewPasswordPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewPasswordFormValues>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: NewPasswordFormValues) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      if (!token) throw new Error("Reset token is missing. Please try again.");

      const payload = {
        token: token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const res = await api().post("reset_password/new", payload);

      setSuccess(t("auth.success.passwordReset"));

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  // If no token is provided, show an error
  if (!token) {
    return (
      <AuthLayout
        title={t("auth.reset.new.title")}
        subtitle={t("auth.reset.new.subtitle")}
      >
        <FormMessage type="error" message={t("auth.error.invalidToken")} />
        <div className="text-center mt-6">
          <Button
            onClick={() => router.push("/reset-password")}
            className="bg-[#40A578] hover:bg-[#348c65]"
          >
            {t("auth.reset.backToReset")}
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={t("auth.reset.new.title")}
      subtitle={t("auth.reset.new.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {t("auth.reset.new.password")}
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-red-300" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {t(
                `auth.validation.password.${errors.password.message || "min"}`
              )}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            {t("auth.reset.new.confirmPassword")}
          </label>
          <Input
            id="confirmPassword"
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

        {error && <FormMessage type="error" message={error} />}
        {success && <FormMessage type="success" message={success} />}

        <Button
          type="submit"
          className="w-full bg-[#40A578] hover:bg-[#348c65]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.reset.new.loading")}
            </>
          ) : (
            t("auth.reset.new.button")
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
