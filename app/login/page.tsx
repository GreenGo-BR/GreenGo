"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Phone, Mail, Chrome } from "lucide-react";
import Link from "next/link";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/auth/form-message";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { type LoginFormValues } from "@/lib/validators/auth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { api } from "@/lib/api";
import {
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, setAuthPersistence, setGoogleAuth } from "@/lib/firebase";

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.72 1.22 9.22 3.6l6.85-6.85C35.46 2.48 29.99 0 24 0 14.63 0 6.48 5.82 2.55 14.29l7.98 6.19C12.09 13.09 17.56 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.14 24.55c0-1.62-.15-3.18-.44-4.68H24v9.09h12.51c-.54 2.89-2.18 5.34-4.65 6.99l7.33 5.69C43.79 37.14 46.14 31.3 46.14 24.55z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.1c-.48-1.42-.75-2.94-.75-4.55s.27-3.13.75-4.55l-7.98-6.19C.92 15.89 0 19.84 0 23.55s.92 7.66 2.55 10.74l7.98-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.91-2.13 15.88-5.78l-7.33-5.69c-2.04 1.38-4.65 2.18-8.55 2.18-6.44 0-11.91-3.59-14.47-8.78l-7.98 6.19C6.48 42.18 14.63 48 24 48z"
    />
  </svg>
);

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPhoneLogin, setIsPhoneLogin] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  useAuthRedirect();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
      phone: "",
      otp: "",
      isPhoneLogin: false,
    } as any,
    shouldUnregister: true,
  });

  const onSubmit = async (data: any) => {
    setError("");
    setIsLoading(true);

    data.isPhoneLogin = isPhoneLogin;

    try {
      if (isPhoneLogin) {
        if (!confirmationResult) {
          if (typeof window === "undefined") return;

          const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
          });

          const phoneNumber = data.phone;
          if (!phoneNumber) throw new Error("Phone number is required");

          const result = await signInWithPhoneNumber(
            auth,
            phoneNumber,
            recaptcha
          );
          setConfirmationResult(result);
          alert("OTP sent to your phone. Please enter the code below.");
        } else {
          // Confirm OTP
          const otp = data.otp;
          if (!otp) throw new Error("OTP is required");
          const userCredential = await confirmationResult.confirm(otp);
          const token = await userCredential.user.getIdToken();

          const res = await api().post(
            "login",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (res.data?.success) router.push("/home");
          else setError(res.data?.message || "Login failed.");
        }
      } else {
        await setAuthPersistence(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        const token = await userCredential.user.getIdToken();

        const res = await api().post(
          "login",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.twofa_required && res.data.temp_token) {
          localStorage.setItem("tempToken", res.data.temp_token);
          router.push("/2fa");
          return;
        } else {
          router.push("/home");
        }

        if (res.data?.success) router.push("/home");
        else setError(res.data?.message || "Login failed.");
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || t("auth.error.generic");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await setGoogleAuth();
      console.log("User logged in:", result.user);
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isPhoneLogin ? (
          <>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1">
                {t("auth.login.phone")}
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="+15555555555"
                {...register("phone")}
                className={errors.phone ? "border-red-300" : ""}
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {confirmationResult && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-1">
                  Enter OTP
                </label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  {...register("otp")}
                  className={errors.otp ? "border-red-300" : ""}
                />
                {errors.otp && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.otp.message}
                  </p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t("auth.login.email")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu.email@exemplo.com"
                {...register("email")}
                className={errors.email ? "border-red-300" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {t(`auth.validation.${errors.email.message || "required"}`)}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium">
                  {t("auth.login.password")}
                </label>
                <Link
                  href="/reset-password"
                  className="text-xs text-[#40A578] hover:underline"
                >
                  {t("auth.login.forgotPassword")}
                </Link>
              </div>
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
                    `auth.validation.${errors.password.message || "required"}`
                  )}
                </p>
              )}
            </div>
          </>
        )}

        {error && <FormMessage type="error" message={error} />}

        <Button
          type="submit"
          className="w-full bg-[#40A578] hover:bg-[#348c65]"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isPhoneLogin ? t("auth.login.sendOtp") : t("auth.login.loading")}
            </>
          ) : isPhoneLogin && !confirmationResult ? (
            t("auth.login.sendOtp")
          ) : (
            t("auth.login.button")
          )}
        </Button>
      </form>

      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400">{t("auth.login.or")}</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      {/* <Button
        type="button"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-2"
        onClick={() => {
          setIsPhoneLogin(!isPhoneLogin);
          setConfirmationResult(null);
          setValue("email", "");
          setValue("password", "");
          setValue("phone", "");
          setValue("otp", "");
        }}
      >
        {isPhoneLogin ? t("auth.login.emailLogin") : t("auth.login.phone")}
      </Button> */}

      <div className="flex justify-center gap-3">
        {/* Phone/Email Toggle */}
        <Button
          type="button"
          size="icon"
          className="rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            setIsPhoneLogin(!isPhoneLogin);
            setConfirmationResult(null);
            setValue("email", "");
            setValue("password", "");
            setValue("phone", "");
            setValue("otp", "");
          }}
        >
          {isPhoneLogin ? (
            <Mail className="w-5 h-5" />
          ) : (
            <Phone className="w-5 h-5" />
          )}
        </Button>

        {/* Google Login */}
        <Button
          type="button"
          size="icon"
          className="rounded-full bg-white border border-gray-300 hover:bg-gray-100"
          onClick={handleGoogleLogin}
        >
          <GoogleIcon />
        </Button>
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground gap-2">
          {t("auth.login.noAccount")}{" "}
          <Link
            href="/register"
            className="text-[#40A578] hover:underline font-medium"
          >
            {t("auth.login.createAccount")}
          </Link>
        </p>
      </div>

      <div id="recaptcha-container"></div>
    </AuthLayout>
  );
}
