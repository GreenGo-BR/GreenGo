"use client"

import { useState } from "react"
import { NotificationCard } from "@/components/notification-card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check } from "lucide-react"
import Navigation from "@/components/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

export default function NotificationsPage() {
  const { t, language } = useLanguage()
  const [activeTab, setActiveTab] = useState("all")
  useScrollToTop()

  // Dados simulados baseados no idioma
  const initialNotifications = [
    {
      id: "not1",
      type: "collection" as const,
      title: language === "pt-BR" ? "Coleta agendada" : "Collection scheduled",
      message:
        language === "pt-BR"
          ? "Sua coleta foi agendada para 24/05/2024 entre 14:00 e 16:00."
          : "Your collection has been scheduled for 05/24/2024 between 2:00 PM and 4:00 PM.",
      date: new Date(2024, 4, 20, 14, 30),
      read: false,
    },
    {
      id: "not2",
      type: "system" as const,
      title: language === "pt-BR" ? "Bem-vindo ao GreenGo!" : "Welcome to GreenGo!",
      message:
        language === "pt-BR"
          ? "Obrigado por se juntar à nossa comunidade de reciclagem."
          : "Thank you for joining our recycling community.",
      date: new Date(2024, 4, 19, 10, 15),
      read: true,
    },
    {
      id: "not3",
      type: "payment" as const,
      title: language === "pt-BR" ? "Pagamento recebido" : "Payment received",
      message:
        language === "pt-BR"
          ? "Você recebeu R$ 17,50 pela sua última coleta de latinhas."
          : "You received $8.75 for your last can collection.",
      date: new Date(2024, 4, 18, 16, 45),
      read: false,
    },
    {
      id: "not4",
      type: "alert" as const,
      title: language === "pt-BR" ? "Lembrete de coleta" : "Collection reminder",
      message:
        language === "pt-BR"
          ? "Sua coleta está agendada para amanhã entre 14:00 e 16:00."
          : "Your collection is scheduled for tomorrow between 2:00 PM and 4:00 PM.",
      date: new Date(2024, 4, 23, 9, 0),
      read: false,
    },
    {
      id: "not5",
      type: "system" as const,
      title: language === "pt-BR" ? "Atualização do aplicativo" : "App update",
      message:
        language === "pt-BR"
          ? "O GreenGo foi atualizado com novos recursos e melhorias."
          : "GreenGo has been updated with new features and improvements.",
      date: new Date(2024, 4, 15, 11, 20),
      read: true,
    },
  ]

  const [notifications, setNotifications] = useState(initialNotifications)

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !n.read
    return n.type === activeTab
  })

  return (
    <div className="min-h-screen pb-20">
      <main className="pb-20 relative min-h-screen">
        <div className="main-content p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold page-title">{t("notifications.title")}</h1>
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} className="text-xs bg-transparent">
                <Check size={14} className="mr-1" />
                {t("notifications.markAllRead")}
              </Button>
            )}
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="text-xs">
                {t("notifications.all")}
                {notifications.length > 0 && (
                  <span className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5">{notifications.length}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                {t("notifications.unread")}
                {unreadCount > 0 && (
                  <span className="ml-1 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">{unreadCount}</span>
                )}
              </TabsTrigger>
              <TabsTrigger value="collection" className="text-xs">
                {t("notifications.collections")}
              </TabsTrigger>
              <TabsTrigger value="payment" className="text-xs">
                {t("notifications.payments")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationCard key={notification.id} {...notification} onMarkAsRead={handleMarkAsRead} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    {language === "pt-BR" ? "Nenhuma notificação" : "No notifications"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeTab === "all"
                      ? language === "pt-BR"
                        ? "Você não tem notificações no momento."
                        : "You don't have any notifications at the moment."
                      : activeTab === "unread"
                        ? language === "pt-BR"
                          ? "Você não tem notificações não lidas."
                          : "You don't have any unread notifications."
                        : language === "pt-BR"
                          ? `Você não tem notificações de ${
                              activeTab === "collection"
                                ? "coletas"
                                : activeTab === "payment"
                                  ? "pagamentos"
                                  : "sistema"
                            }.`
                          : `You don't have any ${
                              activeTab === "collection" ? "collection" : activeTab === "payment" ? "payment" : "system"
                            } notifications.`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Navigation />
    </div>
  )
}
