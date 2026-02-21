import { zodResolver } from '@hookform/resolvers/zod'
import { BlurView } from 'expo-blur'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

// Logic Imports
import AppKeyboardAvoidingView from '@/components/ui/AppKeyboardAvoidingView'
import AppScreen from '@/components/ui/AppScreen'
import { AppToast } from '@/components/ui/AppToast'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import { useAuth } from '@/hooks/useAuth'
import { SignUpForm, SignUpSchema } from '@/validate/auth'

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const {signup, isSignupLoading} = useAuth()

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: ''
    }
  })

  const handleSignup = async (data: SignUpForm) => {
    setIsLoading(true)
    try {
      await signup({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone_number: data.phone_number,
        password1: data.password,
        password2: data.confirmPassword
      })
      AppToast.success({
        title: 'Signup Successful!',
        description: 'Please log in to get your information.'
      })
      router.replace('/(auth)/signin')
    } catch (err: any) {
      setIsLoading(false)
      AppToast.error({
        title: 'Signup Failed!',
        description: err?.message || 'Something went wrong!'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1">
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={['#CCFBF1', '#E0F2FE', '#F1F5F9']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        className="absolute inset-0"
      />

      <AppScreen animateOnFocus>
        <AppKeyboardAvoidingView>
          <View className="flex-1">
            {/* TOP NAVIGATION BAR - Fixed */}
            <View className="flex-row items-center justify-between pt-3 pb-4">
              <BackButton />
              <View className="flex-row items-center bg-white/40 px-4 py-2 rounded-full border border-white/60">
                <Text className="text-slate-600 mr-2 text-xs font-medium">
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={() => router.push('/(auth)/signin')}>
                  <Text className="text-blue-600 font-bold text-xs">
                    Sign In
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LOGO - Fixed */}
            <Animated.View
              entering={FadeInDown.delay(200).duration(800)}
              className="items-center mt-3 mb-4"
            >
              <Image
                source={require('@/assets/main-header-logo.png')}
                style={{width: 140, height: 50, resizeMode: 'contain'}}
              />
            </Animated.View>

            {/* MAIN GLASS CARD WITH SCROLLABLE CONTENT */}
            <Animated.View
              entering={FadeInDown.delay(400).springify()}
              className="flex-1 rounded-[48px] overflow-hidden border border-white/80 shadow-2xl shadow-black/5"
            >
              <BlurView
                intensity={100}
                tint="light"
                className="flex-1 bg-white/40"
              >
                <ScrollView
                  contentContainerStyle={{padding: 32, paddingBottom: 40}}
                  showsVerticalScrollIndicator={false}
                  bounces={true}
                >
                  <Text className="text-3xl font-bold text-slate-800 text-center">
                    Create Account
                  </Text>
                  <Text className="text-slate-500 text-center mt-2 mb-8 font-medium">
                    Let&apos;s get started!
                  </Text>

                  <View className="mb-5  gap-4">
                    <Controller
                      control={control}
                      name="first_name"
                      render={({field: {onChange, onBlur, value}}) => (
                        <Input
                          label="First Name"
                          leftIcon="user"
                          placeholder="John"
                          autoCapitalize="words"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={errors.first_name?.message}
                          containerClassName="flex-1"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="last_name"
                      render={({field: {onChange, onBlur, value}}) => (
                        <Input
                          label="Last Name"
                          leftIcon="user"
                          placeholder="Doe"
                          autoCapitalize="words"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={errors.last_name?.message}
                          containerClassName="flex-1"
                        />
                      )}
                    />
                  </View>

                  <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="Email Address"
                        leftIcon="mail"
                        placeholder="your@email.com"
                        autoCapitalize="none"
                        keyboardType="email-address"
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
                    name="phone_number"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="Phone Number"
                        leftIcon="phone"
                        placeholder="+1234567890"
                        keyboardType="phone-pad"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.phone_number?.message}
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
                        containerClassName="mb-5"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="Confirm Password"
                        leftIcon="lock"
                        placeholder="••••••••••••"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.confirmPassword?.message}
                        containerClassName="mb-8"
                      />
                    )}
                  />

                  {/* SIGN UP BUTTON */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit(handleSignup)}
                    disabled={isLoading}
                  >
                    <View className="rounded-2xl overflow-hidden">
                      <LinearGradient
                        colors={['#7494EC', '#5C7FE7']}
                        className="py-5 items-center shadow-lg shadow-blue-400"
                      >
                        <Text className="text-white font-bold text-lg">
                          {isSignupLoading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                      </LinearGradient>
                    </View>
                  </TouchableOpacity>

                  {/* SOCIAL LOGIN DIVIDER */}
                  <View className="flex-row items-center my-8">
                    <View className="flex-1 h-[1px] bg-slate-200" />
                    <Text className="mx-4 text-slate-400 font-medium">
                      Or sign up with
                    </Text>

                    <View className="flex-1 h-[1px] bg-slate-200" />
                  </View>

                  {/* GOOGLE SIGN UP */}
                  <TouchableOpacity className="flex-row items-center justify-center border border-slate-200 py-4 rounded-2xl bg-white/50">
                    <Image
                      source={{
                        uri: 'https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000'
                      }}
                      className="size-6 mr-3"
                    />
                    <Text className="text-slate-700 font-bold">
                      Sign up with Google
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </BlurView>
            </Animated.View>
          </View>
        </AppKeyboardAvoidingView>
      </AppScreen>
    </View>
  )
}
