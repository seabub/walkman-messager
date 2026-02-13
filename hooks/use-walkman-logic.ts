"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { YouTubePlayer } from "react-youtube"
import LZString from "lz-string"

// ---------- Schema ----------
export interface WalkmanDisc {
  youtubeId: string
  discLabel: string
  senderName: string
  secretMessage: string
}

export type WalkmanMode = "loading" | "studio" | "playback"

// ---------- YouTube URL parser ----------
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtu\.be\/|youtube\.com\/shorts\/|music\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const re of patterns) {
    const m = url.match(re)
    if (m) return m[1]
  }
  return null
}

// ---------- URL codec ----------
function encodeDisc(disc: WalkmanDisc): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(disc))
}

function decodeDisc(hash: string): WalkmanDisc | null {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash
    if (!raw) return null
    const json = LZString.decompressFromEncodedURIComponent(raw)
    if (!json) return null
    const obj = JSON.parse(json)
    if (obj && typeof obj.youtubeId === "string") return obj as WalkmanDisc
    return null
  } catch {
    return null
  }
}

// ---------- Hook ----------
export function useWalkmanLogic() {
  const [mode, setMode] = useState<WalkmanMode>("loading")
  const [disc, setDisc] = useState<WalkmanDisc | null>(null)

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [showVolume, setShowVolume] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [lockFlash, setLockFlash] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const playerRef = useRef<YouTubePlayer | null>(null)
  const volumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // ---------- Initialize from URL ----------
  useEffect(() => {
    const hash = window.location.hash
    const decoded = decodeDisc(hash)
    if (decoded) {
      setDisc(decoded)
      setMode("playback")
    } else {
      setMode("studio")
    }
  }, [])

  // ---------- Burn disc (creation -> playback) ----------
  const burnDisc = useCallback((newDisc: WalkmanDisc) => {
    const encoded = encodeDisc(newDisc)
    window.history.replaceState(null, "", `#${encoded}`)
    setDisc(newDisc)
    setMode("playback")
  }, [])

  // ---------- YouTube player callbacks ----------
  const onPlayerReady = useCallback(
    (event: { target: YouTubePlayer }) => {
      playerRef.current = event.target
      event.target.setVolume(volume)
    },
    [volume],
  )

  const onPlayerStateChange = useCallback(
    (event: { data: number; target: YouTubePlayer }) => {
      // YT states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
      if (event.data === 1) {
        setIsPlaying(true)
        setDuration(event.target.getDuration?.() ?? 0)
        // Start time tracking
        if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
        timeIntervalRef.current = setInterval(() => {
          if (playerRef.current?.getCurrentTime) {
            setCurrentTime(playerRef.current.getCurrentTime())
          }
        }, 250)
      } else if (event.data === 2 || event.data === 0) {
        setIsPlaying(false)
        if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
      }
    },
    [],
  )

  // ---------- Button guards (HOLD lock) ----------
  const guardAction = useCallback(
    (fn: () => void) => {
      if (isLocked) {
        setLockFlash(true)
        setTimeout(() => setLockFlash(false), 1200)
        return
      }
      fn()
    },
    [isLocked],
  )

  // ---------- Transport controls ----------
  const togglePlay = useCallback(() => {
    guardAction(() => {
      if (!playerRef.current) return
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    })
  }, [guardAction, isPlaying])

  const seekRelative = useCallback(
    (delta: number) => {
      guardAction(() => {
        if (!playerRef.current) return
        const cur = playerRef.current.getCurrentTime?.() ?? 0
        playerRef.current.seekTo(Math.max(0, cur + delta), true)
      })
    },
    [guardAction],
  )

  const changeVolume = useCallback(
    (delta: number) => {
      guardAction(() => {
        setVolume((v) => {
          const next = Math.min(100, Math.max(0, v + delta))
          playerRef.current?.setVolume(next)
          return next
        })
        setShowVolume(true)
        if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current)
        volumeTimerRef.current = setTimeout(() => setShowVolume(false), 1500)
      })
    },
    [guardAction],
  )

  const toggleHold = useCallback(() => {
    setIsLocked((prev) => !prev)
  }, [])

  const toggleFlip = useCallback(() => {
    guardAction(() => {
      setIsFlipped((prev) => !prev)
    })
  }, [guardAction])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
      if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current)
    }
  }, [])

  return {
    // State
    mode,
    disc,
    isPlaying,
    currentTime,
    duration,
    volume,
    showVolume,
    isLocked,
    lockFlash,
    isFlipped,

    // Actions
    burnDisc,
    togglePlay,
    seekRelative,
    changeVolume,
    toggleHold,
    toggleFlip,
    setIsFlipped,

    // YouTube
    onPlayerReady,
    onPlayerStateChange,
  }
}
