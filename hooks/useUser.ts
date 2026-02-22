import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import {api} from '@/lib/axios'
import {getToken} from '@/utils/storage'
import {User} from '@/types/user.types'

/* ================= HOOK ================= */

export const useUser = () => {
  const queryClient = useQueryClient()

  const token = getToken()

  /* ================= FETCH USER ================= */

  const userQuery = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const res = await api.get('/user/profile/')
      return res.data
    },
    enabled: !!token,
    retry: false
  })

  /* ================= UPDATE USER ================= */

  const updateUserMutation = useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await api.post('/user/profile/update/', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(['user'], updatedUser)
    }
  })

  return {
    user: userQuery.data,
    isUserLoading: userQuery.isLoading,
    userError: userQuery.error,

    updateUser: updateUserMutation.mutateAsync,
    isUpdating: updateUserMutation.isPending
  }
}
