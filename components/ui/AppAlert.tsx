import React, {ReactNode, useEffect} from 'react'
import {Modal, Pressable, Text, View} from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'

export type AlertButton = {
  text: string
  onPress?: () => void
  className?: string // tailwind classes (nativewind)
  textClassName?: string
}

export type AppAlertProps = {
  visible: boolean
  title?: string
  message?: string | ReactNode
  onClose: () => void
  buttons?: AlertButton[]
  containerClassName?: string // override card style
}

export default function AppAlert({
  visible,
  title,
  message,
  onClose,
  buttons = [{text: 'OK'}],
  containerClassName = 'bg-neutral-900'
}: AppAlertProps) {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.9)

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, {
        duration: 180,
        easing: Easing.out(Easing.quad)
      })
      scale.value = withTiming(1, {
        duration: 220,
        easing: Easing.out(Easing.back(1.2))
      })
    } else {
      opacity.value = withTiming(0, {duration: 120})
      scale.value = withTiming(0.9, {duration: 120})
    }
  }, [visible])

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value
  }))

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
    opacity: opacity.value
  }))

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={backdropStyle}
        className="flex-1 items-center justify-center bg-black/40"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <Animated.View
          style={cardStyle}
          className={`w-[85%] max-w-[420px] rounded-3xl p-5 ${containerClassName}`}
        >
          {title ? (
            <Text className="text-white text-lg font-semibold mb-2">
              {title}
            </Text>
          ) : null}

          {typeof message === 'string' ? (
            <Text className="text-neutral-300 mb-5">{message}</Text>
          ) : (
            <View className="mb-5">{message}</View>
          )}

          <View className="flex-row justify-end gap-2">
            {buttons.map((btn, i) => (
              <Pressable
                key={i}
                onPress={() => {
                  btn.onPress?.()
                  onClose()
                }}
                className={`px-4 py-2 rounded-xl bg-neutral-800 active:opacity-70 ${btn.className ?? ''}`}
              >
                <Text
                  className={`text-white font-medium ${btn.textClassName ?? ''}`}
                >
                  {btn.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  )
}
