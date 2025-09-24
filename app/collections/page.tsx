"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { Plus, MapPin, Calendar, Clock, Package } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

// Mock data for collections
type mockCollections = {
  id: string;
  date: string;
  time: string;
  address: string;
  city: string;
  status: "scheduled" | "pending" | "completed";
  cans: number;
  value: number;
};

type ColPageProps = {
  token: string;
};

function CollectionsPage({ token }: ColPageProps) {
  const { t } = useLanguage();
  const [collections, setCollections] = useState<mockCollections[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchCollections(token);
      } catch (err) {
        console.error("Failed to load collections:", err);
      }
    };
    load();
  }, [token]);

  const fetchCollections = async (token: string) => {
    try {
      const res = await api().get("/collections", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedList = res.data.collections;

      const normalized = fetchedList.map((fetched: any) => ({
        id: fetched.id,
        date: fetched.collection_date,
        time: fetched.collection_time,
        address: fetched.pickup_address,
        status: fetched.status,
        cans: fetched.number_items,
        value: fetched.amount,
      }));
      setCollections(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return t("collections.status.scheduled");
      case "completed":
        return t("collections.status.completed");
      case "cancelled":
        return t("collections.status.cancelled");
      default:
        return status;
    }
  };

  const totalCans = collections.reduce(
    (sum, collection) => sum + collection.cans,
    0
  );
  const totalValue = collections.reduce(
    (sum, collection) => sum + collection.value,
    0
  );
  const completedCollections = collections.filter(
    (c) => c.status === "completed"
  ).length;

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("collections.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              {t("collections.subtitle")}
            </p>
          </div>
          <Link href="/schedule">
            <Button className="bg-[#40A578] hover:bg-[#348c65] text-white shadow-lg w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              {t("collections.schedule")}
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#40A578]/10 rounded-full">
                <Package className="h-6 w-6 text-[#40A578]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalCans}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("collections.stats.totalCans")}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedCollections}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("collections.stats.completed")}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                  R$
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalValue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("collections.stats.totalValue")}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Collections List */}
        <GlassCard className="p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {t("collections.recent")}
          </h2>

          {collections.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm sm:text-base">
                {t("collections.empty")}
              </p>
              <Link href="/schedule">
                <Button className="bg-[#40A578] hover:bg-[#348c65] text-white w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  {t("collections.schedule")}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-[#40A578] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                            {collection.address}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            {collection.city}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(collection.date).toLocaleDateString(
                            "pt-BR"
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {collection.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          {collection.cans} {t("collections.cans")}
                        </div>
                      </div>
                    </div>

                    {/* Right info */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 gap-2 text-sm">
                      <div className="flex justify-between items-center sm:justify-start sm:gap-3 w-full">
                        <div className="text-gray-900 dark:text-white font-semibold order-2 sm:order-1">
                          R$ {collection.value.toFixed(2)}
                        </div>
                        <Badge
                          className={
                            getStatusColor(collection.status) +
                            " order-1 sm:order-2"
                          }
                        >
                          {getStatusText(collection.status)}
                        </Badge>
                      </div>
                      <Link href={`/collections/${collection.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto"
                        >
                          {t("collections.view")}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
      <Navigation />
    </div>
  );
}
export default withAuth(CollectionsPage);
