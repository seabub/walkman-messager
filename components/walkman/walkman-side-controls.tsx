"use client"

import { useState } from "react"

export function WalkmanSideControls() {
  const [holdActive, setHoldActive] = useState(false)

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
        <span className="text-[5px] font-bold tracking-[0.15em] text-[#888] uppercase select-none">
          HOLD
        </span>
        <button
          className="relative w-[14px] h-[22px] rounded-[3px] cursor-pointer border-0"
          style={{
            background: "linear-gradient(180deg, #4a4a4a 0%, #333 50%, #4a4a4a 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.4), inset 0 0 1px rgba(255,255,255,0.1)",
          }}
          onClick={() => setHoldActive(!holdActive)}
          aria-label="Hold switch"
        >
          <div
            className="absolute w-[10px] h-[9px] rounded-[2px] left-[2px] transition-all"
            style={{
              top: holdActive ? "11px" : "2px",
              background: "linear-gradient(180deg, #666 0%, #555 100%)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
            }}
          >
            {/* Grip lines */}
            <div className="flex flex-col items-center justify-center h-full gap-[1.5px]">
              <div className="w-[6px] h-[0.5px] bg-[#444] rounded-full" />
              <div className="w-[6px] h-[0.5px] bg-[#444] rounded-full" />
              <div className="w-[6px] h-[0.5px] bg-[#444] rounded-full" />
            </div>
          </div>
        </button>
      </div>

      {/* DOWNLOAD port */}
      <div className="flex flex-col items-center gap-[2px]">
        <div
          className="w-[16px] h-[8px] rounded-[2px]"
          style={{
            background: "linear-gradient(180deg, #222 0%, #1a1a1a 50%, #2a2a2a 100%)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.05)",
          }}
        />
        <span className="text-[4.5px] font-bold tracking-[0.08em] text-[#777] uppercase select-none leading-none"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", letterSpacing: "0.08em" }}
        >
          DOWNLOAD
        </span>
      </div>

      {/* VOL rocker */}
      <div className="flex flex-col items-center gap-[2px]">
        <span className="text-[5px] font-bold tracking-[0.15em] text-[#888] uppercase select-none">
          VOL
        </span>
        <div
          className="relative w-[14px] h-[30px] rounded-[3px] overflow-hidden"
          style={{
            background: "linear-gradient(180deg, #4a4a4a 0%, #333 50%, #4a4a4a 100%)",
            boxShadow: "0 1px 2px rgba(0,0,0,0.4), inset 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          {/* Divider */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#222]" />
          {/* + area */}
          <button
            className="absolute top-0 left-0 w-full h-1/2 flex items-center justify-center cursor-pointer border-0 bg-transparent hover:bg-white/5 active:bg-black/10 transition-colors"
            aria-label="Volume up"
          >
            <span className="text-[7px] text-[#999] font-bold leading-none select-none">+</span>
          </button>
          {/* - area */}
          <button
            className="absolute bottom-0 left-0 w-full h-1/2 flex items-center justify-center cursor-pointer border-0 bg-transparent hover:bg-white/5 active:bg-black/10 transition-colors"
            aria-label="Volume down"
          >
            <span className="text-[7px] text-[#999] font-bold leading-none select-none">-</span>
          </button>
        </div>
      </div>
    </div>
  )
}
