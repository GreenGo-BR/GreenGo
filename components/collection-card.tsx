"use client";

import { CalendarDays, MapPin, Clock, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import Image from "next/image";

export interface CollectionProps {
  id: string;
  date: string;
  time: string;
  address: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
  estimatedWeight?: number;
}

export function CollectionCard({
  id,
  date,
  time,
  address,
  status,
  estimatedWeight,
}: CollectionProps) {
  const { t, language } = useLanguage();

  const statusMap = {
    scheduled: {
      label: t("collections.status.scheduled"),
      color: "bg-blue-500",
    },
    completed: {
      label: t("collections.status.completed"),
      color: "bg-green-500",
    },
    cancelled: {
      label: t("collections.status.cancelled"),
      color: "bg-red-500",
    },
    pending: { label: t("collections.status.pending"), color: "bg-yellow-500" },
  };

  const statusInfo = statusMap[status];
  const estimatedCans = estimatedWeight
    ? Math.round(estimatedWeight * 60)
    : undefined;

  return (
    <GlassCard className="mb-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-lg">
            {t("collections.collection")} #{id.slice(-4)}
          </h3>
          <div className="flex items-center text-sm text-muted-foreground mt-1">
            <CalendarDays size={14} className="mr-1" />
            <span>{date}</span>
            <Clock size={14} className="ml-3 mr-1" />
            <span>{time}</span>
          </div>
        </div>
        <Badge className={`${statusInfo.color} text-white`}>
          {statusInfo.label}
        </Badge>
      </div>

      <div className="flex items-start text-sm mb-3">
        <MapPin
          size={16}
          className="mr-2 mt-0.5 flex-shrink-0 text-muted-foreground"
        />
        <span className="text-muted-foreground">{address}</span>
      </div>

      {estimatedCans && (
        <div className="text-sm mb-3 flex items-center">
          <div className="mr-2 w-4 h-4 relative">
            <Image
              src="/images/latinha.png"
              alt="Latinha"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <span className="text-muted-foreground">
            {t("collections.estimatedQuantity")}{" "}
          </span>
          <span className="font-medium">
            {estimatedCans} {t("collections.cans")}
          </span>
          <span className="text-muted-foreground ml-1">
            ({t("collections.approximately")} {estimatedWeight} kg)
          </span>
        </div>
      )}

      <Link
        href={`/collections/${id}`}
        className="flex items-center justify-end text-primary text-sm font-medium"
      >
        {t("collections.details")}
        <ArrowRight size={14} className="ml-1" />
      </Link>
    </GlassCard>
  );
}
