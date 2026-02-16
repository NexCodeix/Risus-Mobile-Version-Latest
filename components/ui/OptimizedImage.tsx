import React, {useState, useCallback, useMemo, useRef, useEffect} from 'react'
import {View, StyleSheet, ViewStyle, ImageStyle} from 'react-native'
import {
  Image,
  ImageContentFit,
  // ImageContentPosition,
  ImageErrorEventData,
  ImageLoadEventData
} from 'expo-image'
import {clsx} from 'clsx'
import Skeleton from '../feedback/Skeleton'
import {
  OptimizedImageProps,
  ImageSource,
  CachePolicy,
  Priority
} from '../../types/common'
import {
  calculateDimensions,
  normalizeImageSource,
  generateCacheKey,
  shouldCache,
  calculateDownscale,
  shouldDownscale,
  buildOptimizedImageUrl
} from '../../utils/media'
import {useMediaLoadingState} from '../../hooks/useMedia'

/**
 * Optimized Image Component
 *
 * Features:
 * - Automatic caching (memory + disk)
 * - Lazy loading support
 * - Skeleton loading states
 * - Aspect ratio handling
 * - Automatic downscaling
 * - Progressive loading
 * - Multiple source selection
 * - Blurhash/Thumbhash support
 *
 * @example
 * <OptimizedImage
 *   source="https://example.com/image.jpg"
 *   aspectRatio="16:9"
 *   contentFit="cover"
 *   cachePolicy="memory-disk"
 *   showSkeleton
 * />
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  placeholder,
  contentFit = 'cover',
  contentPosition,
  priority = 'normal',
  cachePolicy = 'memory-disk',
  blurRadius = 0,
  tintColor,
  allowDownscaling = true,
  style,
  className,
  alt,
  transition = 300,
  recyclingKey,
  width,
  height,
  aspectRatio,
  onLoad,
  onError,
  onLoadStart,
  onLoadEnd,
  showSkeleton = true,
  skeletonClassName,
  maxWidth,
  maxHeight
}) => {
  // State & Hooks

  const {
    isLoading,
    hasError,
    onLoadStart: handleLoadStartInternal,
    onLoad: handleLoadInternal,
    onError: handleErrorInternal,
    onLoadEnd: handleLoadEndInternal
  } = useMediaLoadingState()

  const [dimensions, setDimensions] = useState({width: 0, height: 0})
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Computed Values

  // Calculate dimensions based on aspect ratio
  const computedDimensions = useMemo(() => {
    return calculateDimensions({
      width,
      height,
      aspectRatio,
      containerWidth: typeof width === 'number' ? width : undefined,
      containerHeight: typeof height === 'number' ? height : undefined
    })
  }, [width, height, aspectRatio])

  // Normalize source
  const normalizedSource = useMemo(() => {
    return normalizeImageSource(source)
  }, [source])

  // Generate optimized source
  const optimizedSource = useMemo(() => {
    // Handle number (local asset) directly
    if (typeof normalizedSource === 'number') {
      return normalizedSource
    }

    // Handle array of sources
    if (Array.isArray(normalizedSource)) {
      return normalizedSource
    }

    const src = normalizedSource as ImageSource

    // Return local sources or sources without URI as-is
    if (!src.uri || !src.uri.startsWith('http')) {
      return src
    }

    // Calculate target dimensions for downscaling
    let targetWidth: number | undefined
    let targetHeight: number | undefined

    if (maxWidth || maxHeight || allowDownscaling) {
      if (typeof computedDimensions.width === 'number') {
        targetWidth = maxWidth
          ? Math.min(computedDimensions.width, maxWidth)
          : computedDimensions.width
      }

      if (typeof computedDimensions.height === 'number') {
        targetHeight = maxHeight
          ? Math.min(computedDimensions.height, maxHeight)
          : computedDimensions.height
      }

      // Apply downscaling if source dimensions are available
      if (src.width && src.height && (targetWidth || targetHeight)) {
        const shouldScale = shouldDownscale({
          imageWidth: src.width,
          imageHeight: src.height,
          containerWidth: targetWidth || src.width,
          containerHeight: targetHeight || src.height,
          threshold: 1.5
        })

        if (shouldScale) {
          const downscaled = calculateDownscale({
            originalWidth: src.width,
            originalHeight: src.height,
            maxWidth: targetWidth,
            maxHeight: targetHeight
          })

          targetWidth = downscaled.width
          targetHeight = downscaled.height
        }
      }
    }

    // Build optimized URL if applicable
    let optimizedUri = src.uri
    if (targetWidth || targetHeight) {
      if (shouldOptimizeUrl(src.uri)) {
        optimizedUri = buildOptimizedImageUrl({
          url: src.uri,
          width: targetWidth,
          height: targetHeight
        })
      }
    }

    return {
      ...src,
      uri: optimizedUri,
      cacheKey: src.cacheKey || generateCacheKey(src)
    }
  }, [
    normalizedSource,
    computedDimensions,
    maxWidth,
    maxHeight,
    allowDownscaling
  ])

  // Determine cache policy
  const effectiveCachePolicy = useMemo((): CachePolicy => {
    if (cachePolicy === 'none') return 'none'

    const shouldCacheSource = Array.isArray(optimizedSource)
      ? optimizedSource.some(shouldCache)
      : typeof optimizedSource === 'number'
      ? false
      : shouldCache(optimizedSource)

    if (!shouldCacheSource) return 'none'

    return cachePolicy
  }, [cachePolicy, optimizedSource])

  // Event Handlers

  const handleLoadStart = useCallback(() => {
    if (!mountedRef.current) return
    handleLoadStartInternal()
    onLoadStart?.()
  }, [onLoadStart, handleLoadStartInternal])

  const handleLoad = useCallback(
    (event: ImageLoadEventData) => {
      if (!mountedRef.current) return
      handleLoadInternal()

      // Store actual dimensions if available
      if (event?.source) {
        setDimensions({
          width: event.source.width || 0,
          height: event.source.height || 0
        })
      }

      onLoad?.(event)
    },
    [onLoad, handleLoadInternal]
  )

  const handleError = useCallback(
    (error: ImageErrorEventData) => {
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

  // Styles

  const containerStyle = useMemo<ViewStyle>(() => {
    return {
      width: computedDimensions.width,
      height: computedDimensions.height,
      overflow: 'hidden',
      backgroundColor: hasError ? '#f3f4f6' : 'transparent'
    }
  }, [computedDimensions, hasError])

  const imageStyle = useMemo<ImageStyle>(() => {
    return {
      width: '100%',
      height: '100%',
      ...(style as ImageStyle)
    }
  }, [style])

  // Render

  return (
    <View
      style={[styles.container, containerStyle]}
      className={clsx(className)}
      accessibilityRole="image"
      accessibilityLabel={alt}>
      {/* Skeleton Loader */}
      {isLoading && showSkeleton && !hasError && (
        <View style={StyleSheet.absoluteFill}>
          <Skeleton
            width="100%"
            height="100%"
            borderRadius={0}
            className={skeletonClassName}
          />
        </View>
      )}

      {/* Image */}
      {!hasError && (
        <Image
          source={optimizedSource}
          placeholder={placeholder}
          contentFit={contentFit as ImageContentFit}
          contentPosition={contentPosition}
          priority={priority}
          cachePolicy={effectiveCachePolicy}
          blurRadius={blurRadius}
          tintColor={tintColor}
          allowDownscaling={allowDownscaling}
          style={imageStyle}
          alt={alt}
          transition={transition}
          recyclingKey={recyclingKey}
          onLoadStart={handleLoadStart}
          onLoad={handleLoad}
          onError={handleError}
          onLoadEnd={handleLoadEnd}
          accessible={!!alt}
          accessibilityLabel={alt}
        />
      )}

      {/* Error State */}
      {hasError && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon} />
        </View>
      )}
    </View>
  )
}
// Helper Function

function shouldOptimizeUrl(url: string): boolean {
  const cdnPatterns = [
    'cloudinary.com',
    'imgix.net',
    'cloudflare.com',
    'fastly.net'
  ]

  return cdnPatterns.some((pattern) => url.includes(pattern))
}
// Style

const styles = StyleSheet.create({
  container: {
    position: 'relative'
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6'
  },
  errorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb'
  }
})
// Display Nam

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage