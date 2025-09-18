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
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

const timeSlots = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "13:00 - 15:00",
  "15:00 - 17:00",
  "17:00 - 19:00",
];

type SchedPageProps = {
  token: string;
};
function SchedulePage({ token }: SchedPageProps) {
  const { t, language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState<string>("");
  const [address, setAddress] = useState("");
  const [cansCount, setCansCount] = useState("");
  const [notes, setNotes] = useState("");
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const locale = language === "pt-BR" ? ptBR : enUS;

  useEffect(() => {
    const load = async () => {
      try {
      } catch (err) {
        console.error("Failed to load collections:", err);
      }
    };
    load();
  }, [token]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      let payload = {
        date: date?.toISOString(),
        timeSlot: timeSlot,
        address: address,
        cansCount: parseInt(cansCount),
        notes: notes,
      };

      const res = await api().post("/schedule", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        setIsSuccess(true);
      }
    } catch (errs) {
      console.log(errs);
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="p-4 flex flex-col items-center justify-center min-h-[80vh] relative">
        <div className="main-content flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-6">
            <Check size={40} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-center">
            {t("schedule.success")}
          </h1>
          <p className="text-center text-muted-foreground mb-8">
            {t("schedule.successMessage")}{" "}
            {date &&
              format(date, language === "pt-BR" ? "dd 'de' MMMM" : "MMMM dd", {
                locale,
              })}{" "}
            {language === "pt-BR" ? "às" : "at"} {timeSlot.split(" - ")[0]}.
          </p>
          <div className="flex gap-4 w-full max-w-md">
            <Link href="/collections" className="flex-1">
              <Button variant="outline" className="w-full">
                {language === "pt-BR"
                  ? "Ver minhas coletas"
                  : "View my collections"}
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                {language === "pt-BR" ? "Voltar ao início" : "Back to home"}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pb-20 relative min-h-screen">
      <div className="main-content p-4">
        <div className="flex items-center mb-6">
          {step > 1 ? (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => setStep(step - 1)}
            >
              <ArrowLeft size={20} />
            </Button>
          ) : (
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft size={20} />
              </Button>
            </Link>
          )}
          <h1 className="text-2xl font-bold">{t("schedule.title")}</h1>
          <div className="ml-auto h-10 w-24 relative">
            <Image
              src="/images/greengo10.png"
              alt="GreenGo"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div
            className={`flex-1 flex flex-col items-center ${
              step === 1 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step === 1
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              1
            </div>
            <span className="text-xs">{t("schedule.dateTime")}</span>
          </div>
          <div className="w-16 h-[2px] bg-muted self-center mt-[-12px]" />
          <div
            className={`flex-1 flex flex-col items-center ${
              step === 2 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step === 2
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              2
            </div>
            <span className="text-xs">{t("schedule.details")}</span>
          </div>
          <div className="w-16 h-[2px] bg-muted self-center mt-[-12px]" />
          <div
            className={`flex-1 flex flex-col items-center ${
              step === 3 ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                step === 3
                  ? "bg-primary text-white"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              3
            </div>
            <span className="text-xs">{t("schedule.confirmation")}</span>
          </div>
        </div>

        {step === 1 && (
          <GlassCard>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <CalendarIcon
                    size={16}
                    className="mr-2 text-muted-foreground"
                  />
                  {language === "pt-BR" ? "Data da Coleta" : "Collection Date"}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
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
                          {t("schedule.selectDate")}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
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

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <Clock size={16} className="mr-2 text-muted-foreground" />
                  {language === "pt-BR"
                    ? "Horário da Coleta"
                    : "Collection Time"}
                </label>
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("schedule.selectTime")} />
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

              <Button
                className="w-full mt-4"
                onClick={() => setStep(2)}
                disabled={!date || !timeSlot}
              >
                {t("schedule.continue")}
              </Button>
            </div>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <MapPin size={16} className="mr-2 text-muted-foreground" />
                  {t("schedule.address")}
                </label>
                <Input
                  placeholder={t("schedule.addressPlaceholder")}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <div className="mr-2 text-muted-foreground w-4 h-4 relative">
                    <Image
                      src="/images/latinha.png"
                      alt="Latinha"
                      fill
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  {t("schedule.quantity")}
                </label>
                <Input
                  type="number"
                  placeholder={t("schedule.quantityPlaceholder")}
                  value={cansCount}
                  onChange={(e) => setCansCount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {t("schedule.quantityNote")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 flex items-center">
                  <MessageSquare
                    size={16}
                    className="mr-2 text-muted-foreground"
                  />
                  {t("schedule.notes")}
                </label>
                <Textarea
                  placeholder={t("schedule.notesPlaceholder")}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <Button
                className="w-full mt-4"
                onClick={() => setStep(3)}
                disabled={!address || !cansCount}
              >
                {t("schedule.continue")}
              </Button>
            </div>
          </GlassCard>
        )}

        {step === 3 && (
          <>
            <GlassCard className="mb-4">
              <h2 className="text-lg font-semibold mb-4">
                {language === "pt-BR"
                  ? "Confirme os detalhes da coleta"
                  : "Confirm collection details"}
              </h2>

              <div className="space-y-3">
                <div className="flex items-start">
                  <CalendarIcon
                    size={18}
                    className="mr-3 text-muted-foreground mt-0.5"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "pt-BR" ? "Data" : "Date"}
                    </p>
                    <p>
                      {date &&
                        format(
                          date,
                          language === "pt-BR"
                            ? "dd 'de' MMMM 'de' yyyy"
                            : "MMMM dd, yyyy",
                          { locale }
                        )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock
                    size={18}
                    className="mr-3 text-muted-foreground mt-0.5"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "pt-BR" ? "Horário" : "Time"}
                    </p>
                    <p>{timeSlot}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin
                    size={18}
                    className="mr-3 text-muted-foreground mt-0.5"
                  />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "pt-BR" ? "Endereço" : "Address"}
                    </p>
                    <p>{address}</p>
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
                      {cansCount} {language === "pt-BR" ? "latinhas" : "cans"} (
                      {language === "pt-BR"
                        ? "aproximadamente"
                        : "approximately"}{" "}
                      {Math.round(Number.parseInt(cansCount) / 60)} kg)
                    </p>
                  </div>
                </div>

                {notes && (
                  <div className="flex items-start">
                    <MessageSquare
                      size={18}
                      className="mr-3 text-muted-foreground mt-0.5"
                    />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {language === "pt-BR" ? "Observações" : "Notes"}
                      </p>
                      <p>{notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="mb-4">
              <h3 className="text-lg font-semibold mb-2">
                {language === "pt-BR"
                  ? "Informações importantes"
                  : "Important information"}
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>
                  •{" "}
                  {language === "pt-BR"
                    ? "O pagamento será calculado com base no peso real (R$5/kg)"
                    : "Payment will be calculated based on actual weight ($2.50/kg)"}
                </li>
                <li>
                  •{" "}
                  {language === "pt-BR"
                    ? "Você receberá uma notificação quando o coletor estiver a caminho"
                    : "You will receive a notification when the collector is on the way"}
                </li>
                <li>
                  •{" "}
                  {language === "pt-BR"
                    ? "Você pode cancelar ou reagendar até 2 horas antes da coleta"
                    : "You can cancel or reschedule up to 2 hours before collection"}
                </li>
              </ul>
            </GlassCard>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("schedule.processing") : t("schedule.confirm")}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
export default withAuth(SchedulePage);
