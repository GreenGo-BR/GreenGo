"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage } from "@/components/auth/form-message";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { type LoginFormValues, loginSchema } from "@/lib/validators/auth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { api } from "@/lib/api";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const savedLogin =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("rememberedLogin") || "null")
      : "";

  useAuthRedirect();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: savedLogin ? savedLogin.email : "",
      password: "",
      rememberMe: savedLogin ? savedLogin.rememberMe : false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      api()
        .post("login", data)
        .then(function (res) {
          if (res.data) {
            if (data.rememberMe) {
              localStorage.setItem(
                "rememberedLogin",
                JSON.stringify({
                  email: data.email,
                  rememberMe: data.rememberMe,
                })
              );
            } else {
              localStorage.removeItem("rememberedLogin");
            }
            if (res.data.twofa_required && res.data.temp_token) {
              localStorage.setItem("tempToken", res.data.temp_token);
              router.push("/2fa");
              return;
            }

            if (res.data.token) {
              localStorage.setItem("authToken", res.data.token);
              router.push("/home");
            } else {
              setError(res.data.message || "Login failed. Try again.");
            }
          } else {
            setError(res.data.message);
          }
        })
        .catch(function (err) {
          setError("Invalid Password!");
        });
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || t("auth.error.generic");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t("auth.login.email")}
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
              {t(`auth.validation.${errors.email.message || "required"}`)}
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium">
              {t("auth.login.password")}
            </label>
            <Link
              href="/reset-password"
              className="text-xs text-[#40A578] hover:underline"
            >
              {t("auth.login.forgotPassword")}
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-red-300" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {t(`auth.validation.${errors.password.message || "required"}`)}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue("rememberMe", !!checked)}
          />
          <input type="hidden" {...register("rememberMe")} />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("auth.login.rememberMe")}
          </label>
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
              {t("auth.login.loading")}
            </>
          ) : (
            t("auth.login.button")
          )}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400">{t("auth.login.or")}</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <Button
        type="button"
        className="w-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-2"
      >
        <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 2.06.54 4.06 1.56 5.84L.5 23.5l5.82-1.53A11.5 11.5 0 0 0 12 23.5c6.35 0 11.5-5.15 11.5-11.5S18.35.5 12 .5zm0 21a9.5 9.5 0 0 1-4.83-1.28l-.34-.2-3.45.9.92-3.36-.22-.35A9.5 9.5 0 1 1 12 21.5zm5.54-6.96c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.66.15-.2.3-.77.97-.95 1.17-.17.2-.35.23-.65.08-.3-.15-1.26-.47-2.4-1.5-.89-.8-1.5-1.77-1.67-2.07-.18-.3-.02-.46.13-.6.14-.14.3-.35.46-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.66-1.59-.91-2.18-.24-.58-.49-.5-.66-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.03-1.05 2.52s1.08 2.93 1.23 3.13c.15.2 2.13 3.26 5.17 4.57.72.31 1.28.49 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35z" />
        </svg>
        {t("auth.login.whatsapp")}
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground gap-2">
          {t("auth.login.noAccount")}{" "}
          <Link
            href="/register"
            className="text-[#40A578] hover:underline font-medium"
          >
            {t("auth.login.createAccount")}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
