"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
  type: "terms" | "privacy"
}

export function TermsModal({ isOpen, onClose, type }: TermsModalProps) {
  const { language } = useLanguage()

  const getTitle = () => {
    if (type === "terms") {
      return language === "pt-BR" ? "Termos de Uso" : "Terms of Use"
    }
    return language === "pt-BR" ? "Política de Privacidade" : "Privacy Policy"
  }

  const getContent = () => {
    if (type === "terms") {
      return language === "pt-BR" ? termsContentPT : termsContentEN
    }
    return language === "pt-BR" ? privacyContentPT : privacyContentEN
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-4 text-sm">{getContent()}</div>
        </ScrollArea>

        <div className="flex justify-end">
          <Button onClick={onClose} className="bg-[#40A578] hover:bg-[#348c65]">
            {language === "pt-BR" ? "Fechar" : "Close"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const termsContentPT = (
  <>
    <h3 className="font-semibold">1. Aceitação dos Termos</h3>
    <p>
      Ao utilizar o aplicativo GreenGo, você concorda com estes termos de uso. Se você não concordar com qualquer parte
      destes termos, não deve usar nosso serviço.
    </p>

    <h3 className="font-semibold">2. Descrição do Serviço</h3>
    <p>
      O GreenGo é uma plataforma que conecta pessoas que desejam vender latinhas de alumínio com nossa equipe de coleta
      especializada.
    </p>

    <h3 className="font-semibold">3. Responsabilidades do Usuário</h3>
    <p>
      Você é responsável por fornecer informações precisas sobre a quantidade e localização das latinhas para coleta.
    </p>

    <h3 className="font-semibold">4. Pagamentos</h3>
    <p>
      Os pagamentos são processados com base no peso real das latinhas coletadas, conforme nossa tabela de preços
      vigente.
    </p>

    <h3 className="font-semibold">5. Cancelamentos</h3>
    <p>Coletas podem ser canceladas até 2 horas antes do horário agendado sem penalidades.</p>
  </>
)

const termsContentEN = (
  <>
    <h3 className="font-semibold">1. Acceptance of Terms</h3>
    <p>
      By using the GreenGo application, you agree to these terms of use. If you do not agree with any part of these
      terms, you should not use our service.
    </p>

    <h3 className="font-semibold">2. Service Description</h3>
    <p>
      GreenGo is a platform that connects people who want to sell aluminum cans with our specialized collection team.
    </p>

    <h3 className="font-semibold">3. User Responsibilities</h3>
    <p>
      You are responsible for providing accurate information about the quantity and location of cans for collection.
    </p>

    <h3 className="font-semibold">4. Payments</h3>
    <p>Payments are processed based on the actual weight of collected cans, according to our current price table.</p>

    <h3 className="font-semibold">5. Cancellations</h3>
    <p>Collections can be canceled up to 2 hours before the scheduled time without penalties.</p>
  </>
)

const privacyContentPT = (
  <>
    <h3 className="font-semibold">1. Coleta de Informações</h3>
    <p>
      Coletamos informações pessoais necessárias para fornecer nossos serviços, incluindo nome, endereço, telefone e
      e-mail.
    </p>

    <h3 className="font-semibold">2. Uso das Informações</h3>
    <p>
      Suas informações são usadas exclusivamente para processar coletas, pagamentos e comunicação relacionada ao
      serviço.
    </p>

    <h3 className="font-semibold">3. Compartilhamento de Dados</h3>
    <p>
      Não compartilhamos suas informações pessoais com terceiros, exceto quando necessário para processar pagamentos.
    </p>

    <h3 className="font-semibold">4. Segurança</h3>
    <p>
      Implementamos medidas de segurança adequadas para proteger suas informações pessoais contra acesso não autorizado.
    </p>

    <h3 className="font-semibold">5. Seus Direitos</h3>
    <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.</p>
  </>
)

const privacyContentEN = (
  <>
    <h3 className="font-semibold">1. Information Collection</h3>
    <p>We collect personal information necessary to provide our services, including name, address, phone, and email.</p>

    <h3 className="font-semibold">2. Use of Information</h3>
    <p>Your information is used exclusively to process collections, payments, and service-related communication.</p>

    <h3 className="font-semibold">3. Data Sharing</h3>
    <p>We do not share your personal information with third parties, except when necessary to process payments.</p>

    <h3 className="font-semibold">4. Security</h3>
    <p>We implement appropriate security measures to protect your personal information against unauthorized access.</p>

    <h3 className="font-semibold">5. Your Rights</h3>
    <p>You have the right to access, correct, or delete your personal information at any time.</p>
  </>
)
