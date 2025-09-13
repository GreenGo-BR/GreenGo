"use client";

import type React from "react";

import { useState } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MessageSquare,
  Send,
  User,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";
import Navigation from "@/components/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";

export default function SupportPage() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("chat");
  useScrollToTop();

  const [messages, setMessages] = useState([
    {
      id: "msg1",
      sender: "system",
      message:
        language === "pt-BR"
          ? "Olá! Como podemos ajudar você hoje?"
          : "Hello! How can we help you today?",
      timestamp: new Date(2024, 4, 20, 14, 30),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // FAQ items baseados no idioma
  const faqItems =
    language === "pt-BR"
      ? [
          {
            question: "Como funciona o processo de coleta?",
            answer:
              "Após agendar uma coleta pelo aplicativo, um de nossos coletores irá até o endereço informado no dia e horário escolhidos. O coletor irá pesar as latinhas no local e efetuar o pagamento imediatamente via Pix ou adicionar o valor à sua carteira GreenGo.",
          },
          {
            question: "Quanto é pago por quilo de latinhas?",
            answer:
              "Atualmente, pagamos R$5,00 por quilo de latinhas de alumínio. O valor pode variar de acordo com o mercado, mas sempre informamos antecipadamente qualquer alteração.",
          },
          {
            question: "Posso cancelar ou reagendar uma coleta?",
            answer:
              "Sim, você pode cancelar ou reagendar uma coleta até 2 horas antes do horário agendado, sem nenhuma penalidade. Basta acessar a seção 'Minhas Coletas' e selecionar a opção desejada.",
          },
          {
            question: "Quais materiais são aceitos para coleta?",
            answer:
              "Atualmente, aceitamos apenas latinhas de alumínio (refrigerante, cerveja, energético, etc.). Em breve, expandiremos para outros materiais recicláveis.",
          },
          {
            question: "Como funciona o pagamento?",
            answer:
              "O pagamento é feito imediatamente após a coleta, com base no peso real das latinhas. Você pode optar por receber via Pix ou adicionar o valor à sua carteira GreenGo para resgatar posteriormente.",
          },
          {
            question: "Qual é a quantidade mínima para agendar uma coleta?",
            answer:
              "Não há quantidade mínima obrigatória, mas recomendamos pelo menos 1kg de latinhas (aproximadamente 60 latinhas) para tornar a coleta mais eficiente.",
          },
        ]
      : [
          {
            question: "How does the collection process work?",
            answer:
              "After scheduling a collection through the app, one of our collectors will go to the informed address on the chosen day and time. The collector will weigh the cans on site and make payment immediately via digital transfer or add the amount to your GreenGo wallet.",
          },
          {
            question: "How much is paid per kilogram of cans?",
            answer:
              "Currently, we pay $2.50 per kilogram of aluminum cans. The value may vary according to the market, but we always inform in advance of any changes.",
          },
          {
            question: "Can I cancel or reschedule a collection?",
            answer:
              "Yes, you can cancel or reschedule a collection up to 2 hours before the scheduled time, without any penalty. Just access the 'My Collections' section and select the desired option.",
          },
          {
            question: "What materials are accepted for collection?",
            answer:
              "Currently, we only accept aluminum cans (soda, beer, energy drinks, etc.). Soon, we will expand to other recyclable materials.",
          },
          {
            question: "How does payment work?",
            answer:
              "Payment is made immediately after collection, based on the actual weight of the cans. You can choose to receive via digital transfer or add the amount to your GreenGo wallet to withdraw later.",
          },
          {
            question: "What is the minimum quantity to schedule a collection?",
            answer:
              "There is no mandatory minimum quantity, but we recommend at least 1kg of cans (approximately 60 cans) to make the collection more efficient.",
          },
        ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: `msg${messages.length + 1}`,
      sender: "user",
      message: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");

    // Simulação de resposta automática após 1 segundo
    setTimeout(() => {
      const botMessage = {
        id: `msg${messages.length + 2}`,
        sender: "system",
        message:
          language === "pt-BR"
            ? "Obrigado por entrar em contato! Um de nossos atendentes responderá em breve. Nosso horário de atendimento é de segunda a sexta, das 8h às 18h."
            : "Thank you for contacting us! One of our agents will respond shortly. Our support hours are Monday to Friday, 8am to 6pm.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de envio do formulário
    alert(
      language === "pt-BR"
        ? "Mensagem enviada com sucesso! Responderemos em breve."
        : "Message sent successfully! We will respond shortly."
    );
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("support.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("support.subtitle")}
            </p>
          </div>
        </div>
        <div>
          <Tabs
            defaultValue="chat"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-6"
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="chat">{t("support.chat")}</TabsTrigger>
              <TabsTrigger value="faq">{t("support.faq")}</TabsTrigger>
              <TabsTrigger value="contact">{t("support.contact")}</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <GlassCard className="h-[400px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          msg.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.message}
                        <div
                          className={`text-xs mt-1 ${
                            msg.sender === "user"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {msg.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder={t("support.typePlaceholder")}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </GlassCard>

              <p className="text-sm text-muted-foreground text-center">
                {t("support.hours")}
              </p>
            </TabsContent>

            <TabsContent value="faq">
              <GlassCard>
                <h2 className="text-xl font-semibold mb-4">
                  {language === "pt-BR"
                    ? "Perguntas Frequentes"
                    : "Frequently Asked Questions"}
                </h2>

                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    {language === "pt-BR"
                      ? "Não encontrou o que procurava?"
                      : "Didn't find what you were looking for?"}
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setActiveTab("chat")}
                    className="text-primary"
                  >
                    {language === "pt-BR"
                      ? "Fale conosco pelo chat"
                      : "Contact us via chat"}
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="contact">
              <GlassCard>
                <h2 className="text-xl font-semibold mb-4">
                  {language === "pt-BR" ? "Entre em Contato" : "Get in Touch"}
                </h2>

                <form onSubmit={handleSubmitForm} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <User size={16} className="mr-2 text-muted-foreground" />
                      {language === "pt-BR" ? "Nome Completo" : "Full Name"}
                    </label>
                    <Input
                      placeholder={
                        language === "pt-BR" ? "Seu nome" : "Your name"
                      }
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <Mail size={16} className="mr-2 text-muted-foreground" />
                      {language === "pt-BR" ? "E-mail" : "Email"}
                    </label>
                    <Input
                      type="email"
                      placeholder={
                        language === "pt-BR"
                          ? "seu.email@exemplo.com"
                          : "your.email@example.com"
                      }
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <Phone size={16} className="mr-2 text-muted-foreground" />
                      {language === "pt-BR" ? "Telefone" : "Phone"}
                    </label>
                    <Input
                      placeholder={
                        language === "pt-BR"
                          ? "(00) 00000-0000"
                          : "+1 (000) 000-0000"
                      }
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {language === "pt-BR" ? "Assunto" : "Subject"}
                    </label>
                    <Input
                      placeholder={
                        language === "pt-BR"
                          ? "Assunto da mensagem"
                          : "Message subject"
                      }
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center">
                      <MessageSquare
                        size={16}
                        className="mr-2 text-muted-foreground"
                      />
                      {language === "pt-BR" ? "Mensagem" : "Message"}
                    </label>
                    <Textarea
                      placeholder={
                        language === "pt-BR"
                          ? "Descreva sua dúvida ou problema"
                          : "Describe your question or problem"
                      }
                      className="min-h-[120px]"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {language === "pt-BR" ? "Enviar Mensagem" : "Send Message"}
                  </Button>
                </form>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
