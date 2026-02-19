import {useMutation, useQueryClient} from '@tanstack/react-query'
import {
  PostData,
  CreatePostResponse,
  UploadMediaParams,
  MediaItem
} from '@/types/media.types'
import {getToken} from '@/utils/storage'
import {api} from '@/lib/axios'

// Create Post
export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (postData: PostData): Promise<CreatePostResponse> => {
      const token = getToken()
      if (!token) throw new Error('Authentication token not found')

      const response = await api.post<CreatePostResponse>('/posts/', postData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`
        }
      })

      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch posts
      queryClient.invalidateQueries({queryKey: ['posts']})
    }
  })
}

// Upload Media
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({postId, media}: UploadMediaParams): Promise<void> => {
      const token = getToken()
      if (!token) throw new Error('Authentication token not found')

      const formData = new FormData()
      formData.append('post', postId)

      media.forEach((item, index) => {
        const mediaFileName = item.name || `media_${index}_${Date.now()}.jpg`
        const mediaMimeType = item.mimeType || 'image/jpeg'

        // @ts-ignore - FormData append with file object
        formData.append('file', {
          uri: item.uri,
          name: mediaFileName,
          type: mediaMimeType
        })
      })

      await api.post('/posts/add-file/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Token ${token}`
        }
      })
    }
  })
}

// Get Post by ID
export const useGetPost = () => {
  return useMutation({
    mutationFn: async (postId: string): Promise<CreatePostResponse> => {
      const token = getToken()
      if (!token) throw new Error('Authentication token not found')

      const response = await api.get<CreatePostResponse>(`/posts/${postId}/`, {
        headers: {
          Authorization: `Token ${token}`
        }
      })

      return response.data
    }
  })
}

// Combined hook for creating post with media
export const useCreatePostWithMedia = () => {
  const createPost = useCreatePost()
  const uploadMedia = useUploadMedia()
  const getPost = useGetPost()

  const createPostWithMedia = async (
    postData: PostData,
    media: MediaItem[]
  ): Promise<CreatePostResponse> => {
    try {
      // Step 1: Create the post
      const createdPost = await createPost.mutateAsync(postData)

      // Step 2: Upload media if any
      if (media.length > 0) {
        await uploadMedia.mutateAsync({
          postId: createdPost.id,
          media
        })

        // Step 3: Fetch updated post with media
        const updatedPost = await getPost.mutateAsync(createdPost.id)
        return updatedPost
      }

      return createdPost
    } catch (error) {
      throw error
    }
  }

  return {
    createPostWithMedia,
    isLoading:
      createPost.isPending || uploadMedia.isPending || getPost.isPending,
    error: createPost.error || uploadMedia.error || getPost.error
  }
}
