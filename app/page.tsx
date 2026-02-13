"use client"

import { Walkman } from "@/components/walkman/walkman"
import { StudioOverlay } from "@/components/walkman/studio-overlay"
import { useWalkmanLogic } from "@/hooks/use-walkman-logic"

export default function Page() {
  const logic = useWalkmanLogic()

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

      {/* Playback Mode */}
      {logic.mode === "playback" && logic.disc && (
        <div
          className="transform origin-center"
          style={{
            /* Mobile: scale down to fit, desktop: scale up for impact */
          }}
        >
          <div className="scale-[0.62] sm:scale-[0.75] md:scale-100 lg:scale-110 xl:scale-125 origin-center">
            <Walkman
              disc={logic.disc}
              isPlaying={logic.isPlaying}
              currentTime={logic.currentTime}
              duration={logic.duration}
              volume={logic.volume}
              showVolume={logic.showVolume}
              isLocked={logic.isLocked}
              lockFlash={logic.lockFlash}
              isFlipped={logic.isFlipped}
              onPlayerReady={logic.onPlayerReady}
              onPlayerStateChange={logic.onPlayerStateChange}
              onPlayPause={logic.togglePlay}
              onSeekLeft={() => logic.seekRelative(-10)}
              onSeekRight={() => logic.seekRelative(10)}
              onVolumeUp={() => logic.changeVolume(10)}
              onVolumeDown={() => logic.changeVolume(-10)}
              onToggleHold={logic.toggleHold}
              onToggleFlip={logic.toggleFlip}
            />
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
