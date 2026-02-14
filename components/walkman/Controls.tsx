"use client"

import { useState } from "react"
import { WalkmanWheel } from "./walkman-wheel"

interface ControlsProps {
  onPlayPause: () => void
  onSeekLeft: () => void
  onSeekRight: () => void
  onPrevTrack: () => void
  onNextTrack: () => void
  onToggleFlip: () => void
  onOpenPlaylist?: () => void
}

function MetalButton({
  label,
  position,
  ariaLabel,
  onClick,
  variant = "default",
}: {
  label: string
  position: "tl" | "tr" | "bl" | "br"
  ariaLabel: string
  onClick?: () => void
  variant?: "default" | "white" | "red"
}) {
  const [pressed, setPressed] = useState(false)
  const isWhite = variant === "white"
  const isRed = variant === "red"
  const bgGradient = isRed
    ? pressed
      ? "radial-gradient(circle at 40% 35%, #e04040, #b02020)"
      : "radial-gradient(circle at 35% 30%, #ff5050, #ee3030 40%, #cc2020 90%)"
    : isWhite
      ? pressed
        ? "radial-gradient(circle at 40% 35%, #d8d8dc, #b8b8bc)"
        : "radial-gradient(circle at 35% 30%, #f8f8f8, #e8e8e8 40%, #d8d8d8 90%)"
      : pressed
        ? "radial-gradient(circle at 40% 35%, #a0a0a4, #707074)"
        : "radial-gradient(circle at 35% 30%, #b0b0b4, #909094 40%, #707074 90%)"

  const buttonShadow = isRed
    ? pressed
      ? "inset 0 1px 3px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.2), 0 0 8px rgba(255,60,60,0.4)"
      : "0 2px 4px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.4), 0 0 12px rgba(255,80,80,0.7), 0 0 20px rgba(255,50,50,0.4)"
    : pressed
      ? "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.2)"
      : "0 2px 4px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.5)"

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
          background: bgGradient,
          boxShadow: buttonShadow,
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
        <span
          className="text-[6.5px] font-semibold tracking-[0.12em] uppercase select-none leading-none"
          style={{ color: isRed ? "#c02020" : "#666" }}
        >
          {label}
        </span>
      )}
    </div>
  )
}

export function Controls({
  onPlayPause,
  onSeekLeft,
  onSeekRight,
  onPrevTrack,
  onNextTrack,
  onToggleFlip,
  onOpenPlaylist,
}: ControlsProps) {
  return (
    <div className="flex-1 flex flex-col items-center px-3 mt-1">
      <div className="flex w-full justify-between items-start px-1">
        <MetalButton label="CHG" position="tl" ariaLabel="Charge" />
        <MetalButton label="OPR" position="tr" ariaLabel="Operate" onClick={onOpenPlaylist} />
      </div>

      <div className="my-1">
        <WalkmanWheel
          onPlayPause={onPlayPause}
          onSeekLeft={onSeekLeft}
          onSeekRight={onSeekRight}
          onPrevTrack={onPrevTrack}
          onNextTrack={onNextTrack}
        />
      </div>

      <div className="flex w-full justify-between items-end px-1">
        <MetalButton label="SLIDESHOW" position="bl" ariaLabel="Slideshow" />
        <MetalButton label="DISPLAY" position="br" ariaLabel="Display - flip device" onClick={onToggleFlip} variant="red" />
      </div>
    </div>
  )
}

