"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  CalendarIcon,
  Clock,
  MapPin,
  MessageSquare,
  Save,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { useParams, useRouter } from "next/navigation";
import { FormMessage } from "@/components/auth/form-message";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
];

type ColEditPageProps = {
  token: string;
  userId: number;
};

function EditCollectionPage({ token, userId }: ColEditPageProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const { id } = useParams();
  const rawId = Array.isArray(id) ? id[0] : id;
  const cleanId = rawId?.replace(/^COL/i, "") as string;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [address, setAddress] = useState("");
  const [cansCount, setCansCount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const locale = language === "pt-BR" ? ptBR : enUS;

  useEffect(() => {
    const load = async () => {
      try {
        await fetchCollectionDetails(token, cleanId);
      } catch (err) {
        console.error("Failed to load collections:", err);
      }
    };
    load();
  }, [cleanId, token]);

  const fetchCollectionDetails = async (token: string, id: string) => {
    try {
      const res = await api().get("/collections_details", {
        params: { id },
        headers: { Authorization: `Bearer ${token}` },
      });

      const collection = res.data.collection;

      setDate(new Date(collection.CollectionDate));
      setTimeSlot(collection.CollectionTime);
      setAddress(collection.PickupAddress);
      setCansCount(String(collection.NumberOfItems));
      setNotes(collection.Notes || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    if (!date || !timeSlot || !address || !cansCount) {
      setMessage({
        type: "error",
        text:
          language === "pt-BR"
            ? "Por favor, preencha todos os campos obrigatórios."
            : "Please fill in all required fields.",
      });
      return;
    }

    try {
      // Simulação de API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let payload = {
        id: cleanId,
        userId: userId,
        date: date?.toISOString(),
        timeSlot: timeSlot,
        address: address,
        cansCount: parseInt(cansCount),
        notes: notes,
      };
      setIsSubmitting(true);
      setMessage(null);
      const res = await api().post("/schedule", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setMessage({
          type: "success",
          text:
            language === "pt-BR"
              ? "Coleta atualizada com sucesso!"
              : "Collection updated successfully!",
        });
        setTimeout(() => {
          router.push(`/collections/${id}`);
        }, 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          language === "pt-BR"
            ? "Erro ao atualizar coleta. Tente novamente."
            : "Error updating collection. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pb-20 relative min-h-screen">
      <div className="main-content p-4">
        <div className="flex items-center mb-6">
          <Link href={`/collections/${id}`}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">
            {language === "pt-BR" ? "Editar Coleta" : "Edit Collection"}
          </h1>
          <div className="ml-auto h-10 w-24 relative">
            <Image
              src="/images/greengo10.png"
              alt="GreenGo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <GlassCard className="mb-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              {language === "pt-BR"
                ? `Editando Coleta #${cleanId.slice(-4)}`
                : `Editing Collection #${cleanId.slice(-4)}`}
            </h2>
            <p className="text-sm text-muted-foreground">
              {language === "pt-BR"
                ? "Atualize as informações da sua coleta. Todos os campos são obrigatórios."
                : "Update your collection information. All fields are required."}
            </p>
          </div>

          <div className="space-y-6">
            {/* Data da Coleta */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <CalendarIcon
                  size={16}
                  className="mr-2 text-muted-foreground"
                />
                {language === "pt-BR" ? "Data da Coleta" : "Collection Date"} *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-transparent"
                  >
                    {date ? (
                      format(
                        date,
                        language === "pt-BR"
                          ? "dd 'de' MMMM 'de' yyyy"
                          : "MMMM dd, yyyy",
                        { locale }
                      )
                    ) : (
                      <span className="text-muted-foreground">
                        {language === "pt-BR"
                          ? "Selecione uma data"
                          : "Select a date"}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    locale={locale}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return date < today;
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horário da Coleta */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <Clock size={16} className="mr-2 text-muted-foreground" />
                {language === "pt-BR"
                  ? "Horário da Coleta"
                  : "Collection Time"}{" "}
                *
              </label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      language === "pt-BR"
                        ? "Selecione o horário"
                        : "Select time"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <MapPin size={16} className="mr-2 text-muted-foreground" />
                {language === "pt-BR"
                  ? "Endereço para Coleta"
                  : "Collection Address"}{" "}
                *
              </label>
              <Input
                placeholder={
                  language === "pt-BR"
                    ? "Rua, número, bairro, cidade"
                    : "Street, number, neighborhood, city"
                }
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Quantidade de Latinhas */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <div className="mr-2 text-muted-foreground w-4 h-4 relative">
                  <Image
                    src="/images/latinha.png"
                    alt="Latinha"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
                {language === "pt-BR"
                  ? "Quantidade aproximada de latinhas"
                  : "Approximate number of cans"}{" "}
                *
              </label>
              <Input
                type="number"
                placeholder={language === "pt-BR" ? "Ex: 120" : "Ex: 120"}
                value={cansCount}
                onChange={(e) => setCansCount(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {language === "pt-BR" ? "60 latinhas ≈ 1 kg" : "60 cans ≈ 1 kg"}
              </p>
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <MessageSquare
                  size={16}
                  className="mr-2 text-muted-foreground"
                />
                {language === "pt-BR"
                  ? "Observações (opcional)"
                  : "Notes (optional)"}
              </label>
              <Textarea
                placeholder={
                  language === "pt-BR"
                    ? "Informações adicionais para o coletor"
                    : "Additional information for the collector"
                }
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          {message && (
            <FormMessage type={message.type} message={message.text} />
          )}

          <div className="flex gap-3 mt-6">
            <Link href={`/collections/${id}`} className="flex-1">
              <Button
                variant="outline"
                className="w-full bg-transparent"
                disabled={isSubmitting}
              >
                {language === "pt-BR" ? "Cancelar" : "Cancel"}
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting || !date || !timeSlot || !address || !cansCount
              }
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {language === "pt-BR" ? "Atualizando..." : "Updating..."}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {language === "pt-BR"
                    ? "Atualizar Coleta"
                    : "Update Collection"}
                </>
              )}
            </Button>
          </div>
        </GlassCard>

        {/* Informações importantes */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">
            {language === "pt-BR"
              ? "Informações importantes"
              : "Important information"}
          </h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              {language === "pt-BR"
                ? "As alterações entrarão em vigor imediatamente"
                : "Changes will take effect immediately"}
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              {language === "pt-BR"
                ? "Você receberá uma confirmação por notificação"
                : "You will receive a confirmation notification"}
            </li>
            <li className="flex items-start">
              <span className="text-primary mr-2">•</span>
              {language === "pt-BR"
                ? "O coletor será notificado sobre as mudanças"
                : "The collector will be notified about the changes"}
            </li>
          </ul>
        </GlassCard>
      </div>
    </main>
  );
}
export default withAuth(EditCollectionPage);
