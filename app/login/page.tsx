"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { FormMessage } from "@/components/auth/form-message"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { type LoginFormValues, loginSchema } from "@/lib/validators/auth"

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || t("auth.error.invalidCredentials"))
      }

      // Redirect to home page on successful login
      router.push("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error.generic"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout title={t("auth.login.title")} subtitle={t("auth.login.subtitle")}>
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
            <p className="text-sm text-red-500 mt-1">{t(`auth.validation.${errors.email.message || "required"}`)}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium">
              {t("auth.login.password")}
            </label>
            <Link href="/reset-password" className="text-xs text-[#40A578] hover:underline">
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
            <p className="text-sm text-red-500 mt-1">{t(`auth.validation.${errors.password.message || "required"}`)}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="rememberMe" {...register("rememberMe")} />
          <label
            htmlFor="rememberMe"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {t("auth.login.rememberMe")}
          </label>
        </div>

        {error && <FormMessage type="error" message={error} />}

        <Button type="submit" className="w-full bg-[#40A578] hover:bg-[#348c65]" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("auth.login.loading")}
            </>
          ) : (
            t("auth.login.button")
          )}
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t("auth.login.noAccount")}{" "}
            <Link href="/register" className="text-[#40A578] hover:underline font-medium">
              {t("auth.login.createAccount")}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  )
}
