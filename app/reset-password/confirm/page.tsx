"use client"

import { AuthLayout } from "@/components/auth/auth-layout"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordConfirmPage() {
  const { t } = useLanguage()

  return (
    <AuthLayout title={t("auth.reset.confirm.title")} subtitle={t("auth.reset.confirm.subtitle")}>
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>

        <p className="text-center text-muted-foreground mb-8">{t("auth.reset.confirm.message")}</p>

        <Link href="/login" className="w-full">
          <Button className="w-full bg-[#40A578] hover:bg-[#348c65]">{t("auth.reset.backToLogin")}</Button>
        </Link>
      </div>
    </AuthLayout>
  )
}
