"use client"

import { HeroSection } from "@/components/hero-section"
import { CollectionCard } from "@/components/collection-card"
import { WalletCard } from "@/components/wallet-card"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

// Dados simulados para demonstração
const upcomingCollections = [
  {
    id: "col123456",
    date: "24/05/2024",
    time: "14:00 - 16:00",
    address: "Rua das Flores, 123 - Jardim Primavera",
    status: "scheduled" as const,
    estimatedWeight: 3.5,
  },
  {
    id: "col123457",
    date: "28/05/2024",
    time: "10:00 - 12:00",
    address: "Av. Principal, 456 - Centro",
    status: "pending" as const,
    estimatedWeight: 2,
  },
]

const walletData = {
  balance: 87.5,
  lastPayment: {
    amount: 17.5,
    date: "18/05/2024",
  },
}

export default function HomePage() {
  const { t } = useLanguage()
  useScrollToTop()

  return (
    <div className="min-h-screen pb-20">
      <main className="pb-20 relative min-h-screen">
        <div className="main-content">
          <HeroSection />

          {/* Carteira */}
          <div className="px-4 mb-6">
            <WalletCard {...walletData} />
          </div>

          <div className="px-4 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("home.upcoming")}</h2>
              <Link href="/collections">
                <Button variant="ghost" size="sm">
                  {t("home.viewAll")}
                </Button>
              </Link>
            </div>

            {upcomingCollections.length > 0 ? (
              upcomingCollections.map((collection) => <CollectionCard key={collection.id} {...collection} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("home.noCollections")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}
