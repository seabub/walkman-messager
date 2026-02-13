"use client"

interface WalkmanBackPanelProps {
  secretMessage: string
  senderName: string
  discLabel: string
}

export function WalkmanBackPanel({ secretMessage, senderName, discLabel }: WalkmanBackPanelProps) {
  return (
    <div
      className="relative flex"
      style={{
        width: "386px",
        height: "360px",
        borderRadius: "12px 6px 6px 12px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)",
        /* Mirrored so when the parent is rotateY(180), the text is correct */
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

        {/* Cyber-Sticker / Industrial Warranty Label */}
        <div className="relative flex-1 flex items-center justify-center p-6">
          <div
            className="relative max-w-[300px] w-full p-5"
            style={{
              /* Brushed silver foil texture */
              background: "linear-gradient(135deg, #e8e8e8 0%, #ffffff 25%, #d4d4d4 50%, #f0f0f0 75%, #c8c8c8 100%)",
              boxShadow: "3px 4px 12px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
              /* Double border: outer black, inner red */
              border: "2px solid #000",
              outline: "1px solid #CC0000",
              outlineOffset: "-4px",
              transform: "rotate(-0.8deg)",
            }}
          >
            {/* Metallic shine effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.15) 2px, rgba(255,255,255,0.15) 4px)",
                opacity: 0.6,
              }}
            />

            {/* Header: Disc Label */}
            <div className="relative mb-4 pb-3" style={{ borderBottom: "2px solid #000" }}>
              <div className="flex items-center justify-between">
                <span
                  className="text-[9px] font-bold tracking-[0.15em] text-[#000] uppercase"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  QUALITY ASSURANCE
                </span>
                <span
                  className="text-[8px] font-mono text-[#444] tracking-wider"
                  style={{ fontFamily: "'Courier New', monospace" }}
                >
                  MZ-DH10P
                </span>
              </div>
              <div className="mt-2">
                <span
                  className="text-[10px] font-semibold text-[#222] tracking-[0.03em]"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  DISC: {discLabel}
                </span>
              </div>
            </div>

            {/* Message body - Handwritten style */}
            <div className="relative mb-4">
              <p
                className="text-[16px] leading-[1.7] text-[#1a3a6e] whitespace-pre-wrap break-words"
                style={{
                  fontFamily: "'Caveat', cursive",
                  transform: "rotate(-0.3deg)",
                }}
              >
                {secretMessage || "This disc contains carefully curated audio memories. Handle with care."}
              </p>
            </div>

            {/* Signature */}
            <div className="relative flex items-end justify-between mt-4 pt-3" style={{ borderTop: "1px dashed rgba(0,0,0,0.2)" }}>
              <div>
                <div className="text-[8px] font-semibold text-[#000] tracking-[0.08em] uppercase mb-1" style={{ fontFamily: "Arial, sans-serif" }}>
                  FROM:
                </div>
                <span
                  className="text-[16px] text-[#1a3a6e]"
                  style={{
                    fontFamily: "'Caveat', cursive",
                    transform: "rotate(-0.5deg)",
                    display: "inline-block",
                  }}
                >
                  {senderName}
                </span>
              </div>

              {/* QC Stamp */}
              <div
                className="relative"
                style={{
                  width: "60px",
                  height: "60px",
                  border: "2px solid #CC0000",
                  borderRadius: "50%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  transform: "rotate(12deg)",
                  opacity: 0.85,
                }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "1px solid #CC0000",
                    margin: "3px",
                  }}
                />
                <span
                  className="text-[7px] font-black tracking-[0.08em] text-[#CC0000] leading-none"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  PROPERTY
                </span>
                <span
                  className="text-[6px] font-black tracking-[0.06em] text-[#CC0000] leading-none mt-[2px]"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  OF
                </span>
                <span
                  className="text-[8px] font-black tracking-[0.05em] text-[#CC0000] leading-none mt-[2px] max-w-[50px] text-center truncate px-1"
                  style={{ fontFamily: "Arial, sans-serif" }}
                >
                  {senderName.toUpperCase().substring(0, 8)}
                </span>
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
    </div>
  )
}
