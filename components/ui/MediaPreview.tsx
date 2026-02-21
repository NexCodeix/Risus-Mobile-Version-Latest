import React from 'react'
import {View, Text, Image, TouchableOpacity, Dimensions} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import Animated, {FadeIn, FadeOut, Layout} from 'react-native-reanimated'
import {MediaItem} from '@/types/media.types'
import Typo from './Typo'

const {width: SCREEN_WIDTH} = Dimensions.get('window')

interface MediaPreviewProps {
  media: MediaItem[]
  onRemove: (index: number) => void
  maxItems?: number
  className?: string
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  media,
  onRemove,
  maxItems = 10,
  className = ''
}) => {
  if (media.length === 0) return null

  const itemWidth = (SCREEN_WIDTH - 48) / 3

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className={`mb-6 ${className}`}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Typo size={15} className="text-base font-semibold text-gray-900">
          Selected Images
        </Typo>
        <Typo  size={13} className="text-gray-500">
          {media.length}/{maxItems}
        </Typo>
      </View>

      {/* Grid */}
      <View className="flex-row flex-wrap gap-2">
        {media.map((item, index) => (
          <Animated.View
            key={`${item.uri}-${index}`}
            entering={FadeIn.delay(index * 50).springify()}
            exiting={FadeOut.duration(200)}
            layout={Layout.springify()}
            style={{width: itemWidth, aspectRatio: 1}}
            className="rounded-xl overflow-hidden relative"
          >
            <Image
              source={{uri: item.uri}}
              className="w-full h-full"
              resizeMode="cover"
            />

            {/* Remove Button */}
            <TouchableOpacity
              onPress={() => onRemove(index)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 items-center justify-center"
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  )
}
