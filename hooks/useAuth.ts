import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { setToken, clearToken } from "@/utils/storage";

/* ================= TYPES ================= */

type LoginPayload = {
  email: string;
  password: string;
};

type SignupPayload = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password1: string;
  password2: string;
};

type ForgotPasswordPayload = {
  email: string;
};

/* ================= HOOK ================= */

export const useAuth = () => {
  const queryClient = useQueryClient()

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
  const googleLoginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('user/google-login/')
      return res.data
    },
    onSuccess: (data) => {
      if (data.access_token) {
        setToken(data.access_token)
      } else {
        console.log('Token not found on google login')
      }
    }
  })
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
    googleLogin: googleLoginMutation.mutateAsync,
    isGoogleLoginLoading: googleLoginMutation.isPending,

    // signup
    signup: signupMutation.mutateAsync,
    isSignupLoading: signupMutation.isPending,

    // forgot password
    forgotPassword: forgotPasswordMutation.mutateAsync,
    isForgotLoading: forgotPasswordMutation.isPending,

    // logout
    logout
  }
};
