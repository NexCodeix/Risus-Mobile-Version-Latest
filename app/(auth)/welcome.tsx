import {BlurView} from 'expo-blur'
import {LinearGradient} from 'expo-linear-gradient'
import {router} from 'expo-router'
import {Smile, Sparkles} from 'lucide-react-native'
import React from 'react'
import {Image, Text, TouchableOpacity, View} from 'react-native'
import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated'
import {SafeAreaView} from 'react-native-safe-area-context'

const WelcomeScreen = () => {
  return (
    <View className="flex-1">
      {/* 1. CLEAN GRADIENT BACKGROUND */}
      <LinearGradient
        colors={['#D1FAE5', '#DBEAFE', '#F8FAFC']} // Mint -> Light Blue -> White
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-around py-8">
          {/* LOGO SECTION */}
          <Animated.View entering={FadeIn.delay(300)} className="items-center">
            <Image
              source={require('@/assets/main-header-logo1.png')}
              style={{width: 150, height: 80, resizeMode: 'contain'}}
            />
            {/* Pagination Dots */}
            {/* <View className="flex-row gap-2 mt-5">
              <View className="w-10 h-1.5 rounded-full bg-blue-500/80" />
              <View className="w-2 h-1.5 rounded-full bg-blue-200" />
              <View className="w-2 h-1.5 rounded-full bg-blue-200" />
            </View> */}
          </Animated.View>

          {/* 2. CENTRAL VISUAL */}
          <Animated.View
            entering={FadeInDown.delay(400).springify()}
            className="items-center"
          >
            <View className="rounded-[50px] overflow-hidden border border-white shadow-2xl shadow-blue-200/50">
              <BlurView
                intensity={100}
                tint="light"
                className="p-12 items-center bg-white/30"
              >
                <View className="rounded-full overflow-hidden">
                  <LinearGradient
                    colors={['#60A5FA', '#3B82F6']}
                    className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
                  >
                    <Smile size={48} color="white" strokeWidth={1.5} />
                  </LinearGradient>
                </View>
              </BlurView>
            </View>
          </Animated.View>

          {/* 3. BOTTOM CONTENT CARD */}
          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            className="w-[92%] px-4"
          >
            <View className="rounded-[48px] overflow-hidden border border-white/80 shadow-2xl shadow-black/5">
              <BlurView
                intensity={80}
                tint="light"
                className="p-10 items-center bg-white/40"
              >
                <View className="flex-row items-center gap-2 mb-4">
                  <Sparkles size={16} color="#3B82F6" />
                  <Text className="text-blue-600 font-bold uppercase tracking-[3px] text-[11px]">
                    Risus Social
                  </Text>
                </View>

                <Text className="text-[30px] font-bold text-slate-800 text-center leading-[38px]">
                  Share your story{'\n'}
                  <Text className="text-blue-600">and connect</Text> with the
                  world
                </Text>

                <TouchableOpacity
                  onPress={() => router.push('/(auth)/signup')}
                  activeOpacity={0.8}
                  className="w-full mt-10"
                >
                  <View className="rounded-2xl overflow-hidden">
                    <LinearGradient
                      colors={['#6385E8', '#4F70D9']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      className="py-5 items-center shadow-lg shadow-blue-300"
                    >
                      <Text className="text-white font-bold text-lg tracking-wide">
                        Get Started
                      </Text>
                    </LinearGradient>
                  </View>
                </TouchableOpacity>
              </BlurView>
            </View>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default WelcomeScreen
