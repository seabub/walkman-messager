"use client"

import { useRef } from "react"
import YouTube from "react-youtube"
import { WalkmanScreen } from "./WalkmanScreen"
import { WalkmanChassis } from "./WalkmanChassis"
import { Controls } from "./Controls"
import type { WalkmanDisc } from "@/hooks/use-walkman-logic"

interface WalkmanProps {
  disc: WalkmanDisc
  currentTrackIndex: number
  currentVideoId: string
  totalTracks: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  showVolume: boolean
  isLocked: boolean
  lockFlash: boolean
  isFlipped: boolean
  currentTrackTitle?: string
  currentTrackArtist?: string
  showPlaylist?: boolean
  playlistEntries?: Array<{ index: number; videoId: string; title: string }>
  onOpenPlaylist?: () => void
  onPlayerReady: (e: { target: any }) => void
  onPlayerStateChange: (e: { data: number; target: any }) => void
  onPlayPause: () => void
  onSeekLeft: () => void
  onSeekRight: () => void
  onPrevTrack: () => void
  onNextTrack: () => void
  onVolumeUp: () => void
  onVolumeDown: () => void
  onToggleHold: () => void
  onToggleFlip: () => void
  onShareLink?: () => void
}

export function Walkman({
  disc,
  currentTrackIndex,
  currentVideoId,
  totalTracks,
  isPlaying,
  currentTime,
  duration,
  volume,
  showVolume,
  isLocked,
  lockFlash,
  isFlipped,
  onPlayerReady,
  onPlayerStateChange,
  onPlayPause,
  onSeekLeft,
  onSeekRight,
  onPrevTrack,
  onNextTrack,
  onVolumeUp,
  onVolumeDown,
  onToggleHold,
  onToggleFlip,
  onShareLink: externalOnShareLink,
  currentTrackTitle,
  currentTrackArtist,
  showPlaylist = false,
  playlistEntries = [],
  onOpenPlaylist,
}: WalkmanProps) {
  const captureRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative">
      {/* Hidden YouTube player */}
      <div className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
        <YouTube
          videoId={currentVideoId}
          opts={{
            height: "1",
            width: "1",
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              rel: 0,
              origin: typeof window !== "undefined" ? window.location.origin : "",
            },
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
        />
      </div>

      <WalkmanChassis
        disc={disc}
        isFlipped={isFlipped}
        isLocked={isLocked}
        onToggleHold={onToggleHold}
        onVolumeUp={onVolumeUp}
        onVolumeDown={onVolumeDown}
        onShareLink={externalOnShareLink}
        captureRef={captureRef}
        onOpenPlaylist={onOpenPlaylist}
        onToggleFlip={onToggleFlip}
        screen={
          <WalkmanScreen
            discLabel={disc.meta.title}
            senderName={disc.meta.sender}
            trackTitle={currentTrackTitle}
            trackArtist={currentTrackArtist}
            currentTrackIndex={currentTrackIndex}
            totalTracks={totalTracks}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            showVolume={showVolume}
            isLocked={isLocked}
            lockFlash={lockFlash}
            showPlaylist={showPlaylist}
            playlistEntries={playlistEntries}
          />
        }
        controls={
          <Controls
            onPlayPause={onPlayPause}
            onSeekLeft={onSeekLeft}
            onSeekRight={onSeekRight}
            onPrevTrack={onPrevTrack}
            onNextTrack={onNextTrack}
            onToggleFlip={onToggleFlip}
            onOpenPlaylist={onOpenPlaylist}
          />
        }
      />
    </div>
  )
}
