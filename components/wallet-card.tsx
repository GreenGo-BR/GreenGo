"use client"

import { Wallet } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface WalletCardProps {
  balance: number
  lastPayment?: {
    amount: number
    date: string
  }
  onViewStatement?: () => void
}

export function WalletCard({ balance, lastPayment, onViewStatement }: WalletCardProps) {
  const { t, language } = useLanguage()

  return (
    <GlassCard className="mb-4 relative overflow-hidden">
      {/* Latinha decorativa no canto */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 opacity-20 pointer-events-none">
        <Image src="/images/latinha.png" alt="" width={64} height={64} />
      </div>

      <div className="flex items-center justify-between mb-3 relative z-10">
        <h3 className="font-medium text-lg flex items-center">
          <Wallet size={20} className="mr-2 text-primary" />
          {t("wallet.title")}
        </h3>
        {onViewStatement ? (
          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={onViewStatement}>
            {t("wallet.viewStatement")}
          </Button>
        ) : (
          <Link href="/profile/wallet">
            <Button variant="ghost" size="sm" className="h-8 text-xs">
              {t("wallet.viewStatement")}
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col relative z-10">
        <div className="mb-2">
          <span className="text-muted-foreground text-sm">{t("wallet.balance")}</span>
          <div className="text-2xl font-bold text-primary">
            {language === "pt-BR" ? `R$ ${balance.toFixed(2).replace(".", ",")}` : `$${balance.toFixed(2)}`}
          </div>
        </div>

        {lastPayment && (
          <div className="text-sm">
            <span className="text-muted-foreground">{t("wallet.lastPayment")} </span>
            <span className="font-medium">
              {language === "pt-BR"
                ? `R$ ${lastPayment.amount.toFixed(2).replace(".", ",")}`
                : `$${lastPayment.amount.toFixed(2)}`}
            </span>
            <span className="text-muted-foreground ml-1">
              {t("wallet.in")} {lastPayment.date}
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  )
}
