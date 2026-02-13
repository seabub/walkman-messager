"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import YouTube from "react-youtube"

import { WalkmanScreen } from "./walkman-screen"
import { WalkmanWheel } from "./walkman-wheel"
import { WalkmanSideControls } from "./walkman-side-controls"
import { WalkmanBackPanel } from "./walkman-back-panel"
import type { WalkmanDisc } from "@/hooks/use-walkman-logic"

interface WalkmanProps {
  disc: WalkmanDisc
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  showVolume: boolean
  isLocked: boolean
  lockFlash: boolean
  isFlipped: boolean
  onPlayerReady: (e: { target: any }) => void
  onPlayerStateChange: (e: { data: number; target: any }) => void
  onPlayPause: () => void
  onSeekLeft: () => void
  onSeekRight: () => void
  onVolumeUp: () => void
  onVolumeDown: () => void
  onToggleHold: () => void
  onToggleFlip: () => void
}

function MetalButton({
  label,
  position,
  ariaLabel,
  onClick,
}: {
  label: string
  position: "tl" | "tr" | "bl" | "br"
  ariaLabel: string
  onClick?: () => void
}) {
  const [pressed, setPressed] = useState(false)

  return (
    <div
      className="flex flex-col items-center gap-[3px]"
      style={{
        alignSelf: position === "tl" || position === "bl" ? "flex-start" : "flex-end",
      }}
    >
      {(position === "tl" || position === "tr") && (
        <span className="text-[6.5px] font-semibold tracking-[0.12em] text-[#666] uppercase select-none leading-none">
          {label}
        </span>
      )}
      <button
        className="w-[16px] h-[16px] rounded-full cursor-pointer border-0 transition-transform"
        style={{
          background: pressed
            ? "radial-gradient(circle at 40% 35%, #c0c0c0, #888)"
            : "radial-gradient(circle at 35% 30%, #f0f0f0, #c8c8c8 40%, #999 90%)",
          boxShadow: pressed
            ? "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.2)"
            : "0 2px 4px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.5)",
          transform: pressed ? "scale(0.95)" : "scale(1)",
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => {
          setPressed(false)
          onClick?.()
        }}
        onPointerLeave={() => setPressed(false)}
        aria-label={ariaLabel}
      />
      {(position === "bl" || position === "br") && (
        <span className="text-[6.5px] font-semibold tracking-[0.12em] text-[#666] uppercase select-none leading-none">
          {label}
        </span>
      )}
    </div>
  )
}

export function Walkman({
  disc,
  isPlaying,
  currentTime,
  duration,
  volume,
  showVolume,
  isLocked,
  lockFlash,
  isFlipped,
  onPlayerReady,
  onPlayerStateChange,
  onPlayPause,
  onSeekLeft,
  onSeekRight,
  onVolumeUp,
  onVolumeDown,
  onToggleHold,
  onToggleFlip,
}: WalkmanProps) {
  const captureRef = useRef<HTMLDivElement>(null)
  const downloadingRef = useRef(false)

  const handleDownload = useCallback(async () => {
    if (downloadingRef.current || !captureRef.current) return
    downloadingRef.current = true
    try {
      // Clone the element, strip iframes, and serialize to SVG foreignObject
      const clone = captureRef.current.cloneNode(true) as HTMLElement
      clone.querySelectorAll("iframe").forEach((el) => el.remove())

      const { width, height } = captureRef.current.getBoundingClientRect()
      const scale = 2

      // Inline all computed styles on every element so the serialized SVG looks correct
      const inlineStyles = (source: Element, target: Element) => {
        const computed = window.getComputedStyle(source)
        const targetEl = target as HTMLElement
        for (let i = 0; i < computed.length; i++) {
          const prop = computed[i]
          try {
            targetEl.style.setProperty(prop, computed.getPropertyValue(prop))
          } catch {
            // skip read-only properties
          }
        }
        const sourceChildren = source.children
        const targetChildren = target.children
        for (let i = 0; i < sourceChildren.length; i++) {
          if (targetChildren[i]) {
            inlineStyles(sourceChildren[i], targetChildren[i])
          }
        }
      }
      inlineStyles(captureRef.current, clone)

      const serializer = new XMLSerializer()
      const html = serializer.serializeToString(clone)

      const svgString = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${width * scale}" height="${height * scale}">
          <foreignObject width="${width}" height="${height}" transform="scale(${scale})">
            <div xmlns="http://www.w3.org/1999/xhtml" style="background:#1a1a1e;">
              ${html}
            </div>
          </foreignObject>
        </svg>
      `

      const img = new Image()
      img.crossOrigin = "anonymous"
      const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" })
      const url = URL.createObjectURL(blob)

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement("canvas")
          canvas.width = width * scale
          canvas.height = height * scale
          const ctx = canvas.getContext("2d")!
          ctx.fillStyle = "#1a1a1e"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(img, 0, 0)
          URL.revokeObjectURL(url)

          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const a = document.createElement("a")
              a.download = `walkman-${disc.discLabel.replace(/\s+/g, "-").toLowerCase()}.png`
              a.href = URL.createObjectURL(pngBlob)
              a.click()
              URL.revokeObjectURL(a.href)
            }
            resolve()
          }, "image/png")
        }
        img.onerror = reject
        img.src = url
      })
    } catch (err) {
      console.error("Failed to capture:", err)
    } finally {
      downloadingRef.current = false
    }
  }, [disc.discLabel])

  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      {/* Hidden YouTube player */}
      <div className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <YouTube
          videoId={disc.youtubeId}
          opts={{
            height: "1",
            width: "1",
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              origin: typeof window !== "undefined" ? window.location.origin : "",
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>

      {/* Flippable card */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          ref={captureRef}
          className="relative flex"
          style={{ backfaceVisibility: "hidden" }}
          role="region"
          aria-label="Sony Hi-MD Walkman MZ-DH10P - front"
        >
          {/* Main body */}
          <div
            className="relative flex"
            style={{
              width: "360px",
              height: "360px",
              borderRadius: "6px 12px 12px 6px",
              overflow: "hidden",
              boxShadow:
                "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Left dark panel */}
            <div
              className="relative flex flex-col"
              style={{
                width: "210px",
                height: "100%",
                background:
                  "linear-gradient(180deg, #5a5a60 0%, #48484e 20%, #3e3e44 50%, #48484e 80%, #5a5a60 100%)",
                borderRight: "1px solid rgba(0,0,0,0.15)",
              }}
            >
              {/* Brushed gunmetal texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
                }}
              />

              {/* Screen */}
              <div className="relative px-4 pt-5">
                <div
                  className="relative rounded-[4px] overflow-hidden"
                  style={{
                    boxShadow:
                      "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05)",
                  }}
                >
                  <WalkmanScreen
                    discLabel={disc.discLabel}
                    senderName={disc.senderName}
                    isPlaying={isPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    volume={volume}
                    showVolume={showVolume}
                    isLocked={isLocked}
                    lockFlash={lockFlash}
                  />
                </div>
              </div>

              {/* Button labels: CANCEL and MENU */}
              <div className="flex justify-between items-end px-4 mt-3">
                <div className="flex items-center gap-[3px]">
                  <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                    <rect width="6" height="6" fill="#777" rx="1" />
                  </svg>
                  <span className="text-[6.5px] font-semibold tracking-[0.08em] text-[#999] select-none">
                    /CANCEL
                  </span>
                </div>
                <span className="text-[6.5px] font-semibold tracking-[0.08em] text-[#999] select-none">MENU</span>
              </div>

              {/* Controls */}
              <div className="flex-1 flex flex-col items-center px-3 mt-1">
                <div className="flex w-full justify-between items-start px-1">
                  <MetalButton label="CHG" position="tl" ariaLabel="Charge" />
                  <MetalButton label="OPR" position="tr" ariaLabel="Operate" />
                </div>

                <div className="my-1">
                  <WalkmanWheel
                    onPlayPause={onPlayPause}
                    onSeekLeft={onSeekLeft}
                    onSeekRight={onSeekRight}
                  />
                </div>

                <div className="flex w-full justify-between items-end px-1">
                  <MetalButton label="SLIDESHOW" position="bl" ariaLabel="Slideshow" />
                  <MetalButton label="DISPLAY" position="br" ariaLabel="Display - flip device" onClick={onToggleFlip} />
                </div>
              </div>
            </div>

            {/* Right silver panel */}
            <div
              className="relative flex-1 flex flex-col"
              style={{
                background:
                  "linear-gradient(135deg, #d4d4d8 0%, #c8c8cc 15%, #bcbcc0 30%, #c8c8cc 50%, #d0d0d4 70%, #c4c4c8 85%, #d4d4d8 100%)",
              }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.06) 1px, rgba(255,255,255,0.06) 2px)",
                  opacity: 0.8,
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.05) 100%)",
                }}
              />

              {/* SONY logo */}
              <div className="relative mt-6 mr-4 flex justify-end">
                <span
                  className="text-[26px] font-bold tracking-[0.08em] select-none"
                  style={{
                    color: "transparent",
                    backgroundImage:
                      "linear-gradient(180deg, #9a9a9e 0%, #78787c 40%, #88888c 60%, #a0a0a4 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    textShadow: "none",
                    filter:
                      "drop-shadow(0 1px 0 rgba(255,255,255,0.3)) drop-shadow(0 -0.5px 0 rgba(0,0,0,0.2))",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    fontStretch: "condensed",
                  }}
                >
                  SONY
                </span>
              </div>

              <div className="flex-1" />

              {/* Hi-MD badge */}
              <div className="relative mr-4 mb-2 flex justify-end">
                <div
                  className="flex items-center gap-[3px] px-[6px] py-[4px] rounded-[3px]"
                  style={{
                    background: "linear-gradient(180deg, #2288cc 0%, #1166aa 50%, #0055a0 100%)",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  <span className="text-[7px] font-extrabold tracking-[0.02em] text-white leading-none select-none" style={{ fontFamily: "Arial, sans-serif" }}>
                    Hi-MD
                  </span>
                  <div className="w-[0.5px] h-[8px] bg-white/40" />
                  <span className="text-[5px] font-bold tracking-[0.06em] text-white leading-none select-none uppercase" style={{ fontFamily: "Arial, sans-serif" }}>
                    AUDIO
                  </span>
                </div>
              </div>

              {/* WALKMAN branding */}
              <div className="relative mr-4 mb-5 flex flex-col items-end gap-[2px]">
                <div className="flex items-center gap-[3px]">
                  <div
                    className="w-[10px] h-[10px] rounded-full flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #e88000 0%, #cc6600 100%)",
                      boxShadow: "0 0.5px 1px rgba(0,0,0,0.2)",
                    }}
                  >
                    <span className="text-[6px] font-black text-white leading-none select-none">W</span>
                  </div>
                  <span className="text-[8px] font-semibold tracking-[0.15em] select-none" style={{ color: "#888", fontFamily: "Arial, sans-serif" }}>
                    WALKMAN
                  </span>
                </div>
                <span className="text-[6px] font-medium tracking-[0.06em] select-none" style={{ color: "#888", fontFamily: "Arial, sans-serif" }}>
                  HI-MD WALKMAN MZ-DH10P
                </span>
              </div>
            </div>
          </div>

          {/* Side controls */}
          <WalkmanSideControls
            isLocked={isLocked}
            onToggleHold={onToggleHold}
            onVolumeUp={onVolumeUp}
            onVolumeDown={onVolumeDown}
            onDownload={handleDownload}
          />
        </div>

        {/* BACK */}
        <div
          className="absolute top-0 left-0"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <WalkmanBackPanel
            secretMessage={disc.secretMessage}
            senderName={disc.senderName}
            discLabel={disc.discLabel}
          />
        </div>
      </motion.div>
    </div>
  )
}
