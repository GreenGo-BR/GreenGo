"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormMessage } from "@/components/auth/form-message";
import { ProfileImageUpload } from "@/components/auth/profile-image-upload";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { type RegisterFormValues, registerSchema } from "@/lib/validators/auth";
import { api } from "@/lib/api";

// Lista de países
const countries = [
  { code: "BR", name: { "pt-BR": "Brasil", "en-US": "Brazil" } },
  { code: "US", name: { "pt-BR": "Estados Unidos", "en-US": "United States" } },
  { code: "CA", name: { "pt-BR": "Canadá", "en-US": "Canada" } },
  { code: "PT", name: { "pt-BR": "Portugal", "en-US": "Portugal" } },
  { code: "ES", name: { "pt-BR": "Espanha", "en-US": "Spain" } },
];

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [profileImage, setProfileImage] = useState<FileList | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      cpf: "",
      country: "BR",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("cpf", data.cpf);
      formData.append("country", data.country);
      formData.append("password", data.password);

      if (profileImage && profileImage.length > 0) {
        formData.append("avatar", profileImage[0]);
      }
      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      const res = await api().post("register", formData);
      console.log(res.data);
      router.push("/login");
      // Simulate success
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileImageChange = (files: FileList | null) => {
    setProfileImage(files);
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
    <AuthLayout
      title={t("auth.register.title")}
      subtitle={t("auth.register.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-6">
          <ProfileImageUpload onChange={handleProfileImageChange} />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {t("auth.register.name")}
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
            <p className="text-sm text-red-500 mt-1">
              {t("auth.validation.required")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {t("auth.register.email")}
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
            <p className="text-sm text-red-500 mt-1">
              {t("auth.validation.email")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="cpf" className="block text-sm font-medium mb-1">
            {t("auth.register.cpf")}
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
            <p className="text-sm text-red-500 mt-1">
              {t("auth.validation.cpf")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            {t("auth.register.country")}
          </label>
          <Select
            defaultValue="BR"
            onValueChange={(value) => setValue("country", value)}
          >
            <SelectTrigger
              id="country"
              className={errors.country ? "border-red-300" : ""}
            >
              <SelectValue placeholder={t("auth.register.selectCountry")} />
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
              {t("auth.validation.required")}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            {t("auth.register.password")}
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            className={errors.password ? "border-red-300" : ""}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {t(
                `auth.validation.password.${errors.password.message || "min"}`
              )}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-1"
          >
            {t("auth.register.confirmPassword")}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "border-red-300" : ""}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {t("auth.validation.password.match")}
            </p>
          )}
        </div>

        {error && <FormMessage type="error" message={error} />}

        <Button
          type="submit"
          className="w-full bg-[#40A578] hover:bg-[#348c65]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {language === "pt-BR" ? "Cadastrando..." : "Registering..."}
            </>
          ) : (
            t("auth.register.button")
          )}
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            {t("auth.register.hasAccount")}{" "}
            <Link
              href="/login"
              className="text-[#40A578] hover:underline font-medium"
            >
              {t("auth.register.signIn")}
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
