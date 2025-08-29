"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft, Download, Filter } from "lucide-react"
import { format } from "date-fns"
import { ptBR, enUS } from "date-fns/locale"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  date: Date
  status: "completed" | "pending" | "failed"
}

interface WalletStatementProps {
  onBack: () => void
}

export function WalletStatement({ onBack }: WalletStatementProps) {
  const { t, language } = useLanguage()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const locale = language === "pt-BR" ? ptBR : enUS

  useEffect(() => {
    // Simular carregamento de transações
    const mockTransactions: Transaction[] = [
      {
        id: "1",
        type: "credit",
        amount: 17.5,
        description: language === "pt-BR" ? "Coleta #3455" : "Collection #3455",
        date: new Date(2024, 4, 18),
        status: "completed",
      },
      {
        id: "2",
        type: "credit",
        amount: 15.0,
        description: language === "pt-BR" ? "Coleta #3454" : "Collection #3454",
        date: new Date(2024, 4, 10),
        status: "completed",
      },
      {
        id: "3",
        type: "debit",
        amount: 50.0,
        description: language === "pt-BR" ? "Saque via Pix" : "Digital Withdrawal",
        date: new Date(2024, 4, 5),
        status: "completed",
      },
      {
        id: "4",
        type: "credit",
        amount: 22.5,
        description: language === "pt-BR" ? "Coleta #3453" : "Collection #3453",
        date: new Date(2024, 4, 1),
        status: "completed",
      },
      {
        id: "5",
        type: "credit",
        amount: 12.0,
        description: language === "pt-BR" ? "Coleta #3452" : "Collection #3452",
        date: new Date(2024, 3, 28),
        status: "completed",
      },
    ]

    setTimeout(() => {
      setTransactions(mockTransactions)
      setIsLoading(false)
    }, 1000)
  }, [language])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "failed":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return language === "pt-BR" ? "Concluído" : "Completed"
      case "pending":
        return language === "pt-BR" ? "Pendente" : "Pending"
      case "failed":
        return language === "pt-BR" ? "Falhou" : "Failed"
      default:
        return status
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
          <h2 className="text-xl font-semibold">{language === "pt-BR" ? "Extrato da Carteira" : "Wallet Statement"}</h2>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Filter size={16} />
          </Button>
          <Button variant="outline" size="icon">
            <Download size={16} />
          </Button>
        </div>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">
          {language === "pt-BR" ? "Histórico de Transações" : "Transaction History"}
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(transaction.date, language === "pt-BR" ? "dd/MM/yyyy" : "MM/dd/yyyy", { locale })}
                  </p>
                  <p className={`text-xs ${getStatusColor(transaction.status)}`}>{getStatusText(transaction.status)}</p>
                </div>
                <p className={`font-medium ${transaction.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                  {transaction.type === "credit" ? "+" : "-"}{" "}
                  {language === "pt-BR"
                    ? `R$ ${transaction.amount.toFixed(2).replace(".", ",")}`
                    : `$${transaction.amount.toFixed(2)}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
