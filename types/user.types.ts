/* ================= POST IMAGE ================= */

export type PostImage = {
  id: number
  image: string
}

/* ================= POST ================= */

export type Post = {
  id: number
  title: string
  content: string

  date_created: string // ISO string
  last_updated: string // ISO string

  enable_comment: boolean
  enable_community: boolean

  is_draft: boolean
  is_highlight: boolean
  is_liked: boolean
  is_repost: boolean

  total_likes: number
  total_reposts: number

  thread: number
  main_post: number | null
  user: number

  images: PostImage[] // was [Array]
}

/* ================= USER ================= */

export type User = {
  id: number

  username: string
  email: string

  first_name: string
  last_name: string

  bio: string | null
  summary: string

  phone_number: string

  date_of_birth: string // ISO date
  graduation_date: string // ISO date

  designation: string
  company_name: string

  study: string

  location: string | null
  country: string

  image: string // profile image
  cover_image: string

  profile_link: string

  is_staff: boolean

  achievements: string | null

  third_party_authenticated_by: string | null
  third_party_authentication_data: Record<string, any>

  total_appearance: number
  total_contribution: number
  total_followers: number
  total_following: number
  total_likes: number
  total_views: number

  posts: Post[]
}
