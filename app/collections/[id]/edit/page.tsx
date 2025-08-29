"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CalendarIcon, Clock, MapPin, MessageSquare, Save, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR, enUS } from "date-fns/locale"
import Link from "next/link"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"
import { useRouter } from "next/navigation"
import { FormMessage } from "@/components/auth/form-message"

const timeSlots = ["08:00 - 10:00", "10:00 - 12:00", "13:00 - 15:00", "15:00 - 17:00", "17:00 - 19:00"]

// Dados simulados da coleta atual
const currentCollectionData = {
  id: "col123456",
  date: new Date(2024, 4, 24), // 24/05/2024
  timeSlot: "14:00 - 16:00",
  address: "Rua das Flores, 123 - Jardim Primavera",
  cansCount: "210",
  notes: "Tocar o interfone 102. Cão amigável no local.",
}

export default function EditCollectionPage({ params }: { params: { id: string } }) {
  const { language } = useLanguage()
  const router = useRouter()
  const { id } = params

  const [date, setDate] = useState<Date | undefined>(currentCollectionData.date)
  const [timeSlot, setTimeSlot] = useState<string>(currentCollectionData.timeSlot)
  const [address, setAddress] = useState(currentCollectionData.address)
  const [cansCount, setCansCount] = useState(currentCollectionData.cansCount)
  const [notes, setNotes] = useState(currentCollectionData.notes)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const locale = language === "pt-BR" ? ptBR : enUS

  const handleSubmit = async () => {
    // Validação
    if (!date || !timeSlot || !address || !cansCount) {
      setMessage({
        type: "error",
        text:
          language === "pt-BR"
            ? "Por favor, preencha todos os campos obrigatórios."
            : "Please fill in all required fields.",
      })
      return
    }

    setIsSubmitting(true)
    setMessage(null)

    try {
      // Simulação de API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setMessage({
        type: "success",
        text: language === "pt-BR" ? "Coleta atualizada com sucesso!" : "Collection updated successfully!",
      })

      // Redirecionar após sucesso
      setTimeout(() => {
        router.push(`/collections/${id}`)
      }, 1500)
    } catch (error) {
      setMessage({
        type: "error",
        text:
          language === "pt-BR"
            ? "Erro ao atualizar coleta. Tente novamente."
            : "Error updating collection. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="pb-20 relative min-h-screen">
      <div className="main-content p-4">
        <div className="flex items-center mb-6">
          <Link href={`/collections/${id}`}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{language === "pt-BR" ? "Editar Coleta" : "Edit Collection"}</h1>
          <div className="ml-auto h-10 w-24 relative">
            <Image src="/images/greengo10.png" alt="GreenGo" fill style={{ objectFit: "contain" }} />
          </div>
        </div>

        <GlassCard className="mb-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              {language === "pt-BR" ? `Editando Coleta #${id.slice(-4)}` : `Editing Collection #${id.slice(-4)}`}
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
                <CalendarIcon size={16} className="mr-2 text-muted-foreground" />
                {language === "pt-BR" ? "Data da Coleta" : "Collection Date"} *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    {date ? (
                      format(date, language === "pt-BR" ? "dd 'de' MMMM 'de' yyyy" : "MMMM dd, yyyy", { locale })
                    ) : (
                      <span className="text-muted-foreground">
                        {language === "pt-BR" ? "Selecione uma data" : "Select a date"}
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
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Horário da Coleta */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <Clock size={16} className="mr-2 text-muted-foreground" />
                {language === "pt-BR" ? "Horário da Coleta" : "Collection Time"} *
              </label>
              <Select value={timeSlot} onValueChange={setTimeSlot}>
                <SelectTrigger>
                  <SelectValue placeholder={language === "pt-BR" ? "Selecione o horário" : "Select time"} />
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
                {language === "pt-BR" ? "Endereço para Coleta" : "Collection Address"} *
              </label>
              <Input
                placeholder={
                  language === "pt-BR" ? "Rua, número, bairro, cidade" : "Street, number, neighborhood, city"
                }
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Quantidade de Latinhas */}
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center">
                <div className="mr-2 text-muted-foreground w-4 h-4 relative">
                  <Image src="/images/latinha.png" alt="Latinha" fill style={{ objectFit: "contain" }} />
                </div>
                {language === "pt-BR" ? "Quantidade aproximada de latinhas" : "Approximate number of cans"} *
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
                <MessageSquare size={16} className="mr-2 text-muted-foreground" />
                {language === "pt-BR" ? "Observações (opcional)" : "Notes (optional)"}
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

          {message && <FormMessage type={message.type} message={message.text} />}

          <div className="flex gap-3 mt-6">
            <Link href={`/collections/${id}`} className="flex-1">
              <Button variant="outline" className="w-full bg-transparent" disabled={isSubmitting}>
                {language === "pt-BR" ? "Cancelar" : "Cancel"}
              </Button>
            </Link>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !date || !timeSlot || !address || !cansCount}
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
                  {language === "pt-BR" ? "Atualizar Coleta" : "Update Collection"}
                </>
              )}
            </Button>
          </div>
        </GlassCard>

        {/* Informações importantes */}
        <GlassCard>
          <h3 className="text-lg font-semibold mb-3">
            {language === "pt-BR" ? "Informações importantes" : "Important information"}
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
  )
}
