/**
 * @component AppScreen
 * @description A versatile screen wrapper for consistent layout and animations.
 * @author 
 * @date 2026-02-11
 */

import {clsx} from 'clsx'
import React, {useEffect} from 'react'
import {Keyboard, StatusBar, TouchableWithoutFeedback, View} from 'react-native'
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

/*  COMPONENT  */

export default function AppScreen({
  children,
  className,
  style,
  animateOnFocus = false,
  removeHorizontalPadding = false,
  horizontalPadding = 'px-5',
  statusBarStyle = 'dark'
}: AppScreenProps) {
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  const opacity = useSharedValue(animateOnFocus ? 0 : 1)

  // Handle focus-based animation for tab screens
  useEffect(() => {
    if (animateOnFocus) {
      //  withTiming for smooth transition
      opacity.value = withTiming(isFocused ? 1 : 0, {duration: 300})
    }
  }, [isFocused, animateOnFocus, opacity])

  const focusAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  // Combine custom styles with animated styles
  const combinedStyle = [
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom
    },
    style,
    animateOnFocus ? focusAnimatedStyle : {}
  ]

  // Use layout animations for mount/unmount if not using focus animation
  const layoutAnimationProps = animateOnFocus
    ? {}
    : {
        entering: FadeIn.duration(300),
        exiting: FadeOut.duration(200)
      }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Animated.View
        className={clsx('flex-1 ', className)}
        style={combinedStyle}
        {...layoutAnimationProps}
      >
        <StatusBar
          barStyle={
            statusBarStyle === 'dark' ? 'dark-content' : 'light-content'
          }
          backgroundColor="transparent"
          translucent
        />
        <View
          className={clsx(
            'flex-1',
            !removeHorizontalPadding && horizontalPadding
          )}
        >
          {children}
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

/* 
 *
 * ⚠️ IMPORTANT GUIDELINES
 *
 * ✅ USE AppScreen FOR:
 * - Every main screen to ensure consistent padding and safe area handling.
 * - Screens that need fade animations on mount or focus.
 *
 * ❌ DO NOT USE AppScreen FOR:
 * - Content inside a Modal or BottomSheet that already handles safe areas.
 *
 * -----------------------------------------------------
 *
 * 🧠 COMMON PATTERN (RECOMMENDED)
 *
 * <AppScreen>
 *   <AppKeyboardAvoidingView>
 *     ... your content ...
 *   </AppKeyboardAvoidingView>
 * </AppScreen>
 *
 * -----------------------------------------------------
 *
 * 🎨 STYLING
 *
 * - Use `className` for Tailwind CSS classes (e.g., `bg-primary`).
 * - The default background is 'bg-white dark:bg-black'.
 * - Use `horizontalPadding` prop to adjust side padding (e.g., `horizontalPadding="px-4"`).
 */
