import React from 'react'
import {TouchableOpacity, View} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import Typo from './Typo'

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity)

interface MediaPickerButtonProps {
  onCameraPress: () => void
  onGalleryPress: () => void
  disabled?: boolean
  className?: string
}

export const MediaPickerButton: React.FC<MediaPickerButtonProps> = ({
  onCameraPress,
  onGalleryPress,
  disabled = false,
  className = ''
}) => {
  const cameraScale = useSharedValue(1)
  const galleryScale = useSharedValue(1)

  const cameraAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: cameraScale.value}]
  }))

  const galleryAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: galleryScale.value}]
  }))

  const handleCameraPress = () => {
    cameraScale.value = withSpring(0.9, {damping: 10}, () => {
      cameraScale.value = withSpring(1)
    })
    onCameraPress()
  }

  const handleGalleryPress = () => {
    galleryScale.value = withSpring(0.9, {damping: 10}, () => {
      galleryScale.value = withSpring(1)
    })
    onGalleryPress()
  }

  return (
    <View className={`flex-row gap-3 ${className}`}>
      {/* Camera Button */}
      <AnimatedTouchable
        onPress={handleCameraPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={cameraAnimatedStyle}
        className={`flex-1 flex-col items-center justify-center bg-gray-100 rounded-xl py-4 border border-gray-200 ${
          disabled ? 'opacity-50' : ''
        }`}
      >
        <Ionicons name="camera-outline" size={28} color="#3B82F6" />
        <Typo size={11} className="text-blue-500 font-semibold mt-1">
          Camera
        </Typo>
      </AnimatedTouchable>

      {/* Gallery Button */}
      <AnimatedTouchable
        onPress={handleGalleryPress}
        disabled={disabled}
        activeOpacity={0.8}
        style={galleryAnimatedStyle}
        className={`flex-1 flex-col items-center justify-center bg-gray-100 rounded-xl py-4 border border-gray-200 ${
          disabled ? 'opacity-50' : ''
        }`}
      >
        <Ionicons name="images-outline" size={28} color="#3B82F6" />
        <Typo size={11} className="text-blue-500 font-semibold mt-1">
          Gallery
        </Typo>
      </AnimatedTouchable>
    </View>
  )
}
