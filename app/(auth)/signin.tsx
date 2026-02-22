import {zodResolver} from '@hookform/resolvers/zod'
import {BlurView} from 'expo-blur'
import {LinearGradient} from 'expo-linear-gradient'
import {router} from 'expo-router'
import React, {useState} from 'react'
import {Controller, useForm} from 'react-hook-form'
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import Animated, {FadeInDown} from 'react-native-reanimated'

// Logic Imports
import AppKeyboardAvoidingView from '@/components/ui/AppKeyboardAvoidingView'
import AppScreen from '@/components/ui/AppScreen'
import {AppToast} from '@/components/ui/AppToast'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import {useAuth} from '@/hooks/useAuth'
import {SignInForm, SignInSchema} from '@/validate/auth'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const {login, isLoginLoading} = useAuth()

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const handleLogin = async (data: SignInForm) => {
    try {
      setIsLoading(true)

      await login({email: data.email, password: data.password})

      AppToast.success({
        title: 'Login successful!',
        description: 'Welcome back to Risus.'
      })

      router.replace('/(tabs)')
    } catch (err: any) {
      console.log(err)
      AppToast.error({
        title: 'Login failed!',
        description: err?.data || err?.message || 'Something went wrong'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1">
      {/* 1. BACKGROUND GRADIENT (Matches your design) */}
      <LinearGradient
        colors={['#CCFBF1', '#E0F2FE', '#F1F5F9']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        className="absolute inset-0"
      />

      <AppScreen animateOnFocus>
        <AppKeyboardAvoidingView>
          <ScrollView contentContainerStyle={{flexGrow: 1}} bounces={false}>
            {/* 2. TOP NAVIGATION BAR */}
            <View className="flex-row items-center justify-between pt-5 pb-4">
              <BackButton />
              <View className="flex-row items-center bg-white/40 px-4 py-2 rounded-full border border-white/60">
                <Text className="text-slate-600 mr-2 text-xs font-medium">
                  Don&apos;t have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                  <Text className="text-blue-600 font-bold text-xs">
                    Get Started
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-1 items-center">
              {/* LOGO */}
              <Animated.View
                entering={FadeInDown.delay(200).duration(800)}
                className="mt-4 mb-8"
              >
                <Image
                  source={require('@/assets/main-header-logo1.png')}
                  style={{width: 150, height: 70, resizeMode: 'contain'}}
                />
              </Animated.View>

              {/* 3. MAIN GLASS CARD */}
              <Animated.View
                entering={FadeInDown.delay(400).springify()}
                className="w-full rounded-[48px] overflow-hidden border border-white/80 shadow-2xl shadow-black/5"
              >
                <BlurView
                  intensity={100}
                  tint="light"
                  className="p-8 bg-white/40"
                >
                  <Text className="text-3xl font-bold text-slate-800 text-center">
                    Welcome Back
                  </Text>
                  <Text className="text-slate-500 text-center mt-2 mb-8 font-medium">
                    Please sign in to your account
                  </Text>

                  <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="Email Address"
                        leftIcon="mail"
                        placeholder="your@email.com"
                        autoCapitalize="none"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.email?.message}
                        containerClassName="mb-5"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="Password"
                        leftIcon="lock"
                        placeholder="••••••••••••"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.password?.message}
                        containerClassName="mb-8"
                      />
                    )}
                  />

                  {/* SIGN IN BUTTON */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit(handleLogin)}
                    disabled={isLoading}
                  >
                    <View className="rounded-2xl overflow-hidden">
                      <LinearGradient
                        colors={['#7494EC', '#5C7FE7']}
                        className="py-5 rounded-2xl items-center shadow-lg shadow-blue-400"
                      >
                        <Text className="text-white font-bold text-lg">
                          {isLoginLoading ? 'Signing In...' : 'Sign In'}
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity className="mt-6">
                    <Text className="text-center text-slate-500 font-semibold">
                      Forgot your password?
                    </Text>
                  </TouchableOpacity>

                  {/* SOCIAL LOGIN DIVIDER */}
                  <View className="flex-row items-center my-8">
                    <View className="flex-1 h-[1px] bg-slate-200" />
                    <Text className="mx-4 text-slate-400 font-medium">
                      Or sign in with
                    </Text>
                    <View className="flex-1 h-[1px] bg-slate-200" />
                  </View>

                  {/* GOOGLE SIGN IN (Placeholder Design) */}
                  <TouchableOpacity className="flex-row items-center justify-center border border-slate-200 py-4 rounded-2xl bg-white/50">
                    <Image
                      source={{
                        uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.png'
                      }}
                      className="w-5 h-5 mr-3"
                    />
                    <Text className="text-slate-700 font-bold">
                      Sign in with Google
                    </Text>
                  </TouchableOpacity>
                </BlurView>
              </Animated.View>
            </View>
          </ScrollView>
        </AppKeyboardAvoidingView>
      </AppScreen>
    </View>
  )
}
