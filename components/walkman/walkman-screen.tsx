"use client"

import { useEffect, useState, useRef } from "react"

interface WalkmanScreenProps {
  discLabel?: string
  senderName?: string
  /** YouTube video title; falls back to discLabel when empty */
  trackTitle?: string
  /** YouTube channel/artist; falls back to senderName when empty */
  trackArtist?: string
  currentTrackIndex?: number
  totalTracks?: number
  isPlaying?: boolean
  currentTime?: number
  duration?: number
  volume?: number
  showVolume?: boolean
  isLocked?: boolean
  lockFlash?: boolean
  showPlaylist?: boolean
  playlistEntries?: Array<{ index: number; videoId: string; title: string }>
}

function AudioVisualizer({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-end gap-[2px] h-[18px]">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className={`w-[3px] rounded-[0.5px] ${isPlaying ? "visualizer-bar-active" : ""}`}
          style={{
            background: "linear-gradient(0deg, #00ddcc, #00ffaa)",
            height: isPlaying ? undefined : "2px",
            "--bar-speed": `0.${3 + (i % 4)}s`,
            "--bar-delay": `${i * 0.07}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function MarqueeText({ text, isPlaying }: { text: string; isPlaying: boolean }) {
  if (!isPlaying) return null
  return (
    <div className="overflow-hidden w-full">
      <div
        className="whitespace-nowrap font-walkman text-[8px] text-[#00ddaa] tracking-[0.06em]"
        style={{
          animation: "marqueeScroll 6s linear infinite",
        }}
      >
        {text}  &bull;  {text}  &bull;  {text}
      </div>
    </div>
  )
}

export function WalkmanScreen({
  discLabel = "Blue SKY",
  senderName = "Hi-MD Orchestra",
  trackTitle,
  trackArtist,
  currentTrackIndex = 0,
  totalTracks = 1,
  isPlaying = false,
  currentTime = 0,
  duration = 0,
  volume = 80,
  showVolume = false,
  isLocked = false,
  lockFlash = false,
  showPlaylist = false,
  playlistEntries = [],
}: WalkmanScreenProps) {
  const displayTitle = (trackTitle && trackTitle.trim()) ? trackTitle : discLabel
  const displayArtist = (trackArtist && trackArtist.trim()) ? trackArtist : senderName
  const [lockVisible, setLockVisible] = useState(false)
  const flashRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Flash KEY LOCK text
  useEffect(() => {
    if (lockFlash) {
      let visible = true
      setLockVisible(true)
      flashRef.current = setInterval(() => {
        visible = !visible
        setLockVisible(visible)
      }, 200)
      const timeout = setTimeout(() => {
        if (flashRef.current) clearInterval(flashRef.current)
        setLockVisible(false)
      }, 1200)
      return () => {
        if (flashRef.current) clearInterval(flashRef.current)
        clearTimeout(timeout)
      }
    }
  }, [lockFlash])

  const minutes = String(Math.floor(currentTime / 60)).padStart(2, "0")
  const seconds = String(Math.floor(currentTime) % 60).padStart(2, "0")
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="walkman-screen relative w-full aspect-[16/10] rounded-[3px] overflow-hidden select-none">
      {/* Screen glass overlay */}
      <div
        className="absolute inset-0 z-10 rounded-[3px] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
        }}
      />

      {/* LCD background */}
      <div className="absolute inset-0 bg-[#0a0e14]" />

      {/* Content: playlist view or now-playing */}
      {showPlaylist ? (
        <div className="relative z-[5] flex flex-col h-full p-[6px]">
          <div className="font-walkman text-[10px] text-[#00ccbb] tracking-[0.12em] mb-[6px] border-b border-[#1a3040] pb-[4px]">
            PLAYLIST
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0" style={{ scrollbarWidth: "thin" }}>
            {playlistEntries.map(({ index, title }) => (
              <div
                key={index}
                className={`font-walkman text-[10px] tracking-[0.04em] leading-tight py-[2px] truncate flex items-center gap-[4px] ${
                  index === currentTrackIndex ? "text-[#00ddcc]" : "text-[#b0c0d0]"
                }`}
              >
                <span className="flex-shrink-0 w-[14px] text-[#00ccbb]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{title}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
      <div className="relative z-[5] flex flex-col h-full p-[6px] gap-[2px]">
        {/* Top row: track info + visualizer */}
        <div className="flex items-start justify-between">
          {/* Left: Track number and time */}
          <div className="flex flex-col">
            <div className="flex items-center gap-[6px]">
              {/* Play/Pause icon */}
              {isPlaying ? (
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <path d="M1 1L7 4.5L1 8V1Z" fill="#00ddaa" />
                </svg>
              ) : (
                <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                  <rect x="1" y="1" width="2.5" height="7" fill="#00ddaa" />
                  <rect x="4.5" y="1" width="2.5" height="7" fill="#00ddaa" />
                </svg>
              )}
              <span className="font-walkman text-[13px] text-[#e0e8f0] tracking-[0.1em] leading-none">
                {String(currentTrackIndex + 1).padStart(2, "0")}/{String(totalTracks).padStart(2, "0")}
              </span>
            </div>
            <span className="font-walkman text-[18px] text-[#e0e8f0] tracking-[0.12em] leading-tight mt-[1px]">
              {minutes}:{seconds}
            </span>
            {/* Progress bar */}
            <div className="mt-[3px] w-[72px] h-[4px] bg-[#1a2838] rounded-[1px] overflow-hidden">
              <div
                className="h-full rounded-[1px]"
                style={{
                  background: "linear-gradient(90deg, #00bbaa, #00ddcc)",
                  width: `${Math.min(progress, 100)}%`,
                  transition: "width 0.3s linear",
                }}
              />
            </div>
          </div>

          {/* Right: Visualizer or album art */}
          <div className="w-[38px] h-[38px] rounded-[2px] overflow-hidden border border-[#1a3040] flex-shrink-0 flex items-center justify-center bg-[#0a1018]">
            <AudioVisualizer isPlaying={isPlaying} />
          </div>
        </div>

        {/* Marquee */}
        <MarqueeText text="Now Playing..." isPlaying={isPlaying} />

        {/* Track title */}
        <div className="flex items-center gap-[4px] mt-[1px]">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke="#00ccbb" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="1" fill="#00ccbb" />
          </svg>
          <span className="font-walkman text-[12px] text-[#e0e8f0] tracking-[0.05em] leading-none truncate">
            {displayTitle}
          </span>
        </div>

        {/* Artist */}
        <div className="flex items-center gap-[4px] mt-[1px]">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1" stroke="#00ccbb" strokeWidth="1" fill="none" />
          </svg>
          <span className="font-walkman text-[10.5px] text-[#b0c0d0] tracking-[0.04em] leading-none truncate">
            {displayArtist}
          </span>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center gap-[6px] mt-auto">
          <span className="font-walkman text-[8px] text-[#00ccbb] tracking-[0.06em] px-[3px] py-[1px] border border-[#00ccbb] rounded-[1px] leading-none">
            Hi-MD
          </span>
          {isLocked && (
            <span className="font-walkman text-[8px] text-[#ff6644] tracking-[0.04em] leading-none">
              HOLD
            </span>
          )}
          <span className="font-walkman text-[8px] text-[#00ccbb] tracking-[0.04em] leading-none">
            VC
          </span>
          {/* Battery icon */}
          <div className="flex items-center ml-auto">
            <div className="w-[14px] h-[7px] border border-[#4499bb] rounded-[1px] flex items-center p-[1px] gap-[0.5px]">
              <div className="w-[3px] h-[4px] bg-[#4499bb] rounded-[0.5px]" />
              <div className="w-[3px] h-[4px] bg-[#4499bb] rounded-[0.5px]" />
              <div className="w-[3px] h-[4px] bg-[#1a3858] rounded-[0.5px]" />
            </div>
            <div className="w-[1.5px] h-[3px] bg-[#4499bb] rounded-r-[0.5px]" />
          </div>
        </div>
      </div>
      )}

      {/* Volume overlay */}
      {showVolume && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0e14]/80">
          <div className="flex flex-col items-center gap-[4px]">
            <span className="font-walkman text-[10px] text-[#00ddcc] tracking-[0.1em]">VOLUME</span>
            <div className="flex items-end gap-[2px] h-[20px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[6px] rounded-[0.5px]"
                  style={{
                    height: `${(i + 1) * 2}px`,
                    background: i < Math.floor(volume / 10) ? "#00ddcc" : "#1a3858",
                  }}
                />
              ))}
            </div>
            <span className="font-walkman text-[14px] text-[#e0e8f0] tracking-[0.1em]">{volume}</span>
          </div>
        </div>
      )}

      {/* KEY LOCK flash overlay */}
      {lockFlash && lockVisible && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0a0e14]/80">
          <span className="font-walkman text-[14px] text-[#ff6644] tracking-[0.15em]">KEY LOCK</span>
        </div>
      )}
    </div>
  )
}
