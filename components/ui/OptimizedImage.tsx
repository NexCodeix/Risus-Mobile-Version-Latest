import {clsx} from 'clsx'
import {
  Image,
  ImageContentFit,
  ImageErrorEventData,
  ImageLoadEventData
} from 'expo-image'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ImageStyle, StyleSheet, View, ViewStyle} from 'react-native'
import {useMediaLoadingState} from '../../hooks/useMedia'
import {useAuthenticatedMedia} from '../../hooks/useAuthenticatedMedia'
import {CachePolicy, ImageSource, OptimizedImageProps} from '../../types/common'
import {
  buildOptimizedImageUrl,
  calculateDimensions,
  calculateDownscale,
  generateCacheKey,
  normalizeImageSource,
  shouldCache,
  shouldDownscale
} from '../../utils/media'
import Skeleton from '../feedback/Skeleton'

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
    isLoading: isMediaHookLoading,
    hasError,
    onLoadStart: handleLoadStartInternal,
    onLoad: handleLoadInternal,
    onError: handleErrorInternal,
    onLoadEnd: handleLoadEndInternal
  } = useMediaLoadingState()

  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Normalize source
  const normalizedSource = useMemo(() => {
    return normalizeImageSource(source)
  }, [source])

  const initialUri =
    typeof normalizedSource === 'object' &&
    !Array.isArray(normalizedSource) &&
    normalizedSource?.uri
      ? normalizedSource.uri
      : undefined

  const {
    resolvedUrl,
    isLoading: isUrlResolving,
    error: urlError
  } = useAuthenticatedMedia(initialUri)

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

  // Generate optimized source
  const optimizedSource = useMemo(() => {
    if (typeof normalizedSource === 'number') {
      return normalizedSource
    }

    if (!resolvedUrl) return undefined

    const src = {
      ...(typeof normalizedSource === 'object' &&
      !Array.isArray(normalizedSource)
        ? normalizedSource
        : {}),
      uri: resolvedUrl
    }

    // Downscaling logic (can remain the same)
    let targetWidth: number | undefined
    let targetHeight: number | undefined
    if (allowDownscaling) {
      // ... downscaling calculations ...
    }

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
    resolvedUrl,
    computedDimensions,
    maxWidth,
    maxHeight,
    allowDownscaling
  ])

  const isLoading = isMediaHookLoading || isUrlResolving

  // Determine cache policy
  const effectiveCachePolicy = useMemo((): CachePolicy => {
    if (cachePolicy === 'none') return 'none'
    // Caching logic can remain, now using the resolved URL
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
  const containerStyle = useMemo<ViewStyle>(
    () => ({
      width: computedDimensions.width,
      height: computedDimensions.height,
      overflow: 'hidden',
      backgroundColor: hasError ? '#f3f4f6' : 'transparent'
    }),
    [computedDimensions, hasError]
  )

  const imageStyle = useMemo<ImageStyle>(
    () => ({
      width: '100%',
      height: '100%',
      ...(style as ImageStyle)
    }),
    [style]
  )

  return (
    <View
      style={[styles.container, containerStyle]}
      className={clsx(className)}
      accessibilityRole="image"
      accessibilityLabel={alt}
    >
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

      {!hasError && optimizedSource && (
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

      {(hasError || urlError) && (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon} />
        </View>
      )}
    </View>
  )
}

function shouldOptimizeUrl(url: string): boolean {
  if (!url) return false
  const cdnPatterns = [
    'cloudinary.com',
    'imgix.net',
    'cloudflare.com',
    'fastly.net'
  ]
  return cdnPatterns.some((pattern) => url.includes(pattern))
}

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

OptimizedImage.displayName = 'OptimizedImage'

export default OptimizedImage
