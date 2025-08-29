"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/contexts/language-context"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen flex flex-col bg-[#EEFDF3]">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-40 relative">
                <Image src="/images/greengo10.png" alt="GreenGo" fill priority style={{ objectFit: "contain" }} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">{children}</div>
        </div>
      </div>

      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} GreenGo.{" "}
        {language === "pt-BR" ? "Todos os direitos reservados." : "All rights reserved."}
      </footer>
    </div>
  )
}
