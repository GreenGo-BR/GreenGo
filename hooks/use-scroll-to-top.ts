"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function useScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    // Scroll para o topo quando a rota mudar
    window.scrollTo(0, 0)
  }, [pathname])
}
