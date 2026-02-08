import {create} from 'zustand'
import {setToken, getTokens, clearTokens} from '@/utils/storage'
import {api} from '@/lib/axios'
import {useUserStore} from './useUserStore'

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean

  hydrate: () => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

/**
 * Prevent multiple refresh calls simultaneously
 */

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,

  /**
   Instant hydration from MMKV
   */
  hydrate: () => {
    const {accessToken} = getTokens()

    if (accessToken) {
      set({
        accessToken,
        isAuthenticated: true
      })
    }
  },

  /**
   LOGIN
   */
  login: async (email, password) => {
    try {
      set({isLoading: true})

      const res = await api.post('/user/obtain-token/', {
        email,
        password
      })

      const {key} = res.data

      setToken(key)

      set({
        accessToken: key,
        isAuthenticated: true,
        isLoading: false
      })
    } catch (err) {
      set({isLoading: false})
      throw err
    }
  },

  /**
   LOGOUT
   */
  logout: () => {
    clearTokens()
    useUserStore.getState().clearUser()

    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false
    })
  }
}))
