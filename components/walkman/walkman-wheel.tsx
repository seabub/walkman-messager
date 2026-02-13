"use client"

import { useState } from "react"

export function WalkmanWheel() {
  const [activeDir, setActiveDir] = useState<string | null>(null)
  const [centerPressed, setCenterPressed] = useState(false)

  return (
    <div className="relative w-[140px] h-[140px] flex items-center justify-center">
      {/* Outermost chrome ring with tick marks */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: "conic-gradient(from 0deg, #c8c8c8 0deg, #e8e8e8 15deg, #a0a0a0 30deg, #d4d4d4 60deg, #b8b8b8 90deg, #e0e0e0 120deg, #a8a8a8 150deg, #d0d0d0 180deg, #c0c0c0 210deg, #e4e4e4 240deg, #a4a4a4 270deg, #d8d8d8 300deg, #b4b4b4 330deg, #c8c8c8 360deg)",
          boxShadow: "0 2px 6px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.15), inset 0 1px 2px rgba(255,255,255,0.3)",
        }}
      >
        {/* Tick marks around the bezel */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24
          return (
            <div
              key={i}
              className="absolute top-0 left-1/2 h-full w-[1px] origin-bottom"
              style={{
                transform: `translateX(-50%) rotate(${angle}deg)`,
                height: "50%",
                top: "0",
                transformOrigin: "50% 100%",
              }}
            >
              <div
                className="w-[1px] rounded-full"
                style={{
                  height: i % 2 === 0 ? "5px" : "3px",
                  background: "rgba(0,0,0,0.2)",
                  marginTop: "3px",
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Inner directional ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: "108px",
          height: "108px",
          background: "linear-gradient(145deg, #d8d8d8, #a8a8a8)",
          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2), inset 0 -1px 2px rgba(255,255,255,0.3), 0 0 0 1px rgba(0,0,0,0.1)",
        }}
      >
        {/* Directional button zones */}
        {/* Up */}
        <button
          className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all cursor-pointer border-0 bg-transparent"
          style={{
            background: activeDir === "up" ? "rgba(0,0,0,0.08)" : "transparent",
          }}
          onPointerDown={() => setActiveDir("up")}
          onPointerUp={() => setActiveDir(null)}
          onPointerLeave={() => setActiveDir(null)}
          aria-label="Folder up"
        >
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 6.5L5 1.5L9 6.5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Down */}
        <button
          className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all cursor-pointer border-0 bg-transparent"
          style={{
            background: activeDir === "down" ? "rgba(0,0,0,0.08)" : "transparent",
          }}
          onPointerDown={() => setActiveDir("down")}
          onPointerUp={() => setActiveDir(null)}
          onPointerLeave={() => setActiveDir(null)}
          aria-label="Folder down"
        >
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 1.5L5 6.5L9 1.5" stroke="#555" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Left (rewind) */}
        <button
          className="absolute left-[4px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all cursor-pointer border-0 bg-transparent"
          style={{
            background: activeDir === "left" ? "rgba(0,0,0,0.08)" : "transparent",
          }}
          onPointerDown={() => setActiveDir("left")}
          onPointerUp={() => setActiveDir(null)}
          onPointerLeave={() => setActiveDir(null)}
          aria-label="Rewind"
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M6 1L1 5L6 9" stroke="#555" strokeWidth="1.3" fill="none" />
            <path d="M11 1L6 5L11 9" stroke="#555" strokeWidth="1.3" fill="none" />
          </svg>
        </button>

        {/* Right (forward) */}
        <button
          className="absolute right-[4px] top-1/2 -translate-y-1/2 w-[28px] h-[28px] flex items-center justify-center rounded-full transition-all cursor-pointer border-0 bg-transparent"
          style={{
            background: activeDir === "right" ? "rgba(0,0,0,0.08)" : "transparent",
          }}
          onPointerDown={() => setActiveDir("right")}
          onPointerUp={() => setActiveDir(null)}
          onPointerLeave={() => setActiveDir(null)}
          aria-label="Forward"
        >
          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
            <path d="M1 1L6 5L1 9" stroke="#555" strokeWidth="1.3" fill="none" />
            <path d="M6 1L11 5L6 9" stroke="#555" strokeWidth="1.3" fill="none" />
          </svg>
        </button>
      </div>

      {/* Center play/enter button */}
      <button
        className="absolute rounded-full flex items-center justify-center cursor-pointer transition-all border-0"
        style={{
          width: "40px",
          height: "40px",
          background: centerPressed
            ? "linear-gradient(145deg, #b0b0b0, #d0d0d0)"
            : "linear-gradient(145deg, #d8d8d8, #b0b0b0)",
          boxShadow: centerPressed
            ? "inset 0 2px 4px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.1)"
            : "0 2px 4px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.4)",
        }}
        onPointerDown={() => setCenterPressed(true)}
        onPointerUp={() => setCenterPressed(false)}
        onPointerLeave={() => setCenterPressed(false)}
        aria-label="Play / Enter"
      >
        <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
          {/* Play triangle */}
          <path d="M3 3L8 7L3 11V3Z" fill="#666" />
          {/* Pause bars */}
          <rect x="10" y="3" width="2" height="8" rx="0.5" fill="#666" />
          <rect x="13" y="3" width="2" height="8" rx="0.5" fill="#666" />
        </svg>
      </button>
    </div>
  )
}
