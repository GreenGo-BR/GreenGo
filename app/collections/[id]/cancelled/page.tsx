"use client"

import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { CheckCircle2, Calendar, Home } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

export default function CollectionCancelledPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const { id } = params

  return (
    <main className="p-4 flex flex-col items-center justify-center min-h-[80vh] relative">
      <div className="main-content flex flex-col items-center max-w-md w-full">
        <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6">
          <CheckCircle2 size={40} className="text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">
          {language === "pt-BR" ? "Coleta Cancelada" : "Collection Cancelled"}
        </h1>

        <p className="text-center text-muted-foreground mb-8">
          {language === "pt-BR"
            ? `A coleta #${id.slice(-4)} foi cancelada com sucesso.`
            : `Collection #${id.slice(-4)} has been successfully cancelled.`}
        </p>

        <GlassCard className="w-full mb-6">
          <div className="text-center space-y-3">
            <div className="h-12 w-32 relative mx-auto mb-4">
              <Image src="/images/greengo10.png" alt="GreenGo" fill style={{ objectFit: "contain" }} />
            </div>

            <h3 className="font-semibold">{language === "pt-BR" ? "O que acontece agora?" : "What happens now?"}</h3>

            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                {language === "pt-BR"
                  ? "Sua coleta foi removida da agenda"
                  : "Your collection has been removed from the schedule"}
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                {language === "pt-BR" ? "Nenhuma cobrança será feita" : "No charges will be applied"}
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                {language === "pt-BR"
                  ? "Você pode agendar uma nova coleta a qualquer momento"
                  : "You can schedule a new collection at any time"}
              </li>
            </ul>
          </div>
        </GlassCard>

        <div className="flex gap-3 w-full">
          <Link href="/collections" className="flex-1">
            <Button variant="outline" className="w-full bg-transparent">
              <Calendar className="mr-2 h-4 w-4" />
              {language === "pt-BR" ? "Minhas Coletas" : "My Collections"}
            </Button>
          </Link>
          <Link href="/schedule" className="flex-1">
            <Button className="w-full">{language === "pt-BR" ? "Nova Coleta" : "New Collection"}</Button>
          </Link>
        </div>

        <Link href="/home" className="mt-4">
          <Button variant="ghost" size="sm">
            <Home className="mr-2 h-4 w-4" />
            {language === "pt-BR" ? "Voltar ao Início" : "Back to Home"}
          </Button>
        </Link>
      </div>
    </main>
  )
}
