import { useRef, useState } from "react"
import { cn } from "../../lib/utils"

/** Short CC0 placeholder until Bayana founder intro is hosted. */
export const GETTING_STARTED_INTRO_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"

function PlayIcon() {
  return (
    <svg className="size-3.5 text-bg-accent" viewBox="0 0 14 14" fill="currentColor" aria-hidden>
      <path d="M4.5 2.5v9l7-4.5-7-4.5Z" />
    </svg>
  )
}

export function GettingStartedIntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const startPlayback = async () => {
    const video = videoRef.current
    if (!video) return
    setIsPlaying(true)
    try {
      await video.play()
    } catch {
      setIsPlaying(false)
    }
  }

  return (
    <div className="relative aspect-[576/280] w-full overflow-hidden rounded-2xl bg-bg-default-100">
      <video
        ref={videoRef}
        className={cn("h-full w-full object-cover", !isPlaying && "pointer-events-none opacity-0")}
        src={GETTING_STARTED_INTRO_VIDEO_URL}
        controls={isPlaying}
        playsInline
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => {
          if (videoRef.current?.ended) setIsPlaying(false)
        }}
      >
        <track kind="captions" />
      </video>

      {!isPlaying ? (
        <>
          <button
            type="button"
            className="absolute left-1/2 top-1/2 z-10 flex size-14 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-2 border-bg-accent bg-bg-canvas shadow-control-elevated transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-input-active/40"
            aria-label="Play intro video"
            onClick={() => void startPlayback()}
          >
            <PlayIcon />
          </button>
          <p className="absolute bottom-4 left-1/2 z-10 max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-full bg-bg-canvas px-4 py-2 text-center text-xs font-medium leading-5 text-text-default-500 shadow-control-elevated">
            Watch a 3-mins intro about Bayana from our Founders
          </p>
        </>
      ) : null}
    </div>
  )
}
