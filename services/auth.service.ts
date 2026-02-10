import { api } from "@/lib/axios";
import {useAuthStore} from '@/store/useAuthStore'
import {useUserStore} from '@/store/useUserStore'
import {clearToken} from '@/utils/storage'

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post('/user/obtain-token/', {
    email,
    password
  })

  return res.data
}

export const verifySession = async () => {
  const token = useAuthStore.getState().accessToken

  if (!token) return false

  try {
    await useUserStore.getState().fetchUser()
    return true
  } catch {
    clearToken()

    useAuthStore.getState().logout()
    return false
  }
}
