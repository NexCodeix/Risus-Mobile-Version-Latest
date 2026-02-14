import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Heart, MessageSquare, Plus, Smile, Sparkles } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// Subtle floating animation for the center elements
const Floating = ({ children, offset = 10, duration = 3000 }: any) => {
  const translate = useSharedValue(0);
  useEffect(() => {
    translate.value = withRepeat(
      withSequence(
        withTiming(-offset, { duration }),
        withTiming(0, { duration })
      ),
      -1,
      true
    );
  }, []);
  return (
    <Animated.View style={useAnimatedStyle(() => ({ transform: [{ translateY: translate.value }] }))}>
      {children}
    </Animated.View>
  );
};

const WelcomeScreen = () => {
  return (
    <View className="flex-1">
      {/* 1. CLEAN GRADIENT BACKGROUND (Matching your image) */}
      <LinearGradient
        colors={['#D1FAE5', '#DBEAFE', '#F8FAFC']} // Mint -> Light Blue -> White
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-between py-8">

          {/* LOGO SECTION */}
          <Animated.View entering={FadeIn.delay(300)} className="items-center">
            <Image
              source={require("@/assets/main-header-logo.png")}
              style={{ width: 140, height: 50, resizeMode: 'contain' }}
            />
            {/* Pagination Dots */}
            <View className="flex-row gap-2 mt-5">
              <View className="w-10 h-1.5 rounded-full bg-blue-500/80" />
              <View className="w-2 h-1.5 rounded-full bg-blue-200" />
              <View className="w-2 h-1.5 rounded-full bg-blue-200" />
            </View>
          </Animated.View>

          {/* 2. CENTRAL VISUAL COMPOSITION */}
          <View className="relative w-full h-80 items-center justify-center">

            {/* Background "Card" Layer - Deep Glass */}
            {/* <Animated.View entering={FadeInDown.delay(400)} className="absolute opacity-40">
              <View className="w-64 h-64 rounded-[50px] bg-white/20 border border-white/30" />
            </Animated.View> */}

            {/* Left Small Floating Icon */}
            <View className="absolute left-20 top-4">
              <Floating offset={8} duration={2000}>
                <View className="p-4 rounded-3xl overflow-hidden border border-white/60 bg-white/10 shadow-xl shadow-black/5">
                  <BlurView intensity={40} tint="light" className="items-center justify-center">
                    <Heart size={24} color="#F43F5E" fill="#F43F5E" />
                  </BlurView>
                </View>
              </Floating>
            </View>

            {/* Right Small Floating Icon */}
            <View className="absolute right-8 bottom-12">
              <Floating offset={12} duration={2500}>
                <View className="p-5 rounded-3xl overflow-hidden border border-white/60 bg-white/10 shadow-xl shadow-black/5">
                  <BlurView intensity={40} tint="light">
                    <MessageSquare size={28} color="#3B82F6" />
                  </BlurView>
                </View>
              </Floating>
            </View>

            {/* Main Center Glass Card */}
            <Floating offset={15} duration={3000}>
              <View className="rounded-[50px] overflow-hidden border border-white shadow-2xl shadow-blue-200/50">
                <BlurView intensity={100} tint="light" className="p-12 items-center bg-white/30">
                  <View className='rounded-2xl overflow-hidden'>
                    <LinearGradient
                      colors={['#60A5FA', '#3B82F6']}
                      className="w-24 h-24 rounded-full items-center justify-center shadow-lg"
                    >
                      <Smile size={48} color="white" strokeWidth={1.5} />
                    </LinearGradient>
                  </View>

                  {/* Glass "Skeleton" elements */}
                  <View className="mt-6 gap-3 items-center">
                    <View className="w-20 h-2.5 bg-blue-500/10 rounded-full" />
                    <View className="w-12 h-2 bg-blue-500/5 rounded-full" />
                  </View>
                </BlurView>
              </View>
            </Floating>

            {/* Action Button Overlapping Glass */}
            <TouchableOpacity
              activeOpacity={0.9}
              className="absolute -bottom-4 z-50"
            >
              <View className="rounded-2xl overflow-hidden border-4 border-white shadow-xl shadow-blue-400">
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  className="w-16 h-16 items-center justify-center"
                >
                  <Plus color="white" size={32} strokeWidth={3} />
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>

          {/* 3. BOTTOM CONTENT CARD */}
          <Animated.View
            entering={FadeInDown.delay(600).springify()}
            className="w-[92%] px-4"
          >
            <View className="rounded-[48px] overflow-hidden border border-white/80 shadow-2xl shadow-black/5">
              <BlurView intensity={80} tint="light" className="p-10 items-center bg-white/40">

                <View className="flex-row items-center gap-2 mb-4">
                  <Sparkles size={16} color="#3B82F6" />
                  <Text className="text-blue-600 font-bold uppercase tracking-[3px] text-[11px]">
                    Risus Social
                  </Text>
                </View>

                <Text className="text-[30px] font-bold text-slate-800 text-center leading-[38px]">
                  Share your story{"\n"}
                  <Text className="text-blue-600">and connect</Text> with the world around you
                </Text>

                <TouchableOpacity onPress={() => router.push("/(auth)/signin")} activeOpacity={0.8} className="w-full mt-10">
                  <View className="rounded-2xl overflow-hidden">
                    <LinearGradient
                      colors={['#6385E8', '#4F70D9']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
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
  );
};

export default WelcomeScreen;