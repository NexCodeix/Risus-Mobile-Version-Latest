// constants/api.constants.ts

// API Base URL - now handled by your axios instance
export const API_BASE_URL = 'https://api.risus.io/api';

// API Endpoints (relative paths since axios instance has baseURL)
export const API_ENDPOINTS = {
  POSTS: '/posts/',
  POST_DETAIL: (id: string) => `/posts/${id}/`,
  ADD_MEDIA: '/posts/add-file/',
  USER_PROFILE: '/users/profile/',
} as const;

// Media Configuration
export const MEDIA_CONFIG = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_MEDIA_COUNT: 10,
  IMAGE_QUALITY: 0.8,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Camera Configuration
export const CAMERA_CONFIG = {
  QUALITY: 0.8,
  ALLOW_EDITING: false,
  ASPECT_RATIO: [16, 9] as [number, number],
  VIDEO_MAX_DURATION: 60, // seconds
} as const;

// Storage Keys (you might already have these in your storage utils)
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  DRAFT_POSTS: 'draftPosts',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NO_AUTH_TOKEN: 'Authentication token not found. Please log in again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  PERMISSION_DENIED: 'Permission denied. Please enable permissions in settings.',
  FILE_TOO_LARGE: 'File size too large. Maximum 10MB allowed.',
  INVALID_FILE_TYPE: 'Invalid file type. Only images are allowed.',
  MAX_MEDIA_REACHED: 'Maximum media limit reached.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const;

// Post Settings
export const POST_SETTINGS = {
  WHO_CAN_SEE: ['everyone', 'followers', 'only_me'] as const,
  DEFAULT_VISIBILITY: 'everyone',
  ENABLE_COMMENTS_DEFAULT: true,
  ENABLE_COMMUNITY_DEFAULT: true,
} as const;

export type WhoCanSee = typeof POST_SETTINGS.WHO_CAN_SEE[number];