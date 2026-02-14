import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import {
  deactivateAccount,
  getUserProfile,
  requestDeleteAccount
} from '@/services/user.service'
import {queryKeys} from '@/lib/query-keys'
import {useAuthStore} from '@/store/useAuthStore'
import {Alert} from 'react-native'
import {useUserStore} from '@/store/useUserStore'
import {useEffect} from 'react'

export const useProfile = () => {
  const queryClient = useQueryClient()
  const {logout} = useAuthStore()
  const {setUser} = useUserStore()

  /**
   * Query for fetching the user profile.
   */
  const {
    data: user,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: queryKeys.user.profile,
    queryFn: getUserProfile
  })

  // Set user when data is fetched
  useEffect(() => {
    if (user) {
      setUser(user)
    }
  }, [user, setUser])

  // Handle errors if user  unauthorized thats instancely logged out
  useEffect(() => {
    if (error && (error as any).response?.status === 401) {
      logout()
    }
  }, [error, logout])

  /**
   * Mutation for deactivating the user account.
   */
  const {mutate: deactivate, isPending: isDeactivating} = useMutation({
    mutationFn: deactivateAccount,
    onSuccess: () => {
      Alert.alert(
        'Account Deactivated',
        'Your account has been deactivated successfully.',
        [{text: 'OK', onPress: () => logout()}]
      )
    },
    onError: (err: any) => {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to deactivate account.'
      )
    }
  })

  /**
   * Mutation for requesting account deletion.
   */
  const {mutate: requestDeletion, isPending: isDeleting} = useMutation({
    mutationFn: requestDeleteAccount,
    onSuccess: () => {
      Alert.alert(
        'Deletion Request Submitted',
        'Your account will be permanently deleted soon.',
        [{text: 'OK'}]
      )
      // Optional: Invalidate queries or log out
      queryClient.invalidateQueries({queryKey: queryKeys.user.profile})
    },
    onError: (err: any) => {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Failed to submit deletion request.'
      )
    }
  })

  return {
    user,
    isLoading,
    isError,
    error,
    deactivate,
    isDeactivating,
    requestDeletion,
    isDeleting
  }
}
