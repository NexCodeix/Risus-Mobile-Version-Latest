import AppScreen from '@/components/ui/AppScreen';
import { router } from 'expo-router';
import { ChevronLeft, Sparkles } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// 1. Data Object for App Information
const APP_INFO = {
    name: "Risus",
    version: "1.0.0",
    description: "A dynamic platform where ideas thrive.\nSubmit, vote, and get rewarded for your creativity.",
    developer: "NexCodeix",
    copyright: "© 2026 Risus",
    colors: {
        primary: ["#818cf8", "#6366f1"], // Indigo gradient
        accent: "#60a5fa",
        bgAccent: "#dbeafe"
    }
};

const AboutScreen = () => {
    return (
        <AppScreen animateOnFocus isEnableLinearGradient>
            {/* --- Decorative Background Shapes --- */}
            {/* Top Left Circle */}
            <View
                className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-20"
                style={{ backgroundColor: APP_INFO.colors.bgAccent }}
            />
            {/* Bottom Right Circle */}
            <View
                className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full opacity-30"
                style={{ backgroundColor: APP_INFO.colors.bgAccent }}
            />

            {/* --- Header --- */}
            <View className=" py-4">
                <TouchableOpacity
                onPress={() => router.back()}                    activeOpacity={0.7}
                    className="w-10 h-10 items-center justify-center rounded-full bg-gray-50 border border-gray-100"
                >
                    <ChevronLeft color="#1e293b" size={24} />
                </TouchableOpacity>
            </View>

            {/* --- Main Content --- */}
            <View className="flex-1 items-center justify-center px-10">

                {/* Animated-style Logo Container */}
                <View className="items-center justify-center mb-6">
                    <Image className='size-40' source={require("@/assets/icon.png")}/>
                </View>

                {/* App Name & Version */}
                <View className="items-center mb-12">
                    <Text className="text-4xl font-bold text-slate-800 tracking-tight">
                        {APP_INFO.name}
                    </Text>
                    <View className="flex-row items-center mt-2 bg-slate-100 px-3 py-1 rounded-full">
                        <Text className="text-slate-500 text-xs font-semibold tracking-widest uppercase">
                            Version {APP_INFO.version}
                        </Text>
                    </View>
                </View>

                {/* Description Section */}
                <View className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                    <View className="items-center mb-2">
                        <Sparkles size={20} color={APP_INFO.colors.accent} />
                    </View>
                    <Text className="text-slate-600 text-center text-lg leading-7 font-medium">
                        {APP_INFO.description}
                    </Text>
                </View>
            </View>

            {/* --- Footer --- */}
            <View className="pb-10 items-center">
                <View className="w-12 h-[2px] bg-slate-200 mb-6 rounded-full" />
                <Text className="text-slate-400 text-sm font-medium">
                    Developed by <Text className="text-indigo-500 font-bold">{APP_INFO.developer}</Text>
                </Text>
                <Text className="text-slate-300 text-xs mt-1">
                    {APP_INFO.copyright}
                </Text>
            </View>
        </AppScreen>
    );
};

export default AboutScreen;