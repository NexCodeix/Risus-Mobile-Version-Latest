import {create} from 'zustand'
import {setToken, getToken, clearToken} from '@/utils/storage'
import {api} from '@/lib/axios'
import {useUserStore} from './useUserStore'

type AuthState = {
  accessToken: string | null
  isHydrated: boolean

  hydrate: () => void
  login: (token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isHydrated: false,

  hydrate: () => {
    const token = getToken()

    set({
      accessToken: token ?? null,
      isHydrated: true
    })
  },

  login: (token) => {
    setToken(token)

    set({
      accessToken: token,
      isHydrated: true
    })
  },

  logout: () => {
    clearToken()

    set({
      accessToken: null,
      isHydrated: true
    })
  }
}))
