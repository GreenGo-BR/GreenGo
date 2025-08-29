"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authTranslations } from "./auth-translations"

type Language = "pt-BR" | "en-US"

type Translations = {
  [key: string]: {
    [key: string]: string
  }
}

// Traduções expandidas do aplicativo
const translations: Translations = {
  // Navegação
  "nav.home": {
    "pt-BR": "Início",
    "en-US": "Home",
  },
  "nav.collections": {
    "pt-BR": "Coletas",
    "en-US": "Collections",
  },
  "nav.notifications": {
    "pt-BR": "Notificações",
    "en-US": "Notifications",
  },
  "nav.support": {
    "pt-BR": "Suporte",
    "en-US": "Support",
  },
  "nav.profile": {
    "pt-BR": "Perfil",
    "en-US": "Profile",
  },

  // Página inicial
  "home.slogan": {
    "pt-BR": "A gente busca, o planeta agradece",
    "en-US": "We collect, the planet thanks you",
  },
  "home.schedule": {
    "pt-BR": "Agendar Coleta",
    "en-US": "Schedule Collection",
  },
  "home.upcoming": {
    "pt-BR": "Próximas Coletas",
    "en-US": "Upcoming Collections",
  },
  "home.viewAll": {
    "pt-BR": "Ver todas",
    "en-US": "View all",
  },
  "home.noCollections": {
    "pt-BR": "Você não tem coletas agendadas.",
    "en-US": "You don't have any scheduled collections.",
  },
  "home.scheduleOne": {
    "pt-BR": "Agendar uma coleta",
    "en-US": "Schedule a collection",
  },

  // Carteira
  "wallet.title": {
    "pt-BR": "Carteira GreenGo",
    "en-US": "GreenGo Wallet",
  },
  "wallet.balance": {
    "pt-BR": "Saldo disponível:",
    "en-US": "Available balance:",
  },
  "wallet.lastPayment": {
    "pt-BR": "Último pagamento:",
    "en-US": "Last payment:",
  },
  "wallet.viewStatement": {
    "pt-BR": "Ver extrato",
    "en-US": "View statement",
  },
  "wallet.in": {
    "pt-BR": "em",
    "en-US": "on",
  },

  // Coletas - Expandido
  "collections.title": {
    "pt-BR": "Minhas Coletas",
    "en-US": "My Collections",
  },
  "collections.details": {
    "pt-BR": "Ver detalhes",
    "en-US": "View details",
  },
  "collections.status.scheduled": {
    "pt-BR": "Agendada",
    "en-US": "Scheduled",
  },
  "collections.status.completed": {
    "pt-BR": "Concluída",
    "en-US": "Completed",
  },
  "collections.status.cancelled": {
    "pt-BR": "Cancelada",
    "en-US": "Cancelled",
  },
  "collections.status.pending": {
    "pt-BR": "Pendente",
    "en-US": "Pending",
  },
  "collections.estimatedQuantity": {
    "pt-BR": "Quantidade estimada:",
    "en-US": "Estimated quantity:",
  },
  "collections.cans": {
    "pt-BR": "latinhas",
    "en-US": "cans",
  },
  "collections.collection": {
    "pt-BR": "Coleta",
    "en-US": "Collection",
  },
  "collections.approximately": {
    "pt-BR": "aproximadamente",
    "en-US": "approximately",
  },
  "collections.detailsTitle": {
    "pt-BR": "Detalhes da Coleta",
    "en-US": "Collection Details",
  },
  "collections.date": {
    "pt-BR": "Data",
    "en-US": "Date",
  },
  "collections.time": {
    "pt-BR": "Horário",
    "en-US": "Time",
  },
  "collections.address": {
    "pt-BR": "Endereço",
    "en-US": "Address",
  },
  "collections.notes": {
    "pt-BR": "Observações",
    "en-US": "Notes",
  },
  "collections.collector": {
    "pt-BR": "Coletor",
    "en-US": "Collector",
  },
  "collections.payment": {
    "pt-BR": "Pagamento",
    "en-US": "Payment",
  },
  "collections.reschedule": {
    "pt-BR": "Reagendar",
    "en-US": "Reschedule",
  },
  "collections.cancel": {
    "pt-BR": "Cancelar",
    "en-US": "Cancel",
  },

  // Agendamento
  "schedule.title": {
    "pt-BR": "Agendar Coleta",
    "en-US": "Schedule Collection",
  },
  "schedule.dateTime": {
    "pt-BR": "Data e Hora",
    "en-US": "Date & Time",
  },
  "schedule.details": {
    "pt-BR": "Detalhes",
    "en-US": "Details",
  },
  "schedule.confirmation": {
    "pt-BR": "Confirmação",
    "en-US": "Confirmation",
  },
  "schedule.selectDate": {
    "pt-BR": "Selecione uma data",
    "en-US": "Select a date",
  },
  "schedule.selectTime": {
    "pt-BR": "Selecione um horário",
    "en-US": "Select a time",
  },
  "schedule.address": {
    "pt-BR": "Endereço para Coleta",
    "en-US": "Collection Address",
  },
  "schedule.addressPlaceholder": {
    "pt-BR": "Rua, número, bairro, cidade",
    "en-US": "Street, number, neighborhood, city",
  },
  "schedule.quantity": {
    "pt-BR": "Quantidade aproximada de latinhas",
    "en-US": "Approximate number of cans",
  },
  "schedule.quantityPlaceholder": {
    "pt-BR": "Ex: 120",
    "en-US": "Ex: 120",
  },
  "schedule.quantityNote": {
    "pt-BR": "60 latinhas ≈ 1 kg",
    "en-US": "60 cans ≈ 1 kg",
  },
  "schedule.notes": {
    "pt-BR": "Observações (opcional)",
    "en-US": "Notes (optional)",
  },
  "schedule.notesPlaceholder": {
    "pt-BR": "Informações adicionais para o coletor",
    "en-US": "Additional information for the collector",
  },
  "schedule.continue": {
    "pt-BR": "Continuar",
    "en-US": "Continue",
  },
  "schedule.confirm": {
    "pt-BR": "Confirmar Agendamento",
    "en-US": "Confirm Schedule",
  },
  "schedule.processing": {
    "pt-BR": "Processando...",
    "en-US": "Processing...",
  },
  "schedule.success": {
    "pt-BR": "Coleta Agendada!",
    "en-US": "Collection Scheduled!",
  },
  "schedule.successMessage": {
    "pt-BR": "Sua coleta foi agendada com sucesso",
    "en-US": "Your collection has been successfully scheduled",
  },

  // Suporte
  "support.title": {
    "pt-BR": "Suporte",
    "en-US": "Support",
  },
  "support.chat": {
    "pt-BR": "Chat",
    "en-US": "Chat",
  },
  "support.faq": {
    "pt-BR": "FAQ",
    "en-US": "FAQ",
  },
  "support.contact": {
    "pt-BR": "Contato",
    "en-US": "Contact",
  },
  "support.typePlaceholder": {
    "pt-BR": "Digite sua mensagem...",
    "en-US": "Type your message...",
  },
  "support.send": {
    "pt-BR": "Enviar",
    "en-US": "Send",
  },
  "support.hours": {
    "pt-BR": "Horário de atendimento: Segunda a Sexta, 8h às 18h",
    "en-US": "Support hours: Monday to Friday, 8am to 6pm",
  },

  // Notificações
  "notifications.title": {
    "pt-BR": "Notificações",
    "en-US": "Notifications",
  },
  "notifications.markAllRead": {
    "pt-BR": "Marcar todas como lidas",
    "en-US": "Mark all as read",
  },
  "notifications.all": {
    "pt-BR": "Todas",
    "en-US": "All",
  },
  "notifications.unread": {
    "pt-BR": "Não lidas",
    "en-US": "Unread",
  },
  "notifications.collections": {
    "pt-BR": "Coletas",
    "en-US": "Collections",
  },
  "notifications.payments": {
    "pt-BR": "Pagamentos",
    "en-US": "Payments",
  },

  // Perfil
  "profile.title": {
    "pt-BR": "Meu Perfil",
    "en-US": "My Profile",
  },
  "profile.personalInfo": {
    "pt-BR": "Informações Pessoais",
    "en-US": "Personal Information",
  },
  "profile.name": {
    "pt-BR": "Nome",
    "en-US": "Name",
  },
  "profile.email": {
    "pt-BR": "E-mail",
    "en-US": "Email",
  },
  "profile.phone": {
    "pt-BR": "Telefone",
    "en-US": "Phone",
  },
  "profile.address": {
    "pt-BR": "Endereço",
    "en-US": "Address",
  },
  "profile.recentCollections": {
    "pt-BR": "Coletas Recentes",
    "en-US": "Recent Collections",
  },
  "profile.tabs.personal": {
    "pt-BR": "Pessoal",
    "en-US": "Personal",
  },
  "profile.tabs.wallet": {
    "pt-BR": "Carteira",
    "en-US": "Wallet",
  },
  "profile.tabs.settings": {
    "pt-BR": "Configurações",
    "en-US": "Settings",
  },
  "profile.language": {
    "pt-BR": "Idioma",
    "en-US": "Language",
  },
  "profile.darkMode": {
    "pt-BR": "Modo Escuro",
    "en-US": "Dark Mode",
  },
  "profile.notifications": {
    "pt-BR": "Notificações",
    "en-US": "Notifications",
  },
  "profile.receiveAlerts": {
    "pt-BR": "Receber alertas e lembretes",
    "en-US": "Receive alerts and reminders",
  },
  "profile.changeAppearance": {
    "pt-BR": "Alterar aparência do app",
    "en-US": "Change app appearance",
  },
  "profile.security": {
    "pt-BR": "Segurança",
    "en-US": "Security",
  },
  "profile.changePassword": {
    "pt-BR": "Alterar senha",
    "en-US": "Change password",
  },
  "profile.twoFactor": {
    "pt-BR": "Verificação em duas etapas",
    "en-US": "Two-factor verification",
  },
  "profile.about": {
    "pt-BR": "Sobre",
    "en-US": "About",
  },
  "profile.terms": {
    "pt-BR": "Termos de uso",
    "en-US": "Terms of use",
  },
  "profile.privacy": {
    "pt-BR": "Política de privacidade",
    "en-US": "Privacy policy",
  },
  "profile.version": {
    "pt-BR": "Versão",
    "en-US": "Version",
  },
  "profile.rights": {
    "pt-BR": "Todos os direitos reservados.",
    "en-US": "All rights reserved.",
  },
  "profile.preferences": {
    "pt-BR": "Preferências",
    "en-US": "Preferences",
  },

  // Botões comuns
  "common.back": {
    "pt-BR": "Voltar",
    "en-US": "Back",
  },
  "common.save": {
    "pt-BR": "Salvar",
    "en-US": "Save",
  },
  "common.cancel": {
    "pt-BR": "Cancelar",
    "en-US": "Cancel",
  },
  "common.edit": {
    "pt-BR": "Editar",
    "en-US": "Edit",
  },
  "common.delete": {
    "pt-BR": "Excluir",
    "en-US": "Delete",
  },
  "common.close": {
    "pt-BR": "Fechar",
    "en-US": "Close",
  },

  // Perfil - Edição
  "profile.editPersonalInfo": {
    "pt-BR": "Editar Informações Pessoais",
    "en-US": "Edit Personal Information",
  },
  "profile.updateSuccess": {
    "pt-BR": "Informações atualizadas com sucesso!",
    "en-US": "Information updated successfully!",
  },
  "profile.updateError": {
    "pt-BR": "Erro ao atualizar informações. Tente novamente.",
    "en-US": "Error updating information. Please try again.",
  },

  // Botões comuns - Expandido
  "common.saving": {
    "pt-BR": "Salvando...",
    "en-US": "Saving...",
  },
  "common.loading": {
    "pt-BR": "Carregando...",
    "en-US": "Loading...",
  },

  // Autenticação - Adicionais
  "auth.login.loading": {
    "pt-BR": "Entrando...",
    "en-US": "Signing in...",
  },
  "auth.reset.loading": {
    "pt-BR": "Enviando...",
    "en-US": "Sending...",
  },
  "auth.reset.new.loading": {
    "pt-BR": "Alterando...",
    "en-US": "Changing...",
  },
  "auth.error.invalidToken": {
    "pt-BR": "Token inválido ou expirado",
    "en-US": "Invalid or expired token",
  },
  "auth.reset.backToReset": {
    "pt-BR": "Voltar para recuperação",
    "en-US": "Back to reset",
  },
  "auth.register.changeImage": {
    "pt-BR": "Alterar imagem",
    "en-US": "Change image",
  },
  "auth.register.uploadImage": {
    "pt-BR": "Adicionar imagem",
    "en-US": "Add image",
  },
  "auth.register.selectCountry": {
    "pt-BR": "Selecione o país",
    "en-US": "Select country",
  },

  // Adicionar as traduções de autenticação
  ...authTranslations,

  // Edição de coleta
  "collections.edit.title": {
    "pt-BR": "Editar Coleta",
    "en-US": "Edit Collection",
  },
  "collections.edit.editing": {
    "pt-BR": "Editando Coleta",
    "en-US": "Editing Collection",
  },
  "collections.edit.description": {
    "pt-BR": "Atualize as informações da sua coleta. Todos os campos são obrigatórios.",
    "en-US": "Update your collection information. All fields are required.",
  },
  "collections.edit.update": {
    "pt-BR": "Atualizar Coleta",
    "en-US": "Update Collection",
  },
  "collections.edit.updating": {
    "pt-BR": "Atualizando...",
    "en-US": "Updating...",
  },
  "collections.edit.success": {
    "pt-BR": "Coleta atualizada com sucesso!",
    "en-US": "Collection updated successfully!",
  },
  "collections.edit.error": {
    "pt-BR": "Erro ao atualizar coleta. Tente novamente.",
    "en-US": "Error updating collection. Please try again.",
  },
  "collections.edit.fillRequired": {
    "pt-BR": "Por favor, preencha todos os campos obrigatórios.",
    "en-US": "Please fill in all required fields.",
  },

  // Cancelamento de coleta
  "collections.cancel.title": {
    "pt-BR": "Cancelar Coleta",
    "en-US": "Cancel Collection",
  },
  "collections.cancel.confirm": {
    "pt-BR": "Tem certeza que deseja cancelar a coleta",
    "en-US": "Are you sure you want to cancel collection",
  },
  "collections.cancel.reason": {
    "pt-BR": "Motivo do cancelamento (opcional)",
    "en-US": "Cancellation reason (optional)",
  },
  "collections.cancel.reasonPlaceholder": {
    "pt-BR": "Informe o motivo do cancelamento...",
    "en-US": "Please provide the reason for cancellation...",
  },
  "collections.cancel.warning": {
    "pt-BR": "⚠️ Esta ação não pode ser desfeita. Você poderá agendar uma nova coleta a qualquer momento.",
    "en-US": "⚠️ This action cannot be undone. You can schedule a new collection at any time.",
  },
  "collections.cancel.keep": {
    "pt-BR": "Manter Coleta",
    "en-US": "Keep Collection",
  },
  "collections.cancel.confirmButton": {
    "pt-BR": "Confirmar Cancelamento",
    "en-US": "Confirm Cancellation",
  },
  "collections.cancel.cancelling": {
    "pt-BR": "Cancelando...",
    "en-US": "Cancelling...",
  },

  // Coleta cancelada
  "collections.cancelled.title": {
    "pt-BR": "Coleta Cancelada",
    "en-US": "Collection Cancelled",
  },
  "collections.cancelled.message": {
    "pt-BR": "foi cancelada com sucesso.",
    "en-US": "has been successfully cancelled.",
  },
  "collections.cancelled.whatHappens": {
    "pt-BR": "O que acontece agora?",
    "en-US": "What happens now?",
  },
  "collections.cancelled.removed": {
    "pt-BR": "Sua coleta foi removida da agenda",
    "en-US": "Your collection has been removed from the schedule",
  },
  "collections.cancelled.noCharges": {
    "pt-BR": "Nenhuma cobrança será feita",
    "en-US": "No charges will be applied",
  },
  "collections.cancelled.canSchedule": {
    "pt-BR": "Você pode agendar uma nova coleta a qualquer momento",
    "en-US": "You can schedule a new collection at any time",
  },
  "collections.cancelled.newCollection": {
    "pt-BR": "Nova Coleta",
    "en-US": "New Collection",
  },

  // Informações importantes
  "collections.info.title": {
    "pt-BR": "Informações importantes",
    "en-US": "Important information",
  },
  "collections.info.immediate": {
    "pt-BR": "As alterações entrarão em vigor imediatamente",
    "en-US": "Changes will take effect immediately",
  },
  "collections.info.notification": {
    "pt-BR": "Você receberá uma confirmação por notificação",
    "en-US": "You will receive a confirmation notification",
  },
  "collections.info.collectorNotified": {
    "pt-BR": "O coletor será notificado sobre as mudanças",
    "en-US": "The collector will be notified about the changes",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-BR")

  // Carregar idioma do localStorage quando disponível
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Salvar idioma no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  // Função para traduzir textos
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
