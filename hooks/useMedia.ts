import React, {useState, useEffect, useCallback} from 'react'
import {Dimensions} from 'react-native'
import {Image} from 'expo-image'
import {ImageSource} from '../types/common'
import {shouldCache} from '../utils/media'

// useMediaOrientation Hook

export type MediaOrientation = 'portrait' | 'landscape'

export function useMediaOrientation(): MediaOrientation {
  const [orientation, setOrientation] = useState<MediaOrientation>(() => {
    const {width, height} = Dimensions.get('window')
    return width < height ? 'portrait' : 'landscape'
  })

  const updateOrientation = useCallback(() => {
    const {width, height} = Dimensions.get('window')
    setOrientation(width < height ? 'portrait' : 'landscape')
  }, [])

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      updateOrientation
    )
    return () => subscription?.remove()
  }, [updateOrientation])

  return orientation
}

// useMediaLoadingState Hook

export interface MediaLoadingState {
  isLoading: boolean
  hasLoaded: boolean
  hasError: boolean
  onLoadStart: () => void
  onLoadEnd: () => void
  onLoad: () => void
  onError: (error: any) => void
  setIsLoading: (isLoading: boolean) => void
  setHasError: (hasError: boolean) => void
}

export function useMediaLoadingState(): MediaLoadingState {
  const [isLoading, setIsLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const onLoadStart = useCallback(() => {
    setIsLoading(true)
    setHasLoaded(false)
    setHasError(false)
  }, [])

  const onLoadEnd = useCallback(() => {
    setIsLoading(false)
  }, [])

  const onLoad = useCallback(() => {
    setIsLoading(false)
    setHasLoaded(true)
    setHasError(false)
  }, [])

  const onError = useCallback((error: any) => {
    setIsLoading(false)
    setHasLoaded(false)
    setHasError(true)
    console.error('Media loading error:', error)
  }, [])

  return {
    isLoading,
    hasLoaded,
    hasError,
    onLoadStart,
    onLoadEnd,
    onLoad,
    onError,
    setIsLoading,
    setHasError
  }
}

// usePrefetchImages Hook

export interface UsePrefetchImagesOptions {
  enabled?: boolean
}

export function usePrefetchImages(
  sources: (string | ImageSource)[],
  options: UsePrefetchImagesOptions = {}
): void {
  const {enabled = true} = options

  useEffect(() => {
    if (!enabled || !sources || sources.length === 0) return

    const prefetchImages = async () => {
      const urlsToPrefetch: string[] = []

      sources.forEach((source) => {
        let uri: string | undefined

        if (typeof source === 'string') {
          uri = source
        } else if (typeof source === 'object' && source.uri) {
          uri = source.uri
        }

        if (uri && shouldCache({uri})) {
          urlsToPrefetch.push(uri)
        }
      })

      if (urlsToPrefetch.length > 0) {
        try {
          await Image.prefetch(urlsToPrefetch, 'memory-disk')
        } catch (error) {
          console.warn('Failed to prefetch images:', error)
        }
      }
    }

    prefetchImages()
  }, [sources, enabled])
}

// useImageCache Hook

export interface ImageCacheControls {
  clearMemoryCache: () => Promise<boolean>
  clearDiskCache: () => Promise<boolean>
  clearAllCaches: () => Promise<void>
}

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

  return {
    clearMemoryCache,
    clearDiskCache,
    clearAllCaches
  }
}

// useLazyImage Hook

export interface UseLazyImageOptions {
  threshold?: number
  rootMargin?: string
}

export interface UseLazyImageReturn {
  isVisible: boolean
  shouldLoad: boolean
  imageRef: React.RefObject<any>
}

export function useLazyImage(
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const {threshold = 0, rootMargin = '0px'} = options
  const [isVisible, setIsVisible] = useState(false)
  const imageRef = React.useRef<any>(null)

  useEffect(() => {
    // For React Native, assume visible immediately
    // In a web environment, you would use IntersectionObserver here
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return {
    isVisible,
    shouldLoad: isVisible,
    imageRef
  }
}

// useProgressiveImage Hook

export interface UseProgressiveImageOptions {
  lowResSource: string | ImageSource
  highResSource: string | ImageSource
  delay?: number
}

export interface UseProgressiveImageReturn {
  currentSource: string | ImageSource
  isHighResLoaded: boolean
}

export function useProgressiveImage(
  options: UseProgressiveImageOptions
): UseProgressiveImageReturn {
  const {lowResSource, highResSource, delay = 500} = options
  const [currentSource, setCurrentSource] = useState(lowResSource)
  const [isHighResLoaded, setIsHighResLoaded] = useState(false)

  useEffect(() => {
    // Start with low-res
    setCurrentSource(lowResSource)
    setIsHighResLoaded(false)

    // Simulate loading high-res image after delay
    const timer = setTimeout(() => {
      setCurrentSource(highResSource)
      setIsHighResLoaded(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [lowResSource, highResSource, delay])

  return {
    currentSource,
    isHighResLoaded
  }
}
