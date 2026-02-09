import {useAuthStore} from '@/store/useAuthStore'
import axios from 'axios'

/* ================= CONFIG ================= */

const API_BASE_URL = 'https://api.risus.io/api'
const ENABLE_API_LOGS = true

/* ================= AXIOS ================= */

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
})

/* ================= LOGGER ================= */

const log = (...args: any[]) => ENABLE_API_LOGS && console.log(...args)

const divider = () =>
  ENABLE_API_LOGS && console.log('────────────────────────────')

/* ================= REQUEST ================= */

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  ;(config as any)._startTime = Date.now()

  log('\n🟡 API REQUEST')
  log('➡️', config.method?.toUpperCase(), config.url)
  log('📦 Body:', config.data)

  return config
})

/* ================= REFRESH LOCK ================= */

let refreshPromise: Promise<string | null> | null = null

/**
 SINGLE refresh for multiple 401s
 */
const getFreshToken = async () => {
  if (!refreshPromise) {
    refreshPromise = useAuthStore.getState().refreshAccessToken()

    refreshPromise.finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

/* ================= RESPONSE ================= */

api.interceptors.response.use(
  (res) => {
    const time = Date.now() - ((res.config as any)._startTime ?? Date.now())

    log(
      '🟢 API RESPONSE',
      res.config.url,
      `${time}ms`,
      'Status Code:',
      res.status
    )
    divider()

    return res
  },

  async (error) => {
    const originalRequest = error.config

    const normalizedError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Request failed',
      raw: error.response?.data
    }

    log('🔴 API ERROR', originalRequest?.url, normalizedError)

    /**
     ✅ AUTO REFRESH
     */
    if (normalizedError.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        const newToken = await getFreshToken()

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest)
        }
      } catch {
        // refreshAccessToken already logs out
      }
    }

    divider()

    return Promise.reject(normalizedError)
  }
)
