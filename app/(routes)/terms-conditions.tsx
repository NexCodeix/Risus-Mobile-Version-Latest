import AppScreen from '@/components/ui/AppScreen';
import { ArrowLeft, Info, Pencil, Ticket, User } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

// 1. Data Array for Terms
const termsData = [
    {
        id: 1,
        title: "Introduction",
        content: "Welcome to Risus, a community-driven platform for sharing and voting on ideas. By using Risus, you agree to comply with and be bound by these terms.",
        icon: Info,
        bgColor: "bg-blue-50",
        iconColor: "#3b82f6",
    },
    {
        id: 2,
        title: "User Accounts",
        content: "Users must be 13 or older to create an account. You are responsible for maintaining account security and all activities under your account.",
        icon: User,
        bgColor: "bg-green-50",
        iconColor: "#22c55e",
    },
    {
        id: 3,
        title: "Content Guidelines",
        content: "Users retain ownership of their ideas but grant Risus a license to display them. Content must not violate rights or contain harmful material.",
        icon: Pencil,
        bgColor: "bg-orange-50",
        iconColor: "#f97316",
    },
    {
        id: 4,
        title: "Voting & Rewards",
        content: "Vote on ideas following fair use policy. Rewards are based on engagement and contribution to the community platform.",
        icon: Ticket,
        bgColor: "bg-red-50",
        iconColor: "#ef4444",
    }
];

const TermsConditionsScreen = () => {
    return (
        <AppScreen>
            {/* Header */}
            <View className="flex-row items-center py-4 border-b border-gray-100">
                <TouchableOpacity className="mr-4">
                    <ArrowLeft color="#000" size={24} />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-black">Terms & Conditions</Text>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Intro Text */}
                <Text className="text-center text-gray-500 text-[15px] leading-6 mt-8 mb-10 px-4">
                    Please read these terms carefully before using Risus
                </Text>

                {/* Terms List */}
                {termsData.map((item, index) => (
                    <View key={item.id}>
                        <View className="flex-row items-start mb-8">
                            {/* Icon Container */}
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center ${item.bgColor} mr-4`}>
                                <item.icon color={item.iconColor} size={24} />
                            </View>

                            {/* Text Content */}
                            <View className="flex-1">
                                <Text className="text-lg font-bold text-black mb-2">
                                    {item.title}
                                </Text>
                                <Text className="text-gray-500 text-[15px] leading-6">
                                    {item.content}
                                </Text>
                            </View>
                        </View>

                        {/* Separator Line (Except for last item) */}
                        {index !== termsData.length - 1 && (
                            <View className="h-[1px] bg-gray-100 w-full mb-8 ml-16" />
                        )}
                    </View>
                ))}
            </ScrollView>
        </AppScreen>
    );
};

export default TermsConditionsScreen;