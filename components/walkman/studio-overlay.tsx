"use client"

import { useState, useCallback } from "react"
import { extractYouTubeId, type WalkmanDisc } from "@/hooks/use-walkman-logic"

interface StudioOverlayProps {
  onBurn: (disc: WalkmanDisc) => void
}

export function StudioOverlay({ onBurn }: StudioOverlayProps) {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [discLabel, setDiscLabel] = useState("")
  const [senderName, setSenderName] = useState("")
  const [secretMessage, setSecretMessage] = useState("")
  const [error, setError] = useState("")
  const [isBurning, setIsBurning] = useState(false)
  const [burnProgress, setBurnProgress] = useState(0)

  const handleBurn = useCallback(() => {
    setError("")
    const videoId = extractYouTubeId(youtubeUrl.trim())
    if (!videoId) {
      setError("Invalid YouTube URL. Please paste a valid link.")
      return
    }
    if (!discLabel.trim()) {
      setError("Please enter a Disc Label.")
      return
    }

    setIsBurning(true)
    setBurnProgress(0)

    // Simulated burn progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setBurnProgress(100)
        setTimeout(() => {
          onBurn({
            youtubeId: videoId,
            discLabel: discLabel.trim(),
            senderName: senderName.trim() || "Anonymous",
            secretMessage: secretMessage.trim(),
          })
        }, 400)
      }
      setBurnProgress(Math.min(100, Math.floor(progress)))
    }, 180)
  }, [youtubeUrl, discLabel, senderName, secretMessage, onBurn])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Window */}
      <div
        className="relative w-full max-w-[420px] flex flex-col overflow-hidden select-none"
        style={{
          background: "linear-gradient(180deg, #c0c0c0 0%, #d4d4d4 2%, #c0c0c0 4%, #b8b8b8 100%)",
          border: "2px solid #fafafa",
          borderBottomColor: "#808080",
          borderRightColor: "#808080",
          boxShadow: "4px 4px 0 rgba(0,0,0,0.3), inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-[6px] py-[3px]"
          style={{
            background: "linear-gradient(90deg, #000080 0%, #1084d0 100%)",
          }}
        >
          {/* Icon */}
          <div className="w-[14px] h-[14px] rounded-full bg-[#ff6600] flex items-center justify-center flex-shrink-0">
            <span className="text-[7px] font-black text-white leading-none">W</span>
          </div>
          <span className="text-[11px] font-bold text-white tracking-[0.02em] flex-1 truncate" style={{ fontFamily: "Tahoma, Arial, sans-serif", textShadow: "1px 1px 0 rgba(0,0,0,0.3)" }}>
            Sony Hi-MD Disc Burner v2.1 - [New Session]
          </span>
          {/* Window buttons */}
          <div className="flex gap-[2px]">
            {["_", "[ ]", "X"].map((sym) => (
              <div
                key={sym}
                className="w-[16px] h-[14px] flex items-center justify-center"
                style={{
                  background: "linear-gradient(180deg, #c8c8c8 0%, #b0b0b0 100%)",
                  border: "1px solid #fff",
                  borderBottomColor: "#606060",
                  borderRightColor: "#606060",
                  boxShadow: "inset 1px 1px 0 #e8e8e8",
                }}
              >
                <span className="text-[8px] font-bold text-black leading-none" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>{sym}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content area */}
        <div className="p-3 flex flex-col gap-3" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
          {/* Section: Track Select */}
          <fieldset
            className="p-2 pt-1 flex flex-col gap-[6px]"
            style={{
              border: "1px solid #808080",
              borderBottomColor: "#fff",
              borderRightColor: "#fff",
            }}
          >
            <legend className="text-[10px] font-semibold text-[#333] px-1 tracking-[0.02em]">Track Select (YouTube URL)</legend>
            <div className="flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <rect width="24" height="24" rx="4" fill="#FF0000" />
                <path d="M9.5 7.5V16.5L17 12L9.5 7.5Z" fill="white" />
              </svg>
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 px-[6px] py-[3px] text-[11px] text-black bg-white outline-none"
                style={{
                  border: "1px solid #808080",
                  borderTopColor: "#606060",
                  borderLeftColor: "#606060",
                  fontFamily: "Tahoma, Arial, sans-serif",
                }}
              />
            </div>
          </fieldset>

          {/* Section: Disc Info */}
          <fieldset
            className="p-2 pt-1 flex flex-col gap-[6px]"
            style={{
              border: "1px solid #808080",
              borderBottomColor: "#fff",
              borderRightColor: "#fff",
            }}
          >
            <legend className="text-[10px] font-semibold text-[#333] px-1 tracking-[0.02em]">Disc Properties</legend>

            <div className="flex items-center gap-2">
              <label className="text-[10px] text-[#333] w-[60px] text-right flex-shrink-0">Disc Label:</label>
              <input
                type="text"
                value={discLabel}
                onChange={(e) => setDiscLabel(e.target.value)}
                placeholder="For Sarah"
                maxLength={60}
                className="flex-1 px-[6px] py-[3px] text-[11px] text-black bg-white outline-none"
                style={{
                  border: "1px solid #808080",
                  borderTopColor: "#606060",
                  borderLeftColor: "#606060",
                  fontFamily: "Tahoma, Arial, sans-serif",
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[10px] text-[#333] w-[60px] text-right flex-shrink-0">From:</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Your Name"
                maxLength={40}
                className="flex-1 px-[6px] py-[3px] text-[11px] text-black bg-white outline-none"
                style={{
                  border: "1px solid #808080",
                  borderTopColor: "#606060",
                  borderLeftColor: "#606060",
                  fontFamily: "Tahoma, Arial, sans-serif",
                }}
              />
            </div>
          </fieldset>

          {/* Section: Message */}
          <fieldset
            className="p-2 pt-1 flex flex-col gap-[6px]"
            style={{
              border: "1px solid #808080",
              borderBottomColor: "#fff",
              borderRightColor: "#fff",
            }}
          >
            <legend className="text-[10px] font-semibold text-[#333] px-1 tracking-[0.02em]">Secret Message (taped to back)</legend>
            <textarea
              value={secretMessage}
              onChange={(e) => setSecretMessage(e.target.value)}
              placeholder="Write something they'll find on the back of the player..."
              rows={3}
              maxLength={500}
              className="w-full px-[6px] py-[3px] text-[11px] text-black bg-white outline-none resize-none"
              style={{
                border: "1px solid #808080",
                borderTopColor: "#606060",
                borderLeftColor: "#606060",
                fontFamily: "Tahoma, Arial, sans-serif",
              }}
            />
            <div className="text-right text-[9px] text-[#888]">{secretMessage.length}/500</div>
          </fieldset>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-1 px-1">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <circle cx="8" cy="8" r="7" fill="#FF0000" />
                <path d="M5 5L11 11M11 5L5 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[10px] text-[#cc0000]">{error}</span>
            </div>
          )}

          {/* Burn progress */}
          {isBurning && (
            <div className="flex flex-col gap-1 px-1">
              <span className="text-[10px] text-[#333]">
                {burnProgress < 100 ? `Burning disc... ${burnProgress}%` : "Finalizing session..."}
              </span>
              <div
                className="h-[16px] w-full"
                style={{
                  border: "1px solid #808080",
                  borderTopColor: "#606060",
                  borderLeftColor: "#606060",
                  background: "#fff",
                }}
              >
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${burnProgress}%`,
                    background: "repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #1084d0 8px, #1084d0 16px)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              onClick={handleBurn}
              disabled={isBurning}
              className="px-4 py-[3px] text-[11px] font-semibold text-black cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:pt-[4px] active:pb-[2px]"
              style={{
                background: "linear-gradient(180deg, #e8e8e8 0%, #c0c0c0 100%)",
                border: "2px solid #fff",
                borderBottomColor: "#606060",
                borderRightColor: "#606060",
                boxShadow: "1px 1px 0 #404040",
                fontFamily: "Tahoma, Arial, sans-serif",
              }}
            >
              {isBurning ? "Burning..." : "BURN DISC"}
            </button>
          </div>
        </div>

        {/* Status bar */}
        <div
          className="flex items-center px-2 py-[2px]"
          style={{
            background: "#c0c0c0",
            borderTop: "1px solid #808080",
          }}
        >
          <span className="text-[9px] text-[#444]" style={{ fontFamily: "Tahoma, Arial, sans-serif" }}>
            {isBurning ? "Writing data to Hi-MD disc..." : "Ready - Insert track and burn"}
          </span>
        </div>
      </div>
    </div>
  )
}
