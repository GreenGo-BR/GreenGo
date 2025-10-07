"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/ui/glass-card";
import { EditPersonalInfo } from "@/components/profile/edit-personal-info";
import { EditPhoneInfo } from "@/components/profile/edit-phone-info";
import { ChangePassword } from "@/components/profile/change-password";
import { TwoFactorAuth } from "@/components/profile/two-factor-auth";
import { TermsModal } from "@/components/profile/terms-modal";
import { ProfileImageUploadModal } from "@/components/profile/profile-image-upload-modal";
import { LogoutConfirmationModal } from "@/components/logout-confirmation-modal";
import Navigation from "@/components/navigation";
import {
  Camera,
  Edit,
  Shield,
  Bell,
  Moon,
  Globe,
  CreditCard,
  Wallet,
  FileText,
  HelpCircle,
  LogOut,
  ChevronRight,
  TicketCheck,
  Star,
  Gift,
  Phone,
  User,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "next-themes";
import Link from "next/link";
import { withAuth } from "@/components/withAuth";
import { api } from "@/lib/api";

type ProfPageProps = {
  token: string;
};

function ProfilePage({ token }: ProfPageProps) {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const [isEditingPhoneInfo, setIsEditingPhoneInfo] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isTwoFactorOpen, setIsTwoFactorOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(theme === "dark");

  useEffect(() => {
    const load = async () => {
      try {
        await fetchProfile(token);
      } catch (err) {
        console.error("Failed to load collections:", err);
      }
    };
    load();
  }, [token]);

  const fetchProfile = async (token: string) => {
    try {
      const res = await api().get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data.profile;
      setNotifications(profile.notif == 0 ? false : true);
      setTheme(profile.darkmode == 1 ? "dark" : "light");
      setUserData(profile);
    } catch (err) {
      console.error(err);
    }
  };

  // User data state
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cpf: "",
    country: "",
    avatar: "/placeholder.svg?height=80&width=80",
    phone: "",
  });

  const handleThemeChange = async (checked: boolean) => {
    let payload = {
      darkmode: checked == false ? 0 : 1,
    };
    const res = await api().post("/profile/darkmode", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.data) {
      setDarkMode(checked);
      setTheme(checked ? "dark" : "light");
    }
  };

  const handleNotificationChange = async (checked: boolean) => {
    let payload = {
      notif: checked == false ? 0 : 1,
    };

    const res = await api().post("/profile/notifications", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data) {
      setNotifications(checked);
    }
  };

  const handleLanguageChange = async () => {
    try {
      const newLang = language === "pt-BR" ? "en-US" : "pt-BR";

      let payload = {
        lang: newLang,
      };

      const res = await api().post("/profile/language", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setLanguage(newLang);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePersonalInfoUpdate = async (newData: any) => {
    setUserData((prev) => ({
      ...prev,
      name: newData.name,
      email: newData.email,
      cpf: newData.cpf,
      country: newData.country,
    }));
    setIsEditingPersonalInfo(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    setUserData((prev) => ({
      ...prev,
      avatar: imageUrl,
    }));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCountryName = (code: string) => {
    const countries: Record<string, Record<string, string>> = {
      BR: { "pt-BR": "Brasil", "en-US": "Brazil" },
      US: { "pt-BR": "Estados Unidos", "en-US": "United States" },
      CA: { "pt-BR": "Canadá", "en-US": "Canada" },
      PT: { "pt-BR": "Portugal", "en-US": "Portugal" },
      ES: { "pt-BR": "Espanha", "en-US": "Spain" },
    };
    return countries[code]?.[language] || code;
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("profile.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t("profile.subtitle")}
            </p>
          </div>
        </div>
        <div className="mx-auto space-y-6">
          {/* Profile Header */}
          <GlassCard className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={userData.avatar || "/placeholder.svg"}
                    alt={userData.name}
                  />
                  <AvatarFallback className="text-lg font-semibold bg-[#40A578] text-white">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => setIsImageUploadOpen(true)}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userData.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {userData.email}
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {t("profile.verified")}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-yellow-300 text-yellow-700 dark:border-yellow-600 dark:text-yellow-400"
                  >
                    <Gift className="h-3 w-3 mr-1" />
                    {t("profile.premium")}
                  </Badge>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Personal Information */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-[#40A578]" />
                {t("profile.personalInfo")}
              </h3>
              {!isEditingPersonalInfo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingPersonalInfo(true)}
                  className="text-[#40A578] hover:text-[#348c65] hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>

            {isEditingPersonalInfo ? (
              <EditPersonalInfo
                initialData={userData}
                token={token}
                onSave={handlePersonalInfoUpdate}
                onCancel={() => setIsEditingPersonalInfo(false)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("profile.name")}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {userData.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("profile.email")}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {userData.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("profile.cpf")}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {userData.cpf}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("profile.country")}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {getCountryName(userData.country)}
                  </p>
                </div>
              </div>
            )}
          </GlassCard>

          {/* phone number */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-[#40A578]" />
                {t("profile.phoneNumber")}
              </h3>
              {!isEditingPhoneInfo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingPhoneInfo(true)}
                  className="text-[#40A578] hover:text-[#348c65] hover:bg-green-50 dark:hover:bg-green-900/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            {isEditingPhoneInfo ? (
              <EditPhoneInfo
                initialData={userData}
                token={token}
                onSave={handlePersonalInfoUpdate}
                onCancel={() => setIsEditingPhoneInfo(false)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t("profile.phone")}
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {userData.phone || t("profile.noPhone")}
                  </p>
                </div>
              </div>
            )}
          </GlassCard>

          {/* Security */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#40A578]" />
              {t("profile.security")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t("profile.changePassword")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("profile.changePasswordDesc")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsChangingPassword(true)}
                  className="border-[#40A578] text-[#40A578] hover:bg-[#40A578] hover:text-white"
                >
                  {t("profile.change")}
                </Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {t("profile.twoFactor")}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("profile.twoFactorDesc")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTwoFactorOpen(true)}
                  className="border-[#40A578] text-[#40A578] hover:bg-[#40A578] hover:text-white"
                >
                  {t("profile.configure")}
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Preferences */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("profile.preferences")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-[#40A578]" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t("profile.notifications")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("profile.notificationsDesc")}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={handleNotificationChange}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-[#40A578]" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t("profile.darkMode")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t("profile.darkModeDesc")}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={darkMode}
                  onCheckedChange={handleThemeChange}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-[#40A578]" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {t("profile.language")}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {language === "pt-BR"
                        ? "Português (Brasil)"
                        : "English (US)"}
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLanguageChange}
                  className="border-[#40A578] text-[#40A578] hover:bg-[#40A578] hover:text-white"
                >
                  {t("profile.change")}
                </Button>
              </div>
            </div>
          </GlassCard>

          {/* Wallet & Payments */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#40A578]" />
              {t("profile.wallet")}
            </h3>
            <div className="space-y-4">
              <Link href="/profile/wallet">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <TicketCheck className="h-5 w-5 text-[#40A578]" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t("profile.walletStatement")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("profile.walletStatementDesc")}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
              <Separator />
              <Link href="/profile/payment-methods">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-[#40A578]" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t("profile.paymentMethods")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("profile.paymentMethodsDesc")}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </div>
          </GlassCard>

          {/* Support & Legal */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("profile.support")}
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-[#40A578]" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t("profile.terms")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("profile.termsDesc")}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsTermsOpen(true)}
                    className="text-[#40A578] hover:text-[#348c65] hover:bg-green-50 dark:hover:bg-green-900/20"
                  ></Button>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
              <Separator />
              <Link href="/support">
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-[#40A578]" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {t("profile.help")}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t("profile.helpDesc")}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </div>
          </GlassCard>

          {/* Logout */}
          <GlassCard className="p-6">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setIsLogoutOpen(true)}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t("profile.logout")}
            </Button>
          </GlassCard>
        </div>
      </div>

      {/* Modals */}
      {isChangingPassword && (
        <ChangePassword
          token={token}
          onBack={() => setIsChangingPassword(false)}
          onClose={() => setIsChangingPassword(false)}
        />
      )}

      {isTwoFactorOpen && (
        <TwoFactorAuth
          token={token}
          onBack={() => setIsTwoFactorOpen(false)}
          onClose={() => setIsTwoFactorOpen(false)}
        />
      )}

      {isTermsOpen && (
        <TermsModal
          isOpen={true}
          type="terms"
          onClose={() => setIsTermsOpen(false)}
        />
      )}

      {isImageUploadOpen && (
        <ProfileImageUploadModal
          token={token}
          onClose={() => setIsImageUploadOpen(false)}
          onUpload={handleImageUpload}
        />
      )}

      {isLogoutOpen && (
        <LogoutConfirmationModal
          isOpen={true}
          onClose={() => setIsLogoutOpen(false)}
          onConfirm={async () => {
            setIsLogoutOpen(false);
          }}
        />
      )}
      <Navigation />
    </div>
  );
}
export default withAuth(ProfilePage);
