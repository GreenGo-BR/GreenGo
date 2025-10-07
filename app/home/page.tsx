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

type HomePageProps = {
  token: string;
};

function HomePage({ token }: HomePageProps) {
  const { t } = useLanguage();
  useScrollToTop();
  const [upcomingCollections, setCollections] = useState<Collection[]>([]);
  const [walletData, setWalletData] = useState({
    balance: 0.0,
    lastPayment: {
      amount: 0.0,
      date: "",
    },
  });

  useEffect(() => {
    if (!token) return;

    const fetchHomeWallet = async () => {
      try {
        const res = await api().get("/wallethomedata", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data.result || {};

        setWalletData({
          balance: parseFloat(data.current_balance) || 0.0,
          lastPayment: {
            amount: parseFloat(data.last_payment_amount) || 0.0,
            date: data.last_payment_date || "",
          },
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchHomeWallet();

    const fetchUpcommingCollections = async () => {
      try {
        const res = await api().get("/collections", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedList = res.data.collections;

        const normalized = fetchedList
          .filter((fetched: any) => fetched.status !== "completed")
          .map((fetched: any) => ({
            id: fetched.id,
            date: fetched.collection_date,
            time: fetched.collection_time,
            address: fetched.pickup_address,
            status: fetched.status,
            estimatedWeight: fetched.weight,
          }));

        setCollections(normalized);
      } catch (error) {
        console.error("Error fetching collection details:", error);
      }
    };
    fetchUpcommingCollections();
  }, []);

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
