"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Download, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import Navigation from "@/components/navigation"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

// Dados simulados para demonstração
const transactions = [
  {
    id: "txn001",
    type: "income" as const,
    description: "Coleta #3455",
    amount: 17.5,
    date: "18/05/2024",
    time: "14:30",
    status: "completed" as const,
  },
  {
    id: "txn002",
    type: "income" as const,
    description: "Coleta #3454",
    amount: 15.0,
    date: "10/05/2024",
    time: "11:15",
    status: "completed" as const,
  },
  {
    id: "txn003",
    type: "expense" as const,
    description: "Saque via Pix",
    amount: 50.0,
    date: "05/05/2024",
    time: "16:45",
    status: "completed" as const,
  },
  {
    id: "txn004",
    type: "income" as const,
    description: "Coleta #3453",
    amount: 22.5,
    date: "01/05/2024",
    time: "09:20",
    status: "completed" as const,
  },
  {
    id: "txn005",
    type: "income" as const,
    description: "Coleta #3452",
    amount: 18.75,
    date: "28/04/2024",
    time: "15:10",
    status: "completed" as const,
  },
  {
    id: "txn006",
    type: "expense" as const,
    description: "Saque via Pix",
    amount: 30.0,
    date: "25/04/2024",
    time: "10:30",
    status: "completed" as const,
  },
  {
    id: "txn007",
    type: "income" as const,
    description: "Coleta #3451",
    amount: 20.0,
    date: "20/04/2024",
    time: "13:45",
    status: "completed" as const,
  },
  {
    id: "txn008",
    type: "income" as const,
    description: "Coleta #3450",
    amount: 16.25,
    date: "15/04/2024",
    time: "12:20",
    status: "completed" as const,
  },
]

const accountSummary = {
  currentBalance: 87.5,
  totalIncome: 110.0,
  totalExpenses: 80.0,
  thisMonth: {
    income: 54.5,
    expenses: 50.0,
  },
}

export default function WalletStatementPage() {
  const { language } = useLanguage()
  const [activeFilter, setActiveFilter] = useState("all")
  useScrollToTop()

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeFilter === "all") return true
    if (activeFilter === "income") return transaction.type === "income"
    if (activeFilter === "expenses") return transaction.type === "expense"
    return true
  })

  const formatCurrency = (amount: number) => {
    return language === "pt-BR" ? `R$ ${amount.toFixed(2).replace(".", ",")}` : `$${(amount / 2).toFixed(2)}`
  }

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <main className="relative min-h-screen">
        <div className="main-content p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="mr-2">
                  <ArrowLeft size={20} />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold page-title">
                {language === "pt-BR" ? "Extrato da Carteira" : "Wallet Statement"}
              </h1>
            </div>
            <Button variant="outline" size="icon">
              <Download size={18} />
            </Button>
          </div>

          {/* Account Summary */}
          <GlassCard className="mb-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold mb-2">{language === "pt-BR" ? "Saldo Atual" : "Current Balance"}</h2>
              <p className="text-3xl font-bold text-primary">{formatCurrency(accountSummary.currentBalance)}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">
                  {language === "pt-BR" ? "Total Recebido" : "Total Income"}
                </p>
                <p className="font-semibold text-green-600">{formatCurrency(accountSummary.totalIncome)}</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">
                  {language === "pt-BR" ? "Total Gasto" : "Total Expenses"}
                </p>
                <p className="font-semibold text-red-600">{formatCurrency(accountSummary.totalExpenses)}</p>
              </div>
            </div>
          </GlassCard>

          {/* Filters */}
          <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">{language === "pt-BR" ? "Todas" : "All"}</TabsTrigger>
              <TabsTrigger value="income">{language === "pt-BR" ? "Entradas" : "Income"}</TabsTrigger>
              <TabsTrigger value="expenses">{language === "pt-BR" ? "Saídas" : "Expenses"}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter}>
              <GlassCard>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {language === "pt-BR" ? "Histórico de Transações" : "Transaction History"}
                  </h3>
                  <Badge variant="secondary">
                    {filteredTransactions.length} {language === "pt-BR" ? "transações" : "transactions"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-background rounded-full">{getTransactionIcon(transaction.type)}</div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.date} • {transaction.time}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"} {formatCurrency(transaction.amount)}
                        </p>
                        <Badge
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {transaction.status === "completed"
                            ? language === "pt-BR"
                              ? "Concluída"
                              : "Completed"
                            : language === "pt-BR"
                              ? "Pendente"
                              : "Pending"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {language === "pt-BR"
                        ? "Nenhuma transação encontrada para este filtro."
                        : "No transactions found for this filter."}
                    </p>
                  </div>
                )}
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Navigation />
    </div>
  )
}
