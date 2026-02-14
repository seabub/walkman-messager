"use client"

import { motion, useMotionValue } from "framer-motion"
import { useRef, useEffect, useState } from "react"

interface PolaroidProps {
  src: string
  alt?: string
  /** Used to derive a stable pseudo-random rotation/position. */
  index: number
  initialPosition?: { x: number; y: number }
  onDragEnd?: (x: number, y: number) => void
  dragConstraints?: React.RefObject<HTMLElement | null>
}

export function Polaroid({
  src,
  alt,
  index,
  initialPosition,
  onDragEnd,
  dragConstraints,
}: PolaroidProps) {
  const constraintsRef = useRef(null)
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [retryKey, setRetryKey] = useState(0)

  // Calculate initial position if not provided
  // Spread polaroids around center in a circular/radial pattern
  const angle = ((index * 17) % 31) - 15 // -15deg to +15deg rotation
  const radius = 180 + (index % 3) * 80 // Vary distance from center
  const angleRad = (index * 137.5) * (Math.PI / 180) // Golden angle distribution
  const baseX = Math.cos(angleRad) * radius
  const baseY = Math.sin(angleRad) * radius

  const finalX = initialPosition?.x ?? baseX
  const finalY = initialPosition?.y ?? baseY

  const x = useMotionValue(finalX)
  const y = useMotionValue(finalY)

  // Sync motion values when initialPosition changes
  useEffect(() => {
    x.set(finalX)
    y.set(finalY)
  }, [finalX, finalY, x, y])

  // Reset status when src changes
  useEffect(() => {
    setStatus("loading")
  }, [src, retryKey])

  return (
    <motion.div
      ref={constraintsRef}
      drag
      dragMomentum={false}
      dragElastic={0.18}
      dragConstraints={dragConstraints || constraintsRef}
      style={{ x, y }}
      initial={{
        x: finalX,
        y: finalY,
        rotate: angle,
      }}
      onDragEnd={() => {
        if (onDragEnd) {
          onDragEnd(x.get(), y.get())
        }
      }}
      whileTap={{ scale: 0.97 }}
      className="absolute cursor-grab active:cursor-grabbing z-10"
    >
      <div
        className="relative w-[150px] h-[180px]"
        style={{
          background: "#fdfdfd",
          borderRadius: "4px",
          padding: "10px 10px 28px 10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Image area with top/side borders */}
        <div className="absolute inset-x-[10px] top-[10px] bottom-[28px] overflow-hidden rounded-[2px] bg-black/6 flex items-center justify-center">
          {status === "error" ? (
            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
              <span className="text-[10px] text-[#666]">Photo couldn’t load</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setRetryKey((k) => k + 1)
                }}
                className="text-[9px] text-[#00ccbb] underline"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {status === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/20">
                  <div className="w-6 h-6 border-2 border-[#00ccbb]/40 border-t-[#00ccbb] rounded-full animate-spin" />
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={retryKey}
                src={src}
                alt={alt || "Polaroid"}
                className="w-full h-full object-cover"
                loading="eager"
                referrerPolicy="no-referrer"
                onLoad={() => setStatus("ok")}
                onError={() => setStatus("error")}
              />
            </>
          )}
        </div>
        {/* Caption space at bottom */}
        <div className="absolute inset-x-[10px] bottom-[10px] h-[18px] bg-transparent" />
      </div>
    </motion.div>
  )
}

