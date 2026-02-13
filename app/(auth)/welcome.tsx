import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare, Plus, Heart, List, Smile } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WelcomeScreen = () => {
  return (
    <View className="flex-1 bg-white">
      {/* 1. STABLE BACKGROUND (No Blurs to prevent Android crashes) */}
      <LinearGradient
        colors={['#E0F7F6', '#E1E9FF', '#F3E8FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="absolute inset-0"
      />

      {/* Mesh Decoration Blobs */}
      <View className="absolute w-80 h-80 rounded-full bg-pink-200/20 -top-20 -right-20" />
      <View className="absolute w-64 h-64 rounded-full bg-blue-300/20 bottom-1/4 -left-20" />

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center justify-between py-6">

          {/* 2. LOGO SECTION */}
          <View className="items-center mt-4">
            <View className="flex-row items-center space-x-3">
              <View style={{ elevation: 10 }}>
                <LinearGradient
                  colors={['#60A5FA', '#C084FC']}
                  className="w-12 h-12 rounded-2xl items-center justify-center"
                >
                  <Text className="text-white font-bold text-2xl">R</Text>
                </LinearGradient>
              </View>
              <Text className="text-4xl font-extrabold tracking-tight text-blue-600">
                Risus
              </Text>
            </View>

            <View className="flex-row space-x-2 mt-6">
              <View className="w-8 h-2 rounded-full bg-blue-500" />
              <View className="w-2 h-2 rounded-full bg-blue-200" />
              <View className="w-2 h-2 rounded-full bg-blue-200" />
            </View>
          </View>

          {/* 3. FLOATING ILLUSTRATION SECTION */}
          <View className="relative w-full h-72 items-center justify-center">
            {/* Left Card */}
            <View
              style={{ elevation: 8, transform: [{ rotate: '-12deg' }] }}
              className="absolute left-10 bg-white p-4 rounded-3xl border border-white/60 shadow-lg shadow-blue-200"
            >
              <View className="w-24 h-16 bg-blue-50 rounded-xl mb-3" />
              <View className="flex-row justify-between items-center px-1">
                <Heart size={16} color="#F87171" fill="#F87171" />
                <MessageSquare size={16} color="#94A3B8" />
              </View>
            </View>

            {/* Right Card */}
            <View
              style={{ elevation: 8, transform: [{ rotate: '12deg' }] }}
              className="absolute right-8 bg-white p-5 rounded-3xl border border-white/60 shadow-lg shadow-blue-200"
            >
              <List size={48} color="#3B82F6" opacity={0.6} strokeWidth={1.5} />
            </View>

            {/* Center Smiley Card */}
            <View
              style={{ elevation: 15 }}
              className="z-10 bg-white p-8 rounded-[40px] border border-white items-center justify-center shadow-2xl shadow-blue-400"
            >
              <Smile size={60} color="#2563EB" strokeWidth={1.5} />
              <View className="mt-5 space-y-2 items-center">
                <View className="w-16 h-2 bg-blue-100 rounded-full" />
                <View className="w-10 h-2 bg-blue-50 rounded-full" />
              </View>
            </View>

            {/* Floating Plus Button */}
            <View className="absolute -bottom-2 z-20" style={{ elevation: 12 }}>
              <TouchableOpacity activeOpacity={0.9}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  className="w-16 h-16 rounded-full items-center justify-center border-4 border-white"
                >
                  <Plus color="white" size={32} strokeWidth={3} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* 4. CONTENT CARD (Glass-Look Fallback) */}
          <View
            className="w-[92%] mb-2 overflow-hidden rounded-[40px] border border-white shadow-xl shadow-black/10"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)' }} // High-quality glass effect without BlurView
          >
            <View className="p-10 items-center">
              <Text className="text-3xl font-bold text-slate-800 text-center leading-9">
                Share your story{"\n"}
                <Text className="text-blue-600">and connect</Text>
              </Text>

              <Text className="text-slate-500 text-center mt-5 text-base leading-6 font-medium">
                Join a community of creators and share your unique journey with the world.
              </Text>

              {/* Get Started Button */}
              <TouchableOpacity activeOpacity={0.8} className="w-full mt-10">
                <LinearGradient
                  colors={['#4F46E5', '#3B82F6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="py-5 rounded-2xl items-center"
                  style={{ elevation: 5 }}
                >
                  <Text className="text-white font-bold text-xl">
                    Get Started
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;