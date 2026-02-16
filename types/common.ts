import {Feather, Ionicons} from '@expo/vector-icons'
import {ComponentProps, } from 'react'
import {
  StyleProp,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps,
  ViewStyle,
  ImageStyle,
} from 'react-native'
import { ImageContentFit, ImageContentPosition, ImageLoadEventData, ImageErrorEventData } from 'expo-image';


// Typo
export type TypoProps = {
  size?: number
  children: React.ReactNode
  className?: string
  style?: StyleProp<TextStyle>
  textProps?: TextProps
}
//loader type
export type LoaderType =
  | 'spinner'
  | 'dots'
  | 'bar'
  | 'pulse'
  | 'bounce'
  | 'wave'
  | 'orbit'
  | 'gradient'

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'
export interface LoaderProps {
  type?: LoaderType
  size?: LoaderSize
  color?: string
  secondaryColor?: string
  className?: string
  speed?: number
}

// Button
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'white'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type FeatherIconName = keyof typeof Feather.glyphMap
export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  /** Button content */
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  loaderType?: LoaderType
  leftIcon?: FeatherIconName
  rightIcon?: FeatherIconName
  iconSize?: number
  fullWidth?: boolean
  className?: string
  contentClassName?: string
  animated?: boolean
  iconColor?: string
  enhancedAnimation?: boolean
}

//input types
export interface InputProps extends TextInputProps {
  label?: string
  leftIcon?: keyof typeof Feather.glyphMap
  rightIcon?: keyof typeof Feather.glyphMap
  iconSize?: number
  iconColor?: string
  error?: string
  helperText?: string
  containerClassName?: string
  inputWrapperClassName?: string
  inputClassName?: string
  labelClassName?: string
  onRightIconPress?: () => void
  disabled?: boolean
}

//backbutton prop
export type BackButtonProps = {
  onPress?: () => void
  iconName?: ComponentProps<typeof Ionicons>['name']
  iconColor?: string
  iconSize?: number
} & TouchableOpacityProps


//screen types
export interface AppScreenProps {
  /** The content to be rendered within the screen. */
  children: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
  animateOnFocus?: boolean;
  removeHorizontalPadding?: boolean;
  horizontalPadding?: string;
  statusBarStyle?: 'light' | 'dark';
  isEnableLinearGradient?: boolean;
}


// Common Media Types

export type AspectRatio =
  | '1:1'   // Square (1.0)
  | '4:3'   // Standard (1.333)
  | '3:2'   // Classic photo (1.5)
  | '16:9'  // Widescreen (1.778)
  | '9:16'  // Vertical video (0.563)
  | '21:9'  // Ultrawide (2.333)
  | '2:3'   // Portrait (0.667)
  | number; // Custom ratio

export type ContentFit = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

export type Priority = 'low' | 'normal' | 'high';

export type CachePolicy = 'none' | 'disk' | 'memory' | 'memory-disk';

export interface MediaDimensions {
  width?: number | string;
  height?: number | string;
  aspectRatio?: AspectRatio;
}

export interface CacheOptions {
  cachePolicy?: CachePolicy;
  cacheKey?: string;
}

// Image Types

export interface ImageSource {
  uri?: string;
  blurhash?: string;
  thumbhash?: string;
  headers?: Record<string, string>;
  width?: number;
  height?: number;
  cacheKey?: string;
}

export interface OptimizedImageProps extends MediaDimensions {
  source: string | number | ImageSource | ImageSource[];
  placeholder?: string | ImageSource;
  contentFit?: ContentFit;
  contentPosition?: ImageContentPosition;
  priority?: Priority;
  cachePolicy?: CachePolicy;
  blurRadius?: number;
  tintColor?: string;
  allowDownscaling?: boolean;
  style?: ViewStyle | ImageStyle;
  className?: string;
  alt?: string;
  transition?: number;
  recyclingKey?: string;
  onLoad?: (event: ImageLoadEventData) => void;
  onError?: (event: ImageErrorEventData) => void;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  maxWidth?: number;
  maxHeight?: number;
}

// Video Types

// Define expo-video related types locally
export type VideoPlayerStatus = 'idle' | 'loading' | 'readyToPlay' | 'error';

export interface VideoPlayerError {
  message: string;
}

export interface VideoPlaybackStatus {
  status: VideoPlayerStatus;
  error?: VideoPlayerError;
  // Add other properties of the status object from expo-video if needed
  // e.g., isPlaying, isBuffering, positionMillis, durationMillis, etc.
  isPlaying: boolean;
  isBuffering: boolean;
  positionMillis: number;
  durationMillis: number;
  didJustFinish: boolean;
}


export interface VideoSource {
  uri?: string;
  headers?: Record<string, string>;
  metadata?: {
    title?: string;
    artist?: string;
    artwork?: string;
  };
}

// Chunked video support
export interface VideoChunk {
  url: string;
  start: number;
  end: number;
  duration: number;
}

export interface ChunkedVideoSource {
  chunks: VideoChunk[];
  totalDuration: number;
  baseUrl?: string;
}

export interface VideoControls {
  play?: boolean;
  pause?: boolean;
  replay?: boolean;
  mute?: boolean;
  volume?: number;
  playbackRate?: number;
  loop?: boolean;
  currentTime?: number;
}

export interface OptimizedVideoProps extends MediaDimensions {
  source: string | VideoSource | ChunkedVideoSource;
  poster?: string | ImageSource;
  contentFit?: ContentFit;
  priority?: Priority;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  volume?: number;
  playbackRate?: number;
  style?: ViewStyle;
  className?: string;
  showSkeleton?: boolean;
  skeletonClassName?: string;
  allowsFullscreen?: boolean;
  allowsPictureInPicture?: boolean;
  onLoad?: () => void;
  onError?: (error: VideoPlayerError) => void; // Updated type
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onPlaybackStatusUpdate?: (status: VideoPlaybackStatus) => void; // Updated type
  onReadyToDisplay?: () => void;
  resizeMode?: 'cover' | 'contain' | 'stretch';
}

// Enhanced video props for chunked playback control
export interface EnhancedVideoProps extends OptimizedVideoProps {
  enableChunkedPlayback?: boolean;
  onChunkChange?: (chunk: VideoChunk) => void;
  preloadNextChunk?: boolean;
}

// Media Grid Types (not directly used for now, but kept for completeness if needed later)

export interface MediaGridItem {
  id: string;
  type: 'image' | 'video';
  source: string | ImageSource | VideoSource;
  aspectRatio?: AspectRatio;
  placeholder?: string | ImageSource;
  poster?: string | ImageSource;
}

export interface MediaGridProps {
  items: MediaGridItem[];
  columns?: number;
  spacing?: number;
  aspectRatio?: AspectRatio;
  contentFit?: ContentFit;
  cachePolicy?: CachePolicy;
  showSkeleton?: boolean;
  style?: ViewStyle;
  className?: string;
  onItemPress?: (item: MediaGridItem) => void;
}

// Performance Types (placeholders for future use)

export interface MediaPerformanceOptions {
  enableCache?: boolean;
  preloadNext?: number;
  recycleViews?: boolean;
  downscaleThreshold?: number;
  progressiveLoad?: boolean;
  lazyLoad?: boolean;
  loadingDistance?: number;
}

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'auto';
  allowDownscaling?: boolean;
}