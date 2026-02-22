import { useCurrentUser, useNotifications } from '@/hooks/useFeedApi'
import { router } from 'expo-router'
import { Bell, Compass, Flame, Search, Sparkles } from 'lucide-react-native'
import { useState } from 'react'
import { Dimensions, Image, TouchableOpacity, View } from 'react-native'
import Typo from '../../ui/Typo'
import Avatar from '../../ui/Avatar'

const {width} = Dimensions.get('window')

type TabType = 'forYou' | 'explore' | 'trending'

export function FeedHeader() {
  const {data: user} = useCurrentUser()
  const {data: notifications} = useNotifications()

  const [activeTab, setActiveTab] = useState<TabType>('forYou')

  const unreadCount = notifications?.filter((n: any) => !n.is_read).length || 0

  return (
    <View className="">
      {/*  Top Row  */}
      <View className="relative flex-row items-center justify-between px-4 py-3">
        {/* Left - Bell */}
        <TouchableOpacity
          onPress={() => router.push('/notification')}
          className="relative p-2 rounded-full bg-white shadow-sm"
          activeOpacity={0.7}
        >
          <Bell size={22} color="black" />

          {unreadCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[16px] h-4 items-center justify-center px-1">
              <Typo className="text-white text-[10px] font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </Typo>
            </View>
          )}
        </TouchableOpacity>

        {/* Center - Absolute Logo */}
        <View
          style={{
            position: 'absolute',
            left: width / 2 - 48
          }}
        >
          <Image
            source={require('@/assets/main-header-logo1.png')}
            style={{width: 96, height: 60}}
            resizeMode="contain"
          />
        </View>

        {/* Right - Search + Profile */}
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.push('/search')}
            activeOpacity={0.7}
            className="mr-4"
          >
            <Search size={22} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/profile')}
            activeOpacity={0.8}
          >
            <Avatar 
              source={user?.image} 
              size={44}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/*  Tab Bar  */}
      <View className="flex-row justify-around px-4 py-2">
        {/* For You */}
        <TouchableOpacity
          onPress={() => setActiveTab('forYou')}
          className={`flex-row items-center px-4 py-3 rounded-xl ${
            activeTab === 'forYou' ? 'bg-blue-100' : ''
          }`}
          activeOpacity={0.7}
        >
          <Sparkles size={18} color={activeTab === 'forYou' ? '#0167CC' : '#9CA3AF'} />
          <View className="ml-2">
            <Typo
              size={15}
              className={`text-sm font-bold ${
                activeTab === 'forYou' ? 'text-[#0167CC]' : 'text-gray-400'
              }`}
            >
              For you
            </Typo>
          </View>
        </TouchableOpacity>

        {/* Explore */}
        <TouchableOpacity
          onPress={() => setActiveTab('explore')}
          className={`flex-row items-center px-4 py-3 rounded-xl ${
            activeTab === 'explore' ? 'bg-blue-100' : ''
          }`}
          activeOpacity={0.7}
        >
          <Compass size={18} color={activeTab === 'explore' ? '#0167CC' : '#9CA3AF'} />
          <View className="ml-2">
            <Typo
              size={15}
              className={`text-sm font-bold ${
                activeTab === 'explore' ? 'text-[#0167CC]' : 'text-gray-400'
              }`}
            >
              Explore
            </Typo>
          </View>
        </TouchableOpacity>

        {/* Trending */}
        <TouchableOpacity
          onPress={() => setActiveTab('trending')}
          className={`flex-row items-center px-4 py-3 rounded-xl ${
            activeTab === 'trending' ? 'bg-blue-100' : ''
          }`}
          activeOpacity={0.7}
        >
          <Flame size={18} color={activeTab === 'trending' ? '#0167CC' : '#9CA3AF'} />
          <View className="ml-2">
            <Typo
              size={15}
              className={`text-sm font-bold ${
                activeTab === 'trending' ? 'text-[#0167CC]' : 'text-gray-400'
              }`}
            >
              Trending
            </Typo>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

