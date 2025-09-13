"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  User,
  MessageSquare,
  CreditCard,
  Edit,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { CancelCollectionModal } from "@/components/cancel-collection-modal";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

// Dados simulados para demonstração
type collectionDet = {
  id: string;
  date: string;
  time: string;
  address: string;
  status: "scheduled" | "completed" | "cancelled" | "pending";
  estimatedWeight: number;
  estimatedCans: number;
  notes: string;
  collector: {
    name: string;
    rating: number;
    phone: string;
  };
  payment: {
    status: "failed" | "completed" | "pending";
    amount: number;
    method: string;
    date: string;
  };
};

const statusMap = {
  scheduled: { label: "Agendada", color: "bg-blue-500" },
  completed: { label: "Concluída", color: "bg-green-500" },
  cancelled: { label: "Cancelada", color: "bg-red-500" },
  pending: { label: "Pendente", color: "bg-yellow-500" },
};

const paymentStatusMap = {
  pending: { label: "Pendente", color: "bg-yellow-500" },
  completed: { label: "Pago", color: "bg-green-500" },
  failed: { label: "Falhou", color: "bg-red-500" },
};

type ColDetPageProps = {
  token: string;
};

function CollectionDetailsPage({ token }: ColDetPageProps) {
  const { language } = useLanguage();
  const { id } = useParams();
  const rawId = Array.isArray(id) ? id[0] : id;
  const cleanId = rawId?.replace(/^COL/i, "");

  const [showCancelModal, setShowCancelModal] = useState(false);

  const [collectionDetails, setCollectionDetails] = useState<
    collectionDet | undefined
  >(undefined);

  useEffect(() => {
    if (!token || !cleanId) return;
    const load = async () => {
      try {
        await fetchCollectionDetails(token, cleanId);
      } catch (err) {
        console.error("Failed to load collections:", err);
      }
    };
    load();
  }, [token, cleanId]);

  const fetchCollectionDetails = async (token: string, id: string) => {
    try {
      const res = await api().get("/collections_details", {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetched = await res.data.collection;

      const normalized: collectionDet = {
        id: fetched.ID,
        date: fetched.CollectionDate,
        time: fetched.CollectionTime,
        address: fetched.PickupAddress,
        status: fetched.Status,
        estimatedWeight: fetched.Weight,
        estimatedCans: fetched.NumberOfItems,
        notes: fetched.Notes || "",
        collector: {
          name: fetched.Collector || "josh",
          rating: fetched.Rating || 2.5,
          phone: fetched.PhoneNumber || "876543123",
        },
        payment: {
          status: fetched.PaymentStatus || "pending",
          amount: fetched.PaymentAmount || 23.34,
          method: fetched.PaymentMethod || "Cash",
          date: fetched.PaymentDate || "",
        },
      };

      setCollectionDetails(normalized);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelCollection = async (reason?: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (!token || !cleanId) {
      console.error("Missing token or cleanId");
      return;
    }

    try {
      const res = await api().post(
        "/collections_details/cancelled",
        { id: cleanId, reason },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowCancelModal(false);

      setTimeout(() => {
        fetchCollectionDetails(token!, cleanId!);
      }, 300);
    } catch (err) {
      console.error(err);
    }
  };

  if (!collectionDetails) {
    return <div className="p-4">Carregando detalhes da coleta...</div>;
  }

  const statusInfo = statusMap[collectionDetails.status];
  const paymentInfo = paymentStatusMap[collectionDetails.payment.status];

  return (
    <main className="pb-20 relative min-h-screen">
      <div className="p-4 relative z-10">
        <div className="flex items-center mb-6">
          <Link href="/collections">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {language === "pt-BR" ? "Detalhes da Coleta" : "Collection Details"}
          </h1>
        </div>

        <GlassCard className="mb-4">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">
              {language === "pt-BR" ? "Coleta" : "Collection"} #
              {collectionDetails.id.slice(-4)}
            </h2>
            <Badge className={`${statusInfo.color} text-white`}>
              {statusInfo.label}
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="flex items-start">
              <CalendarDays
                size={18}
                className="mr-3 text-muted-foreground mt-0.5"
              />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "pt-BR" ? "Data" : "Date"}
                </p>
                <p>{collectionDetails.date}</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock size={18} className="mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "pt-BR" ? "Horário" : "Time"}
                </p>
                <p>{collectionDetails.time}</p>
              </div>
            </div>

            <div className="flex items-start">
              <MapPin size={18} className="mr-3 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "pt-BR" ? "Endereço" : "Address"}
                </p>
                <p>{collectionDetails.address}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="mr-3 text-muted-foreground mt-0.5 w-[18px] h-[18px] relative">
                <Image
                  src="/images/latinha.png"
                  alt="Latinha"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {language === "pt-BR"
                    ? "Quantidade de latinhas"
                    : "Number of cans"}
                </p>
                <p>
                  {collectionDetails.estimatedCans}{" "}
                  {language === "pt-BR" ? "latinhas" : "cans"} (
                  {language === "pt-BR" ? "aproximadamente" : "approximately"}{" "}
                  {collectionDetails.estimatedWeight} kg)
                </p>
              </div>
            </div>

            {collectionDetails.notes && (
              <div className="flex items-start">
                <MessageSquare
                  size={18}
                  className="mr-3 text-muted-foreground mt-0.5"
                />
                <div>
                  <p className="text-sm text-muted-foreground">
                    {language === "pt-BR" ? "Observações" : "Notes"}
                  </p>
                  <p>{collectionDetails.notes}</p>
                </div>
              </div>
            )}
          </div>
        </GlassCard>

        <GlassCard className="mb-4">
          <h3 className="text-lg font-semibold mb-3">
            {language === "pt-BR" ? "Coletor" : "Collector"}
          </h3>

          {collectionDetails.collector ? (
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                <User size={24} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {collectionDetails.collector.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {language === "pt-BR" ? "Avaliação:" : "Rating:"}{" "}
                  {collectionDetails.collector.rating}/5
                </p>
                <p className="text-sm text-muted-foreground">
                  {collectionDetails.collector.phone}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {language === "pt-BR"
                ? "Coletor ainda não designado"
                : "Collector not yet assigned"}
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">
              {language === "pt-BR" ? "Pagamento" : "Payment"}
            </h3>
            <Badge className={`${paymentInfo.color} text-white`}>
              {paymentInfo.label}
            </Badge>
          </div>

          {collectionDetails.payment.status === "completed" ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {language === "pt-BR" ? "Valor:" : "Amount:"}
                </span>
                <span className="font-medium">
                  {language === "pt-BR" ? "R$" : "$"}{" "}
                  {collectionDetails.payment.amount
                    ?.toFixed(2)
                    .replace(".", ",")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {language === "pt-BR" ? "Método:" : "Method:"}
                </span>
                <span>{collectionDetails.payment.method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {language === "pt-BR" ? "Data:" : "Date:"}
                </span>
                <span>{collectionDetails.payment.date}</span>
              </div>
              <Button className="w-full mt-2 bg-transparent" variant="outline">
                <CreditCard size={16} className="mr-2" />
                {language === "pt-BR" ? "Ver comprovante" : "View receipt"}
              </Button>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {language === "pt-BR"
                ? "O pagamento será processado após a conclusão da coleta"
                : "Payment will be processed after collection completion"}
            </p>
          )}
        </GlassCard>

        {collectionDetails.status === "scheduled" && (
          <div className="mt-6 flex gap-4">
            <Link href={`/collections/${id}/edit`} className="flex-1">
              <Button
                className="w-full glass-button text-foreground border-white/20 hover:bg-white/10 hover:backdrop-blur-md transition-all duration-300 bg-transparent"
                variant="outline"
              >
                <Edit size={16} className="mr-2" />
                {language === "pt-BR" ? "Editar Coleta" : "Edit Collection"}
              </Button>
            </Link>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setShowCancelModal(true)}
            >
              {language === "pt-BR" ? "Cancelar" : "Cancel"}
            </Button>
          </div>
        )}
      </div>

      <CancelCollectionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelCollection}
        collectionId={collectionDetails.id}
      />
      <Navigation />
    </main>
  );
}

export default withAuth(CollectionDetailsPage);
