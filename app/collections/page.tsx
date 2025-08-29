"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CollectionCard } from "@/components/collection-card"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { FloatingCans } from "@/components/floating-cans"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

// Dados simulados para demonstração
const collections = [
  {
    id: "col123456",
    date: "25/05/2024",
    time: "14:00 - 16:00",
    address: "Rua das Palmeiras, 789 - Vila Nova",
    status: "scheduled" as const,
    estimatedWeight: 5.5,
  },
  {
    id: "col123455",
    date: "18/05/2024",
    time: "15:00 - 17:00",
    address: "Rua das Flores, 123 - Jardim Primavera",
    status: "completed" as const,
    estimatedWeight: 4.2,
  },
  {
    id: "col123454",
    date: "10/05/2024",
    time: "09:00 - 11:00",
    address: "Av. Principal, 456 - Centro",
    status: "completed" as const,
    estimatedWeight: 3,
  },
  {
    id: "col123453",
    date: "05/05/2024",
    time: "16:00 - 18:00",
    address: "Rua do Comércio, 321 - Centro",
    status: "cancelled" as const,
    estimatedWeight: 2.8,
  },
  {
    id: "col123452",
    date: "28/04/2024",
    time: "10:00 - 12:00",
    address: "Av. das Nações, 654 - Bairro Alto",
    status: "completed" as const,
    estimatedWeight: 6.1,
  },
]

export default function CollectionsPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const { language, t } = useLanguage()
  const router = useRouter()
  useScrollToTop()

  const statusCounts = {
    all: collections.length,
    scheduled: collections.filter((c) => c.status === "scheduled").length,
    completed: collections.filter((c) => c.status === "completed").length,
    cancelled: collections.filter((c) => c.status === "cancelled").length,
  }

  const filteredCollections = collections.filter((collection) => {
    if (selectedStatus === "all") return true
    return collection.status === selectedStatus
  })

  const getStatusText = (status: string) => {
    const statusMap = {
      all: language === "pt-BR" ? "Todas" : "All",
      scheduled: language === "pt-BR" ? "Agendadas" : "Scheduled",
      completed: language === "pt-BR" ? "Concluídas" : "Completed",
      cancelled: language === "pt-BR" ? "Canceladas" : "Cancelled",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  return (
    <div className="min-h-screen pb-20">
      <main className="pb-20 relative min-h-screen">
        <div className="main-content p-4">
          {/* Hero section com latinhas flutuantes */}
          <div className="relative overflow-hidden mb-6 min-h-[200px]">
            <FloatingCans count={5} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.back()}
                    className="mr-2 dark:text-black dark:hover:text-black dark:hover:bg-gray-200"
                  >
                    <ArrowLeft size={20} />
                  </Button>
                  <h1 className="text-2xl font-bold page-title">{t("collections.title")}</h1>
                </div>
                <Link href="/schedule">
                  <Button size="sm" className="bg-[#40A578] hover:bg-[#348c65]">
                    <Plus size={16} className="mr-1" />
                    {t("collections.new")}
                  </Button>
                </Link>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <GlassCard className="text-center">
                  <p className="text-2xl font-bold text-[#40A578]">{statusCounts.completed}</p>
                  <p className="text-sm text-muted-foreground">{t("collections.completed")}</p>
                </GlassCard>
                <GlassCard className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{statusCounts.scheduled}</p>
                  <p className="text-sm text-muted-foreground">{t("collections.scheduled")}</p>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {["all", "scheduled", "completed", "cancelled"].map((status) => (
              <Badge
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                className={`cursor-pointer whitespace-nowrap ${
                  selectedStatus === status ? "bg-[#40A578] hover:bg-[#348c65]" : "hover:bg-muted"
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {getStatusText(status)} ({statusCounts[status as keyof typeof statusCounts]})
              </Badge>
            ))}
          </div>

          {/* Lista de coletas */}
          <div className="space-y-3">
            {filteredCollections.length > 0 ? (
              filteredCollections.map((collection) => <CollectionCard key={collection.id} {...collection} />)
            ) : (
              <GlassCard className="text-center py-8">
                <p className="text-muted-foreground">
                  {language === "pt-BR"
                    ? "Nenhuma coleta encontrada para este filtro."
                    : "No collections found for this filter."}
                </p>
              </GlassCard>
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  )
}
