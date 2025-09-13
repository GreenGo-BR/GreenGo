"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  Bell,
  User,
  MessageCircleQuestion,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [hasNotifications, setHasNotifications] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Simulação de notificações
    setHasNotifications(true);
  }, []);

  // Não mostrar navegação nas páginas de autenticação
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/reset-password")
  ) {
    return null;
  }

  const navItems = [
    { href: "/home", icon: Home, label: t("nav.home") },
    { href: "/collections", icon: Calendar, label: t("nav.collections") },
    {
      href: "/notifications",
      icon: Bell,
      label: t("nav.notifications"),
      badge: hasNotifications,
    },
    { href: "/support", icon: MessageCircleQuestion, label: t("nav.support") },
    { href: "/profile", icon: User, label: t("nav.profile") },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 bg-white dark:bg-[#0B1C14] border-t border-border shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => handleNavigation(item.href)}
            data-active={pathname === item.href}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full transition-all duration-200 relative z-10",
              pathname === item.href
                ? "text-primary dark:text-[#40a578]"
                : "text-muted-foreground hover:text-foreground dark:text-[#2d674f]/70 dark:hover:text-[#40a578]"
            )}
          >
            <div className="relative">
              <item.icon size={20} />
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
