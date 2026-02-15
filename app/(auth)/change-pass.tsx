import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

import AppKeyboardAvoidingView from '@/components/ui/AppKeyboardAvoidingView'
import AppScreen from '@/components/ui/AppScreen'
import BackButton from '@/components/ui/BackButton'
import Input from '@/components/ui/Input'
import { ChangePasswordForm, ChangePasswordSchema } from '@/validate/auth'
import { BlurView } from 'expo-blur'
import Animated, { FadeInDown } from 'react-native-reanimated'

export default function ChangePass() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: {errors}
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    }
  })

  const onSubmit = (data: ChangePasswordForm) => {
    console.log(data)
    // Add your logic to change the password
  }

  return (
    <View className="flex-1">
      <LinearGradient
        colors={['#CCFBF1', '#E0F2FE', '#F1F5F9']}
        start={{x: 0, y: 0}}
        end={{x: 0, y: 1}}
        className="absolute inset-0"
      />
      <AppScreen>
        <AppKeyboardAvoidingView>
          <View className="flex-row items-center justify-between pt-5 pb-4">
            <BackButton />
          </View>
          <ScrollView contentContainerStyle={{flexGrow: 1}} bounces={false}>
            <View className="flex-1 items-center justify-center">
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
                    Change Password
                  </Text>
                  <Text className="text-slate-500 text-center mt-2 mb-8 font-medium">
                    Please enter your new password details.
                  </Text>

                  <Controller
                    control={control}
                    name="currentPassword"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="Current Password"
                        leftIcon="lock"
                        placeholder="••••••••••••"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.currentPassword?.message}
                        containerClassName="mb-5"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="newPassword"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="New Password"
                        leftIcon="lock"
                        placeholder="••••••••••••"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.newPassword?.message}
                        containerClassName="mb-5"
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="confirmNewPassword"
                    render={({field: {onChange, onBlur, value}}) => (
                      <Input
                        label="Confirm New Password"
                        leftIcon="lock"
                        placeholder="••••••••••••"
                        secureTextEntry
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.confirmNewPassword?.message}
                        containerClassName="mb-8"
                      />
                    )}
                  />

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    <View className="rounded-2xl overflow-hidden">
                      <LinearGradient
                        colors={['#7494EC', '#5C7FE7']}
                        className="py-5 rounded-2xl items-center shadow-lg shadow-blue-400"
                      >
                        <Text className="text-white font-bold text-lg">
                          {isLoading ? 'Saving...' : 'Save Changes'}
                        </Text>
                      </LinearGradient>
                    </View>
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
