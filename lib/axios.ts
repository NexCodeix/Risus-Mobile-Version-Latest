import {useAuthStore} from '@/store/useAuthStore'
import {getAccessToken} from '@/utils/authToken'
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
  const token = getAccessToken()
  // console.log('Token from axios', token)

  if (token) {
    config.headers.Authorization = `Token ${token}`
  }

  ;(config as any)._startTime = Date.now()

  log('🟡 API REQUEST')
  log('➡️', config.method?.toUpperCase(), config.url)
  log('➡️', config.headers)
  log('📦 Body:', config.data)

  return config
})

/* ================= RESPONSE ================= */

api.interceptors.response.use(
  (res) => {
    const time = Date.now() - ((res.config as any)._startTime ?? Date.now())

    log('🟢 API RESPONSE', res.config.url, `${time}ms`, 'Status:', res.status)

    divider()

    return res
  },

  async (error) => {
    const status = error.response?.status ?? 0

    const normalizedError = {
      status,
      message:
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Request failed',
      raw: error.response?.data
    }

    log('🔴 API ERROR', error.config?.url, normalizedError)

    /**
     👉 Force logout on unauthorized
     */
    if (status === 401) {
      const logout = useAuthStore.getState().logout

      // Prevent multiple logout calls
      if (useAuthStore.getState().isAuthenticated) {
        logout()
      }
    }

    divider()

    return Promise.reject(normalizedError)
  }
)
