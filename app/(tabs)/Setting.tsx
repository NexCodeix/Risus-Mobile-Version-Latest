import React, { useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {LogOut} from 'lucide-react-native'
import {useUser} from '@/hooks/useUser'
import AppScreen from '@/components/ui/AppScreen'
import ProfileCard from '@/components/ui/ProfileCard'
import {ListItem, SectionHeader} from '@/components/ui/List'
import Input from '@/components/ui/Input'
import AppAlert from '@/components/ui/AppAlert'
import {useAuth} from '@/hooks/useAuth'
import {AppToast} from '@/components/ui/AppToast'
import Typo from '@/components/ui/Typo'
import { SETTINGS_SECTIONS } from '@/constants/settings'

export default function SettingsScreen() {
  const {user, isUserLoading} = useUser()
  const [searchQuery, setSearchQuery] = useState('')
  const {logout} = useAuth()
  const [visible, setVisible] = useState(false)

  const handleLogoutPress = async () => {
    setVisible(true)
  }

  const confirmLogout = async () => {
    await logout()
    AppToast.success({
      title: 'Logged Out!',
      description: 'We are waiting for you again.'
    })
  }

  const filteredSections = SETTINGS_SECTIONS.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtitle &&
          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter((section) => section.items.length > 0)

  if (isUserLoading)
    return (
      <AppScreen animateOnFocus isEnableLinearGradient>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </AppScreen>
    )

  return (
    <AppScreen animateOnFocus isEnableLinearGradient>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Typo size={20} className="flex-1 text-center text-lg font-bold mr-6">
          Settings
        </Typo>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="px-4">
        {/* Search Bar */}
        <Input
          placeholder="Search settings..."
          leftIcon="search"
          containerClassName="my-4"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Profile Section */}
        {!searchQuery && ( // Only show profile card when not searching
          <ProfileCard
            user={user}
            isLoading={isUserLoading}
            cardClassName="bg-white border border-white/40 mb-4"
            textClass="text-black"
          />
        )}

        {/* Sections */}
        {filteredSections.map((section) => (
          <View key={section.title}>
            <SectionHeader title={section.title} color={section.titleColor} />
            {section.items.map((item, index) => (
              <ListItem key={index} {...item} />
            ))}
          </View>
        ))}

        {/* Logout Button */}
        {!searchQuery && ( // Only show logout when not searching
          <TouchableOpacity
            onPress={handleLogoutPress}
            className="flex-row items-center justify-center border border-red-200 rounded-2xl py-4 my-8"
          >
            <LogOut size={20} color="#ef4444" className="mr-2" />
            <Text className="text-red-500 font-bold text-lg">Log Out</Text>
          </TouchableOpacity>
        )}

        {/* Added some bottom padding to ensure content doesn't get hidden by your custom tab bar */}
        <View className="h-28" />
        <AppAlert
          visible={visible}
          onClose={() => setVisible(false)}
          title="Log out?"
          message="You will need to login again to access your account."
          buttons={[
            {
              text: 'Cancel',
              className: 'bg-neutral-700'
            },
            {
              text: 'Logout',
              className: 'bg-red-600',
              textClassName: 'text-white',
              onPress: confirmLogout
            }
          ]}
        />
      </ScrollView>
    </AppScreen>
  )
}
