"use client"

import { useRef, useCallback } from "react"
import { Walkman } from "@/components/walkman/walkman"
import { StudioOverlay } from "@/components/walkman/studio-overlay"
import { useWalkmanLogic } from "@/hooks/use-walkman-logic"
import { StickyNote } from "@/components/draggable/StickyNote"
import { Polaroid } from "@/components/draggable/Polaroid"

export default function Page() {
  const logic = useWalkmanLogic()
  const deskContainerRef = useRef<HTMLDivElement>(null)

  const handleShareLink = useCallback(async () => {
    const url = typeof window !== "undefined" ? window.location.href : ""
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement("textarea")
      textArea.value = url
      textArea.style.position = "fixed"
      textArea.style.opacity = "0"
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
    }
  }, [])

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1a1a1e] p-4 md:p-8 overflow-hidden">
      {/* Loading state */}
      {logic.mode === "loading" && (
        <div className="font-walkman text-[#00ddcc] text-sm tracking-widest animate-pulse">
          READING DISC...
        </div>
      )}

      {/* Studio Overlay (Creation Mode) */}
      {logic.mode === "studio" && <StudioOverlay onBurn={logic.burnDisc} />}

      {/* Playback Mode - Digital Desk */}
      {logic.mode === "playback" && logic.disc && (
        <div className="relative w-full min-h-screen h-screen flex items-center justify-center overflow-hidden">
          {/* Desk background */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at top left, #2b2b30 0%, #18181c 40%, #101015 80%, #050508 100%)",
            }}
          />

          {/* Draggable layer */}
          <div
            id="desk-container"
            ref={deskContainerRef}
            className="relative w-full h-full max-w-5xl max-h-[720px] overflow-hidden"
          >
            {/* Layer 1: Polaroids (Bottom - z-index: 0) */}
            <div className="absolute inset-0 z-0">
              {logic.disc.photos?.map((src, index) => {
                const photoPosition = logic.disc?.positions?.photos?.[index]
                return (
                  <Polaroid
                    key={`${src}-${index}`}
                    src={src}
                    alt={`Photo ${index + 1}`}
                    index={index}
                    initialPosition={photoPosition}
                    onDragEnd={(x, y) => {
                      if (!logic.disc) return
                      const newPhotos = [...(logic.disc.positions?.photos || [])]
                      newPhotos[index] = { x, y }
                      logic.updatePositions({
                        ...logic.disc.positions,
                        photos: newPhotos,
                      })
                    }}
                    dragConstraints={deskContainerRef}
                  />
                )
              })}
            </div>

            {/* Layer 2: Walkman (Middle - z-index: 10) */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="scale-[0.62] sm:scale-[0.75] md:scale-100 lg:scale-110 xl:scale-125 origin-center">
                <Walkman
                  disc={logic.disc}
                  currentTrackIndex={logic.currentTrackIndex}
                  currentVideoId={logic.currentVideoId}
                  totalTracks={logic.totalTracks}
                  isPlaying={logic.isPlaying}
                  currentTime={logic.currentTime}
                  duration={logic.duration}
                  volume={logic.volume}
                  showVolume={logic.showVolume}
                  isLocked={logic.isLocked}
                  lockFlash={logic.lockFlash}
                  isFlipped={logic.isFlipped}
                  currentTrackTitle={logic.currentTrackTitle}
                  currentTrackArtist={logic.currentTrackArtist}
                  showPlaylist={logic.showPlaylist}
                  playlistEntries={logic.playlistEntries}
                  onOpenPlaylist={logic.togglePlaylist}
                  onPlayerReady={logic.onPlayerReady}
                  onPlayerStateChange={logic.onPlayerStateChange}
                  onPlayPause={logic.togglePlay}
                  onSeekLeft={() => logic.seekRelative(-10)}
                  onSeekRight={() => logic.seekRelative(10)}
                  onPrevTrack={logic.prevTrack}
                  onNextTrack={logic.nextTrack}
                  onVolumeUp={() => logic.changeVolume(10)}
                  onVolumeDown={() => logic.changeVolume(-10)}
                  onToggleHold={logic.toggleHold}
                  onToggleFlip={logic.toggleFlip}
                  onShareLink={handleShareLink}
                />
              </div>
            </div>

            {/* Layer 3: StickyNote (Top - z-index: 20). pointer-events-none so clicks pass through to Walkman/Polaroids. */}
            <div className="absolute inset-0 z-20 pointer-events-none">
              {logic.disc.message && (
                <StickyNote
                  message={logic.disc.message}
                  initialPosition={{
                    x: logic.disc.positions?.note?.x ?? 40,
                    y: logic.disc.positions?.note?.y ?? 60,
                  }}
                  initialSize={
                    logic.disc.positions?.note?.w != null && logic.disc.positions?.note?.h != null
                      ? { w: logic.disc.positions.note.w, h: logic.disc.positions.note.h }
                      : undefined
                  }
                  onDragEnd={(x, y) => {
                    if (!logic.disc) return
                    const currentPositions = logic.disc.positions || {}
                    const currentNote = currentPositions.note || {}
                    logic.updatePositions({
                      ...currentPositions,
                      note: { ...currentNote, x, y },
                    })
                  }}
                  onSizeChange={(w, h) => {
                    if (!logic.disc) return
                    const currentPositions = logic.disc.positions || {}
                    const currentNote = currentPositions.note || {}
                    logic.updatePositions({
                      ...currentPositions,
                      note: { ...currentNote, w, h },
                    })
                  }}
                  dragConstraints={deskContainerRef}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Blurred walkman in background when studio is open */}
      {logic.mode === "studio" && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none -z-0 opacity-20 blur-sm scale-75">
          <div
            className="w-[360px] h-[360px] rounded-xl"
            style={{
              background: "linear-gradient(135deg, #3e3e44 0%, #5a5a60 40%, #c8c8cc 50%, #d4d4d8 100%)",
            }}
          />
        </div>
      )}
    </main>
  )
}
