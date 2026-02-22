/**
 * Feed API Hooks
 * TanStack Query hooks for feed, reposts, and related data
 */

import {api} from '@/lib/axios'
import {FeedResponse, RepostsResponse} from '@/types/feed'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'

// Feed Hooks

/**
 * Fetch main feed with infinite scroll
 * Filters out reposts to show only original posts
 */
export function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({pageParam = 1}) => {
      const response = await api.get<FeedResponse>(`/feed/?page=${pageParam}`)
      return response.data
    },
    getNextPageParam: (lastPage: FeedResponse) => {
      if (!lastPage.next) return undefined
      const url = new URL(lastPage.next)
      return url.searchParams.get('page')
    },
    initialPageParam: "1",
    select: (data) => ({
      pages: data.pages.map((page) => ({
        ...page,
        // Filter out reposts from main feed
        results: page.results.filter((post) => !post.is_repost)
      })),
      pageParams: data.pageParams
    })
  })
}

/**
 * Refresh feed (pull to refresh)
 */
export function useRefreshFeed() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const response = await api.get<FeedResponse>('/feed/?page=1')
      return response.data
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['feed'], (old: any) => ({
        pages: [data],
        pageParams: [1]
      }))
    }
  })
}

// Reposts Hooks

/**
 * Fetch reposts for a specific thread
 * @param threadId - The thread ID to fetch reposts for
 * @param enabled - Whether to enable the query
 */
export function useReposts(threadId: string | null, enabled = false) {
  return useInfiniteQuery({
    queryKey: ['reposts', threadId],
    queryFn: async ({pageParam = 1}) => {
      if (!threadId) throw new Error('No thread ID provided')

      const response = await api.get<RepostsResponse>(
        `/feed/${threadId}/get-reposts/?page=${pageParam}&is_repost=true`
      )

      // Filter out the original post from reposts
      const filteredResults = response.data.results.filter(
        (repost) => repost.is_repost === true
      )
console.log("filter result repost data", filteredResults);
      return {
        ...response.data,
        results: filteredResults
      }
    },
    getNextPageParam: (lastPage: RepostsResponse) => {
      if (!lastPage.next) return undefined
      const url = new URL(lastPage.next)
      return url.searchParams.get('page')
    },
    initialPageParam: "1",
    enabled: !!threadId && enabled
  })
}

/**
 * Get repost images for bottom carousel
 * Extracts first 3 images from reposts
 */
export function useRepostImages(threadId: string | null) {
  const {data: repostsData} = useReposts(threadId, !!threadId)

  const reposts = repostsData?.pages.flatMap((page) => page.results) || []

  // Extract images from reposts
  const images: string[] = []

  reposts.forEach((repost) => {
    if (repost.images && repost.images.length > 0) {
      repost.images.forEach((media) => {
        if (media.file_type === 'image' && media.file) {
          images.push(media.file)
        }
      })
    }
  })

  // Return first 3 unique images
  return [...new Set(images)].slice(0, 3)
}

// User Hooks

/**
 * Get current user profile
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: async () => {
      const response = await api.get('/user/profile/')
      return response.data
    }
  })
}

/**
 * Get notifications
 */
export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const response = await api.get('/notifications/')
      return response.data.results || []
    }
  })
}

// Post Actions Hooks

/**
 * Like a post
 */
export function useLikePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.post(`/feed/${postId}/like/`)
      return response.data
    },
    onSuccess: (_, postId) => {
      // Invalidate feed to refresh like counts
      queryClient.invalidateQueries({queryKey: ['feed']})
      queryClient.invalidateQueries({queryKey: ['reposts']})
    }
  })
}

/**
 * Create a repost
 */
export function useCreateRepost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      threadId,
      content,
      images
    }: {
      threadId: string
      content?: string
      images?: File[] // Note: File type might need adjustment for React Native
    }) => {
      const formData = new FormData()
      formData.append('thread', threadId)
      if (content) formData.append('content', content)

      if (images && images.length > 0) {
        images.forEach((image, index) => {
          // @ts-ignore - FormData for React Native handles files this way
          formData.append(`images[${index}]`, image)
        })
      }

      const response = await api.post('/feed/create-repost/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({queryKey: ['feed']})
      try {
        queryClient.invalidateQueries({
          queryKey: ['reposts', variables.threadId]
        })
      } catch (e) {
        // ignore
      }
    }
  })
}

/**
 * Delete a post/repost
 */
export function useDeletePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await api.delete(`/feed/${postId}/`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['feed']})
      queryClient.invalidateQueries({queryKey: ['reposts']})
    }
  })
}
