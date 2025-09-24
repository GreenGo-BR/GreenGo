"use client";

import { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Edit2, Trash2, Star } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/language-context";
import Navigation from "@/components/navigation";
import { useScrollToTop } from "@/hooks/use-scroll-to-top";
import { AddPaymentMethodModal } from "@/components/profile/add-payment-method-modal";
import { EditPaymentMethodModal } from "@/components/profile/edit-payment-method-modal";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

// Dados simulados para demonstração
interface PaymentMethod {
  id: string;
  type: "email" | "phone" | "cpf" | "random";
  key: string;
  label?: string;
  isDefault: boolean;
}

type PaymentMethodProps = {
  token: string;
  uid: string;
};

function PaymentMethodsPage({ token }: PaymentMethodProps) {
  const { t } = useLanguage();
  const { language } = useLanguage();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(
    null
  );
  useScrollToTop();

  useEffect(() => {
    if (!token) return;
    const fetchPaymentMethods = async () => {
      try {
        const res = await api().get("/payment_methods", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const methods = (res.data?.result ?? []).map((pm: any) => ({
          id: String(pm.PmID),
          type: pm.type,
          key: pm.keyname,
          label: pm.label || "",
          isDefault: Boolean(pm.isdefault),
        }));

        setPaymentMethods(methods);
      } catch (err) {
        console.error(err);
        setPaymentMethods([]);
      }
    };
    fetchPaymentMethods();
  }, []);

  const getTypeLabel = (type: string) => {
    const labels = {
      email: language === "pt-BR" ? "Email" : "Email",
      phone: language === "pt-BR" ? "Telefone" : "Phone",
      cpf: language === "pt-BR" ? "CPF" : "CPF",
      random: language === "pt-BR" ? "Chave Aleatória" : "Random Key",
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return "📧";
      case "phone":
        return "📱";
      case "cpf":
        return "🆔";
      case "random":
        return "🔑";
      default:
        return "💳";
    }
  };

  const handleAddPaymentMethod = (newMethod: Omit<PaymentMethod, "id">) => {
    const id = `pm${Date.now()}`;
    setPaymentMethods([...paymentMethods, { ...newMethod, id }]);
    setShowAddModal(false);
  };

  const handleEditPaymentMethod = (updatedMethod: PaymentMethod) => {
    setPaymentMethods(
      paymentMethods.map((method) =>
        method.id === updatedMethod.id ? updatedMethod : method
      )
    );
    setShowEditModal(false);
    setEditingMethod(null);
  };

  const handleDeletePaymentMethod = async (id: string) => {
    const method = paymentMethods.find((m) => m.id === id);
    if (method?.isDefault) {
      alert(
        language === "pt-BR"
          ? "Não é possível excluir a chave padrão."
          : "Cannot delete the default payment method."
      );
      return;
    }

    if (
      confirm(
        language === "pt-BR"
          ? "Tem certeza que deseja excluir esta chave Pix?"
          : "Are you sure you want to delete this Pix key?"
      )
    ) {
      try {
        const res = await api().delete(`/payment_methods/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setPaymentMethods((prev) =>
            prev.filter((method) => method.id !== id)
          );
        } else {
          alert(
            language === "pt-BR"
              ? "Erro ao excluir a chave Pix."
              : "Failed to delete Pix key."
          );
        }
      } catch (err) {
        console.error("Delete failed:", err);
        alert(
          language === "pt-BR"
            ? "Erro ao excluir a chave Pix."
            : "Failed to delete Pix key."
        );
      }
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await api().post(
        `/payment_methods/set_default/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setPaymentMethods(
          paymentMethods.map((method) => ({
            ...method,
            isDefault: method.id === id,
          }))
        );
      } else {
        alert(res.data.message || "Failed to update default method.");
      }
    } catch (err) {
      console.error("Set default failed:", err);
      alert("Error setting default method.");
    }
  };

  const openEditModal = (method: PaymentMethod) => {
    setEditingMethod(method);
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link href="/profile">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("paymentmethod.title")}
            </h1>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={18} className="mr-2" />
            {t("paymentmethod.add")}
          </Button>
        </div>

        {/* Payment Methods List */}
        <GlassCard>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">
              {t("paymentmethod.pix_keys")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("paymentmethod.manage")}
            </p>
          </div>

          {paymentMethods.length > 0 ? (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getTypeIcon(method.type)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">
                          {method.label ||
                            `${getTypeLabel(method.type)} ${method.id.slice(
                              -2
                            )}`}
                        </p>
                        {method.isDefault && (
                          <Badge variant="default" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {language === "pt-BR" ? "Padrão" : "Default"}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.key}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {getTypeLabel(method.type)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        title={
                          language === "pt-BR"
                            ? "Definir como padrão"
                            : "Set as default"
                        }
                      >
                        <Star size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(method)}
                      title={language === "pt-BR" ? "Editar" : "Edit"}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      disabled={method.isDefault}
                      title={language === "pt-BR" ? "Excluir" : "Delete"}
                      className="text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">💳</div>
              <p className="text-muted-foreground mb-4">
                {t("paymentmethod.register")}
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus size={18} className="mr-2" />
                {t("paymentmethod.addkey")}
              </Button>
            </div>
          )}
        </GlassCard>

        {/* Info Card */}
        <GlassCard className="mt-4">
          <h4 className="font-semibold mb-2">
            {language === "pt-BR" ? "Sobre as chaves Pix" : "About Pix keys"}
          </h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              {language === "pt-BR"
                ? "• Email: Use seu endereço de email como chave"
                : "• Email: Use your email address as key"}
            </p>
            <p>
              {language === "pt-BR"
                ? "• Telefone: Use seu número de celular"
                : "• Phone: Use your mobile number"}
            </p>
            <p>
              {language === "pt-BR"
                ? "• CPF: Use seu documento de identificação"
                : "• CPF: Use your identification document"}
            </p>
            <p>
              {language === "pt-BR"
                ? "• Chave aleatória: Sequência única gerada pelo banco"
                : "• Random key: Unique sequence generated by the bank"}
            </p>
          </div>
        </GlassCard>
      </div>
      <Navigation />

      {/* Modals */}
      <AddPaymentMethodModal
        isOpen={showAddModal}
        token={token}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddPaymentMethod}
      />

      {editingMethod && (
        <EditPaymentMethodModal
          token={token}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingMethod(null);
          }}
          onEdit={handleEditPaymentMethod}
          paymentMethod={editingMethod}
        />
      )}
    </div>
  );
}
export default withAuth(PaymentMethodsPage);
