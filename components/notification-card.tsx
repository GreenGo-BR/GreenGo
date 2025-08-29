"use client"

import { Check, Calendar, Info, AlertTriangle } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export interface NotificationProps {
  id: string
  type: "collection" | "payment" | "system" | "alert"
  title: string
  message: string
  date: Date
  read: boolean
  onMarkAsRead?: (id: string) => void
}

const iconMap = {
  collection: Calendar,
  payment: Check,
  system: Info,
  alert: AlertTriangle,
}

const colorMap = {
  collection: "text-blue-500",
  payment: "text-green-500",
  system: "text-primary",
  alert: "text-amber-500",
}

export function NotificationCard({ id, type, title, message, date, read, onMarkAsRead }: NotificationProps) {
  const Icon = iconMap[type]
  const colorClass = colorMap[type]
  const timeAgo = formatDistanceToNow(date, { addSuffix: true, locale: ptBR })

  return (
    <GlassCard className={cn("mb-4 transition-all duration-300", !read && "border-l-4 border-l-primary")}>
      <div className="flex items-start">
        <div className={cn("p-2 rounded-full mr-3", colorClass)}>
          <Icon size={18} />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">{title}</h3>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>

          <p className="text-sm text-muted-foreground mt-1">{message}</p>

          {!read && onMarkAsRead && (
            <button onClick={() => onMarkAsRead(id)} className="text-xs text-primary mt-2 flex items-center">
              <Check size={12} className="mr-1" />
              Marcar como lida
            </button>
          )}
        </div>
      </div>
    </GlassCard>
  )
}
