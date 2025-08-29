"use client"

import { InfiniteCanCarousel } from "./infinite-can-carousel"

interface ProfileFloatingCansProps {
  count?: number
  className?: string
}

export function ProfileFloatingCans({ count = 7, className = "" }: ProfileFloatingCansProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <InfiniteCanCarousel position="profile" />
    </div>
  )
}
