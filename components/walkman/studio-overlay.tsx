"use client"

import { useState, useCallback } from "react"
import { extractYouTubeId, type WalkmanDisc } from "@/hooks/use-walkman-logic"

interface StudioOverlayProps {
  onBurn: (disc: WalkmanDisc) => void
}

const macFont = "'Geneva', 'Chicago', 'Charcoal', 'Lucida Grande', 'Helvetica Neue', sans-serif"

function PlatinumInput({
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  maxLength?: number
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="flex-1 px-[6px] py-[4px] text-[11px] text-[#000] bg-white outline-none"
      style={{
        fontFamily: macFont,
        border: "1px solid #999",
        boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.2)",
        borderRadius: "0px",
      }}
    />
  )
}

function PlatinumButton({
  children,
  onClick,
  disabled,
  primary,
  small,
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  primary?: boolean
  small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:brightness-90"
      style={{
        fontFamily: macFont,
        fontSize: small ? "10px" : "11px",
        fontWeight: 600,
        color: "#000",
        padding: small ? "2px 10px" : "4px 18px",
        borderRadius: "4px",
        border: "1px solid #888",
        background: "linear-gradient(180deg, #FAFAFA 0%, #E0E0E0 45%, #C8C8C8 55%, #D8D8D8 100%)",
        boxShadow: primary
          ? "0 0 0 2px #000, inset 0 1px 0 rgba(255,255,255,0.5)"
          : "0 1px 2px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
      }}
    >
      {children}
    </button>
  )
}

export function StudioOverlay({ onBurn }: StudioOverlayProps) {
  const [trackInput, setTrackInput] = useState("")
  const [playlist, setPlaylist] = useState<string[]>([])
  const [photoInput, setPhotoInput] = useState("")
  const [photos, setPhotos] = useState<string[]>([])
  const [title, setTitle] = useState("")
  const [sender, setSender] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isBurning, setIsBurning] = useState(false)
  const [burnProgress, setBurnProgress] = useState(0)

  const addTrack = useCallback(() => {
    setError("")
    const videoId = extractYouTubeId(trackInput.trim())
    if (!videoId) {
      setError("Invalid YouTube URL.")
      return
    }
    if (playlist.length >= 10) {
      setError("Maximum 10 tracks per disc.")
      return
    }
    if (playlist.includes(videoId)) {
      setError("Track already added.")
      return
    }
    setPlaylist((prev) => [...prev, videoId])
    setTrackInput("")
  }, [trackInput, playlist])

  const addPhoto = useCallback(() => {
    setError("")
    const url = photoInput.trim()
    if (!url) {
      setError("Enter an image URL.")
      return
    }
    if (photos.length >= 12) {
      setError("Maximum 12 photos per desk.")
      return
    }
    if (photos.includes(url)) {
      setError("Photo already added.")
      return
    }
    setPhotos((prev) => [...prev, url])
    setPhotoInput("")
  }, [photoInput, photos])

  const removeTrack = useCallback((index: number) => {
    setPlaylist((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleBurn = useCallback(() => {
    setError("")
    if (playlist.length === 0) {
      setError("Add at least one track.")
      return
    }
    if (!title.trim()) {
      setError("Please enter a disc label.")
      return
    }

    setIsBurning(true)
    setBurnProgress(0)

    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 5
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setBurnProgress(100)
        setTimeout(() => {
          onBurn({
            playlist,
            photos,
            message: message.trim(),
            meta: {
              title: title.trim(),
              sender: sender.trim() || "Anonymous",
              message: message.trim(),
            },
          })
        }, 400)
      }
      setBurnProgress(Math.min(100, Math.floor(progress)))
    }, 180)
  }, [playlist, photos, title, sender, message, onBurn])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-[440px] flex flex-col overflow-hidden select-none"
        style={{
          background: "#DDDDDD",
          border: "1px solid #999",
          borderRadius: "6px",
          boxShadow: "1px 2px 8px rgba(0,0,0,0.4), inset 0 0 0 1px #F0F0F0",
        }}
      >
        {/* Title bar - Platinum horizontal pinstripes */}
        <div
          className="relative flex items-center px-[8px] py-[3px]"
          style={{
            height: "22px",
            background: `repeating-linear-gradient(
              180deg,
              #E8E8E8 0px,
              #E8E8E8 1px,
              #D0D0D0 1px,
              #D0D0D0 2px
            )`,
            borderBottom: "1px solid #AAA",
            borderRadius: "5px 5px 0 0",
          }}
        >
          <button
            className="relative w-[11px] h-[11px] flex-shrink-0 border-0 cursor-pointer"
            aria-label="Close"
            style={{
              background: "linear-gradient(180deg, #F0F0F0 0%, #D8D8D8 50%, #C0C0C0 100%)",
              border: "1px solid #888",
              borderRadius: "1px",
            }}
          />
          <span
            className="flex-1 text-center text-[11px] font-bold text-[#000] leading-none truncate px-3"
            style={{ fontFamily: macFont }}
          >
            Mixtape Wizard
          </span>
          <div className="w-[11px] h-[11px] flex-shrink-0" />
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-3" style={{ fontFamily: macFont }}>
          {/* Playlist Section */}
          <div
            className="flex flex-col gap-[6px] p-3 pt-4 relative"
            style={{ border: "1px solid #AAA", background: "#DDDDDD" }}
          >
            <span
              className="absolute -top-[7px] left-[10px] bg-[#DDDDDD] px-[4px] text-[10px] font-bold text-[#333]"
              style={{ fontFamily: macFont }}
            >
              Playlist ({playlist.length}/10)
            </span>

            {/* Add track input */}
            <div className="flex items-center gap-[6px]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <rect width="24" height="24" rx="4" fill="#FF0000" />
                <path d="M9.5 7.5V16.5L17 12L9.5 7.5Z" fill="white" />
              </svg>
              <PlatinumInput
                value={trackInput}
                onChange={setTrackInput}
                placeholder="https://youtube.com/watch?v=..."
              />
              <PlatinumButton small onClick={addTrack} disabled={isBurning}>
                Add
              </PlatinumButton>
            </div>

            {/* Track list */}
            {playlist.length > 0 && (
              <div
                className="flex flex-col gap-[2px] max-h-[120px] overflow-y-auto mt-1"
                style={{
                  border: "1px solid #BBB",
                  background: "#FFF",
                  boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {playlist.map((id, i) => (
                  <div
                    key={`${id}-${i}`}
                    className="flex items-center gap-[6px] px-[6px] py-[3px]"
                    style={{
                      background: i % 2 === 0 ? "#FFF" : "#F4F4F4",
                      borderBottom: "1px solid #EEE",
                    }}
                  >
                    <span className="text-[10px] text-[#666] w-[16px] text-right flex-shrink-0" style={{ fontFamily: macFont }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#000] flex-1 truncate font-mono">{id}</span>
                    {!isBurning && (
                      <button
                        onClick={() => removeTrack(i)}
                        className="text-[10px] text-[#999] hover:text-[#CC0000] cursor-pointer border-0 bg-transparent px-[3px] leading-none"
                        style={{ fontFamily: macFont }}
                        aria-label={`Remove track ${i + 1}`}
                      >
                        x
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Photos Section */}
          <div
            className="flex flex-col gap-[6px] p-3 pt-4 relative"
            style={{ border: "1px solid #AAA", background: "#DDDDDD" }}
          >
            <span
              className="absolute -top-[7px] left-[10px] bg-[#DDDDDD] px-[4px] text-[10px] font-bold text-[#333]"
              style={{ fontFamily: macFont }}
            >
              Photos ({photos.length}/12)
            </span>

            <div className="flex items-center gap-[6px]">
              <PlatinumInput
                value={photoInput}
                onChange={setPhotoInput}
                placeholder="https://example.com/photo.jpg"
              />
              <PlatinumButton small onClick={addPhoto} disabled={isBurning}>
                Add
              </PlatinumButton>
            </div>

            {photos.length > 0 && (
              <div
                className="grid grid-cols-2 gap-[4px] max-h-[120px] overflow-y-auto mt-1"
                style={{
                  border: "1px solid #BBB",
                  background: "#FFF",
                  boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                {photos.map((url, i) => (
                  <div
                    key={`${url}-${i}`}
                    className="flex items-center gap-[4px] px-[4px] py-[3px]"
                    style={{
                      background: i % 2 === 0 ? "#FFF" : "#F4F4F4",
                      borderBottom: "1px solid #EEE",
                    }}
                  >
                    <div
                      className="w-[26px] h-[22px] flex-shrink-0 bg-[#ddd] border border-[#aaa]"
                      style={{
                        boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
                      }}
                    />
                    <span className="text-[9px] text-[#000] flex-1 truncate" style={{ fontFamily: macFont }}>
                      {url}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Disc Properties */}
          <div
            className="flex flex-col gap-[8px] p-3 pt-4 relative"
            style={{ border: "1px solid #AAA", background: "#DDDDDD" }}
          >
            <span
              className="absolute -top-[7px] left-[10px] bg-[#DDDDDD] px-[4px] text-[10px] font-bold text-[#333]"
              style={{ fontFamily: macFont }}
            >
              Disc Properties
            </span>
            <div className="flex items-center gap-[8px]">
              <label className="text-[10px] text-[#333] w-[58px] text-right flex-shrink-0 font-semibold" style={{ fontFamily: macFont }}>
                Disc Label:
              </label>
              <PlatinumInput value={title} onChange={setTitle} placeholder="Summer Mixtape" maxLength={60} />
            </div>
            <div className="flex items-center gap-[8px]">
              <label className="text-[10px] text-[#333] w-[58px] text-right flex-shrink-0 font-semibold" style={{ fontFamily: macFont }}>
                From:
              </label>
              <PlatinumInput value={sender} onChange={setSender} placeholder="Your Name" maxLength={40} />
            </div>
          </div>

          {/* Sticky note message */}
          <div
            className="flex flex-col gap-[6px] p-3 pt-4 relative"
            style={{ border: "1px solid #AAA", background: "#DDDDDD" }}
          >
            <span
              className="absolute -top-[7px] left-[10px] bg-[#DDDDDD] px-[4px] text-[10px] font-bold text-[#333]"
              style={{ fontFamily: macFont }}
            >
              Sticky note (on the desk)
            </span>
            <textarea
              value={message}
              onChange={(e) => {
                const value = e.target.value
                if (value.length <= 300) {
                  setMessage(value)
                }
              }}
              placeholder="Write a note for the desk..."
              rows={6}
              maxLength={300}
              className="w-full px-[6px] py-[4px] text-[11px] text-[#000] bg-white outline-none resize-none"
              style={{
                fontFamily: macFont,
                border: "1px solid #999",
                boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.2)",
                borderRadius: "0px",
              }}
            />
            <div className="text-right text-[9px] text-[#888]" style={{ fontFamily: macFont }}>
              {message.length}/300
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-[6px] px-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                <polygon points="8,0 16,8 8,16 0,8" fill="#FF4444" stroke="#880000" strokeWidth="0.5" />
                <text x="8" y="11.5" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">!</text>
              </svg>
              <span className="text-[10px] text-[#990000]" style={{ fontFamily: macFont }}>{error}</span>
            </div>
          )}

          {/* Progress bar */}
          {isBurning && (
            <div className="flex flex-col gap-[4px] px-1">
              <span className="text-[10px] text-[#333]" style={{ fontFamily: macFont }}>
                {burnProgress < 100 ? `Writing ${playlist.length} track(s) to disc... ${burnProgress}%` : "Finalizing session..."}
              </span>
              <div
                className="h-[12px] w-full overflow-hidden"
                style={{
                  border: "1px solid #999",
                  background: "#FFF",
                  boxShadow: "inset 1px 1px 2px rgba(0,0,0,0.15)",
                }}
              >
                <div
                  className="h-full transition-all duration-150"
                  style={{
                    width: `${burnProgress}%`,
                    background: "repeating-linear-gradient(135deg, #3366CC 0px, #3366CC 4px, #4477DD 4px, #4477DD 8px)",
                  }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-[10px] pt-1">
            <PlatinumButton primary onClick={handleBurn} disabled={isBurning}>
              {isBurning ? "Burning..." : "Burn Disc"}
            </PlatinumButton>
          </div>
        </div>

        {/* Resize grip */}
        <div className="flex justify-end px-[3px] pb-[3px]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="9" y1="1" x2="1" y2="9" stroke="#AAA" strokeWidth="1" />
            <line x1="9" y1="4" x2="4" y2="9" stroke="#AAA" strokeWidth="1" />
            <line x1="9" y1="7" x2="7" y2="9" stroke="#AAA" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </div>
  )
}
