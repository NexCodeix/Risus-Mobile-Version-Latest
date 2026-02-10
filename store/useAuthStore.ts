import {create} from 'zustand'
import {setToken, getToken, clearToken} from '@/utils/storage'
import {api} from '@/lib/axios'
import {useUserStore} from './useUserStore'

type AuthState = {
  accessToken: string | null
  isHydrated: boolean
  isAuthenticated: boolean
  isLoading: boolean

  hydrate: () => void
  login: (token: string) => void
  logout: () => void
}

/**
 * Prevent multiple refresh calls simultaneously
 */

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  isHydrated: false,
  isAuthenticated: false,
  isLoading: false,

  /**
   Instant hydration from MMKV
   */
  hydrate: () => {
    const token = getToken()
    // console.log('Token hydrate', token)

    if (token) {
      set({
        accessToken: token,
        isAuthenticated: true,
        isHydrated: true
      })
    }
  },

  /**
   LOGIN
   */
  login: (token) => {
    setToken(token)
    set({
      accessToken: token,
      isAuthenticated: true,
      isHydrated: true
    })
  },

  /**
   LOGOUT
   */
  logout: () => {
    clearToken()
    // useUserStore.getState().clearUser()

    set({
      accessToken: null,
      isHydrated: true,
      isAuthenticated: false
    })
  }
}))
