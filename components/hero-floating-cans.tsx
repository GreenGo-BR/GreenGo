"use client"

import { InfiniteCanCarousel } from "./infinite-can-carousel"

interface HeroFloatingCansProps {
  count?: number
  className?: string
}

export function HeroFloatingCans({ count = 7, className = "" }: HeroFloatingCansProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <InfiniteCanCarousel position="hero" />
    </div>
  )
}
