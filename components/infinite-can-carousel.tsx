"use client"

import { useState, useEffect } from "react"

interface InfiniteCanCarouselProps {
  position?: "hero" | "profile"
  className?: string
}

export function InfiniteCanCarousel({ position = "hero", className = "" }: InfiniteCanCarouselProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Configurações responsivas
  const cansCount = isMobile ? 5 : 7

  // Rotações variadas para naturalidade
  const rotations = ["rotate-3", "-rotate-6", "rotate-2", "rotate-1", "-rotate-4", "rotate-7", "-rotate-2"]

  // Posicionamento baseado no contexto
  const topPosition = position === "hero" ? "65%" : "70%"

  // Gerar latinhas para o carrossel
  const generateCans = () => {
    return Array.from({ length: cansCount }, (_, i) => (
      <img
        key={`can-${i}`}
        src="/images/latinha.png"
        alt=""
        className={`latinha ${rotations[i % rotations.length]}`}
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          boxShadow: "none",
        }}
      />
    ))
  }

  return (
    <div className={`latinha-container ${className}`} style={{ top: topPosition }}>
      <div className="latinha-track">
        {/* Primeiro grupo de latinhas */}
        {generateCans()}

        {/* Segundo grupo (duplicado para loop infinito) */}
        {generateCans()}
      </div>
    </div>
  )
}
