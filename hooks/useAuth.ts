import {api} from '@/lib/axios'
import {clearToken, setToken, setUserInfo} from '@/utils/storage'
import {useMutation, useQueryClient} from '@tanstack/react-query'
import * as Google from 'expo-auth-session/providers/google'
import {useState} from 'react'
import {Platform} from 'react-native'

/* ================= TYPES ================= */

type LoginPayload = {
  email: string
  password: string
}

type SignupPayload = {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  password1: string
  password2: string
}

type ForgotPasswordPayload = {
  email: string
}

type GoogleUserInfo = {
  id: string
  email: string
  name: string
}

const googleConfig = Platform.select({
  ios: {
    iosClientId:
      '648777206637-hguiupk76aio67enkivt3rubkmg7qfof.apps.googleusercontent.com',
    scopes: ['profile', 'email']
  },
  android: {
    androidClientId:
      '648777206637-ffiqpumuoecbqrmt2c7pv468oc8l07rt.apps.googleusercontent.com',
    scopes: ['profile', 'email']
  },
  default: {
    webClientId:
      '648777206637-3v7v5978um0bgrc63eij8t0ab350deu0.apps.googleusercontent.com',
    scopes: ['profile', 'email']
  }
})

/* ================= HOOK ================= */

export const useAuth = () => {
  const queryClient = useQueryClient()
  const [isGoogleLoginLoading, setIsGoogleLoginLoading] = useState(false)
  const [googleRequest, , googlePromptAsync] =
    Google.useAuthRequest(googleConfig)

  /* ================= LOGIN ================= */

  const loginMutation = useMutation({
    mutationFn: async (data: LoginPayload) => {
      const res = await api.post('/user/obtain-token/', data)
      return res.data
    },
    onSuccess: (data) => {
      setToken(data.key)
    }
  })

  /* ================= SIGNUP ================= */

  const signupMutation = useMutation({
    mutationFn: async (data: SignupPayload) => {
      const res = await api.post('/user/user-register/', data)
      return res.data
    },
    onSuccess: (data) => {
      // If backend returns token after signup
      if (data.key) {
        setToken(data.key)
      }
    }
  })

  /* ================= Google Login ================= */
  const googleSignIn = async () => {
    const authResult = await googlePromptAsync()

    if (authResult.type !== 'success') {
      throw new Error('Google sign in was cancelled')
    }

    const accessToken = authResult.authentication?.accessToken

    if (!accessToken) {
      throw new Error('Google access token is missing')
    }

    setIsGoogleLoginLoading(true)

    try {
      const profileRes = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: {Authorization: `Bearer ${accessToken}`}
        }
      )

      const userInfo = (await profileRes.json()) as GoogleUserInfo

      if (!userInfo?.email) {
        throw new Error('Failed to fetch Google user info')
      }

      setUserInfo(userInfo)

      const backendResponse = await api.post('/user/google-login/', {
        access_token: accessToken,
        user_type: '2',
        user_data: {
          email: userInfo.email,
          googleId: userInfo.id,
          name: userInfo.name
        },
        google_loggedin_data: {
          userInfo
        }
      })

      const token = backendResponse?.data?.key

      if (!token) {
        throw new Error('Token not found on google login')
      }

      setToken(token)
      return backendResponse.data
    } finally {
      setIsGoogleLoginLoading(false)
    }
  }
  /* ================= FORGOT PASSWORD ================= */

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordPayload) => {
      const res = await api.post('/user/forgot-password/', data)
      return res.data
    }
  })

  /* ================= LOGOUT ================= */

  const logout = async () => {
    clearToken()
    await queryClient.clear() // clear cached user queries
  }

  return {
    // login
    login: loginMutation.mutateAsync,
    isLoginLoading: loginMutation.isPending,
    googleSignIn,
    isGoogleLoginLoading,
    isGooglePromptReady: Boolean(googleRequest),

    // signup
    signup: signupMutation.mutateAsync,
    isSignupLoading: signupMutation.isPending,

    // forgot password
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotLoading: forgotPasswordMutation.isPending,

    // logout
    logout
  }
}
