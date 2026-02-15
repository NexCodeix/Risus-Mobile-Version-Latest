import React from 'react'
import {Tabs} from 'expo-router'
import {View, TouchableOpacity, Image} from 'react-native'
import {BlurView} from 'expo-blur'
import {Home, MessageCircle, Settings, SquarePen} from 'lucide-react-native'
import {LinearGradient} from 'expo-linear-gradient'
import RisusIcon from '../../assets/risus-app-icons_round.png'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent'
        }
      }}
      tabBar={(props: any) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{title: 'Home'}} />
      <Tabs.Screen name="chat" options={{title: 'Chat'}} />
      <Tabs.Screen name="create-post" options={{title: 'Create'}} />
      <Tabs.Screen name="setting" options={{title: 'Setting'}} />
    </Tabs>
  )
}

function CustomTabBar({ state, navigation }: any) {
  const iconSize = 24
  const inactiveColor = '#64748b' // Modern slate colors for inactive state

  const renderTabIcon = (
    route: {key: React.Key | null | undefined; name: string},
    isFocused: boolean
  ) => {
    let IconComponent
    switch (route.name) {
      case 'index':
        IconComponent = Home
        break
      case 'chat':
        IconComponent = MessageCircle
        break
      case 'create-post':
        IconComponent = SquarePen
        break
      case 'setting':
        IconComponent = Settings
        break
      default:
        IconComponent = Home
    }

    if (isFocused) {
      return (
        <LinearGradient
          colors={['#2185D5', '#7BC7FA']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={{
            width: 54,
            height: 54,
            borderRadius: 27,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#F8FEFC',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5
          }}
        >
          <IconComponent size={iconSize} color="white" strokeWidth={2.5} />
        </LinearGradient>
      )
    }

    return (
      <IconComponent size={iconSize} color={inactiveColor} strokeWidth={2} />
    )
  }

  return (
    // Positioning the bar at the bottom with some padding
    <View className="absolute bottom-10 left-5 right-5 items-center">
      <BlurView
        intensity={100}
        tint="light" // Light mode glassy effect
        className="flex-row items-center justify-between px-2 py-2 rounded-[40px] overflow-hidden border border-white/60 bg-white shadow-sm"
        style={{width: '100%', height: 75}}
      >
        {/* Left side tabs */}
        <View
          style={{
            flexDirection: 'row',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'space-around',
            flex: 1, // Keep flex 1 for proper distribution
          }}
        >
          {state.routes
            .slice(0, 2)
            .map(
              (
                route: {key: React.Key | null | undefined; name: string},
                index: number
              ) => {
                const isFocused = state.index === index
                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true
                  })
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name)
                  }
                }
                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={onPress}
                    activeOpacity={0.7}
                    className="items-center justify-center flex-1"
                  >
                    {renderTabIcon(route, isFocused)}
                  </TouchableOpacity>
                )
              }
            )}
        </View>

        {/* Central Static Risus Icon */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'white', // Background for the pop-up effect
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 2
          }}
        >
          <Image
            source={RisusIcon}
            style={{
              width: 54,
              height: 54,
              borderRadius: 27
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* Right side tabs */}
        <View
          style={{
            flexDirection: 'row',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'space-around',
            flex: 1, // Keep flex 1 for proper distribution
          }}
        >
          {state.routes
            .slice(2, 4)
            .map(
              (
                route: {key: React.Key | null | undefined; name: string},
                index: number
              ) => {
                // Adjust index for right side tabs as they are sliced from the original routes array
                const actualIndex = index + 2
                const isFocused = state.index === actualIndex
                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: route.key,
                    canPreventDefault: true
                  })
                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name)
                  }
                }
                return (
                  <TouchableOpacity
                    key={route.key}
                    onPress={onPress}
                    activeOpacity={0.7}
                    className="items-center justify-center flex-1"
                  >
                    {renderTabIcon(route, isFocused)}
                  </TouchableOpacity>
                )
              }
            )}
        </View>
      </BlurView>
    </View>
  )
}
