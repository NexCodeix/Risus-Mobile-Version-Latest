import {
  BarChart2,
  Bell,
  Bookmark,
  ChevronRight,
  FileText,
  Hand,
  HelpCircle,
  Info,
  Key,
  LogOut,
  PauseCircle,
  PieChart,
  Rocket,
  Search,
  Trash2,
  User,
  Wallet
} from 'lucide-react-native'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

import AppAlert from '@/components/ui/AppAlert'
import AppScreen from '@/components/ui/AppScreen'
import ProfileCard from '@/components/ui/ProfileCard'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'
import { router } from 'expo-router'

export default function SettingsScreen() {
  const { user, isUserLoading } = useUser()
  const [visible, setVisible] = useState(false)
  const { logout } = useAuth()

  const handleLogoutPress = () => {
    setVisible(true)
  }

  const confirmLogout = async () => {
    setVisible(false)
    await logout()
    router.replace('/(auth)/signin')
  }

  if (isUserLoading)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    )
  return (
    <AppScreen animateOnFocus className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Text className="flex-1 text-center text-lg font-bold mr-6">
          Settings
        </Text>
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
        <ProfileCard
          user={user}
          isLoading={isUserLoading}
          cardClassName="bg-gray-50 border-gray-100 mb-4"
          textClass="text-black"
        />

        {/* Account Section */}
        <SectionHeader title="Account" />
        <SettingItem
          icon={<User size={20} color="#3b82f6" />}
          title="Edit my profile"
          onPress={() => router.push("/(routes)/profile")}
        />
        <SettingItem
          icon={<Key size={20} color="#3b82f6" />}
          title="Change Password"
          onPress={() => router.push('/(auth)/change-pass')}
        />
        <SettingItem
          icon={<Wallet size={20} color="#3b82f6" />}
          title="RUST Balance"
          subtitle="View your current RUST holdings"
          onPress={() => router.push('/(routes)/coming-soon')}
        />
        <SettingItem
          icon={<Wallet size={20} color="#3b82f6" />}
          title="RISUS Balance"
          subtitle="View your current RISUS holdings"
          onPress={() => router.push('/(routes)/coming-soon')}
        />

        {/* Promotions Section */}
        <SectionHeader title="Promotions" />
        <SettingItem
          icon={<Hand size={20} color="#3b82f6" />}
          title="Influencer Partnerships"
          subtitle="Collaborate with creators to promote your brand"
          onPress={() => router.push('/(routes)/coming-soon')}
        />
        <SettingItem
          icon={<BarChart2 size={20} color="#3b82f6" />}
          title="Monetize Pings"
          subtitle="Earn from Ping and boost engagement automatically"
          onPress={() => router.push('/(routes)/coming-soon')}
        />
        <SettingItem
          icon={<Rocket size={20} color="#3b82f6" />}
          title="Post Promotion"
          subtitle="Promote posts and reach a wider audience fast"
          onPress={() => router.push('/(routes)/coming-soon')}
        />

        {/* General Section */}
        <SectionHeader title="General" />
        <SettingItem
          icon={<Bookmark size={20} color="#3b82f6" />}
          title="Bookmarks"
        />
        <SettingItem
          icon={<Bell size={20} color="#3b82f6" />}
          title="Notifications"
        />
        <SettingItem
          icon={<PieChart size={20} color="#3b82f6" />}
          title="Analytics"
          onPress={() => router.push('/(routes)/coming-soon')}
        />
        <SettingItem
          icon={<HelpCircle size={20} color="#3b82f6" />}
          title="FAQ"
          onPress={() => router.push("/(routes)/faq")}
        />
        <SettingItem
          icon={<FileText size={20} color="#3b82f6" />}
          title="Terms & Conditions"
          onPress={() => router.push("/(routes)/terms-conditions")}
        />
        <SettingItem
          icon={<Info size={20} color="#3b82f6" />}
          title="About App"
          onPress={() => router.push("/(routes)/about-app")}
        />

        {/* Deactivating Section */}
        <SectionHeader title="Account Action" color="text-red-500" />
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
        <TouchableOpacity
          onPress={handleLogoutPress}
          className="flex-row items-center justify-center border border-red-200 rounded-2xl py-4 my-8"
        >
          <LogOut size={20} color="#ef4444" className="mr-2" />
          <Text className="text-red-500 font-bold text-lg">Log Out</Text>
        </TouchableOpacity>


        {/* Added some bottom padding to ensure content doesn't get hidden by your custom tab bar */}
        <View className="h-28" />
        <AppAlert
          visible={visible}
          onClose={() => setVisible(false)}
          title="Log out?"
          message="You will need to login again to access your account."
          buttons={[
            {
              text: "Cancel",
              className: "bg-neutral-700",
            },
            {
              text: "Logout",
              className: "bg-red-600",
              textClassName: "text-white",
              onPress: confirmLogout,
            },
          ]}
        />

      </ScrollView>
    </AppScreen>
  )
}

// Reusable Section Header Component
const SectionHeader = ({ title, color = 'text-gray-900' }: any) => (
  <Text className={`text-base font-bold mt-6 mb-2 ${color}`}>{title}</Text>
)

// Reusable Setting Item Component
const SettingItem = ({
  icon,
  title,
  subtitle,
  titleColor = 'text-gray-800',
  onPress
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center py-4 border-b border-gray-50"
  >
    <View className="w-10 h-10 bg-blue-50/50 rounded-full items-center justify-center">
      {icon}
    </View>
    <View className="ml-4 flex-1">
      <Text className={`text-base font-medium ${titleColor}`}>{title}</Text>
      {subtitle && <Text className="text-gray-400 text-sm">{subtitle}</Text>}
    </View>
    <ChevronRight size={18} color="#cbd5e1" />
  </TouchableOpacity>
)
