import {useState, useEffect, useCallback} from 'react'
import {
  VideoSource,
  OptimizedVideoProps,
  VideoPlaybackStatus,
  VideoPlayerError,
  VideoPlayerStatus
} from '../types/common'
import {useVideoPlayer, VideoPlayer, StatusChangeEventPayload} from 'expo-video'

// useVideoPlayback Hook

interface UseVideoPlaybackOptions {
  source: OptimizedVideoProps['source']
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  volume?: number
  playbackRate?: number
  onPlaybackStatusUpdate?: (status: VideoPlaybackStatus) => void
}

interface UseVideoPlaybackReturn {
  player: VideoPlayer | null
  isPlaying: boolean
  isLoading: boolean
  error: VideoPlayerError | null
  duration: number
  currentTime: number
  play: () => void
  pause: () => void
  togglePlayPause: () => void
  seek: (time: number) => void
}

export function useVideoPlayback(
  options: UseVideoPlaybackOptions
): UseVideoPlaybackReturn {
  const {
    source,
    autoPlay = false,
    muted = false,
    loop = false,
    volume = 1.0,
    playbackRate = 1.0,
    onPlaybackStatusUpdate
  } = options

  // Create video player
  const player = useVideoPlayer(source, (player) => {
    player.loop = loop
    player.muted = muted
    player.volume = volume
    player.playbackRate = playbackRate
    if (autoPlay) {
      player.play()
    }
  })

  // Local state
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<VideoPlayerError | null>(null)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)

  // Listen to player status changes
  useEffect(() => {
    if (!player) return

    const subscription = player.addListener(
      'statusChange',
      (payload: StatusChangeEventPayload) => {
        const {status: playerStatus, error: playerError} = payload

        // Update local states based on player properties and status
        setIsPlaying(player.playing)
        setIsLoading(playerStatus === 'loading')
        setDuration(player.duration || 0)
        setCurrentTime(player.currentTime || 0)

        if (playerError) {
          setError(playerError)
        } else {
          setError(null)
        }

        // Construct VideoPlaybackStatus object
        const videoPlaybackStatus: VideoPlaybackStatus = {
          status: playerStatus,
          error: playerError,
          isPlaying: player.playing,
          isBuffering: playerStatus === 'loading',
          positionMillis: (player.currentTime || 0) * 1000,
          durationMillis: (player.duration || 0) * 1000,
          didJustFinish:
            playerStatus === 'readyToPlay' &&
            (player.currentTime || 0) >= (player.duration || 0) &&
            player.playing === false
        }

        onPlaybackStatusUpdate?.(videoPlaybackStatus)
      }
    )

    return () => {
      subscription.remove()
    }
  }, [player, onPlaybackStatusUpdate])

  // Update player settings when props change
  useEffect(() => {
    if (player) {
      player.loop = loop
      player.muted = muted
      player.volume = volume
      player.playbackRate = playbackRate
    }
  }, [player, loop, muted, volume, playbackRate])

  // Control methods
  const play = useCallback(() => {
    player?.play()
  }, [player])

  const pause = useCallback(() => {
    player?.pause()
  }, [player])

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const seek = useCallback(
    (time: number) => {
      if (player) {
        player.currentTime = time
      }
    },
    [player]
  )

  return {
    player,
    isPlaying,
    isLoading,
    error,
    duration,
    currentTime,
    play,
    pause,
    togglePlayPause,
    seek
  }
}

// useVideoVisibility Hook

interface UseVideoVisibilityOptions {
  player: VideoPlayer | null
  autoPlay?: boolean
  pauseWhenHidden?: boolean
}

interface UseVideoVisibilityReturn {
  isVisible: boolean
  videoRef: React.RefObject<any>
}

export function useVideoVisibility(
  options: UseVideoVisibilityOptions
): UseVideoVisibilityReturn {
  const {player, autoPlay = false, pauseWhenHidden = true} = options
  const [isVisible, setIsVisible] = useState(true)
  const videoRef = React.useRef<any>(null)

  useEffect(() => {
    if (!player) return

    // Simulate visibility detection
    // In a real app, this would use IntersectionObserver (web) or
    // onScroll measurements (native) to detect visibility
    const handleVisibilityChange = () => {
      // Placeholder: assume visible for now
      const isVisibleInViewport = true

      setIsVisible(isVisibleInViewport)

      if (isVisibleInViewport) {
        if (autoPlay) {
          player.play()
        }
      } else {
        if (pauseWhenHidden) {
          player.pause()
        }
      }
    }

    // Simulate a check after component mounts
    const timer = setTimeout(handleVisibilityChange, 500)

    return () => clearTimeout(timer)
  }, [player, autoPlay, pauseWhenHidden])

  return {isVisible, videoRef}
}