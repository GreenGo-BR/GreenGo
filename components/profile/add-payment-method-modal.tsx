"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { api } from "@/lib/api";

interface PaymentMethod {
  type: "email" | "phone" | "cpf" | "random";
  key: string;
  label?: string;
  isDefault: boolean;
}

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  token: string;
  onClose: () => void;
  onAdd: (method: Omit<PaymentMethod, "id">) => void;
}

export function AddPaymentMethodModal({
  isOpen,
  token,
  onClose,
  onAdd,
}: AddPaymentMethodModalProps) {
  const { language } = useLanguage();
  const { t } = useLanguage();
  const [type, setType] = useState<"email" | "phone" | "cpf" | "random">(
    "email"
  );
  const [key, setKey] = useState("");
  const [label, setLabel] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateKey = (type: string, value: string) => {
    switch (type) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      case "phone":
        return /^$$\d{2}$$\s\d{4,5}-\d{4}$/.test(value);
      case "cpf":
        return /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value);
      case "random":
        return value.length >= 32;
      default:
        return false;
    }
  };

  const formatInput = (type: string, value: string) => {
    switch (type) {
      case "phone":
        // Remove all non-digits
        const digits = value.replace(/\D/g, "");
        // Format as (XX) XXXXX-XXXX or (XX) XXXX-XXXX
        if (digits.length <= 11) {
          return digits.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
        }
        return value;
      case "cpf":
        // Remove all non-digits
        const cpfDigits = value.replace(/\D/g, "");
        // Format as XXX.XXX.XXX-XX
        if (cpfDigits.length <= 11) {
          return cpfDigits.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            "$1.$2.$3-$4"
          );
        }
        return value;
      default:
        return value;
    }
  };

  const handleKeyChange = (value: string) => {
    const formatted = formatInput(type, value);
    setKey(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateKey(type, key)) {
      alert(
        language === "pt-BR"
          ? "Por favor, insira uma chave válida."
          : "Please enter a valid key."
      );
      return;
    }

    setIsLoading(true);

    try {
      let payload = {
        id: "0",
        type: type,
        key: key,
        label: label,
      };

      const res = await api().post("/payment_methods/add", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        const methods: PaymentMethod = {
          type: res.data.result.type,
          key: res.data.result.keyname,
          label: res.data.result.label || "",
          isDefault: res.data.result.isdefault == 0 ? false : true,
        };
        onAdd(methods);
        onClose();
      }
    } catch (error) {
      console.error("Failed to add payment method:", error);
      alert(
        language === "pt-BR"
          ? "Erro ao adicionar método de pagamento."
          : "Failed to add payment method."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholder = (type: string) => {
    switch (type) {
      case "email":
        return "exemplo@email.com";
      case "phone":
        return "(11) 99999-9999";
      case "cpf":
        return "000.000.000-00";
      case "random":
        return language === "pt-BR"
          ? "Cole aqui a chave aleatória do seu banco"
          : "Paste your bank's random key here";
      default:
        return "";
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      email: language === "pt-BR" ? "Email" : "Email",
      phone: language === "pt-BR" ? "Telefone" : "Phone",
      cpf: language === "pt-BR" ? "CPF" : "CPF",
      random: language === "pt-BR" ? "Chave Aleatória" : "Random Key",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("profile.addPixKey")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="type">{t("profile.keyType")}</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" align="start">
                <SelectItem value="email">
                  📧 {getTypeLabel("email")}
                </SelectItem>
                <SelectItem value="phone">
                  📱 {getTypeLabel("phone")}
                </SelectItem>
                <SelectItem value="cpf">🆔 {getTypeLabel("cpf")}</SelectItem>
                <SelectItem value="random">
                  🔑 {getTypeLabel("random")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="key">{t("profile.key")}</Label>
            <Input
              id="key"
              value={key}
              onChange={(e) => handleKeyChange(e.target.value)}
              placeholder={getPlaceholder(type)}
              required
            />
          </div>

          <div>
            <Label htmlFor="label">{t("profile.labelOptional")}</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t("profile.labelPlaceholder")}
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading
                ? language === "pt-BR"
                  ? "Adicionando..."
                  : "Adding..."
                : t("paymentmethod.add")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
