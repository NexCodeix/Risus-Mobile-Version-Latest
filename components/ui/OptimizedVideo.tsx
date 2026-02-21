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
import {useAuthenticatedMedia} from '../../hooks/useAuthenticatedMedia'

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
    isLoading: isMediaHookLoading,
    hasError: hasMediaError,
    onLoadStart: handleLoadStartInternal,
    onLoad: handleLoadInternal,
    onError: handleErrorInternal,
    onLoadEnd: handleLoadEndInternal
  } = useMediaLoadingState()

  const mountedRef = useRef(true)
  const initialUri = typeof source === 'string' ? source : source?.uri
  const {
    resolvedUrl,
    isLoading: isUrlResolving,
    error: urlError
  } = useAuthenticatedMedia(initialUri)

  const isLoading = isMediaHookLoading || isUrlResolving

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // We are not supporting chunked video with this auth model for now
  const isChunked = false
  const chunkedSource = null
  const currentChunk = null

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
    source: resolvedUrl ? {uri: resolvedUrl} : undefined,
    autoPlay,
    muted,
    loop,
    volume,
    playbackRate,
    onPlaybackStatusUpdate
  })

  // Sync loading/error states
  useEffect(() => {
    if (isPlaybackLoading) handleLoadStartInternal()
    else handleLoadEndInternal()
  }, [isPlaybackLoading, handleLoadStartInternal, handleLoadEndInternal])

  useEffect(() => {
    if (playbackError) handleErrorInternal(playbackError)
  }, [playbackError, handleErrorInternal])

  // Event Handlers
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

  // Render
  const containerClasses = clsx('relative overflow-hidden bg-black', className)

  return (
    <View
      className={containerClasses}
      style={{
        width: computedDimensions.width,
        height: computedDimensions.height
      }}
      accessibilityRole="none"
    >
      {isLoading && showSkeleton && !hasMediaError && (
        <View style={StyleSheet.absoluteFill}>
          <Skeleton
            width="100%"
            height="100%"
            borderRadius={0}
            className={skeletonClassName}
          />
        </View>
      )}

      {!hasMediaError && !urlError && player && (
        <VideoView
          player={player}
          className="w-full h-full"
          contentFit={contentFit}
          nativeControls={controls}
          allowsFullscreen={allowsFullscreen}
          allowsPictureInPicture={allowsPictureInPicture}
        />
      )}

      {(hasMediaError || urlError) && (
        <View className="absolute inset-0 justify-center items-center bg-black">
          <View className="w-16 h-16 rounded-full bg-gray-700" />
          <Text className="text-white text-sm mt-4">Failed to load video</Text>
        </View>
      )}
    </View>
  )
}

OptimizedVideo.displayName = 'OptimizedVideo'

export default OptimizedVideo