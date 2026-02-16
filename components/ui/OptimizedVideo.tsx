import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react'
import {View, TouchableOpacity, ActivityIndicator, Text, StyleSheet} from 'react-native'
import {VideoView} from 'expo-video'
import {clsx} from 'clsx'
import Skeleton from '../feedback/Skeleton'
import {OptimizedImage} from './OptimizedImage'
import {
  EnhancedVideoProps,
  VideoSource,
  ChunkedVideoSource,
  VideoChunk,
  VideoPlayerError
} from '../../types/common'
import {
  calculateDimensions,
  normalizeVideoSource,
  isChunkedVideo,
  getCurrentChunk,
  preloadChunk
} from '../../utils/media'
import {useVideoPlayback} from '../../hooks/useVideo'
import {useMediaLoadingState} from '../../hooks/useMedia'

/**
 * OptimizedVideo Component
 *
 * Features:
 * - Automatic player lifecycle management
 * - Poster image support
 * - NativeWind styling support
 * - Skeleton loading states
 * - Aspect ratio handling
 * - Picture-in-Picture support
 * - Fullscreen support
 * - **Chunked video streaming support**
 * - Memory efficient playback
 *
 * @example
 * // Regular video
 * <OptimizedVideo
 *   source="https://example.com/video.mp4"
 *   poster="https://example.com/poster.jpg"
 *   aspectRatio="16:9"
 *   className="rounded-lg"
 * />
 *
 * // Chunked video (for large videos split into segments)
 * <OptimizedVideo
 *   source={{
 *     chunks: [
 *       { url: 'https://cdn.com/video-chunk-0.mp4', start: 0, end: 30, duration: 30 },
 *       { url: 'https://cdn.com/video-chunk-1.mp4', start: 30, end: 60, duration: 30 },
 *     ],
 *     totalDuration: 60,
 *   }}
 *   aspectRatio="16:9"
 *   enableChunkedPlayback
 *   onChunkChange={(chunk) => console.log('Now playing chunk:', chunk)}
 * />
 */
export const OptimizedVideo: React.FC<EnhancedVideoProps> = ({
  source,
  poster,
  contentFit = 'contain',
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  volume = 1.0,
  playbackRate = 1.0,
  className,
  width,
  height,
  aspectRatio,
  showSkeleton = true,
  skeletonClassName,
  allowsFullscreen = true,
  allowsPictureInPicture = false,
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  onPlaybackStatusUpdate,
  onReadyToDisplay,
  enableChunkedPlayback = false,
  onChunkChange,
  preloadNextChunk = true
}) => {

  // State & Hooks


  const {
    isLoading: isMediaLoading,
    hasError: hasMediaError,
    onLoadStart: handleLoadStartInternal,
    onLoad: handleLoadInternal,
    onError: handleErrorInternal,
    onLoadEnd: handleLoadEndInternal
  } = useMediaLoadingState()

  const [showPoster, setShowPoster] = useState(!!poster)
  const [currentChunk, setCurrentChunk] = useState<VideoChunk | null>(null)
  const [buffering, setBuffering] = useState(false)
  const mountedRef = useRef(true)
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout>()
  const preloadedChunks = useRef<Set<string>>(new Set())

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
      }
    }
  }, [])


  // Chunked Video Logic


  const isChunked = useMemo(() => {
    return enableChunkedPlayback && isChunkedVideo(source)
  }, [enableChunkedPlayback, source])

  const chunkedSource = useMemo<ChunkedVideoSource | null>(() => {
    if (isChunked) {
      return source as ChunkedVideoSource
    }
    return null
  }, [isChunked, source])

  const currentVideoSource = useMemo(() => {
    if (isChunked && chunkedSource && currentChunk) {
      return currentChunk.url
    }
    return normalizeVideoSource(source as string | VideoSource)
  }, [isChunked, chunkedSource, currentChunk, source])

  // Initialize with first chunk
  useEffect(() => {
    if (isChunked && chunkedSource && !currentChunk) {
      const firstChunk = chunkedSource.chunks[0]
      if (firstChunk) {
        setCurrentChunk(firstChunk)
        preloadedChunks.current.add(firstChunk.url)
      }
    }
  }, [isChunked, chunkedSource, currentChunk])


  // Computed Values


  const computedDimensions = useMemo(() => {
    return calculateDimensions({
      width,
      height,
      aspectRatio,
      containerWidth: typeof width === 'number' ? width : undefined,
      containerHeight: typeof height === 'number' ? height : undefined
    })
  }, [width, height, aspectRatio])


  // Video Player Hook


  const {
    player,
    isPlaying,
    isLoading: isPlaybackLoading,
    error: playbackError
  } = useVideoPlayback({
    source: currentVideoSource,
    autoPlay,
    muted,
    loop: isChunked ? false : loop,
    volume,
    playbackRate,
    onPlaybackStatusUpdate
  })

  // Sync loading/error states with media loading state hook
  useEffect(() => {
    if (isPlaybackLoading) {
      handleLoadStartInternal()
    } else {
      handleLoadEndInternal()
    }
  }, [isPlaybackLoading, handleLoadStartInternal, handleLoadEndInternal])

  useEffect(() => {
    if (playbackError) {
      handleErrorInternal(playbackError)
    }
  }, [playbackError, handleErrorInternal])


  // Chunk Management


  useEffect(() => {
    if (!player || !isChunked || !chunkedSource || !currentChunk) return

    const checkChunkTransition = () => {
      const currentTime = player.currentTime
      const totalElapsedTime = currentChunk.start + currentTime

      // Check if we need to switch chunks
      const newChunk = getCurrentChunk(chunkedSource.chunks, totalElapsedTime)

      if (newChunk && newChunk !== currentChunk) {
        // Chunk transition needed
        setBuffering(true)
        setCurrentChunk(newChunk)
        onChunkChange?.(newChunk)

        // Calculate time within new chunk
        const timeInChunk = totalElapsedTime - newChunk.start

        // Small delay to allow chunk to load
        setTimeout(() => {
          if (player) {
            player.currentTime = timeInChunk
            if (isPlaying) {
              player.play()
            }
            setBuffering(false)
          }
        }, 100)

        // Preload next chunk
        if (preloadNextChunk && !preloadedChunks.current.has(newChunk.url)) {
          preloadChunk(newChunk)
          preloadedChunks.current.add(newChunk.url)

          const currentIndex = chunkedSource.chunks.indexOf(newChunk)
          const nextChunk = chunkedSource.chunks[currentIndex + 1]
          if (nextChunk && !preloadedChunks.current.has(nextChunk.url)) {
            preloadChunk(nextChunk)
            preloadedChunks.current.add(nextChunk.url)
          }
        }
      }

      // Check if we've reached the end of current chunk
      if (currentTime >= currentChunk.duration - 0.5) {
        const currentIndex = chunkedSource.chunks.indexOf(currentChunk)
        const nextChunk = chunkedSource.chunks[currentIndex + 1]

        if (nextChunk) {
          // Seamlessly transition to next chunk
          setBuffering(true)
          setCurrentChunk(nextChunk)
          onChunkChange?.(nextChunk)

          setTimeout(() => {
            if (player) {
              player.currentTime = 0
              if (isPlaying) {
                player.play()
              }
              setBuffering(false)
            }
          }, 100)
        } else if (loop) {
          // Loop back to first chunk
          const firstChunk = chunkedSource.chunks[0]
          setCurrentChunk(firstChunk)
          player.currentTime = 0
          player.play()
        } else {
          // End of video
          player.pause()
        }
      }
    }

    // Check chunk every 200ms
    timeUpdateIntervalRef.current = setInterval(checkChunkTransition, 200)

    return () => {
      if (timeUpdateIntervalRef.current) {
        clearInterval(timeUpdateIntervalRef.current)
      }
    }
  }, [
    player,
    isChunked,
    chunkedSource,
    currentChunk,
    loop,
    isPlaying,
    preloadNextChunk,
    onChunkChange
  ])


  // Event Handlers


  const handleLoadStart = useCallback(() => {
    if (!mountedRef.current) return
    handleLoadStartInternal()
    onLoadStart?.()
  }, [onLoadStart, handleLoadStartInternal])

  const handleLoad = useCallback(() => {
    if (!mountedRef.current) return
    handleLoadInternal()
    onLoad?.()
  }, [onLoad, handleLoadInternal])

  const handleError = useCallback(
    (error: VideoPlayerError) => {
      if (!mountedRef.current) return
      handleErrorInternal(error)
      onError?.(error)
    },
    [onError, handleErrorInternal]
  )

  const handleLoadEnd = useCallback(() => {
    if (!mountedRef.current) return
    handleLoadEndInternal()
    onLoadEnd?.()
  }, [onLoadEnd, handleLoadEndInternal])

  const handleReadyToDisplay = useCallback(() => {
    if (!mountedRef.current) return
    setShowPoster(false)
    handleLoadInternal()
    onReadyToDisplay?.()
  }, [onReadyToDisplay, handleLoadInternal])

  const handlePosterPress = useCallback(() => {
    if (player) {
      setShowPoster(false)
      player.play()
    }
  }, [player])


  // Render


  const containerClasses = clsx('relative overflow-hidden bg-black', className)
  const skeletonClasses = clsx('absolute inset-0', skeletonClassName)

  return (
    <View
      className={containerClasses}
      style={{
        width: computedDimensions.width,
        height: computedDimensions.height
      }}
      accessibilityRole="none">
      {/* Skeleton Loader */}
      {isMediaLoading && showSkeleton && !hasMediaError && (
        <View style={StyleSheet.absoluteFill}>
          <Skeleton
            width="100%"
            height="100%"
            borderRadius={0}
            className={skeletonClassName}
          />
        </View>
      )}

      {/* Video Player */}
      {!hasMediaError && player && (
        <VideoView
          player={player}
          className="w-full h-full"
          contentFit={contentFit}
          nativeControls={controls}
          allowsFullscreen={allowsFullscreen}
          allowsPictureInPicture={allowsPictureInPicture}
          onFirstFrameRender={handleReadyToDisplay}
        />
      )}

      {/* Poster Image */}
      {showPoster && poster && !hasMediaError && (
        <TouchableOpacity
          className="absolute inset-0"
          onPress={handlePosterPress}
          activeOpacity={0.9}>
          <OptimizedImage
            source={poster}
            contentFit="cover"
            width="100%"
            height="100%"
            cachePolicy="memory-disk"
            showSkeleton={false}
          />

          {/* Play Button Overlay */}
          <View className="absolute inset-0 justify-center items-center bg-black/30">
            <View className="w-16 h-16 rounded-full bg-white/90 justify-center items-center shadow-lg">
              <View className="ml-1 w-0 h-0 border-l-[20px] border-l-black border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent" />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Chunk Indicator (Development) */}
      {isChunked && currentChunk && chunkedSource && __DEV__ && (
        <View className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded">
          <Text className="text-white text-xs">
            Chunk {chunkedSource.chunks.indexOf(currentChunk) + 1}/
            {chunkedSource.chunks.length}
          </Text>
        </View>
      )}

      {/* Buffering Indicator */}
      {buffering && (
        <View className="absolute inset-0 justify-center items-center bg-black/50">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white text-sm mt-2">
            Loading next segment...
          </Text>
        </View>
      )}

      {/* Loading Indicator */}
      {isMediaLoading && !showSkeleton && (
        <View className="absolute inset-0 justify-center items-center bg-black/50">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Error State */}
      {hasMediaError && (
        <View className="absolute inset-0 justify-center items-center bg-black">
          <View className="w-16 h-16 rounded-full bg-gray-700" />
          <Text className="text-white text-sm mt-4">Failed to load video</Text>
        </View>
      )}
    </View>
  )
}

// Display Name

OptimizedVideo.displayName = 'OptimizedVideo'

export default OptimizedVideo