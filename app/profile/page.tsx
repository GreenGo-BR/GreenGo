"use client"

import { useState } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CollectionCard } from "@/components/collection-card"
import { WalletCard } from "@/components/wallet-card"
import {
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
  LogOut,
  Bell,
  Moon,
  Globe,
  ChevronRight,
  Camera,
  Languages,
} from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Navigation from "@/components/navigation"
import { ProfileFloatingCans } from "@/components/profile-floating-cans"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { LogoutConfirmationModal } from "@/components/logout-confirmation-modal"
import { ProfileImageUploadModal } from "@/components/profile/profile-image-upload-modal"
import { EditPersonalInfo } from "@/components/profile/edit-personal-info"

// Dados simulados para demonstração
const initialUserData = {
  name: "Maria Silva",
  email: "maria.silva@email.com",
  phone: "(11) 98765-4321",
  address: "Rua das Flores, 123 - Jardim Primavera, São Paulo - SP",
  profileImage: null,
}

const walletData = {
  balance: 87.5,
  lastPayment: {
    amount: 17.5,
    date: "18/05/2024",
  },
}

const recentCollections = [
  {
    id: "col123455",
    date: "18/05/2024",
    time: "15:00 - 17:00",
    address: "Rua das Flores, 123 - Jardim Primavera",
    status: "completed" as const,
    estimatedWeight: 4.2,
  },
  {
    id: "col123454",
    date: "10/05/2024",
    time: "09:00 - 11:00",
    address: "Av. Principal, 456 - Centro",
    status: "completed" as const,
    estimatedWeight: 3,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal")
  const [notifications, setNotifications] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [showImageUploadModal, setShowImageUploadModal] = useState(false)
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(initialUserData.profileImage)
  const [userData, setUserData] = useState(initialUserData)
  const { language, setLanguage, t } = useLanguage()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  useScrollToTop()

  const toggleLanguage = () => {
    setLanguage(language === "pt-BR" ? "en-US" : "pt-BR")
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    // Simulação de logout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirecionar para página de login
    router.push("/login")
  }

  const handleImageUpdate = (newImageUrl: string) => {
    setProfileImage(newImageUrl)
  }

  const handlePersonalInfoUpdate = (updatedData: Partial<typeof userData>) => {
    setUserData((prev) => ({ ...prev, ...updatedData }))
    setIsEditingPersonalInfo(false)
  }

  return (
    <div className="min-h-screen pb-20">
      <main className="pb-20 relative min-h-screen">
        <div className="main-content p-4">
          {/* Hero section do perfil com latinhas flutuantes - ALTURA AUMENTADA */}
          <div className="relative overflow-hidden mb-0 min-h-[350px]">
            <ProfileFloatingCans count={7} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold page-title">{t("profile.title")}</h1>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleLanguage}
                    className="rounded-full bg-transparent"
                    title={language === "pt-BR" ? "Switch to English" : "Mudar para Português"}
                  >
                    <Languages size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="dark:text-black dark:hover:text-black dark:hover:bg-gray-200"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <LogOut size={20} />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center mb-8 pb-4">
                <div className="relative mb-3">
                  <Avatar className="w-24 h-24 border-4 border-background">
                    {profileImage ? (
                      <AvatarImage src={profileImage || "/placeholder.svg"} alt={userData.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/20 text-primary text-xl">
                        {userData.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full"
                    onClick={() => setShowImageUploadModal(true)}
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                <h2 className="text-xl font-semibold profile-name">{userData.name}</h2>
                <p className="text-sm text-muted-foreground profile-email">{userData.email}</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-3 mb-4 relative z-10">
              <TabsTrigger value="personal">{t("profile.tabs.personal")}</TabsTrigger>
              <TabsTrigger value="wallet">{t("profile.tabs.wallet")}</TabsTrigger>
              <TabsTrigger value="settings">{t("profile.tabs.settings")}</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              {isEditingPersonalInfo ? (
                <EditPersonalInfo
                  userData={userData}
                  onCancel={() => setIsEditingPersonalInfo(false)}
                  onSave={handlePersonalInfoUpdate}
                />
              ) : (
                <>
                  <GlassCard className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{t("profile.personalInfo")}</h3>
                      <Button variant="ghost" size="icon" onClick={() => setIsEditingPersonalInfo(true)}>
                        <Edit2 size={16} />
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <User size={18} className="mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t("profile.name")}</p>
                          <p>{userData.name}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Mail size={18} className="mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t("profile.email")}</p>
                          <p>{userData.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone size={18} className="mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t("profile.phone")}</p>
                          <p>{userData.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <MapPin size={18} className="mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">{t("profile.address")}</p>
                          <p>{userData.address}</p>
                        </div>
                      </div>
                    </div>
                  </GlassCard>

                  <GlassCard>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{t("profile.recentCollections")}</h3>
                      <Link href="/collections">
                        <Button variant="ghost" size="sm">
                          {t("home.viewAll")}
                        </Button>
                      </Link>
                    </div>

                    {recentCollections.map((collection) => (
                      <CollectionCard key={collection.id} {...collection} />
                    ))}
                  </GlassCard>
                </>
              )}
            </TabsContent>

            <TabsContent value="wallet">
              <WalletCard {...walletData} />

              <GlassCard className="mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {language === "pt-BR" ? "Histórico de Transações" : "Transaction History"}
                  </h3>
                  <Link href="/profile/wallet">
                    <Button variant="ghost" size="sm">
                      {language === "pt-BR" ? "Ver extrato" : "View statement"}
                    </Button>
                  </Link>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{language === "pt-BR" ? "Coleta #3455" : "Collection #3455"}</p>
                      <p className="text-sm text-muted-foreground">18/05/2024</p>
                    </div>
                    <p className="text-green-600 font-medium">{language === "pt-BR" ? "+ R$ 17,50" : "+ $8.75"}</p>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{language === "pt-BR" ? "Coleta #3454" : "Collection #3454"}</p>
                      <p className="text-sm text-muted-foreground">10/05/2024</p>
                    </div>
                    <p className="text-green-600 font-medium">{language === "pt-BR" ? "+ R$ 15,00" : "+ $7.50"}</p>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{language === "pt-BR" ? "Saque via Pix" : "Digital Withdrawal"}</p>
                      <p className="text-sm text-muted-foreground">05/05/2024</p>
                    </div>
                    <p className="text-red-600 font-medium">{language === "pt-BR" ? "- R$ 50,00" : "- $25.00"}</p>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{language === "pt-BR" ? "Coleta #3453" : "Collection #3453"}</p>
                      <p className="text-sm text-muted-foreground">01/05/2024</p>
                    </div>
                    <p className="text-green-600 font-medium">{language === "pt-BR" ? "+ R$ 22,50" : "+ $11.25"}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <h3 className="text-lg font-semibold mb-4">
                  {language === "pt-BR" ? "Métodos de Pagamento" : "Payment Methods"}
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256">
                          <path
                            fill="currentColor"
                            d="M208 56H48a24 24 0 0 0-24 24v96a24 24 0 0 0 24 24h160a24 24 0 0 0 24-24V80a24 24 0 0 0-24-24m0 16a8 8 0 0 1 8 8v16H40V80a8 8 0 0 1 8-8Zm0 112H48a8 8 0 0 1-8-8v-64h176v64a8 8 0 0 1-8 8m-16-24a8 8 0 0 1-8 8h-32a8 8 0 0 1 0-16h32a8 8 0 0 1 8 8m-64 0a8 8 0 0 1-8 8h-8a8 8 0 0 1 0-16h8a8 8 0 0 1 8 8"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">{language === "pt-BR" ? "Pix" : "Digital Transfer"}</p>
                        <p className="text-sm text-muted-foreground">maria.silva@email.com</p>
                      </div>
                    </div>
                    <Link href="/profile/payment-methods">
                      <Button variant="ghost" size="sm">
                        {language === "pt-BR" ? "Gerenciar" : "Manage"}
                      </Button>
                    </Link>
                  </div>

                  <Link href="/profile/payment-methods">
                    <Button variant="outline" className="w-full bg-transparent">
                      {language === "pt-BR" ? "Gerenciar métodos de pagamento" : "Manage payment methods"}
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            </TabsContent>

            <TabsContent value="settings">
              <GlassCard className="mb-4">
                <h3 className="text-lg font-semibold mb-4">{t("profile.preferences")}</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Bell size={18} className="mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t("profile.notifications")}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.receiveAlerts")}</p>
                      </div>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Moon size={18} className="mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t("profile.darkMode")}</p>
                        <p className="text-sm text-muted-foreground">{t("profile.changeAppearance")}</p>
                      </div>
                    </div>
                    <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Globe size={18} className="mr-3 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{t("profile.language")}</p>
                        <p className="text-sm text-muted-foreground">
                          {language === "pt-BR" ? "Português (Brasil)" : "English (US)"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={toggleLanguage}>
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="mb-4">
                <h3 className="text-lg font-semibold mb-4">{t("profile.security")}</h3>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    {t("profile.changePassword")}
                    <ChevronRight size={16} />
                  </Button>

                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    {t("profile.twoFactor")}
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </GlassCard>

              <GlassCard className="mb-4">
                <h3 className="text-lg font-semibold mb-4">{t("profile.about")}</h3>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    {t("profile.terms")}
                    <ChevronRight size={16} />
                  </Button>

                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    {t("profile.privacy")}
                    <ChevronRight size={16} />
                  </Button>

                  <div className="text-center text-sm text-muted-foreground pt-2">
                    <div className="flex justify-center mb-2">
                      <div className="h-10 w-32 relative">
                        <Image src="/images/greengo10.png" alt="GreenGo" fill style={{ objectFit: "contain" }} />
                      </div>
                    </div>
                    <p>{t("profile.version")} 1.0.0</p>
                    <p>© 2024 GreenGo. {t("profile.rights")}</p>
                  </div>
                </div>
              </GlassCard>

              {/* Botão de Logout */}
              <GlassCard>
                <Button variant="destructive" className="w-full" onClick={() => setShowLogoutModal(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {language === "pt-BR" ? "Sair da Conta" : "Sign Out"}
                </Button>
              </GlassCard>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Navigation />

      {/* Modal de confirmação de logout */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      {/* Modal de upload de imagem do perfil */}
      <ProfileImageUploadModal
        isOpen={showImageUploadModal}
        onClose={() => setShowImageUploadModal(false)}
        currentImage={profileImage}
        onImageUpdate={handleImageUpdate}
      />
    </div>
  )
}
