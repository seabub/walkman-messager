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

        {/* Taped note */}
        <div className="relative flex-1 flex items-center justify-center p-6">
          {/* The note itself */}
          <div
            className="relative max-w-[300px] w-full p-5"
            style={{
              background: "linear-gradient(135deg, #fef9e7 0%, #fdf6d8 30%, #fcf3c8 100%)",
              boxShadow: "2px 3px 10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
              transform: "rotate(-1.5deg)",
            }}
          >
            {/* Tape strips */}
            <div
              className="absolute -top-[8px] left-1/2 -translate-x-1/2 w-[60px] h-[16px]"
              style={{
                background: "linear-gradient(180deg, rgba(200,200,180,0.7) 0%, rgba(180,180,160,0.5) 100%)",
                backdropFilter: "blur(1px)",
              }}
            />
            <div
              className="absolute -bottom-[6px] right-[30px] w-[40px] h-[14px]"
              style={{
                background: "linear-gradient(180deg, rgba(200,200,180,0.6) 0%, rgba(180,180,160,0.4) 100%)",
                transform: "rotate(3deg)",
              }}
            />

            {/* Disc label at top */}
            <div className="mb-3 pb-2" style={{ borderBottom: "1px dashed rgba(0,0,0,0.15)" }}>
              <span
                className="text-[11px] tracking-[0.05em] text-[#888]"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                re: {discLabel}
              </span>
            </div>

            {/* Message body */}
            <p
              className="text-[15px] leading-[1.6] text-[#333] whitespace-pre-wrap break-words"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              {secretMessage || "No secret message was left on this disc."}
            </p>

            {/* Signature */}
            <div className="mt-4 pt-2 flex justify-end" style={{ borderTop: "1px dashed rgba(0,0,0,0.1)" }}>
              <span
                className="text-[14px] text-[#555]"
                style={{ fontFamily: "'Caveat', cursive" }}
              >
                - {senderName}
              </span>
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
