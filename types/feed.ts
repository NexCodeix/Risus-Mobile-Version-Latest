/**
 * Feed Types
 * Type definitions for the feed system
 */

export interface User {
  id: string
  email: string
  username: string
  display_name?: string
  first_name?: string
  last_name?: string
  image?: string
}

export interface MediaItem {
  id: string
  file: string
  file_type: 'image' | 'video'
  thumbnail?: string
}

export interface Post {
  id: string
  user: User
  content: string
  images: MediaItem[]
  thread?: string
  title?: string
  is_liked: boolean
  is_repost: boolean
  total_likes: number
  total_comments: number
  total_reposts: number
  date_created: string
}

export interface RepostData {
  [threadId: string]: Post[]
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
