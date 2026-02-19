

import { OptimizedImage } from '@/components/ui/OptimizedImage'
import { OptimizedVideo } from '@/components/ui/OptimizedVideo'
import { useLikePost } from '@/hooks/useFeedApi'
import { Post } from '@/types/feed'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import {
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import Typo from '../../ui/Typo'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

interface FeedCardProps {
  post: Post
  onRepostPress: () => void
}

export function FeedCard({post, onRepostPress}: FeedCardProps) {
  console.log('Post Data:', JSON.stringify(post, null, 2))
  const {mutate: likePost} = useLikePost()
  const [isLiked, setIsLiked] = useState(post.is_liked || false)
  const [likeCount, setLikeCount] = useState(post.total_likes)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const images = post.images || []
  const hasMedia = images.length > 0
  const currentMedia = images[currentImageIndex]

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1)
    likePost(post.id)
  }

  const handleTap = (evt: any) => {
    if (!hasMedia || images.length <= 1) return

    const pageX = evt.nativeEvent.pageX
    const threshold = SCREEN_WIDTH / 2

    if (pageX < threshold) {
      // Tap left - previous image
      setCurrentImageIndex((prev) => Math.max(0, prev - 1))
    } else {
      // Tap right - next image
      setCurrentImageIndex((prev) => Math.min(images.length - 1, prev + 1))
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    return `${Math.floor(diffMinutes / 1440)}d ago`
  }

  return (
    <Animated.View
      entering={FadeIn}
      className="bg-white rounded-3xl overflow-hidden shadow-lg"
      style={{
        width: '90%',
        height: SCREEN_HEIGHT * 0.58,
        maxHeight: 600
      }}
    >
      {/* User Info Overlay - Top */}
      <View className="absolute top-4 left-4 right-4 flex-row items-center justify-between z-10 pointer-events-none">
        <View className="flex-row items-center bg-black/60 backdrop-blur rounded-full px-3 py-2 shadow-lg">
          <Image
            source={{
              uri:
                post.user.image ||
                'https://via.placeholder.com/32/3B82F6/FFFFFF?text=U'
            }}
            className="w-8 h-8 rounded-full mr-2 border border-white/50"
          />
          <View>
            <Text className="text-white font-semibold text-sm">
              {post.user.display_name || post.user.username.split('-')[0]}
            </Text>
            <Text className="text-white/80 text-xs">
              @{post.user.username.split('@')[0].split('-')[0]} •{' '}
              {formatTime(post.date_created)}
            </Text>
          </View>
        </View>

        {/* Image Counter */}
        {images.length > 1 && (
          <View className="bg-black/60 backdrop-blur rounded-full px-3 py-1.5 shadow-lg">
            <Text className="text-white text-xs font-semibold">
              {currentImageIndex + 1}/{images.length}
            </Text>
          </View>
        )}
      </View>

      {/* Media Indicator */}
      {hasMedia && images.length > 1 && (
        <View className="absolute top-16 left-0 right-0 flex-row justify-center items-center px-4 z-10 pointer-events-none">
          {images.map((_, i) => (
            <View
              key={i}
              className={`h-1 mx-0.5 rounded-full ${
                i === currentImageIndex ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </View>
      )}

      {/* Media Content with Tap Navigation */}
      {hasMedia && currentMedia?.file ? (
        <TouchableWithoutFeedback onPress={handleTap}>
          <View className="w-full h-full relative">
            {currentMedia.file_type === 'video' ? (
              <OptimizedVideo
                key={currentMedia.id}
                source={currentMedia.file}
                poster={currentMedia.thumbnail}
                contentFit="cover"
                className="w-full h-full"
                cachePolicy="memory-disk"
                controls
                autoPlay={false}
                muted
                resizeMode="cover"
              />
            ) : (
              <OptimizedImage
                key={currentMedia.id}
                source={currentMedia.file}
                contentFit="cover"
                className="w-full h-full"
                cachePolicy="memory-disk"
                showSkeleton
                transition={200}
              />
            )}

            {/* Gradient Overlay for Better Text Visibility */}
            <View className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 items-center justify-center">
          <Ionicons name="images-outline" size={48} color="white" />
          <Text className="text-white text-lg font-semibold mt-3">
            No Media
          </Text>
        </View>
      )}

      {/* Content Overlay - Bottom */}
      {post.content && (
        <View className="absolute bottom-10 left-4 right-20   ">
          <Typo size={16} className="text-white py-1 leading-5">
            {post.title}
          </Typo>
          {post.content.length > 100 && (
            <Text className="text-blue-300 text-xs mt-1 font-medium">
              Read More
            </Text>
          )}
        </View>
      )}

      {/* Action Buttons - Right Side */}
      <View className="absolute bottom-20 right-4 gap-3 items-center">
        {/* Like */}
        <TouchableOpacity
          onPress={handleLike}
          className="items-center bg-black/50 backdrop-blur rounded-full p-3 shadow-lg"
          activeOpacity={0.7}
        >
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={28}
            color={isLiked ? '#EF4444' : '#fff'}
          />
          <Text className="text-white text-xs font-bold mt-1">{likeCount}</Text>
        </TouchableOpacity>

        {/* Comment */}
        <TouchableOpacity
          className="items-center bg-black/50 backdrop-blur rounded-full p-3 shadow-lg"
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={26} color="#fff" />
          <Text className="text-white text-xs font-bold mt-1">
            {post.total_comments}
          </Text>
        </TouchableOpacity>

        {/* Repost */}
        <TouchableOpacity
          onPress={onRepostPress}
          className="items-center bg-blue-500 rounded-full p-3.5 shadow-2xl"
          activeOpacity={0.8}
          style={{
            shadowColor: '#3B82F6',
            shadowOffset: {width: 0, height: 4},
            shadowOpacity: 0.4,
            shadowRadius: 8
          }}
        >
          <Ionicons name="repeat-outline" size={26} color="#fff" />
          <Text className="text-white text-xs font-bold mt-1">
            {post.total_reposts}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Gradient for Card Separation */}
      <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-blue-50/50 to-transparent pointer-events-none" />
    </Animated.View>
  )
}
