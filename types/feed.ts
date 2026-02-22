/**
 * Feed Types
 * Type definitions matching the actual API response
 */

export interface User {
  user_id: number
  email: string
  username: string
  display_name?: string
  first_name?: string
  last_name?: string
  image?: string
}

export interface MediaItem {
  id: number
  file: string
  file_type: 'image' | 'video'
  thumbnail?: string
}

export interface Post {
  id: number
  user: User
  content: string
  images: MediaItem[]
  thread?: number | string // API sends number, hooks might use string
  title?: string
  is_liked: boolean
  is_repost: boolean
  total_likes: number
  total_comments: number
  total_reposts: number
  date_created: string
  is_bookmarked?: boolean
  is_draft?: boolean
  is_highlight?: boolean
  enable_comment?: boolean
  enable_community?: boolean
}

export interface FeedResponse {
  results: Post[]
  count: number
  next: string | null
  previous: string | null
}

export interface RepostsResponse {
  results: Post[]
  count: number
  next: string | null
  previous: string | null
}
