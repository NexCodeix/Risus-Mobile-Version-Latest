import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import {
  ArrowLeft, Search, ChevronRight, User, Key, Wallet, Hand,
  BarChart2, Rocket, Bookmark, Bell, PieChart, HelpCircle,
  FileText, Info, PauseCircle, Trash2, LogOut
} from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '@/hooks/useUser';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const { user, isUserLoading } = useUser()
  if (isUserLoading) return <View className="flex-1 items-center justify-center bg-white">
    <ActivityIndicator />
  </View>
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Text className="flex-1 text-center text-lg font-bold mr-6">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3 my-4">
          <Search size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search settings..."
            className="ml-3 flex-1 text-base text-gray-800"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Profile Section */}
        <TouchableOpacity onPress={() => router.push("/(routes)/profile")} className="flex-row items-center py-4">
          <View className="w-14 h-14 bg-gray-200 rounded-full items-center justify-center">
            {/* Replace with your image source */}
            <User size={30} color="#94a3b8" />
          </View>
          <View className="ml-4 flex-1">
            <Text className="text-lg font-bold text-gray-900">{user?.first_name}{" "}{user?.last_name}</Text>
            <Text className="text-gray-400">@{user?.username}</Text>
          </View>
          <ChevronRight size={20} color="#cbd5e1" />
        </TouchableOpacity>

        {/* Account Section */}
        <SectionHeader title="Account" />
        <SettingItem icon={<User size={20} color="#3b82f6" />} title="Edit my profile" />
        <SettingItem icon={<Key size={20} color="#3b82f6" />} title="Change Password" />
        <SettingItem
          icon={<Wallet size={20} color="#3b82f6" />}
          title="RUSD Balance"
          subtitle="View your current RUSD holdings"
        />
        <SettingItem
          icon={<Wallet size={20} color="#3b82f6" />}
          title="RISUS Balance"
          subtitle="View your current RISUS holdings"
        />

        {/* Promotions Section */}
        <SectionHeader title="Promotions" />
        <SettingItem
          icon={<Hand size={20} color="#3b82f6" />}
          title="Influencer Partnerships"
          subtitle="Collaborate with creators to promote your brand"
        />
        <SettingItem
          icon={<BarChart2 size={20} color="#3b82f6" />}
          title="Monetize Pings"
          subtitle="Earn from Ping and boost engagement automatically"
        />
        <SettingItem
          icon={<Rocket size={20} color="#3b82f6" />}
          title="Post Promotion"
          subtitle="Promote posts and reach a wider audience fast"
        />

        {/* General Section */}
        <SectionHeader title="General" />
        <SettingItem icon={<Bookmark size={20} color="#3b82f6" />} title="Bookmarks" />
        <SettingItem icon={<Bell size={20} color="#3b82f6" />} title="Notifications" />
        <SettingItem icon={<PieChart size={20} color="#3b82f6" />} title="Analytics" />
        <SettingItem icon={<HelpCircle size={20} color="#3b82f6" />} title="FAQ" />
        <SettingItem icon={<FileText size={20} color="#3b82f6" />} title="Terms & Conditions" />
        <SettingItem icon={<Info size={20} color="#3b82f6" />} title="About App" />

        {/* Deactivating Section */}
        <SectionHeader title="Deactivating and Deletion" color="text-red-500" />
        <SettingItem
          icon={<PauseCircle size={20} color="#eab308" />}
          title="Deactivate Account"
          subtitle="Temporarily disable your account"
          titleColor="text-yellow-600"
        />
        <SettingItem
          icon={<Trash2 size={20} color="#ef4444" />}
          title="Request Account Deletion"
          subtitle="Permanently delete your account and data"
          titleColor="text-red-500"
        />

        {/* Logout Button */}
        <TouchableOpacity className="flex-row items-center justify-center border border-red-200 rounded-2xl py-4 my-8">
          <LogOut size={20} color="#ef4444" className="mr-2" />
          <Text className="text-red-500 font-bold text-lg">Log Out</Text>
        </TouchableOpacity>

        {/* Added some bottom padding to ensure content doesn't get hidden by your custom tab bar */}
        <View className="h-28" />
      </ScrollView>
    </SafeAreaView>
  );
}

// Reusable Section Header Component
const SectionHeader = ({ title, color = "text-gray-900" }: any) => (
  <Text className={`text-base font-bold mt-6 mb-2 ${color}`}>{title}</Text>
);

// Reusable Setting Item Component
const SettingItem = ({ icon, title, subtitle, titleColor = "text-gray-800" }: any) => (
  <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-50">
    <View className="w-10 h-10 bg-blue-50/50 rounded-full items-center justify-center">
      {icon}
    </View>
    <View className="ml-4 flex-1">
      <Text className={`text-base font-medium ${titleColor}`}>{title}</Text>
      {subtitle && <Text className="text-gray-400 text-sm">{subtitle}</Text>}
    </View>
    <ChevronRight size={18} color="#cbd5e1" />
  </TouchableOpacity>
);