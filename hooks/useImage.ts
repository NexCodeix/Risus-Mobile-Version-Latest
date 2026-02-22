import {useEffect, useCallback, useState, useRef} from 'react'
import {ImageSource} from '../types/common'
import {Image} from 'expo-image'
import {shouldCache} from '../utils/media'

// usePrefetchImages Hook

export interface UsePrefetchImagesOptions {
  enabled?: boolean
  cachePolicy?: 'memory' | 'disk' | 'memory-disk'
}

/**
 * Hook to prefetch images for better UX
 * 
 * @example
 * usePrefetchImages([
 *   'https://example.com/image1.jpg',
 *   { uri: 'https://example.com/image2.jpg' }
 * ], { enabled: true, cachePolicy: 'memory-disk' });
 */
export function usePrefetchImages(
  sources: (string | ImageSource)[],
  options: UsePrefetchImagesOptions = {}
) {
  const {enabled = true, cachePolicy = 'memory-disk'} = options
  const prefetchedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!enabled || !sources || sources.length === 0) return

    const prefetchImages = async () => {
      const urlsToPrefetch: string[] = []

      // Extract URIs from sources
      sources.forEach((source) => {
        let uri: string | undefined

        if (typeof source === 'string') {
          uri = source
        } else if (typeof source === 'object' && source.uri) {
          uri = source.uri
        }

        // Only prefetch if it's cacheable and not already prefetched
        if (uri && shouldCache({uri}) && !prefetchedRef.current.has(uri)) {
          urlsToPrefetch.push(uri)
          prefetchedRef.current.add(uri)
        }
      })

      if (urlsToPrefetch.length > 0) {
        try {
          // Prefetch all URLs at once (more efficient than forEach)
          await Image.prefetch(urlsToPrefetch, cachePolicy)
        } catch (error) {
          console.warn('Failed to prefetch images:', error)
          // Remove failed URLs from prefetched set
          urlsToPrefetch.forEach((url) => prefetchedRef.current.delete(url))
        }
      }
    }

    prefetchImages()
  }, [sources, enabled, cachePolicy])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      prefetchedRef.current.clear()
    }
  }, [])
}

// useImageCache Hook

export interface ImageCacheControls {
  clearMemoryCache: () => Promise<boolean>
  clearDiskCache: () => Promise<boolean>
  clearAllCaches: () => Promise<void>
  getCachePath: (uri: string) => Promise<string | null>
}

/**
 * Hook for managing image cache
 * 
 * @example
 * const { clearMemoryCache, clearDiskCache, clearAllCaches } = useImageCache();
 * 
 * // Clear specific cache
 * await clearMemoryCache();
 * 
 * // Clear all caches
 * await clearAllCaches();
 */
export function useImageCache(): ImageCacheControls {
  const clearMemoryCache = useCallback(async (): Promise<boolean> => {
    try {
      const result = await Image.clearMemoryCache()
      console.log('Memory cache cleared successfully')
      return result
    } catch (error) {
      console.error('Failed to clear memory cache:', error)
      return false
    }
  }, [])

  const clearDiskCache = useCallback(async (): Promise<boolean> => {
    try {
      const result = await Image.clearDiskCache()
      console.log('Disk cache cleared successfully')
      return result
    } catch (error) {
      console.error('Failed to clear disk cache:', error)
      return false
    }
  }, [])

  const clearAllCaches = useCallback(async (): Promise<void> => {
    try {
      await Promise.all([clearMemoryCache(), clearDiskCache()])
      console.log('All caches cleared successfully')
    } catch (error) {
      console.error('Failed to clear caches:', error)
    }
  }, [clearMemoryCache, clearDiskCache])

  const getCachePath = useCallback(async (uri: string): Promise<string | null> => {
    try {
      const path = await Image.getCachePathAsync(uri)
      return path
    } catch (error) {
      console.warn('Failed to get cache path:', error)
      return null
    }
  }, [])

  return {
    clearMemoryCache,
    clearDiskCache,
    clearAllCaches,
    getCachePath
  }
}

// useLazyImage Hook

export interface UseLazyImageOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export interface UseLazyImageReturn {
  isVisible: boolean
  shouldLoad: boolean
  source: string | ImageSource | undefined
  setIsVisible: (visible: boolean) => void
}

/**
 * Hook for lazy loading images
 * 
 * @example
 * const { shouldLoad, source } = useLazyImage(imageSource, { 
 *   threshold: 0.1,
 *   enabled: true 
 * });
 * 
 * if (shouldLoad) {
 *   return <OptimizedImage source={source} />;
 * }
 */
export function useLazyImage(
  source: string | ImageSource,
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const {threshold = 0, rootMargin = '0px', enabled = true} = options
  const [isVisible, setIsVisible] = useState(!enabled) // If disabled, assume visible

  useEffect(() => {
    if (!enabled) {
      setIsVisible(true)
      return
    }

    // For React Native, assume visible after a small delay
    // In a real implementation with IntersectionObserver on web:
    // - You'd create an observer
    // - Observe the element
    // - Update visibility based on intersection
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [enabled])

  return {
    isVisible,
    shouldLoad: isVisible,
    source: isVisible ? source : undefined,
    setIsVisible
  }
}

// useProgressiveImage Hook

export interface UseProgressiveImageOptions {
  lowResSource: string | ImageSource
  highResSource: string | ImageSource
  delay?: number
  enabled?: boolean
}

export interface UseProgressiveImageReturn {
  currentSource: string | ImageSource
  isHighResLoaded: boolean
  isLoading: boolean
}

/**
 * Hook for progressive image loading (low-res to high-res)
 * 
 * @example
 * const { currentSource, isHighResLoaded } = useProgressiveImage({
 *   lowResSource: 'https://example.com/thumb.jpg',
 *   highResSource: 'https://example.com/full.jpg',
 *   delay: 300
 * });
 * 
 * <OptimizedImage 
 *   source={currentSource} 
 *   showSkeleton={!isHighResLoaded} 
 * />
 */
export function useProgressiveImage(
  options: UseProgressiveImageOptions
): UseProgressiveImageReturn {
  const {lowResSource, highResSource, delay = 0, enabled = true} = options
  const [currentSource, setCurrentSource] = useState(lowResSource)
  const [isHighResLoaded, setIsHighResLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!enabled) {
      setCurrentSource(highResSource)
      setIsHighResLoaded(true)
      return
    }

    // Start with low-res
    setCurrentSource(lowResSource)
    setIsHighResLoaded(false)
    setIsLoading(true)

    // Extract high-res URI
    const highResUri =
      typeof highResSource === 'string' ? highResSource : highResSource.uri

    if (!highResUri) {
      setIsLoading(false)
      return
    }

    // Prefetch high-res image
    const loadHighRes = async () => {
      try {
        await Image.prefetch([highResUri], 'memory-disk')

        // Wait for delay if specified
        await new Promise((resolve) => setTimeout(resolve, delay))

        if (mountedRef.current) {
          setCurrentSource(highResSource)
          setIsHighResLoaded(true)
          setIsLoading(false)
        }
      } catch (error) {
        console.warn('Failed to load high-res image:', error)
        if (mountedRef.current) {
          setIsLoading(false)
        }
      }
    }

    loadHighRes()
  }, [lowResSource, highResSource, delay, enabled])

  return {
    currentSource,
    isHighResLoaded,
    isLoading
  }
}

// useImagePreloader Hook (Bonus)

export interface UseImagePreloaderOptions {
  sources: (string | ImageSource)[]
  enabled?: boolean
  onComplete?: () => void
  onError?: (error: Error) => void
}

export interface UseImagePreloaderReturn {
  isLoading: boolean
  progress: number
  loadedCount: number
  totalCount: number
  errors: Error[]
}

/**
 * Hook for preloading multiple images with progress tracking
 * 
 * @example
 * const { isLoading, progress } = useImagePreloader({
 *   sources: [
 *     'https://example.com/image1.jpg',
 *     'https://example.com/image2.jpg',
 *     'https://example.com/image3.jpg',
 *   ],
 *   onComplete: () => console.log('All images loaded!')
 * });
 */
export function useImagePreloader(
  options: UseImagePreloaderOptions
): UseImagePreloaderReturn {
  const {sources, enabled = true, onComplete, onError} = options
  const [isLoading, setIsLoading] = useState(false)
  const [loadedCount, setLoadedCount] = useState(0)
  const [errors, setErrors] = useState<Error[]>([])
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!enabled || sources.length === 0) {
      setLoadedCount(0)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setLoadedCount(0)
    setErrors([])

    const loadImages = async () => {
      const urlsToLoad: string[] = []

      sources.forEach((source) => {
        const uri = typeof source === 'string' ? source : source.uri
        if (uri && shouldCache({uri})) {
          urlsToLoad.push(uri)
        }
      })

      // Load images one by one to track progress
      for (let i = 0; i < urlsToLoad.length; i++) {
        try {
          await Image.prefetch([urlsToLoad[i]], 'memory-disk')
          if (mountedRef.current) {
            setLoadedCount((prev) => prev + 1)
          }
        } catch (error) {
          const err = error as Error
          if (mountedRef.current) {
            setErrors((prev) => [...prev, err])
          }
          onError?.(err)
        }
      }

      if (mountedRef.current) {
        setIsLoading(false)
        onComplete?.()
      }
    }

    loadImages()
  }, [sources, enabled, onComplete, onError])

  const progress =
    sources.length > 0 ? (loadedCount / sources.length) * 100 : 0

  return {
    isLoading,
    progress,
    loadedCount,
    totalCount: sources.length,
    errors
  }
}