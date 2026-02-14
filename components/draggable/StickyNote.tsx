"use client"

import { motion, useMotionValue } from "framer-motion"
import { useRef, useEffect, useState, useCallback } from "react"

const MIN_SIZE = 120
const MAX_SIZE = 320
const DEFAULT_SIZE = 160

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

interface StickyNoteProps {
  message: string
  initialPosition?: { x: number; y: number }
  initialSize?: { w: number; h: number }
  onDragEnd?: (x: number, y: number) => void
  onSizeChange?: (w: number, h: number) => void
  dragConstraints?: React.RefObject<HTMLElement | null>
}

export function StickyNote({
  message,
  initialPosition = { x: 40, y: 60 },
  initialSize,
  onDragEnd,
  onSizeChange,
  dragConstraints,
}: StickyNoteProps) {
  const constraintsRef = useRef(null)
  const x = useMotionValue(initialPosition.x)
  const y = useMotionValue(initialPosition.y)

  const [width, setWidth] = useState(initialSize?.w ?? DEFAULT_SIZE)
  const [height, setHeight] = useState(initialSize?.h ?? DEFAULT_SIZE)
  const resizingRef = useRef(false)
  const startRef = useRef({ x: 0, y: 0, w: 0, h: 0 })
  const lastSizeRef = useRef({ w: width, h: height })
  lastSizeRef.current = { w: width, h: height }

  // Sync motion values when initialPosition changes
  useEffect(() => {
    x.set(initialPosition.x)
    y.set(initialPosition.y)
  }, [initialPosition.x, initialPosition.y, x, y])

  // Sync size when initialSize is provided (e.g. from URL)
  useEffect(() => {
    if (initialSize?.w != null && initialSize?.h != null) {
      setWidth((w) => clamp(initialSize.w, MIN_SIZE, MAX_SIZE))
      setHeight((h) => clamp(initialSize.h, MIN_SIZE, MAX_SIZE))
    }
  }, [initialSize?.w, initialSize?.h])

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      resizingRef.current = true
      startRef.current = { x: e.clientX, y: e.clientY, w: width, h: height }
      const onMouseMove = (move: MouseEvent) => {
        if (!resizingRef.current) return
        const dx = move.clientX - startRef.current.x
        const dy = move.clientY - startRef.current.y
        const newW = clamp(startRef.current.w + dx, MIN_SIZE, MAX_SIZE)
        const newH = clamp(startRef.current.h + dy, MIN_SIZE, MAX_SIZE)
        lastSizeRef.current = { w: newW, h: newH }
        setWidth(newW)
        setHeight(newH)
      }
      const onMouseUp = () => {
        resizingRef.current = false
        document.removeEventListener("mousemove", onMouseMove)
        document.removeEventListener("mouseup", onMouseUp)
        if (onSizeChange) {
          onSizeChange(lastSizeRef.current.w, lastSizeRef.current.h)
        }
      }
      document.addEventListener("mousemove", onMouseMove)
      document.addEventListener("mouseup", onMouseUp)
    },
    [onSizeChange],
  )

  // Truncate message to 100 characters
  const displayMessage = message.length > 100 ? message.substring(0, 100) + "..." : message

  return (
    <motion.div
      ref={constraintsRef}
      drag
      dragMomentum={false}
      dragElastic={0.2}
      dragConstraints={dragConstraints || constraintsRef}
      style={{ x, y }}
      initial={{
        x: initialPosition.x,
        y: initialPosition.y,
        rotate: 6,
      }}
      onDragEnd={() => {
        if (onDragEnd) {
          onDragEnd(x.get(), y.get())
        }
      }}
      whileTap={{ scale: 0.98 }}
      className="absolute cursor-grab active:cursor-grabbing z-50 pointer-events-auto"
    >
      <div
        className="p-4 flex flex-col relative"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.15) 0%, transparent 50%),
            #fbfbfb
          `,
          backgroundSize: "100% 100%, 100% 100%, 100% 100%",
          borderRadius: "8px",
          boxShadow: "0 12px 28px rgba(0,0,0,0.25), 0 4px 12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        {/* Subtle paper texture overlay */}
        <div
          className="absolute inset-0 rounded-[8px] pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px),
              repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)
            `,
          }}
        />

        {/* Character counter */}
        <div className="absolute top-2 right-2 text-[10px] text-[#999] z-10">
          {message.length}/100
        </div>

        {/* Centered text */}
        <p
          className="text-[18px] leading-relaxed text-[#2d2d2d] whitespace-pre-wrap break-words relative z-10 flex-1 flex items-center justify-center text-center"
          style={{
            fontFamily: "var(--font-caveat), 'Caveat', cursive",
          }}
        >
          {displayMessage}
        </p>

        {/* Resize handle - bottom-right corner */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Resize sticky note"
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center rounded-bl-[6px] hover:bg-black/5"
          onMouseDown={handleResizeStart}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-[#999]" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 10V6M4 6H10M8 8L4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}

