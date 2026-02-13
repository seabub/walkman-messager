"use client"

import { useCallback, useRef } from "react"
import { toPng } from "html-to-image"

interface WalkmanSideControlsProps {
  isLocked?: boolean
  onToggleHold?: () => void
  onVolumeUp?: () => void
  onVolumeDown?: () => void
  onDownload?: () => void
  walkmanRef?: React.RefObject<HTMLDivElement | null>
}

export function WalkmanSideControls({
  isLocked = false,
  onToggleHold,
  onVolumeUp,
  onVolumeDown,
  onDownload,
  walkmanRef,
}: WalkmanSideControlsProps) {
  const downloadingRef = useRef(false)

  const handleDownload = useCallback(async () => {
    if (downloadingRef.current) return
    if (onDownload) {
      onDownload()
      return
    }
    if (!walkmanRef?.current) return
    downloadingRef.current = true
    try {
      const dataUrl = await toPng(walkmanRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#1a1a1e",
      })
      const link = document.createElement("a")
      link.download = "walkman-mixtape.png"
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error("Failed to capture image:", err)
    } finally {
      downloadingRef.current = false
    }
  }, [onDownload, walkmanRef])

  return (
    <div
      className="relative flex flex-col items-center justify-between py-4"
      style={{
        width: "26px",
        height: "100%",
        background: "linear-gradient(90deg, #2a2a2a 0%, #3a3a3a 40%, #333 80%, #222 100%)",
        borderRadius: "0 8px 8px 0",
        boxShadow: "inset -1px 0 2px rgba(255,255,255,0.05), inset 1px 0 3px rgba(0,0,0,0.3)",
      }}
    >
      {/* HOLD switch */}
      <div className="flex flex-col items-center gap-[2px]">
        <span className="text-[5px] font-bold tracking-[0.15em] text-[#888] uppercase select-none">HOLD</span>
        <button
          className="relative w-[14px] h-[22px] rounded-[3px] cursor-pointer border-0"
          style={{
            background: "linear-gradient(180deg, #4a4a4a 0%, #333 50%, #4a4a4a 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.4), inset 0 0 1px rgba(255,255,255,0.1)",
          }}
          onClick={onToggleHold}
          aria-label="Hold switch"
        >
          <div
            className="absolute w-[10px] h-[9px] rounded-[2px] left-[2px] transition-all"
            style={{
              top: isLocked ? "11px" : "2px",
              background: isLocked
                ? "linear-gradient(180deg, #cc6600 0%, #995500 100%)"
                : "linear-gradient(180deg, #666 0%, #555 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-[1.5px]">
              <div className="w-[6px] h-[0.5px] bg-[#444] rounded-full" />
              <div className="w-[6px] h-[0.5px] bg-[#444] rounded-full" />
              <div className="w-[6px] h-[0.5px] bg-[#444] rounded-full" />
            </div>
          </div>
        </button>
      </div>

      {/* DOWNLOAD button */}
      <div className="flex flex-col items-center gap-[2px]">
        <button
          className="w-[16px] h-[8px] rounded-[2px] cursor-pointer border-0 active:brightness-75 transition-all"
          style={{
            background: "linear-gradient(180deg, #222 0%, #1a1a1a 50%, #2a2a2a 100%)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05)",
          }}
          onClick={handleDownload}
          aria-label="Download snapshot"
        />
        <span
          className="text-[4.5px] font-bold tracking-[0.08em] text-[#777] uppercase select-none leading-none"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", letterSpacing: "0.08em" }}
        >
          DOWNLOAD
        </span>
      </div>

      {/* VOL rocker */}
      <div className="flex flex-col items-center gap-[2px]">
        <span className="text-[5px] font-bold tracking-[0.15em] text-[#888] uppercase select-none">VOL</span>
        <div
          className="relative w-[14px] h-[30px] rounded-[3px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #4a4a4a 0%, #333 50%, #4a4a4a 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.4), inset 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#222]" />
          <button
            className="absolute top-0 left-0 w-full h-1/2 flex items-center justify-center cursor-pointer border-0 bg-transparent hover:bg-white/5 active:bg-black/10 transition-colors"
            onClick={onVolumeUp}
            aria-label="Volume up"
          >
            <span className="text-[7px] text-[#999] font-bold leading-none select-none">+</span>
          </button>
          <button
            className="absolute bottom-0 left-0 w-full h-1/2 flex items-center justify-center cursor-pointer border-0 bg-transparent hover:bg-white/5 active:bg-black/10 transition-colors"
            onClick={onVolumeDown}
            aria-label="Volume down"
          >
            <span className="text-[7px] text-[#999] font-bold leading-none select-none">-</span>
          </button>
        </div>
      </div>
    </div>
  )
}
