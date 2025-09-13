"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Save, X } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
} from "@/lib/validators/auth";
import { api } from "@/lib/api";

interface EditPersonalInfoProps {
  initialData: {
    name: string;
    email: string;
    cpf: string;
    country: string;
  };
  token: string;
  userId: number;
  onSave: (data: PersonalInfoFormValues) => void;
  onCancel: () => void;
}

const countries = [
  { code: "BR", name: { "pt-BR": "Brasil", "en-US": "Brazil" } },
  { code: "US", name: { "pt-BR": "Estados Unidos", "en-US": "United States" } },
  { code: "CA", name: { "pt-BR": "Canadá", "en-US": "Canada" } },
  { code: "PT", name: { "pt-BR": "Portugal", "en-US": "Portugal" } },
  { code: "ES", name: { "pt-BR": "Espanha", "en-US": "Spain" } },
];

export function EditPersonalInfo({
  initialData,
  token,
  userId,
  onSave,
  onCancel,
}: EditPersonalInfoProps) {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: initialData,
  });

  const watchedCountry = watch("country");

  const onSubmit = async (data: PersonalInfoFormValues) => {
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (Math.random() < 0.1) {
        throw new Error(
          language === "pt-BR"
            ? "Erro ao salvar informações"
            : "Error saving information"
        );
      }

      try {
        let payload = {
          id: userId,
          name: data.name,
          email: data.email,
          cpf: data.cpf,
          country: data.country,
        };
        const res = await api().post("/profile/edit", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success) {
          setSuccess(
            language === "pt-BR"
              ? "Informações atualizadas com sucesso!"
              : "Information updated successfully!"
          );
          setTimeout(() => {
            onSave(data);
          }, 1500);
        }
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : language === "pt-BR"
          ? "Erro inesperado"
          : "Unexpected error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length <= 3) {
      return numericValue;
    } else if (numericValue.length <= 6) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(3)}`;
    } else if (numericValue.length <= 9) {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(
        3,
        6
      )}.${numericValue.slice(6)}`;
    } else {
      return `${numericValue.slice(0, 3)}.${numericValue.slice(
        3,
        6
      )}.${numericValue.slice(6, 9)}-${numericValue.slice(9, 11)}`;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("profile.name")}
          </label>
          <Input
            id="name"
            type="text"
            placeholder={
              language === "pt-BR" ? "Seu nome completo" : "Your full name"
            }
            {...register("name")}
            className={errors.name ? "border-red-300" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("profile.email")}
          </label>
          <Input
            id="email"
            type="email"
            placeholder={
              language === "pt-BR"
                ? "seu.email@exemplo.com"
                : "your.email@example.com"
            }
            {...register("email")}
            className={errors.email ? "border-red-300" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="cpf"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("profile.cpf")}
          </label>
          <Input
            id="cpf"
            type="text"
            placeholder="000.000.000-00"
            {...register("cpf")}
            onChange={(e) => {
              const formatted = formatCPF(e.target.value);
              e.target.value = formatted;
              setValue("cpf", formatted);
            }}
            className={errors.cpf ? "border-red-300" : ""}
            maxLength={14}
          />
          {errors.cpf && (
            <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {t("profile.country")}
          </label>
          <Select
            value={watchedCountry}
            onValueChange={(value) => setValue("country", value)}
          >
            <SelectTrigger
              id="country"
              className={errors.country ? "border-red-300" : ""}
            >
              <SelectValue
                placeholder={
                  language === "pt-BR"
                    ? "Selecione um país"
                    : "Select a country"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">
              {errors.country.message}
            </p>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <p className="text-sm text-green-600 dark:text-green-400">
            {success}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-[#40A578] hover:bg-[#348c65] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === "pt-BR" ? "Salvando..." : "Saving..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {language === "pt-BR" ? "Salvar" : "Save"}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          <X className="mr-2 h-4 w-4" />
          {language === "pt-BR" ? "Cancelar" : "Cancel"}
        </Button>
      </div>
    </form>
  );
}
