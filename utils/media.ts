import {
  ImageSource,
  VideoSource,
  AspectRatio,
  ChunkedVideoSource,
  VideoChunk
} from '../types/common'
import {Dimensions} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

// Common Utilities

export function parseAspectRatio(aspectRatio: AspectRatio): number {
  if (typeof aspectRatio === 'number') {
    return aspectRatio
  }
  const [width, height] = aspectRatio.split(':').map(Number)
  if (width && height) {
    return width / height
  }
  return 1 // Default to square if parsing fails
}

export function calculateDimensions({
  width,
  height,
  aspectRatio,
  containerWidth = SCREEN_WIDTH,
  containerHeight = SCREEN_HEIGHT
}: {
  width?: number | string
  height?: number | string
  aspectRatio?: AspectRatio
  containerWidth?: number
  containerHeight?: number
}): {width?: number | string; height?: number | string} {
  if (width && height) {
    return {width, height}
  }

  if (aspectRatio) {
    const ratio = parseAspectRatio(aspectRatio)
    if (width) {
      const w = typeof width === 'string' ? parseFloat(width) : width
      return {width, height: w / ratio}
    }
    if (height) {
      const h = typeof height === 'string' ? parseFloat(height) : height
      return {width: h * ratio, height}
    }
    // If no explicit width/height, calculate based on container and aspect ratio
    return {width: containerWidth, height: containerWidth / ratio}
  }

  return {width, height} // Return original if no calculations possible
}

export function generateCacheKey(
  source: ImageSource | VideoSource
): string | undefined {
  if (source.cacheKey) return source.cacheKey
  if (source.uri) return source.uri
  return undefined
}

export function shouldCache(source: ImageSource | VideoSource): boolean {
  // Implement logic to determine if a source should be cached
  // For now, assume remote URIs should be cached unless explicitly told not to
  return !!source.uri && source.uri.startsWith('http')
}

export function buildOptimizedImageUrl({
  url,
  width,
  height,
  quality,
  format
}: {
  url: string
  width?: number
  height?: number
  quality?: number
  format?: string
}): string {
  // This is a placeholder for actual CDN-specific optimization logic
  // You would typically append query parameters like ?w=...&h=...&q=...&fm=...
  const params: string[] = []
  if (width) params.push(`w=${width}`)
  if (height) params.push(`h=${height}`)
  if (quality) params.push(`q=${quality}`)
  if (format) params.push(`fm=${format}`)

  if (params.length > 0) {
    const separator = url.includes('?') ? '&' : '?'
    return `${url}${separator}${params.join('&')}`
  }
  return url
}

export function getFilenameFromUrl(url: string): string {
  const parts = url.split('/')
  return parts[parts.length - 1].split('?')[0] // Remove query params
}

export function normalizeImageSource(
  source: string | number | ImageSource | ImageSource[]
): ImageSource | ImageSource[] | number {
  if (typeof source === 'string') {
    return {uri: source}
  }
  if (typeof source === 'number') {
    return source // Return number directly for local assets
  }
  return source
}

export function selectBestImageSource(
  sources: ImageSource[],
  targetWidth: number,
  targetHeight: number
): ImageSource {
  // Placeholder: In a real scenario, this would select the best resolution source
  // based on targetWidth/Height and available sources.
  return sources[0]
}

export function normalizeVideoSource(
  source: string | VideoSource
): VideoSource {
  if (typeof source === 'string') {
    return {uri: source}
  }
  return source
}

export function calculateDownscale({
  originalWidth,
  originalHeight,
  maxWidth,
  maxHeight
}: {
  originalWidth: number
  originalHeight: number
  maxWidth?: number
  maxHeight?: number
}): {width: number; height: number} {
  let width = originalWidth
  let height = originalHeight

  if (maxWidth && width > maxWidth) {
    height = (maxWidth / width) * height
    width = maxWidth
  }

  if (maxHeight && height > maxHeight) {
    width = (maxHeight / height) * width
    height = maxHeight
  }

  return {width, height}
}

export function shouldDownscale({
  imageWidth,
  imageHeight,
  containerWidth,
  containerHeight,
  threshold = 1.5
}: {
  imageWidth: number
  imageHeight: number
  containerWidth: number
  containerHeight: number
  threshold?: number
}): boolean {
  return (
    imageWidth > containerWidth * threshold ||
    imageHeight > containerHeight * threshold
  )
}

export function estimateMemoryUsage(): number {
  // Placeholder for a function to estimate memory usage for media
  return 0
}

export function createBlurhashPlaceholder(blurhash: string): string {
  return `data:image/jpeg;base64,${blurhash}` // This is an example, actual blurhash would need a decoder
}

export function createThumbhashPlaceholder(thumbhash: string): string {
  return `data:image/jpeg;base64,${thumbhash}` // Similar to blurhash
}

export function isValidImageSource(source: any): boolean {
  if (typeof source === 'string' && source.length > 0) return true
  if (typeof source === 'number') return true // Local image asset
  if (
    typeof source === 'object' &&
    source !== null &&
    'uri' in source &&
    typeof source.uri === 'string' &&
    source.uri.length > 0
  )
    return true
  return false
}

export function isValidVideoSource(source: any): boolean {
  if (typeof source === 'string' && source.length > 0) return true
  if (
    typeof source === 'object' &&
    source !== null &&
    'uri' in source &&
    typeof source.uri === 'string' &&
    source.uri.length > 0
  )
    return true
  // Also check for ChunkedVideoSource
  if (
    typeof source === 'object' &&
    source !== null &&
    'chunks' in source &&
    Array.isArray(source.chunks) &&
    source.chunks.length > 0
  )
    return true
  return false
}

export function getOptimalFormat(): string {
  // Placeholder for logic to determine optimal image format (e.g., webp, avif)
  return 'auto'
}

export function getQualityForFormat(): number {
  // Placeholder for logic to determine optimal quality for a given format
  return 80 // Default quality
}

// function shouldOptimizeUrl(url: string): boolean {
//   // Add logic to detect if URL is from a CDN that supports optimization
//   // This is a placeholder implementation
//   const cdnPatterns = [
//     'cloudinary.com',
//     'imgix.net',
//     'cloudflare.com',
//     'fastly.net'
//   ]

//   return cdnPatterns.some((pattern) => url.includes(pattern))
// }

export function getMediaType(
  source: string | ImageSource | VideoSource
): 'image' | 'video' | 'unknown' {
  let uri: string | undefined

  if (typeof source === 'string') {
    uri = source
  } else if ('uri' in source) {
    uri = source.uri
  } else if (
    'chunks' in source &&
    Array.isArray(source.chunks) &&
    source.chunks.length > 0
  ) {
    // For chunked video sources, take the URI of the first chunk
    uri = source.chunks[0].url
  }

  if (!uri) return 'unknown'

  // Check file extension
  const videoExtensions = [
    '.mp4',
    '.mov',
    '.avi',
    '.wmv',
    '.flv',
    '.webm',
    '.mkv',
    '.m4v',
    '.3gp'
  ]

  const imageExtensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
    '.bmp',
    '.svg',
    '.avif',
    '.heic'
  ]

  const lowerUri = uri.toLowerCase()

  if (videoExtensions.some((ext) => lowerUri.includes(ext))) {
    return 'video'
  }

  if (imageExtensions.some((ext) => lowerUri.includes(ext))) {
    return 'image'
  }

  // Check for video streaming patterns
  if (lowerUri.includes('youtube.com') || lowerUri.includes('vimeo.com')) {
    return 'video'
  }

  // Default to image if uncertain
  return 'image'
}

// Video Chunk Management Utilities

export function isChunkedVideo(source: any): source is ChunkedVideoSource {
  return (
    typeof source === 'object' &&
    'chunks' in source &&
    Array.isArray(source.chunks) &&
    source.chunks.every(
      (chunk: any) =>
        typeof chunk.url === 'string' &&
        typeof chunk.start === 'number' &&
        typeof chunk.end === 'number' &&
        typeof chunk.duration === 'number'
    )
  )
}

export function getCurrentChunk(
  chunks: VideoChunk[],
  currentTime: number
): VideoChunk | null {
  for (const chunk of chunks) {
    if (currentTime >= chunk.start && currentTime < chunk.end) {
      return chunk
    }
  }
  return chunks[chunks.length - 1] || null
}

export async function preloadChunk(chunk: VideoChunk): Promise<void> {
  try {
    await fetch(chunk.url, {method: 'HEAD'})
  } catch (error) {
    console.warn('Failed to preload chunk:', error)
  }
}
