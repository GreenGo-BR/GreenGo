"use client";

import { useState, useEffect } from "react";
import { NotificationCard } from "@/components/notification-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Check } from "lucide-react";
import Navigation from "@/components/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

interface Notifications {
  id: string;
  type: "collection" | "payment" | "system" | "alert";
  title: string;
  message: string;
  date: Date;
  read: boolean;
  onMarkAsRead?: (id: string) => void;
}
// Dados simulados baseados no idioma
type NotifMethodProps = {
  token: string;
  uid: string;
};

function NotificationsPage({ token }: NotifMethodProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("all");

  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useScrollToTop();

  useEffect(() => {
    if (!token) return;
    const fetchNotifMethods = async () => {
      try {
        const res = await api().get("/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const methods = (res.data?.result ?? []).map((n: any) => ({
          id: String(n.NotificationID),
          type: n.type,
          title: n.title,
          message: n.messages,
          date: n.created_at,
          read: n.isread == 1,
        }));

        setNotifications(methods);
      } catch (err) {
        console.error(err);
        setNotifications([]);
      }
    };
    fetchNotifMethods();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await api().post(
        `/notifications/update/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setNotifications(
          notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      } else {
        alert(
          language === "pt-BR"
            ? "Falha ao marcar como lida."
            : "Failed to mark as read."
        );
      }
    } catch (err) {
      alert(
        language === "pt-BR"
          ? "Falha ao marcar como lida."
          : "Failed to mark as read."
      );
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await api().post(
        `/notifications/update/${0}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
      } else {
        alert(
          language === "pt-BR"
            ? "Falha ao marcar como lida."
            : "Failed to mark all as read."
        );
      }
    } catch (err) {
      alert(
        language === "pt-BR"
          ? "Falha ao marcar como lida."
          : "Failed to mark all as read."
      );
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("notifications.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("notifications.subtitle")}
            </p>
          </div>
          <Button
            onClick={handleMarkAllAsRead}
            className="bg-[#40A578] hover:bg-[#348c65] text-white shadow-lg"
          >
            <Check className="h-4 w-4 mr-2" />
            {t("notifications.markAllRead")}
          </Button>
        </div>

        <div>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all" className="text-xs">
                {t("notifications.all")}
                {notifications.length > 0 && (
                  <span className="ml-1 text-xs bg-muted rounded-full px-1.5 py-0.5">
                    {notifications.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                {t("notifications.unread")}
                {unreadCount > 0 && (
                  <span className="ml-1 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">
                    {unreadCount}
                  </span>
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
                  <NotificationCard
                    key={notification.id}
                    {...notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell size={24} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">
                    {language === "pt-BR"
                      ? "Nenhuma notificação"
                      : "No notifications"}
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
                          activeTab === "collection"
                            ? "collection"
                            : activeTab === "payment"
                            ? "payment"
                            : "system"
                        } notifications.`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
export default withAuth(NotificationsPage);
