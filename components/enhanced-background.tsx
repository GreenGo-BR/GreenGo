"use client"

import type React from "react"

interface EnhancedBackgroundProps {
  density?: "light" | "medium" | "dense"
  className?: string
}

export function EnhancedBackground({ density = "medium", className = "" }: EnhancedBackgroundProps) {
  // Configurações baseadas na densidade - 3 a 5 latinhas grandes
  const canCount = density === "light" ? 3 : density === "medium" ? 4 : 5

  const generateCanPositions = () => {
    const positions = []
    const rotations = [-15, -8, 8, 15, -12] // Ângulos variados
    const animationVariants = ["normal", "slow", "fast"]

    for (let i = 0; i < canCount; i++) {
      const rotation = rotations[i % rotations.length]
      const animationDelay = Math.random() * 4 // 0-4s delay
      const animationVariant = animationVariants[i % animationVariants.length]

      // Distribuição com maior espaçamento para evitar aglomeração
      let top, left

      if (i === 0) {
        // Primeira latinha - canto superior esquerdo
        top = Math.random() * 15 + 10 // 10-25%
        left = Math.random() * 15 + 5 // 5-20%
      } else if (i === 1) {
        // Segunda latinha - canto superior direito
        top = Math.random() * 15 + 10 // 10-25%
        left = Math.random() * 15 + 75 // 75-90%
      } else if (i === 2) {
        // Terceira latinha - meio esquerda
        top = Math.random() * 20 + 40 // 40-60%
        left = Math.random() * 10 + 5 // 5-15%
      } else if (i === 3) {
        // Quarta latinha - inferior direita
        top = Math.random() * 15 + 70 // 70-85%
        left = Math.random() * 15 + 75 // 75-90%
      } else {
        // Quinta latinha - inferior centro-esquerda
        top = Math.random() * 10 + 75 // 75-85%
        left = Math.random() * 20 + 25 // 25-45%
      }

      positions.push({
        id: i,
        rotation,
        animationDelay,
        animationVariant,
        top,
        left,
      })
    }

    return positions
  }

  const cans = generateCanPositions()

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Latinhas flutuantes grandes com espaçamento otimizado */}
      {cans.map((can) => (
        <div
          key={`can-${can.id}`}
          className={`floating-can ${
            can.animationVariant === "slow"
              ? "animate-float-slow"
              : can.animationVariant === "fast"
                ? "animate-float-fast"
                : "animate-float"
          }`}
          style={
            {
              top: `${can.top}%`,
              left: `${can.left}%`,
              "--rotation": `${can.rotation}deg`,
              animationDelay: `${can.animationDelay}s`,
            } as React.CSSProperties
          }
        >
          <img
            src="/images/latinha.png"
            alt=""
            className="w-full h-full object-contain"
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </div>
      ))}
    </div>
  )
}
