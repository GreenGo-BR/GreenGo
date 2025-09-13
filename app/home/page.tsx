"use client";

import { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { CollectionCard } from "@/components/collection-card";
import { WalletCard } from "@/components/wallet-card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

type Collection = {
  id: string;
  date: string;
  time: string;
  address: string;
  status: "scheduled" | "pending" | "completed";
  estimatedWeight: number;
};

const walletData = {
  balance: 87.5,
  lastPayment: {
    amount: 17.5,
    date: "18/05/2024",
  },
};

type HomePageProps = {
  token: string;
};

function HomePage({ token }: HomePageProps) {
  const { t } = useLanguage();
  useScrollToTop();
  const [upcomingCollections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchUpcommingCollections(token);
      } catch (err) {
        console.error("Failed to load collections:", err);
      }
    };
    load();
  }, [token]);

  const fetchUpcommingCollections = async (token: string) => {
    try {
      const res = await api().get("/collections", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedList = res.data.collections;

      const normalized = fetchedList.map((fetched: any) => ({
        id: fetched.ID,
        date: fetched.CollectionDate,
        time: fetched.CollectionTime,
        address: fetched.PickupAddress,
        status: fetched.Status,
        estimatedWeight: fetched.Weight,
      }));

      setCollections(normalized);
    } catch (error) {
      console.error("Error fetching collection details:", error);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <main className="pb-20 relative min-h-screen">
        <div className="main-content">
          <HeroSection />

          {/* Carteira */}
          <div className="px-4 mb-6">
            <WalletCard {...walletData} />
          </div>

          <div className="px-4 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("home.upcoming")}</h2>
              <Link href="/collections">
                <Button variant="ghost" size="sm">
                  {t("home.viewAll")}
                </Button>
              </Link>
            </div>

            {upcomingCollections.length > 0 ? (
              upcomingCollections.map((collection) => (
                <CollectionCard key={collection.id} {...collection} />
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>{t("home.noCollections")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Navigation />
    </div>
  );
}
export default withAuth(HomePage);
