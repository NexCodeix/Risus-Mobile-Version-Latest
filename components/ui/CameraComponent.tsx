import React, {useRef, useState} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native'
import {CameraView, CameraType, FlashMode} from 'expo-camera'
import * as ImageManipulator from 'expo-image-manipulator'
import {Ionicons, MaterialCommunityIcons} from '@expo/vector-icons'
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  useSharedValue
} from 'react-native-reanimated'
import {GestureDetector, Gesture} from 'react-native-gesture-handler'
import {MediaItem} from '@/types/media.types'

interface CameraComponentProps {
  onClose: () => void
  onCapture: (media: MediaItem) => void
  className?: string
}

export type FilterType = 'none' | 'cool' | 'warm' | 'vintage'

interface FilterOption {
  id: FilterType
  name: string
  icon: string
  color: string
}

const FILTERS: FilterOption[] = [
  {id: 'none', name: 'Original', icon: 'camera', color: '#3B82F6'},
  {id: 'cool', name: 'Cool', icon: 'snowflake', color: '#60A5FA'},
  {id: 'warm', name: 'Warm', icon: 'white-balance-sunny', color: '#FB923C'},
  {
    id: 'vintage',
    name: 'Vintage',
    icon: 'image-filter-vintage',
    color: '#A78BFA'
  }
]

export const CameraComponent: React.FC<CameraComponentProps> = ({
  onClose,
  onCapture,
  className = ''
}) => {
  const cameraRef = useRef<CameraView>(null)
  const [facing, setFacing] = useState<CameraType>('back')
  const [flash, setFlash] = useState<FlashMode>('off')
  const [isCapturing, setIsCapturing] = useState(false)
  const [zoom, setZoom] = useState(0)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none')
  const [showFilters, setShowFilters] = useState(false)

  // Animated values
  const shutterScale = useSharedValue(1)
  const flashOpacity = useSharedValue(0)
  const filterBarTranslateY = useSharedValue(100)

  const shutterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: shutterScale.value}]
  }))

  const flashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value
  }))

  const filterBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: filterBarTranslateY.value}]
  }))

  // Pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newZoom = Math.max(0, Math.min(1, (e.scale - 1) * 0.5))
      setZoom(newZoom)
    })
    .runOnJS(true)

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'))
  }

  const toggleFlash = () => {
    setFlash((current) => {
      if (current === 'off') return 'on'
      if (current === 'on') return 'auto'
      return 'off'
    })
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
    filterBarTranslateY.value = withSpring(showFilters ? 100 : 0)
  }

  const getFlashIcon = () => {
    switch (flash) {
      case 'on':
        return 'flash'
      case 'auto':
        return 'flash-outline'
      default:
        return 'flash-off'
    }
  }

  const getFilterStyle = () => {
    switch (selectedFilter) {
      case 'cool':
        return {backgroundColor: 'rgba(59, 130, 246, 0.3)'}
      case 'warm':
        return {backgroundColor: 'rgba(251, 146, 60, 0.3)'}
      case 'vintage':
        return {backgroundColor: 'rgba(167, 139, 250, 0.2)'}
      default:
        return {}
    }
  }

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return

    try {
      setIsCapturing(true)
      shutterScale.value = withSequence(
        withSpring(0.8, {damping: 10}),
        withSpring(1, {damping: 10})
      )
      flashOpacity.value = withSequence(
        withSpring(1, {duration: 100}),
        withSpring(0, {duration: 200})
      )

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false
      })

      if (photo) {
        let finalUri = photo.uri
        let finalWidth = photo.width
        let finalHeight = photo.height

        // Apply zoom by cropping the image
        if (zoom > 0) {
          const cropWidth = photo.width * (1 - zoom)
          const cropHeight = photo.height * (1 - zoom)
          const originX = (photo.width - cropWidth) / 2
          const originY = (photo.height - cropHeight) / 2

          const manipulatedImage = await ImageManipulator.manipulateAsync(
            photo.uri,
            [
              {
                crop: {
                  originX,
                  originY,
                  width: cropWidth,
                  height: cropHeight
                }
              }
            ],
            {compress: 1, format: ImageManipulator.SaveFormat.JPEG}
          )
          finalUri = manipulatedImage.uri
          finalWidth = manipulatedImage.width
          finalHeight = manipulatedImage.height
        }

        // TODO: Apply filters. This requires a more advanced image processing library
        // or a backend service, as expo-image-manipulator does not support color filtering.
        // For now, the filter is only a preview.

        const mediaItem: MediaItem = {
          uri: finalUri,
          type: 'image',
          mimeType: 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
          width: finalWidth,
          height: finalHeight
        }

        onCapture(mediaItem)
        onClose()
      }
    } catch (error) {
      console.error('Error taking picture:', error)
      Alert.alert('Error', 'Failed to take picture. Please try again.')
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <View className={`flex-1 bg-black ${className}`}>
      {/* Flash overlay */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, flashAnimatedStyle]}
        className="bg-white"
        pointerEvents="none"
      />

      {/* Camera View with Gesture */}
      <GestureDetector gesture={pinchGesture}>
        <View style={StyleSheet.absoluteFill}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            facing={facing}
            flash={flash}
            zoom={zoom}
          />
        </View>
      </GestureDetector>

      {/* Filter Overlay */}
      {selectedFilter !== 'none' && (
        <View
          style={[StyleSheet.absoluteFillObject, getFilterStyle()]}
          pointerEvents="none"
        />
      )}

      {/* UI Controls Overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {/* Top Controls */}
        <View className="flex-row items-center justify-between px-6 pt-14 pb-4">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center rounded-full bg-black/50"
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <View className="flex-row gap-3">
            {/* Flash */}
            <TouchableOpacity
              onPress={toggleFlash}
              className="w-10 h-10 items-center justify-center rounded-full bg-black/50"
              activeOpacity={0.7}
            >
              <Ionicons name={getFlashIcon()} size={24} color="white" />
            </TouchableOpacity>

            {/* Filter */}
            <TouchableOpacity
              onPress={toggleFilters}
              className={`w-10 h-10 items-center justify-center rounded-full ${
                showFilters ? 'bg-blue-500' : 'bg-black/50'
              }`}
              activeOpacity={0.7}
            >
              <MaterialCommunityIcons name="palette" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Zoom Indicator */}
        {zoom > 0 && (
          <View className="absolute top-32 self-center bg-black/70 px-4 py-2 rounded-full">
            <Text className="text-white font-semibold">
              {(zoom * 10 + 1).toFixed(1)}x
            </Text>
          </View>
        )}

        {/* Filter Bar */}
        {showFilters && (
          <Animated.View
            style={filterBarAnimatedStyle}
            className="absolute bottom-32 left-0 right-0 px-4"
          >
            <View className="bg-black/70 rounded-2xl p-4">
              <Text className="text-white text-sm font-medium mb-3">
                Filters
              </Text>
              <View className="flex-row justify-around">
                {FILTERS.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => setSelectedFilter(filter.id)}
                    className="items-center"
                  >
                    <View
                      className={`w-12 h-12 rounded-full items-center justify-center ${
                        selectedFilter === filter.id
                          ? 'bg-blue-500'
                          : 'bg-gray-700'
                      }`}
                      style={
                        selectedFilter === filter.id
                          ? {backgroundColor: filter.color}
                          : {}
                      }
                    >
                      <MaterialCommunityIcons
                        name={filter.icon as any}
                        size={24}
                        color="white"
                      />
                    </View>
                    <Text
                      className={`text-xs mt-1 ${
                        selectedFilter === filter.id
                          ? 'text-white font-semibold'
                          : 'text-gray-400'
                      }`}
                    >
                      {filter.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0 pb-10">
          <View className="flex-row items-center justify-around px-6">
            {/* Empty space for symmetry */}
            <View className="w-14 h-14" />

            {/* Capture Button */}
            <TouchableOpacity
              onPress={takePicture}
              disabled={isCapturing}
              activeOpacity={0.8}
              className="items-center justify-center"
            >
              <Animated.View
                style={shutterAnimatedStyle}
                className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
              >
                {isCapturing ? (
                  <ActivityIndicator color="#fff" size="large" />
                ) : (
                  <View className="w-16 h-16 rounded-full bg-white" />
                )}
              </Animated.View>
            </TouchableOpacity>

            {/* Flip Camera */}
            <TouchableOpacity
              onPress={toggleCameraFacing}
              className="w-14 h-14 items-center justify-center rounded-full bg-black/50"
              activeOpacity={0.7}
            >
              <Ionicons name="camera-reverse" size={32} color="white" />
            </TouchableOpacity>
          </View>

          {/* Hint Text */}
          <Text className="text-white text-center mt-4 text-sm opacity-70">
            Pinch to zoom • Tap to capture
          </Text>
        </View>
      </View>
    </View>
  )
}
