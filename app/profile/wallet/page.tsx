"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import Navigation from "@/components/navigation";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

type WalletStatementMethodProps = {
  token: string;
};

interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

function WalletStatementPage({ token }: WalletStatementMethodProps) {
  const { t, language } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accountSummary, setAccountSummary] = useState({
    currentBalance: 0.0,
    totalIncome: 0.0,
    totalExpenses: 0.0,
  });
  const [activeFilter, setActiveFilter] = useState("all");

  useScrollToTop();

  useEffect(() => {
    if (!token) return;
    const fetchWalletStatment = async () => {
      try {
        const res = await api().get("/walletstatement", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const transactions = (res.data?.result ?? []).map((n: any) => ({
          id: String(n.TransactionID),
          type: n.type_name,
          amount: n.amount * 1,
          description: n.reference_code,
          date: n.transaction_date,
          status: n.tran_status,
        }));

        setTransactions(transactions);
      } catch (err) {
        console.error(err);
        setTransactions([]);
      }
    };
    fetchWalletStatment();

    const fetchAccountSummary = async () => {
      try {
        const res = await api().get("/walletaccountsummary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.result || {};

        setAccountSummary({
          currentBalance: parseFloat(data.current_balance) || 0.0,
          totalIncome: parseFloat(data.total_income) || 0.0,
          totalExpenses: parseFloat(data.total_expense) || 0.0,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchAccountSummary();
  }, []);
  const filteredTransactions = transactions.filter((tran) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "income") return tran.type === "income";
    if (activeFilter === "expenses") return tran.type === "expense";
    return true;
  });

  const formatCurrency = (amount: number) => {
    return language === "pt-BR"
      ? `R$ ${amount.toFixed(2).replace(".", ",")}`
      : `$${amount.toFixed(2)}`;
  };

  const getTransactionIcon = (type: string) => {
    return type === "income" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

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
                {t("wallet.statement")}
              </h1>
            </div>
            <Button variant="outline" size="icon">
              <Download size={18} />
            </Button>
          </div>

          {/* Account Summary */}
          <GlassCard className="mb-6">
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold mb-2">
                {t("wallet.currentbalance")}
              </h2>
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(accountSummary.currentBalance)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">
                  {t("wallet.totalincome")}
                </p>
                <p className="font-semibold text-green-600">
                  {formatCurrency(accountSummary.totalIncome)}
                </p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600 mx-auto mb-1" />
                <p className="text-sm text-muted-foreground">
                  {t("wallet.totalexpense")}
                </p>
                <p className="font-semibold text-red-600">
                  {formatCurrency(accountSummary.totalExpenses)}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Filters */}
          <Tabs
            defaultValue="all"
            value={activeFilter}
            onValueChange={setActiveFilter}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">{t("wallet.all")}</TabsTrigger>
              <TabsTrigger value="income">{t("wallet.income")}</TabsTrigger>
              <TabsTrigger value="expenses">{t("wallet.expense")}</TabsTrigger>
            </TabsList>

            <TabsContent value={activeFilter}>
              <GlassCard>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {t("wallet.transactionhistory")}
                  </h3>
                  <Badge variant="secondary" className="gap-2">
                    {filteredTransactions.length}
                    {t("wallet.transaction")}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-background rounded-full">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}{" "}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <Badge
                          variant={
                            transaction.status === "completed"
                              ? "default"
                              : "secondary"
                          }
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
  );
}
export default withAuth(WalletStatementPage);
