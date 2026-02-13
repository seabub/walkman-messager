"use client"

import { useState } from "react"
import { WalkmanScreen } from "./walkman-screen"
import { WalkmanWheel } from "./walkman-wheel"
import { WalkmanSideControls } from "./walkman-side-controls"

function MetalButton({
  label,
  position,
  ariaLabel,
}: {
  label: string
  position: "tl" | "tr" | "bl" | "br"
  ariaLabel: string
}) {
  const [pressed, setPressed] = useState(false)

  return (
    <div
      className="flex flex-col items-center gap-[3px]"
      style={{
        alignSelf:
          position === "tl" || position === "bl" ? "flex-start" : "flex-end",
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
        onPointerUp={() => setPressed(false)}
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

export function Walkman() {
  return (
    <div className="relative flex" role="img" aria-label="Sony Hi-MD Walkman MZ-DH10P digital recreation">
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
        {/* Left dark panel (screen + controls area) */}
        <div
          className="relative flex flex-col"
          style={{
            width: "210px",
            height: "100%",
            background: "linear-gradient(180deg, #5a5a60 0%, #48484e 20%, #3e3e44 50%, #48484e 80%, #5a5a60 100%)",
            borderRight: "1px solid rgba(0,0,0,0.15)",
          }}
        >
          {/* Brushed gunmetal texture overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)",
            }}
          />

          {/* Screen area */}
          <div className="relative px-4 pt-5">
            <div
              className="relative rounded-[4px] overflow-hidden"
              style={{
                boxShadow:
                  "inset 0 2px 6px rgba(0,0,0,0.6), inset 0 -1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              <WalkmanScreen />
            </div>
          </div>

          {/* Button labels row (top): CANCEL and MENU */}
          <div className="flex justify-between items-end px-4 mt-3">
            <div className="flex items-center gap-[3px]">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <rect width="6" height="6" fill="#777" rx="1" />
              </svg>
              <span className="text-[6.5px] font-semibold tracking-[0.08em] text-[#999] select-none">/CANCEL</span>
            </div>
            <span className="text-[6.5px] font-semibold tracking-[0.08em] text-[#999] select-none">MENU</span>
          </div>

          {/* Controls area: buttons + wheel */}
          <div className="flex-1 flex flex-col items-center px-3 mt-1">
            {/* Top row buttons */}
            <div className="flex w-full justify-between items-start px-1">
              <MetalButton label="CHG" position="tl" ariaLabel="Charge" />
              <MetalButton label="OPR" position="tr" ariaLabel="Operate" />
            </div>

            {/* Navigation wheel */}
            <div className="my-1">
              <WalkmanWheel />
            </div>

            {/* Bottom row buttons */}
            <div className="flex w-full justify-between items-end px-1">
              <MetalButton label="SLIDESHOW" position="bl" ariaLabel="Slideshow" />
              <MetalButton label="DISPLAY" position="br" ariaLabel="Display" />
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
          {/* Brushed aluminum horizontal grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.06) 1px, rgba(255,255,255,0.06) 2px)",
              opacity: 0.8,
            }}
          />
          {/* Specular highlight across the top */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.05) 100%)",
            }}
          />

          {/* SONY logo */}
          <div className="relative mt-6 mr-4 flex justify-end">
            <span
              className="text-[26px] font-bold tracking-[0.08em] select-none"
              style={{
                color: "transparent",
                backgroundImage: "linear-gradient(180deg, #9a9a9e 0%, #78787c 40%, #88888c 60%, #a0a0a4 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                textShadow: "none",
                filter: "drop-shadow(0 1px 0 rgba(255,255,255,0.3)) drop-shadow(0 -0.5px 0 rgba(0,0,0,0.2))",
                fontFamily: "Arial, Helvetica, sans-serif",
                fontStretch: "condensed",
              }}
            >
              SONY
            </span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Hi-MD Audio badge */}
          <div className="relative mr-4 mb-2 flex justify-end">
            <div
              className="flex items-center gap-[3px] px-[6px] py-[4px] rounded-[3px]"
              style={{
                background: "linear-gradient(180deg, #2288cc 0%, #1166aa 50%, #0055a0 100%)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.3), inset 0 0.5px 0 rgba(255,255,255,0.2)",
              }}
            >
              <span
                className="text-[7px] font-extrabold tracking-[0.02em] text-white leading-none select-none"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                Hi-MD
              </span>
              <div className="w-[0.5px] h-[8px] bg-white/40" />
              <span
                className="text-[5px] font-bold tracking-[0.06em] text-white leading-none select-none uppercase"
                style={{ fontFamily: "Arial, sans-serif" }}
              >
                AUDIO
              </span>
            </div>
          </div>

          {/* Walkman logo + model */}
          <div className="relative mr-4 mb-5 flex flex-col items-end gap-[2px]">
            {/* Walkman W icon + text */}
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
              <span
                className="text-[8px] font-semibold tracking-[0.15em] select-none"
                style={{
                  color: "#888",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                WALKMAN
              </span>
            </div>
            <span
              className="text-[6px] font-medium tracking-[0.06em] select-none"
              style={{ color: "#888", fontFamily: "Arial, sans-serif" }}
            >
              HI-MD WALKMAN MZ-DH10P
            </span>
          </div>
        </div>
      </div>

      {/* Right-side edge panel */}
      <WalkmanSideControls />
    </div>
  )
}
