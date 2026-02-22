/**
 *  AppScreen
 * Safe with BottomSheetModal + GestureHandler
 */

import {clsx} from 'clsx'
import {LinearGradient} from 'expo-linear-gradient'
import React, {useEffect} from 'react'
import {Keyboard, StatusBar, View, TouchableWithoutFeedback} from 'react-native'
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {useIsFocused} from '@react-navigation/native'

import {AppScreenProps} from '@/types/common'

export default function AppScreen({
  children,
  className,
  style,
  animateOnFocus = true,
  removeHorizontalPadding = false,
  horizontalPadding = 'px-5',
  statusBarStyle = 'dark',
  isEnableLinearGradient = false,
  dismissKeyboardOnPress = true
}: AppScreenProps & {dismissKeyboardOnPress?: boolean}) {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const opacity = useSharedValue(animateOnFocus ? 0 : 1)

  useEffect(() => {
    if (animateOnFocus) {
      opacity.value = withTiming(isFocused ? 1 : 0, {duration: 250})
    }
  }, [isFocused])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const layoutAnimationProps = animateOnFocus
    ? {}
    : {
        entering: FadeIn.duration(250),
        exiting: FadeOut.duration(200)
      }

  return (
    <View style={{flex: 1}}>
      {isEnableLinearGradient && (
        <LinearGradient
          colors={['#E1F2FF', '#FFFFFF', '#FFFFFF']}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }}
        />
      )}

      <Animated.View
        className={clsx('flex-1', className)}
        style={[
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            backgroundColor: 'transparent'
          },
          style,
          animateOnFocus ? animatedStyle : {}
        ]}
        {...layoutAnimationProps}
      >
        <StatusBar
          barStyle={
            statusBarStyle === 'dark' ? 'dark-content' : 'light-content'
          }
          backgroundColor="transparent"
          translucent
        />

        {dismissKeyboardOnPress ? (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
              className={clsx(
                'flex-1',
                !removeHorizontalPadding && horizontalPadding
              )}
            >
              {children}
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View
            className={clsx(
              'flex-1',
              !removeHorizontalPadding && horizontalPadding
            )}
          >
            {children}
          </View>
        )}
      </Animated.View>
    </View>
  )
}
