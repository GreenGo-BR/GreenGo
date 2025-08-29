"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface CancelCollectionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason?: string) => Promise<void>
  collectionId: string
}

export function CancelCollectionModal({ isOpen, onClose, onConfirm, collectionId }: CancelCollectionModalProps) {
  const { language } = useLanguage()
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm(reason)
      setReason("")
      onClose()
    } catch (error) {
      console.error("Erro ao cancelar coleta:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setReason("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            {language === "pt-BR" ? "Cancelar Coleta" : "Cancel Collection"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {language === "pt-BR"
              ? `Tem certeza que deseja cancelar a coleta #${collectionId.slice(-4)}?`
              : `Are you sure you want to cancel collection #${collectionId.slice(-4)}?`}
          </p>

          <div>
            <label className="block text-sm font-medium mb-2">
              {language === "pt-BR" ? "Motivo do cancelamento (opcional)" : "Cancellation reason (optional)"}
            </label>
            <Textarea
              placeholder={
                language === "pt-BR"
                  ? "Informe o motivo do cancelamento..."
                  : "Please provide the reason for cancellation..."
              }
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {language === "pt-BR"
                ? "⚠️ Esta ação não pode ser desfeita. Você poderá agendar uma nova coleta a qualquer momento."
                : "⚠️ This action cannot be undone. You can schedule a new collection at any time."}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {language === "pt-BR" ? "Manter Coleta" : "Keep Collection"}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {language === "pt-BR" ? "Cancelando..." : "Cancelling..."}
              </>
            ) : language === "pt-BR" ? (
              "Confirmar Cancelamento"
            ) : (
              "Confirm Cancellation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
