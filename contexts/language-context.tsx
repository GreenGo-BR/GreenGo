"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { authTranslations } from "./auth-translations";

type Language = "pt-BR" | "en-US";

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Traduções expandidas do aplicativo
const translations: Translations = {
  "auth.2fa.title": {
    "pt-BR": "Início",
    "en-US": "Two-Factor Authentication",
  },
  "auth.2fa.subtitle": {
    "pt-BR": "Início",
    "en-US": "Enter the 6-digit code from your app.",
  },
  "auth.2fa.code": {
    "pt-BR": "Início",
    "en-US": "Authentication Code",
  },
  "auth.2fa.button": {
    "pt-BR": "Início",
    "en-US": "Verify",
  },
  "auth.2fa.loading": {
    "pt-BR": "Início",
    "en-US": "Verifying...",
  },
  "auth.2fa.backToLogin": {
    "pt-BR": "Início",
    "en-US": "Wrong account?",
  },
  "auth.2fa.login": {
    "pt-BR": "Início",
    "en-US": "Log in again",
  },
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
  "wallet.statement": {
    "pt-BR": "Extrato da Carteira",
    "en-US": "Wallet Statement",
  },
  "wallet.currentbalance": {
    "pt-BR": "Saldo Atual",
    "en-US": "Current Balance",
  },
  "wallet.totalincome": {
    "pt-BR": "Total Recebido",
    "en-US": "Total Income",
  },
  "wallet.totalexpense": {
    "pt-BR": "Total Gasto",
    "en-US": "Total Expense",
  },
  "wallet.all": {
    "pt-BR": "Todas",
    "en-US": "All",
  },
  "wallet.income": {
    "pt-BR": "Entradas",
    "en-US": "Income",
  },
  "wallet.expense": {
    "pt-BR": "Saídas",
    "en-US": "Expense",
  },
  "wallet.transactionhistory": {
    "pt-BR": "Histórico de Transações",
    "en-US": "Transaction History",
  },
  "wallet.transaction": {
    "pt-BR": "Transações",
    "en-US": "Transactions",
  },

  // Coletas - Expandido
  "collections.title": {
    "pt-BR": "Minhas Coletas",
    "en-US": "My Collections",
  },
  "collections.subtitle": {
    "pt-BR": "Organize e acesse facilmente seus itens salvos em coleções.",
    "en-US": "Organize and easily access your saved items in collections.",
  },
  "collections.schedule": {
    "pt-BR": "Agendar Coleta",
    "en-US": "Schedule Collection",
  },
  "collections.details": {
    "pt-BR": "Ver detalhes",
    "en-US": "View Details",
  },
  "collections.view": {
    "pt-BR": "Ver Coleções",
    "en-US": "View Collections",
  },
  "collections.empty": {
    "pt-BR": "Nenhuma coleção encontraDa.",
    "en-US": "No collections found.",
  },
  "collections.recent": {
    "pt-BR": "Recentes",
    "en-US": "Recent",
  },
  "collections.stats.totalCans": {
    "pt-BR": "Total de Latas",
    "en-US": "Total Cans",
  },
  "collections.stats.completed": {
    "pt-BR": "Concluídas",
    "en-US": "Completed",
  },
  "collections.stats.totalValue": {
    "pt-BR": "Valor Total",
    "en-US": "Total Value",
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
  "collections.nocans": {
    "pt-BR": "Número de latinhas",
    "en-US": "Number of cans",
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
  "collections.rating": {
    "pt-BR": "Avaliação",
    "en-US": "Rating",
  },
  "collections.view_receipt": {
    "pt-BR": "Ver comprovante",
    "en-US": "View Receipt",
  },
  "collections.payments_collections": {
    "pt-BR": "O pagamento será processado após a conclusão da coleta",
    "en-US": "Payment will be processed after collection completion",
  },
  "collections.no_collector_assigned": {
    "pt-BR": "Coletor ainda não designado",
    "en-US": "Collector not yet assigned",
  },
  "collections.amount": {
    "pt-BR": "Valor",
    "en-US": "Amount",
  },
  "collections.r": {
    "pt-BR": "R$",
    "en-US": "$",
  },
  "collections.method": {
    "pt-BR": "Método",
    "en-US": "Method",
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
  "schedule.dateFormat": {
    "pt-BR": "dd 'de' MMMM 'de' yyyy",
    "en-US": "MMMM dd, yyyy",
  },

  // Suporte
  "support.title": {
    "pt-BR": "Suporte",
    "en-US": "Support",
  },
  "support.subtitle": {
    "pt-BR": "Entre em contato com nossa equipe de suporte para obter ajuda.",
    "en-US": "Get in touch with our support team for assistance.",
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
  "notifications.subtitle": {
    "pt-BR": "Gerencie suas preferências de notificações e fique atualizado.",
    "en-US": "Manage your notification preferences and stay updated.",
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
  "profile.verified": {
    "pt-BR": "Verificado",
    "en-US": "Verified",
  },
  "profile.premium": {
    "pt-BR": "Premium",
    "en-US": "Premium",
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
  "profile.phoneNumber": {
    "pt-BR": "Número de telefone",
    "en-US": "Phone number",
  },
  "profile.phoneotp": {
    "pt-BR": "Número de telefone OTP",
    "en-US": "OTP phone number",
  },
  "profile.noPhone": {
    "pt-BR": "Nenhum número de telefone fornecido",
    "en-US": "No phone number provided",
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
  "profile.logout": {
    "pt-BR": "Sair",
    "en-US": "Logout",
  },
  "profile.subtitle": {
    "pt-BR": "Visualize e atualize suas informações pessoais.",
    "en-US": "View and update your personal information.",
  },
  "profile.cpf": {
    "pt-BR": "CPF",
    "en-US": "CPF",
  },
  "profile.country": {
    "pt-BR": "País",
    "en-US": "Country",
  },
  "profile.changePasswordDesc": {
    "pt-BR": "Atualize sua senha para manter sua conta segura.",
    "en-US": "Update your password to keep your account secure.",
  },
  "profile.twoFactorDesc": {
    "pt-BR": "Adicione uma camada extra de segurança à sua conta.",
    "en-US": "Add an extra layer of security to your account.",
  },
  "profile.change": {
    "pt-BR": "Mudar",
    "en-US": "Change",
  },
  "profile.configure": {
    "pt-BR": "Configurar",
    "en-US": "Configure",
  },
  "profile.notificationsDesc": {
    "pt-BR":
      "Gerencie suas preferências de notificação para se manter atualizado sobre atividades e atualizações importantes da conta.",
    "en-US":
      "Manage your notification preferences to stay updated on important account activity and updates.",
  },
  "profile.darkModeDesc": {
    "pt-BR":
      "Mude para um tema mais escuro que seja mais agradável aos seus olhos.",
    "en-US": "Switch to a darker theme that's easier on your eyes.",
  },
  "profile.wallet": {
    "pt-BR": "Carteira",
    "en-US": "Wallet",
  },
  "profile.walletStatement": {
    "pt-BR": "Extrato da carteira",
    "en-US": "Wallet Statement",
  },
  "profile.walletStatementDesc": {
    "pt-BR":
      "Mude para um tema mais escuro que seja mais agradável aos seus olhos.",
    "en-US": "View a summary of your recent transactions and balances.",
  },
  "profile.paymentMethods": {
    "pt-BR": "Métodos de pagamento",
    "en-US": "Payment Methods",
  },
  "profile.paymentMethodsDesc": {
    "pt-BR":
      "Gerencie suas opções de pagamento salvas para uma finalização de compra rápida e fácil.",
    "en-US": "Manage your saved payment options for quick and easy checkout.",
  },
  "profile.support": {
    "pt-BR": "Apoiar",
    "en-US": "Support",
  },
  "profile.termsDesc": {
    "pt-BR": "Leia as regras e condições para usar nosso serviço.",
    "en-US": "Read the rules and conditions for using our service.",
  },
  "profile.help": {
    "pt-BR": "Ajuda",
    "en-US": "Help",
  },
  "profile.helpDesc": {
    "pt-BR": "Obtenha suporte e respostas para perguntas comuns.",
    "en-US": "Get support and answers to common questions.",
  },
  "profile.keyType": {
    "pt-BR": "Tipo de Chave",
    "en-US": "Key Type",
  },
  "profile.addPixKey": {
    "pt-BR": "Adicionar Chave Pix",
    "en-US": "Add Pix Key",
  },
  "profile.key": {
    "pt-BR": "Chave",
    "en-US": "Key",
  },
  "profile.labelOptional": {
    "pt-BR": "Nome (opcional)",
    "en-US": "Label (optional)",
  },
  "profile.labelPlaceholder": {
    "pt-BR": "Ex: Email principal, Celular pessoal...",
    "en-US": "Ex: Main email, Personal phone...",
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
    "pt-BR":
      "Atualize as informações da sua coleta. Todos os campos são obrigatórios.",
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
    "pt-BR":
      "⚠️ Esta ação não pode ser desfeita. Você poderá agendar uma nova coleta a qualquer momento.",
    "en-US":
      "⚠️ This action cannot be undone. You can schedule a new collection at any time.",
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

  /* Payment Method */
  "paymentmethod.title": {
    "pt-BR": "Métodos de Pagamento",
    "en-US": "Payment Methods",
  },
  "paymentmethod.add": {
    "pt-BR": "Adicionar",
    "en-US": "Add",
  },
  "paymentmethod.pix_keys": {
    "pt-BR": "Chaves Pix",
    "en-US": "Pix Keys",
  },
  "paymentmethod.manage": {
    "pt-BR": "Gerencie suas chaves Pix para receber pagamentos",
    "en-US": "Manage your Pix keys to receive payments",
  },
  "paymentmethod.register": {
    "pt-BR": "Nenhuma chave Pix cadastrada",
    "en-US": "No Pix keys registered",
  },
  "paymentmethod.addkey": {
    "pt-BR": "Adicionar primeira chave",
    "en-US": "Add first key",
  },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("pt-BR");

  // Carregar idioma do localStorage quando disponível
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Salvar idioma no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  // Função para traduzir textos
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
