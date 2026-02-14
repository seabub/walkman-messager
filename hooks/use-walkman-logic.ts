"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { flushSync } from "react-dom"
import type { YouTubePlayer } from "react-youtube"
import LZString from "lz-string"

// ---------- Schema ----------
export interface WalkmanMeta {
  title: string
  sender: string
  message: string
}

export interface WalkmanDisc {
  /**
   * Primary list of tracks for playback.
   * Historically named "playlist" in the encoded URL – we keep that
   * field for backwards compatibility and treat it as the canonical
   * track list.
   */
  playlist: string[] // YouTube video IDs

  /**
   * Optional photos rendered as draggable Polaroids on the digital desk.
   * Encoded in the URL hash alongside the playlist.
   */
  photos: string[]

  /**
   * Secret desk / sticky note message.
   * This mirrors (and is initialised from) meta.message so older discs
   * that only stored the note in meta remain compatible.
   */
  message: string

  /**
   * Positions (and optional size) of draggable elements on the desk.
   * Used to persist and restore layout when sharing.
   */
  positions?: {
    note?: { x: number; y: number; w?: number; h?: number }
    photos?: Array<{ x: number; y: number }>
  }

  meta: WalkmanMeta
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
  // Persist only serializable URL state. We keep "playlist" as the field
  // name for tracks to remain compatible with older links, and include
  // the new top-level photos + message fields.
  const payload = {
    playlist: disc.playlist,
    photos: disc.photos ?? [],
    message: disc.message ?? disc.meta.message ?? "",
    positions: disc.positions ?? undefined,
    meta: disc.meta,
  }
  return LZString.compressToEncodedURIComponent(JSON.stringify(payload))
}

function decodeDisc(hash: string): WalkmanDisc | null {
  try {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash
    if (!raw) return null
    const json = LZString.decompressFromEncodedURIComponent(raw)
    if (!json) return null
    const obj = JSON.parse(json)

    // Support legacy single-track format
    if (obj && typeof obj.youtubeId === "string") {
      const legacyMessage = obj.secretMessage || ""
      const legacyMeta: WalkmanMeta = {
        title: obj.discLabel || "Untitled",
        sender: obj.senderName || "Anonymous",
        message: legacyMessage,
      }

      return {
        playlist: [obj.youtubeId],
        photos: [],
        message: legacyMessage,
        positions: undefined,
        meta: legacyMeta,
      }
    }

    // Modern encoded object – tolerate missing new fields for backwards compatibility
    if (obj && Array.isArray(obj.playlist) && obj.meta) {
      const rawPhotos = Array.isArray(obj.photos) ? obj.photos : []
      const topLevelMessage =
        typeof obj.message === "string" ? obj.message : typeof obj.meta.message === "string" ? obj.meta.message : ""

      const meta: WalkmanMeta = {
        title: obj.meta.title || "Untitled",
        sender: obj.meta.sender || "Anonymous",
        // Preserve any meta-level message but fall back to top-level message if needed
        message: typeof obj.meta.message === "string" ? obj.meta.message : topLevelMessage,
      }

      const disc: WalkmanDisc = {
        playlist: obj.playlist,
        photos: rawPhotos,
        message: topLevelMessage,
        positions: obj.positions || undefined,
        meta,
      }

      return disc
    }

    return null
  } catch {
    return null
  }
}

// ---------- Hook ----------
export function useWalkmanLogic() {
  const [mode, setMode] = useState<WalkmanMode>("loading")
  const [disc, setDisc] = useState<WalkmanDisc | null>(null)

  // Playlist state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [showVolume, setShowVolume] = useState(false)

  // CRITICAL: isLocked always starts false, only toggled by HOLD switch
  const [isLocked, setIsLocked] = useState(false)
  const [lockFlash, setLockFlash] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  // YouTube video metadata for current track (from getVideoData())
  const [currentTrackTitle, setCurrentTrackTitle] = useState("")
  const [currentTrackArtist, setCurrentTrackArtist] = useState("")

  // Playlist view (OPR/MENU): show all track titles on LCD
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [trackTitlesByVideoId, setTrackTitlesByVideoId] = useState<Record<string, string>>({})

  const playerRef = useRef<YouTubePlayer | null>(null)
  const volumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const positionUpdateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const oEmbedRequestedRef = useRef<Set<string>>(new Set())

  // Current video ID derived from playlist + index
  const currentVideoId = disc?.playlist[currentTrackIndex] ?? ""
  const totalTracks = disc?.playlist.length ?? 0

  // Playlist entries for LCD playlist view (index, videoId, title)
  const playlistEntries =
    disc?.playlist.map((videoId, index) => ({
      index,
      videoId,
      title: trackTitlesByVideoId[videoId] ?? "...",
    })) ?? []

  // ---------- Fetch track title via YouTube oEmbed (for playlist view) ----------
  useEffect(() => {
    if (!showPlaylist || !disc?.playlist.length) return
    disc.playlist.forEach((videoId) => {
      if (oEmbedRequestedRef.current.has(videoId)) return
      oEmbedRequestedRef.current.add(videoId)
      const url = `/api/youtube-oembed?videoId=${encodeURIComponent(videoId)}`
      fetch(url)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: { title?: string } | null) => {
          const title = data && typeof data?.title === "string" ? data.title : "Unknown"
          setTrackTitlesByVideoId((prev) => ({ ...prev, [videoId]: title }))
        })
        .catch(() => {
          setTrackTitlesByVideoId((prev) => ({ ...prev, [videoId]: "Unknown" }))
        })
    })
  }, [showPlaylist, disc?.playlist])

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

  // ---------- Reset track when video ID changes ----------
  useEffect(() => {
    setCurrentTrackTitle("")
    setCurrentTrackArtist("")
    if (currentVideoId && playerRef.current) {
      setCurrentTime(0)
      setDuration(0)
      // Optionally auto-play the new track
      if (isPlaying) {
        playerRef.current.playVideo()
      }
    }
  }, [currentVideoId, isPlaying])

  // ---------- Burn disc (creation -> playback) ----------
  const burnDisc = useCallback((newDisc: WalkmanDisc) => {
    const encoded = encodeDisc(newDisc)
    window.history.replaceState(null, "", `#${encoded}`)
    flushSync(() => {
      setDisc(newDisc)
      setCurrentTrackIndex(0)
      setMode("playback")
    })
  }, [])

  // ---------- Update positions (debounced) ----------
  const updatePositions = useCallback(
    (positions: WalkmanDisc["positions"]) => {
      if (!disc) return

      // Clear existing timer
      if (positionUpdateTimerRef.current) {
        clearTimeout(positionUpdateTimerRef.current)
      }

      // Debounce: wait 500ms after drag ends before updating URL
      positionUpdateTimerRef.current = setTimeout(() => {
        const updatedDisc: WalkmanDisc = {
          ...disc,
          positions,
        }
        const encoded = encodeDisc(updatedDisc)
        window.history.replaceState(null, "", `#${encoded}`)
        setDisc(updatedDisc)
      }, 500)
    },
    [disc],
  )

  // ---------- YouTube player callbacks ----------
  const updateVideoData = useCallback((player: YouTubePlayer) => {
    try {
      const data = player.getVideoData?.()
      if (data && typeof data.title === "string") {
        setCurrentTrackTitle(data.title)
        setCurrentTrackArtist(typeof data.author === "string" ? data.author : "")
      }
    } catch {
      // ignore
    }
  }, [])

  const onPlayerReady = useCallback(
    (event: { target: YouTubePlayer }) => {
      playerRef.current = event.target
      event.target.setVolume(volume)
      // Video may already be cued; try to get metadata
      updateVideoData(event.target)
    },
    [volume, updateVideoData],
  )

  const onPlayerStateChange = useCallback(
    (event: { data: number; target: YouTubePlayer }) => {
      // YT states: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
      if (event.data === 1) {
        setIsPlaying(true)
        setDuration(event.target.getDuration?.() ?? 0)
        updateVideoData(event.target)
        if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
        timeIntervalRef.current = setInterval(() => {
          if (playerRef.current?.getCurrentTime) {
            setCurrentTime(playerRef.current.getCurrentTime())
          }
        }, 250)
      } else if (event.data === 5) {
        // Cued – video loaded, metadata available
        updateVideoData(event.target)
      } else if (event.data === 2) {
        setIsPlaying(false)
        if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
      } else if (event.data === 0) {
        // Track ended - auto-advance to next
        setIsPlaying(false)
        if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
        setCurrentTrackIndex((prev) => {
          const total = disc?.playlist.length ?? 1
          return (prev + 1) % total
        })
        setCurrentTime(0)
        setDuration(0)
      }
    },
    [disc, updateVideoData],
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
      const player = playerRef.current
      if (!player) return
      const state = player.getPlayerState?.()
      if (state === 1 || state === 3) {
        player.pauseVideo()
        setIsPlaying(false)
      } else {
        player.playVideo()
        setIsPlaying(true)
      }
    })
  }, [guardAction])

  const nextTrack = useCallback(() => {
    guardAction(() => {
      if (!disc || disc.playlist.length <= 1) return
      setCurrentTrackIndex((prev) => (prev + 1) % disc.playlist.length)
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
    })
  }, [guardAction, disc])

  const prevTrack = useCallback(() => {
    guardAction(() => {
      if (!disc || disc.playlist.length <= 1) return
      setCurrentTrackIndex((prev) => (prev - 1 + disc.playlist.length) % disc.playlist.length)
      setCurrentTime(0)
      setDuration(0)
      setIsPlaying(false)
    })
  }, [guardAction, disc])

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

  const togglePlaylist = useCallback(() => {
    guardAction(() => {
      setShowPlaylist((prev) => !prev)
    })
  }, [guardAction])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current)
      if (volumeTimerRef.current) clearTimeout(volumeTimerRef.current)
      if (positionUpdateTimerRef.current) clearTimeout(positionUpdateTimerRef.current)
    }
  }, [])

  return {
    mode,
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
    currentTrackTitle,
    currentTrackArtist,
    showPlaylist,
    togglePlaylist,
    playlistEntries,
    burnDisc,
    updatePositions,
    togglePlay,
    nextTrack,
    prevTrack,
    seekRelative,
    changeVolume,
    toggleHold,
    toggleFlip,
    setIsFlipped,
    onPlayerReady,
    onPlayerStateChange,
  }
}
