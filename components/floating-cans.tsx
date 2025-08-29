import Image from "next/image"

interface FloatingCansProps {
  count?: number
  variant?: "default" | "subtle" | "dense"
  className?: string
}

export function FloatingCans({ count = 3, variant = "default", className = "" }: FloatingCansProps) {
  // Configurações para diferentes variantes
  const opacityRange = variant === "subtle" ? { min: 30, max: 50 } : { min: 60, max: 85 }
  const sizeRange = variant === "dense" ? { min: 8, max: 12 } : { min: 10, max: 16 }

  // Gerar posições aleatórias para as latinhas
  const cans = Array.from({ length: count }, (_, i) => {
    const size = Math.floor(Math.random() * (sizeRange.max - sizeRange.min + 1)) + sizeRange.min
    const opacity = Math.floor(Math.random() * (opacityRange.max - opacityRange.min + 1)) + opacityRange.min
    const rotation = Math.floor(Math.random() * 30) - 15
    const delay = Math.random() * 3

    // Posições aleatórias
    const positions = [
      { top: `${Math.random() * 20}%`, left: `${Math.random() * 20}%` },
      { top: `${Math.random() * 20 + 40}%`, right: `${Math.random() * 20}%` },
      { bottom: `${Math.random() * 20}%`, left: `${Math.random() * 20 + 10}%` },
      { bottom: `${Math.random() * 30}%`, right: `${Math.random() * 30}%` },
      { top: `${Math.random() * 40 + 30}%`, left: `${Math.random() * 40 + 30}%` },
    ]

    const position = positions[i % positions.length]

    return {
      id: i,
      size,
      opacity,
      rotation,
      delay,
      position,
    }
  })

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {cans.map((can) => (
        <div
          key={can.id}
          className="absolute float"
          style={{
            ...can.position,
            width: `${can.size}rem`,
            height: `${can.size}rem`,
            opacity: can.opacity / 100,
            transform: `rotate(${can.rotation}deg)`,
            animationDelay: `${can.delay}s`,
            zIndex: 0,
          }}
        >
          <Image
            src="/images/latinha.png"
            alt=""
            fill
            style={{ objectFit: "contain" }}
            className="select-none"
            aria-hidden="true"
          />
        </div>
      ))}
    </div>
  )
}
