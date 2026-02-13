"use client"

import { useEffect, useState } from "react"

export function WalkmanScreen() {
  const [timer, setTimer] = useState(225) // 3:45 in seconds
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setTimer((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const minutes = String(Math.floor(timer / 60)).padStart(2, "0")
  const seconds = String(timer % 60).padStart(2, "0")

  return (
    <div className="walkman-screen relative w-full aspect-[16/10] rounded-[3px] overflow-hidden select-none">
      {/* Screen glass overlay */}
      <div className="absolute inset-0 z-10 rounded-[3px] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)",
        }}
      />

      {/* LCD background */}
      <div className="absolute inset-0 bg-[#0a0e14]" />

      {/* Content */}
      <div className="relative z-[5] flex flex-col h-full p-[6px] gap-[2px]">
        {/* Top row: track info + album art */}
        <div className="flex items-start justify-between">
          {/* Left: Track number and time */}
          <div className="flex flex-col">
            <div className="flex items-center gap-[6px]">
              {/* Play icon */}
              <svg width="8" height="9" viewBox="0 0 8 9" fill="none">
                <path d="M1 1L7 4.5L1 8V1Z" fill="#00ddaa" />
              </svg>
              <span className="font-walkman text-[13px] text-[#e0e8f0] tracking-[0.1em] leading-none">001</span>
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
                  width: `${Math.min(((timer - 225) / 180) * 100 + 35, 100)}%`,
                  transition: "width 1s linear",
                }}
              />
            </div>
          </div>

          {/* Right: Album art thumbnail */}
          <div className="w-[38px] h-[38px] rounded-[2px] overflow-hidden border border-[#1a3040] flex-shrink-0">
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(135deg, #446644 0%, #88aa55 25%, #ddbb77 45%, #cc8866 60%, #885544 80%, #446644 100%)",
                imageRendering: "pixelated",
              }}
            >
              {/* Stylized pixelated face silhouette */}
              <svg viewBox="0 0 38 38" className="w-full h-full opacity-70">
                <ellipse cx="19" cy="14" rx="8" ry="9" fill="#e8c8a0" opacity="0.6" />
                <ellipse cx="19" cy="30" rx="12" ry="10" fill="#cc8866" opacity="0.4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Track title */}
        <div className="flex items-center gap-[4px] mt-[1px]">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke="#00ccbb" strokeWidth="1" fill="none" />
            <circle cx="5" cy="5" r="1" fill="#00ccbb" />
          </svg>
          <span className="font-walkman text-[12px] text-[#e0e8f0] tracking-[0.05em] leading-none truncate">
            Blue SKY
          </span>
        </div>

        {/* Artist */}
        <div className="flex items-center gap-[4px] mt-[1px]">
          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
            <rect x="2" y="2" width="6" height="6" rx="1" stroke="#00ccbb" strokeWidth="1" fill="none" />
          </svg>
          <span className="font-walkman text-[10.5px] text-[#b0c0d0] tracking-[0.04em] leading-none truncate">
            Hi-MD Orchestra
          </span>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center gap-[6px] mt-auto">
          <span className="font-walkman text-[8px] text-[#00ccbb] tracking-[0.06em] px-[3px] py-[1px] border border-[#00ccbb] rounded-[1px] leading-none">
            Hi-MD
          </span>
          <span className="font-walkman text-[8px] text-[#00ccbb] tracking-[0.04em] leading-none">
            SHUF
          </span>
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M0 3H6M4 1L6 3L4 5" stroke="#00ccbb" strokeWidth="0.8" />
          </svg>
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
    </div>
  )
}
