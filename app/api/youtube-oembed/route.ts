import { NextRequest, NextResponse } from "next/server"

const YOUTUBE_OEMBED = "https://www.youtube.com/oembed"

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("videoId")
  if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return NextResponse.json({ error: "Invalid videoId" }, { status: 400 })
  }
  const url = `${YOUTUBE_OEMBED}?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}&format=json`
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } })
    if (!res.ok) return NextResponse.json({ error: "oEmbed failed" }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Fetch failed" }, { status: 502 })
  }
}
