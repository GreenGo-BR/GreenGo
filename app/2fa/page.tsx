"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/auth/form-message";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { api } from "@/lib/api";

const schema = z.object({
  code: z.string().min(6, "Code must be 6 digits"),
});

type FormValues = z.infer<typeof schema>;

export default function TwoFAPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setError("");

    try {
      const tempToken = localStorage.getItem("tempToken");
      if (!tempToken) {
        setError("2FA session expired. Please log in again.");
        return;
      }

      const res = await api().post("/verify_2fa", {
        code: data.code,
        temp_token: tempToken,
      });

      if (res.data?.token) {
        localStorage.removeItem("tempToken");
        localStorage.setItem("authToken", res.data.token);
        router.push("/home");
      } else {
        setError(res.data?.message || "Verification failed. Try again.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to verify 2FA code.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title={t("auth.2fa.title")} subtitle={t("auth.2fa.subtitle")}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            {t("auth.2fa.code") || "Authentication Code"}
          </label>
          {/* <Input
            id="code"
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            {...register("code")}
            className={errors.code ? "border-red-300" : ""}
          /> */}
          <Input
            type="text"
            placeholder="000000"
            {...register("code")}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
          {errors.code && (
            <p className="text-sm text-red-500 mt-1">{errors.code.message}</p>
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
              {t("auth.2fa.loading")}
            </>
          ) : (
            t("auth.2fa.button")
          )}
        </Button>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground gap-2">
            {t("auth.2fa.backToLogin")}{" "}
            <a
              href="/login"
              className="text-[#40A578] hover:underline font-medium"
            >
              {t("auth.2fa.login")}
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
