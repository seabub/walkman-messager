"use client"

import { useState } from "react"

interface WalkmanBackPanelProps {
  secretMessage: string
  senderName: string
  discLabel: string
  onFlipToFront?: () => void
}

function BackPanelMetalButton({ onFlipToFront }: { onFlipToFront: () => void }) {
  const [pressed, setPressed] = useState(false)
  return (
    <div className="absolute bottom-4 right-4 left-4 flex flex-col items-center justify-center pointer-events-auto gap-[3px]" style={{ transform: "scaleX(-1)" }}>
      <button
        type="button"
        onClick={onFlipToFront}
        className="w-[16px] h-[16px] rounded-full cursor-pointer border-0 transition-transform"
        style={{
          background: pressed
            ? "radial-gradient(circle at 40% 35%, #a0a0a4, #707074)"
            : "radial-gradient(circle at 35% 30%, #b0b0b4, #909094 40%, #707074 90%)",
          boxShadow: pressed
            ? "inset 0 1px 3px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(0,0,0,0.2)"
            : "0 2px 4px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.5)",
          transform: pressed ? "scale(0.95)" : "scale(1)",
        }}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
        aria-label="Flip to front"
      />
      <span className="text-[6.5px] font-semibold tracking-[0.12em] text-[#666] uppercase select-none leading-none" style={{ fontFamily: "Arial, sans-serif" }}>
        FLIP
      </span>
    </div>
  )
}

export function WalkmanBackPanel({ secretMessage, senderName, discLabel, onFlipToFront }: WalkmanBackPanelProps) {
  return (
    <div
      className="relative flex"
      style={{
        width: "386px",
        height: "360px",
        borderRadius: "12px 6px 6px 12px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
        /* Mirrored so when the parent is rotateY(180), the layout is correct */
        transform: "scaleX(-1)",
      }}
    >
      {/* Aluminum back body */}
      <div
        className="relative w-full h-full flex flex-col"
        style={{
          background: "linear-gradient(135deg, #c8c8cc 0%, #b8b8bc 20%, #c4c4c8 40%, #b0b0b4 60%, #bcbcc0 80%, #c8c8cc 100%)",
        }}
      >
        {/* Brushed aluminum texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,0.04) 1px, rgba(255,255,255,0.04) 2px)",
            opacity: 0.9,
          }}
        />

        {/* Specular highlight */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.06) 100%)",
          }}
        />

        {/* Inner content: scaleX(-1) so text reads correctly (outer scaleX(-1) × inner scaleX(-1) = scaleX(1)) */}
        <div className="relative flex-1 flex flex-col w-full" style={{ transform: "scaleX(-1)" }}>
        {/* Back content: grey aluminium with letter, envelope, stamp – portrait 9:16, almost full */}
        <div
          className="relative flex-1 flex items-center justify-center p-3 min-h-0"
          style={{
            background: "linear-gradient(135deg, #c8c8cc 0%, #b8b8bc 20%, #c4c4c8 40%, #b0b0b4 60%, #bcbcc0 80%, #c8c8cc 100%)",
          }}
        >
          {/* Portrait 9:16 content area – fills most of back */}
          <div
            className="relative w-full h-full max-w-[220px] max-h-[320px]"
            style={{ aspectRatio: "9/16" }}
          >
            {/* Envelope – white, paper texture, landscape, diagonal & offset so not directly behind letter */}
            <div
              className="absolute overflow-visible z-0"
              style={{
                left: "32%",
                top: "48%",
                width: "240px",
                height: "140px",
                transform: "translate(-50%, -50%) rotate(-18deg)",
                filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.15))",
              }}
            >
              <div className="relative w-full h-full rounded-sm">
                {/* White envelope body */}
                <div
                  className="absolute inset-0 rounded-sm"
                  style={{
                    background: "linear-gradient(180deg, #ffffff 0%, #fafafa 50%, #f5f5f5 100%)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px rgba(0,0,0,0.06)",
                  }}
                />
                {/* Paper texture overlay */}
                <div
                  className="absolute inset-0 rounded-sm pointer-events-none opacity-[0.4]"
                  style={{
                    backgroundImage: `
                      repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.015) 1px, rgba(0,0,0,0.015) 2px),
                      repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(0,0,0,0.02) 1px, rgba(0,0,0,0.02) 2px)
                    `,
                  }}
                />
                {/* Sealed flap – white trapezoid */}
                <div
                  className="absolute left-0 right-0 top-0 overflow-hidden rounded-t-sm"
                  style={{ height: "38%" }}
                >
                  <div
                    className="absolute left-0 right-0 top-0 w-full"
                    style={{
                      height: "100%",
                      background: "linear-gradient(180deg, #ffffff 0%, #f8f8f8 50%, #f0f0f0 100%)",
                      clipPath: "polygon(0 0, 100% 0, 96% 100%, 4% 100%)",
                      boxShadow: "inset 0 2px 0 rgba(255,255,255,0.8), 0 4px 8px rgba(0,0,0,0.06)",
                    }}
                  />
                  <div
                    className="absolute left-[4%] right-[4%] bottom-0 h-[8px]"
                    style={{
                      background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.06) 100%)",
                    }}
                  />
                </div>
                <div
                  className="absolute left-0 top-0 bottom-0 w-[4px] rounded-l-sm"
                  style={{
                    background: "linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 100%)",
                  }}
                />
              </div>
            </div>

            {/* Letter – white, paper texture, portrait, in front of envelope; shifted right more, diagonal to the right */}
            <div
              className="absolute left-[30%] top-[8%] right-[-10%] bottom-[8%] z-10 rounded-[3px] p-5 shadow-lg flex flex-col"
              style={{
                background: "linear-gradient(180deg, #ffffff 0%, #fcfcfc 50%, #f8f8f8 100%)",
                boxShadow: "4px 6px 20px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06)",
                transform: "rotate(8deg)",
              }}
            >
              {/* Paper texture */}
              <div
                className="absolute inset-0 rounded-[3px] pointer-events-none opacity-[0.35]"
                style={{
                  backgroundImage: `
                    repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.018) 1px, rgba(0,0,0,0.018) 2px),
                    repeating-linear-gradient(90deg, transparent 0px, transparent 1px, rgba(0,0,0,0.022) 1px, rgba(0,0,0,0.022) 2px)
                  `,
                }}
              />
              <p
                className="text-[15px] leading-[1.6] text-[#2a2a2a] whitespace-pre-wrap break-words flex-1 relative z-10"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                {secretMessage || "This disc contains carefully curated audio memories. Handle with care."}
              </p>
              <p className="text-[16px] text-[#1a3a6e] mt-4 relative z-10" style={{ fontFamily: "'Caveat', cursive" }}>
                From, {senderName}
              </p>
            </div>

            {/* Stamp – Japanese style, larger, on top */}
            <div
              className="absolute right-[4%] bottom-[10%] overflow-hidden z-20"
              style={{
                width: "64px",
                height: "90px",
                transform: "rotate(10deg)",
                background: "#d8e8d8",
                border: "2px dashed rgba(255,255,255,0.9)",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.08), inset 0 0 8px rgba(0,0,0,0.04)",
              }}
            >
              {/* Simplified floral motif: pink flowers + green leaves */}
              <div className="absolute inset-0 flex items-center justify-center p-1">
                <div className="relative w-full h-full">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-pink-300/90" />
                  <div className="absolute left-[30%] top-[35%] w-3 h-3 rounded-full bg-pink-400/90" />
                  <div className="absolute right-[28%] top-[40%] w-3 h-3 rounded-full bg-pink-300/90" />
                  <div className="absolute left-[35%] bottom-[32%] w-2 h-2 rounded-full bg-green-600/80" />
                  <div className="absolute right-[35%] bottom-[35%] w-2 h-2 rounded-full bg-green-700/80" />
                  <div className="absolute left-[20%] top-[55%] w-3 h-1 rounded-full bg-green-600/70 -rotate-45" />
                  <div className="absolute right-[22%] top-[52%] w-3 h-1 rounded-full bg-green-600/70 rotate-45" />
                </div>
              </div>
              {/* Text – dark blue */}
              <div className="absolute right-1.5 top-1.5 text-right leading-none" style={{ color: "#1a237e", fontFamily: "Arial, sans-serif" }}>
                <span className="text-[8px] font-semibold uppercase">NIPPON</span>
                <br />
                <span className="text-[16px] font-bold">50</span>
              </div>
              <div className="absolute left-1.5 bottom-[28px] text-[8px] leading-tight" style={{ color: "#1a237e", fontFamily: "sans-serif" }}>
                ツツジ・東京都
              </div>
              <div className="absolute right-1.5 bottom-1.5 text-[8px] leading-tight" style={{ color: "#1a237e", fontFamily: "sans-serif" }}>
                日本郵便
              </div>
            </div>
          </div>
        </div>

        {/* Bottom engravings */}
        <div className="relative flex items-center justify-between px-4 pb-3">
          <span className="text-[6px] font-medium tracking-[0.06em] text-[#999] select-none" style={{ fontFamily: "Arial, sans-serif" }}>
            MADE IN JAPAN
          </span>
          <span className="text-[6px] font-medium tracking-[0.06em] text-[#999] select-none" style={{ fontFamily: "Arial, sans-serif" }}>
            MODEL MZ-DH10P
          </span>
        </div>
        </div>

        {/* Flip to front – metal button like front DISPLAY (scaleX(-1) so label reads correctly) */}
        {onFlipToFront && (
          <BackPanelMetalButton onFlipToFront={onFlipToFront} />
        )}
      </div>
    </div>
  )
}
