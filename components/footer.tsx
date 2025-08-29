import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="mt-auto py-4 px-6 rounded-t-xl relative">
      <div className="flex flex-col items-center justify-center relative z-10">
        <div className="h-8 w-24 relative mb-2 logo-image">
          <Image
            src="/images/greengo10.png"
            alt="GreenGo"
            fill
            style={{
              objectFit: "contain",
              background: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center dark:text-gray-300">
          © {new Date().getFullYear()} GreenGo. Todos os direitos reservados.
        </p>
        <div className="flex gap-4 mt-2">
          <Link href="/terms" className="text-xs text-primary hover:underline dark:text-[#1ed760]">
            Termos de Uso
          </Link>
          <Link href="/privacy" className="text-xs text-primary hover:underline dark:text-[#1ed760]">
            Privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
