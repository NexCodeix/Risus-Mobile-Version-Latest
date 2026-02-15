import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ComingSoon() {
  return (
    <View className="flex-1 bg-[#0a1d37]">
      <StatusBar barStyle="light-content" />

      {/* 1. Background Gradient & Decorative Blobs */}
      <LinearGradient
        colors={['#0f172a', '#1e3a8a', '#1e1b4b']}
        className="absolute inset-0"
      />
      
      {/* Subtle Background Glows (The "Blobs") */}
      <View 
        className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full" 
        style={{ borderRadius: width }} 
      />
      <View 
        className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/5 rounded-full" 
        style={{ borderRadius: width }} 
      />

      <SafeAreaView className="flex-1">
        {/* 2. Header / Back Button */}
        <View className="px-6 pt-4">
          <TouchableOpacity 
          onPress={() => router.back()}
            activeOpacity={0.7}
            className="flex-row items-center bg-white/10 self-start pr-5 pl-3 py-2.5 rounded-2xl border border-white/10"
          >
            <Ionicons name="chevron-back" size={20} color="white" />
            <Text className="text-white font-semibold ml-1 text-base">Back</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Main Content */}
        <View className="flex-1 justify-center items-center px-10">
          {/* Animated Icon Container */}
          {/* <View className="mb-6 bg-blue-400/10 p-5 rounded-full border border-blue-400/20">
            <Ionicons name="rocket-outline" size={40} color="#22d3ee" />
          </View> */}

          <View className="items-center">
            <Text className="text-white text-5xl font-black tracking-tight text-center">
              Coming Soon!
            </Text>
            
            {/* Elegant Accent Line */}
            <View className="h-1.5 w-16 bg-cyan-400 rounded-full mt-5 shadow-lg shadow-cyan-400/50" />
            
            <Text className="text-blue-200/70 text-lg text-center mt-8 leading-6 font-medium">
              We&apos;re building something amazing for you. Get ready for a brand new experience.
            </Text>
          </View>
        </View>

        {/* 4. Footer / Call to Action */}
        <View className="px-8 pb-10">
          <TouchableOpacity 
            activeOpacity={0.8}
            className="bg-[#3b82f6] flex-row items-center justify-center py-5 rounded-3xl shadow-2xl shadow-blue-500/40"
          >
            <Ionicons name="notifications" size={22} color="white" style={{ marginRight: 8 }} />
            <Text className="text-white text-xl font-bold">Notify Me</Text>
          </TouchableOpacity>
{/*           
          <Text className="text-blue-400/40 text-center mt-6 text-xs uppercase tracking-widest">
            Coming to iOS & Android
          </Text> */}
        </View>
      </SafeAreaView>
    </View>
  );
}