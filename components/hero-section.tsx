"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { HeroFloatingCans } from "@/components/hero-floating-cans"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <div className="relative overflow-hidden pt-8 pb-12 px-4 text-center min-h-[400px]">
      {/* Latinhas flutuantes com distribuição otimizada */}
      <HeroFloatingCans count={6} />

      {/* Conteúdo principal com z-index alto */}
      <div className="hero-content relative z-20">
        <div className="flex justify-center mb-4">
          <div className="h-16 relative logo-image">
            <Image
              src="/images/greengo10.png"
              alt="GreenGo"
              width={200}
              height={64}
              priority
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                boxShadow: "none",
              }}
            />
          </div>
        </div>

        <p className="text-lg mb-6 text-muted-foreground">{t("home.slogan")}</p>

        <Link href="/schedule">
          <Button
            size="lg"
            className="rounded-full px-8 py-6 text-base shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 z-20 relative"
          >
            {t("home.schedule")}
          </Button>
        </Link>
      </div>
    </div>
  )
}
