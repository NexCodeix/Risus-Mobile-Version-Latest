import React, {useMemo} from 'react'
import {ViewStyle} from 'react-native'
import {OptimizedImage} from './OptimizedImage'
import {OptimizedVideo} from './OptimizedVideo'
import {
  AspectRatio,
  ContentFit,
  Priority,
  CachePolicy,
  ImageSource,
  VideoSource,
  ChunkedVideoSource,
  OptimizedVideoProps,
  OptimizedImageProps
} from '../../types/common'
import {getMediaType} from '../../utils/media'

// MediaRenderer Props
interface MediaRendererProps {
  source:
    | string
    | number
    | ImageSource
    | ImageSource[]
    | VideoSource
    | ChunkedVideoSource
  type?: 'image' | 'video' | 'auto'
  poster?: string | ImageSource
  placeholder?: string | ImageSource
  aspectRatio?: AspectRatio
  contentFit?: ContentFit
  priority?: Priority
  cachePolicy?: CachePolicy
  width?: number | string
  height?: number | string
  style?: ViewStyle
  className?: string
  showSkeleton?: boolean
  skeletonClassName?: string

  // Image-specific props
  blurRadius?: number
  tintColor?: string
  transition?: number

  // Video-specific props
  controls?: boolean
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  volume?: number
  allowsFullscreen?: boolean
  allowsPictureInPicture?: boolean
  onPlaybackStatusUpdate?: OptimizedVideoProps['onPlaybackStatusUpdate']
  onReadyToDisplay?: () => void
  resizeMode?: OptimizedVideoProps['resizeMode']

  // Event handlers
  onLoad?: OptimizedImageProps['onLoad'] | OptimizedVideoProps['onLoad']
  onError?: OptimizedImageProps['onError'] | OptimizedVideoProps['onError']
  onLoadStart?: () => void
  onLoadEnd?: () => void
}

/**
 * ?Media Renderer Component
 *
 * Universal component that automatically renders images or videos
 * based on the source type. Perfect for feeds where content type varies.
 *
 * Features:
 * - Automatic type detection
 * - Unified API for both media types
 * - All optimizations from OptimizedImage/OptimizedVideo
 * - Seamless switching between types
 *
 * @example
 * * Automatic detection
 * <MediaRenderer
 *   source="https://example.com/media.mp4"
 *   aspectRatio="16:9"
 *   contentFit="cover"
 * />
 *
 * *Explicit type
 * <MediaRenderer
 *   source={mediaSource}
 *   type="video"
 *   poster={posterSource}
 *   controls
 * />
 */
export const MediaRenderer: React.FC<MediaRendererProps> = ({
  source,
  type = 'auto',
  poster,
  placeholder,
  aspectRatio,
  contentFit = 'cover',
  priority = 'normal',
  cachePolicy = 'memory-disk',
  width,
  height,
  style,
  className,
  showSkeleton = true,
  skeletonClassName,
  blurRadius,
  tintColor,
  transition,
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  volume = 1.0,
  allowsFullscreen = true,
  allowsPictureInPicture = false,
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  onPlaybackStatusUpdate,
  onReadyToDisplay,
  resizeMode
}) => {
  // Computed Values

  const mediaType = useMemo(() => {
    if (type !== 'auto') return type
    return getMediaType(source)
  }, [source, type])

  // Render

  if (mediaType === 'video') {
    return (
      <OptimizedVideo
        source={source as OptimizedVideoProps['source']}
        poster={poster}
        aspectRatio={aspectRatio}
        contentFit={contentFit}
        priority={priority}
        width={width}
        height={height}
        style={style}
        className={className}
        showSkeleton={showSkeleton}
        skeletonClassName={skeletonClassName}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        volume={volume}
        allowsFullscreen={allowsFullscreen}
        allowsPictureInPicture={allowsPictureInPicture}
        onLoad={onLoad as OptimizedVideoProps['onLoad']}
        onError={onError as OptimizedVideoProps['onError']}
        onLoadStart={onLoadStart}
        onLoadEnd={onLoadEnd}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onReadyToDisplay={onReadyToDisplay}
        resizeMode={resizeMode}
      />
    )
  }

  // Default to image
  return (
    <OptimizedImage
      source={source as OptimizedImageProps['source']}
      placeholder={placeholder}
      aspectRatio={aspectRatio}
      contentFit={contentFit}
      priority={priority}
      cachePolicy={cachePolicy}
      width={width}
      height={height}
      style={style}
      className={className}
      showSkeleton={showSkeleton}
      skeletonClassName={skeletonClassName}
      blurRadius={blurRadius}
      tintColor={tintColor}
      transition={transition}
      onLoad={onLoad as OptimizedImageProps['onLoad']}
      onError={onError as OptimizedImageProps['onError']}
      onLoadStart={onLoadStart}
      onLoadEnd={onLoadEnd}
    />
  )
}

// Display Name

MediaRenderer.displayName = 'MediaRenderer'

export default MediaRenderer
