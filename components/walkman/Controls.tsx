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
        <MetalButton label="DISPLAY" position="br" ariaLabel="Display - flip device" onClick={onToggleFlip} />
      </div>
    </div>
  )
}

