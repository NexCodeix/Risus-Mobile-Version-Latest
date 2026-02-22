import {useLikePost} from '@/hooks/useFeedApi'
import {MediaItem, Post} from '@/types/feed'
import {smartTime} from '@/utils/Time'
import {Ionicons} from '@expo/vector-icons'
import {clsx} from 'clsx'
import {BlurView} from 'expo-blur'
import {Image} from 'expo-image'
import {LinearGradient} from 'expo-linear-gradient'
import {useVideoPlayer, VideoView} from 'expo-video'
import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated'
import Avatar from '../../ui/Avatar'
import Typo from '../../ui/Typo'

const {width: SCREEN_WIDTH} = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.92
const MEDIA_ASPECT_RATIO = 4 / 5
const CARD_HEIGHT = CARD_WIDTH / MEDIA_ASPECT_RATIO

interface FeedCardProps {
  post: Post
  onRepostPress?: () => void
  isRepost?: boolean
}

const MediaItemComponent = ({
  item,
  isVisible
}: {
  item: MediaItem
  isVisible: boolean
}) => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (hasError) {
    return (
      <LinearGradient
        colors={['#3B82F6', '#1D4ED8']}
        style={StyleSheet.absoluteFill}
        className="items-center justify-center p-6"
      >
        <Ionicons
          name="alert-circle-outline"
          size={32}
          color="white"
          opacity={0.6}
        />
        <Typo size={12} className="text-white/60 text-center mt-2 font-medium">
          Media unavailable
        </Typo>
        <TouchableOpacity
          onPress={() => {
            setHasError(false)
            setIsLoading(true)
          }}
          className="mt-3 bg-white/10 px-4 py-2 rounded-full border border-white/20"
        >
          <Typo size={12} className="text-white font-bold">
            Retry
          </Typo>
        </TouchableOpacity>
      </LinearGradient>
    )
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {item.file_type === 'video' ? (
        <VideoPlayer
          source={item.file}
          isVisible={isVisible}
          poster={item.thumbnail}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />
      ) : (
        <Image
          source={{uri: item.file}}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={200}
          cachePolicy="memory-disk"
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true)
            setIsLoading(false)
          }}
        />
      )}

      {isLoading && (
        <View
          style={StyleSheet.absoluteFill}
          className="bg-[#007AFF] items-center justify-center"
        >
          <ActivityIndicator size="small" color="#DFDFDF" />
        </View>
      )}
    </View>
  )
}

const VideoPlayer = ({
  source,
  isVisible,
  poster,
  onLoadStart,
  onLoad,
  onError
}: {
  source: string
  isVisible: boolean
  poster?: string
  onLoadStart: () => void
  onLoad: () => void
  onError: () => void
}) => {
  const player = useVideoPlayer(source, (player) => {
    player.loop = true
    player.muted = true
  })

  useEffect(() => {
    if (isVisible) {
      player.play()
    } else {
      player.pause()
    }
  }, [isVisible, player])

  useEffect(() => {
    onLoadStart()
    const subscription = player.addListener('statusChange', (status: any) => {
      if (status === 'readyToPlay') onLoad()
      if (status === 'error') onError()
    })
    return () => subscription.remove()
  }, [player])

  return (
    <View style={StyleSheet.absoluteFill} className="bg-black">
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
      {poster && !isVisible && (
        <Image
          source={{uri: poster}}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
      )}
    </View>
  )
}

export function FeedCard({
  post,
  onRepostPress,
  isRepost = false
}: FeedCardProps) {
  const {mutate: likePost} = useLikePost()
  const [isLiked, setIsLiked] = useState(post.is_liked)
  const [likeCount, setLikeCount] = useState(post.total_likes)
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0)

  const images = post.images || []
  const hasMedia = images.length > 0

  const scale = useSharedValue(1)

  const handleLike = () => {
    const newLiked = !isLiked
    setIsLiked(newLiked)
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1))
    likePost(post.id.toString())

    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1)
    })
  }

  const heartStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}]
  }))

  const handleMediaTap = (event: any) => {
    if (images.length <= 1) return
    const x = event.nativeEvent.locationX
    if (x < CARD_WIDTH / 2) {
      setCurrentMediaIndex((prev) => Math.max(0, prev - 1))
    } else {
      setCurrentMediaIndex((prev) => Math.min(images.length - 1, prev + 1))
    }
  }

  return (
    <Animated.View
      entering={FadeIn}
      className={clsx(
        'rounded-[32px] overflow-hidden shadow-lg border border-white/20',
        isRepost ? 'my-2' : ''
      )}
      style={{
        width: CARD_WIDTH,
        height: isRepost ? CARD_HEIGHT * 0.8 : CARD_HEIGHT // Back to original height
      }}
    >
      {/* Media & Content Section */}
      <View style={{flex: 1, overflow: 'hidden', borderRadius: 32}}>
        {/* Media Layer */}
        <View style={StyleSheet.absoluteFill}>
          {hasMedia ? (
            <TouchableWithoutFeedback onPress={handleMediaTap}>
              <View style={StyleSheet.absoluteFill}>
                <MediaItemComponent
                  item={images[currentMediaIndex]}
                  isVisible={true}
                />

                {/* Story-style Progress & Asset Counter Row */}
                <View className="absolute top-4 left-0 right-0 flex-row items-center px-4 z-20">
                  <View className="flex-row flex-1 gap-1 mr-3 ">
                    {images.length > 0 ? (
                      images.map((_, idx) => (
                        <View
                          key={idx}
                          className={clsx(
                            'h-[7px] flex-1 rounded-[10px] shadow-sm',
                            idx === currentMediaIndex
                              ? 'bg-white'
                              : 'bg-white/40'
                          )}
                        />
                      ))
                    ) : (
                      <View className="h-[4px] flex-1 rounded-[10px] bg-white shadow-sm" />
                    )}
                  </View>

                  {/* Asset Counter Badge */}
                  <View className="px-2 py-1">
                    <Typo size={10} className="text-white font-bold">
                      {images.length > 0
                        ? `${currentMediaIndex + 1}/${images.length}`
                        : '1/1'}
                    </Typo>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          ) : (
            <LinearGradient
              colors={['#3B82F6', '#1D4ED8']}
              style={StyleSheet.absoluteFill}
              className="items-center justify-center p-8"
            >
              {post.title && (
                <Typo
                  size={28}
                  className="text-white font-bold text-center mb-4 leading-tight"
                >
                  {post.title}
                </Typo>
              )}
              {/* <Typo size={16} className="text-white/80 text-center leading-6" textProps={{ numberOfLines: 5 }}>
                {post.content}
              </Typo> */}
            </LinearGradient>
          )}

          {/* Gradient Overlay for Text Visibility */}
          <View
            style={[
              StyleSheet.absoluteFill,
              {backgroundColor: 'rgba(0,0,0,0.1)'}
            ]}
            pointerEvents="none"
          />
        </View>

        {/* Header Overlay */}
        <View className="absolute top-12 left-4 right-4 flex-row items-center justify-between z-10">
          <BlurView
            intensity={40}
            tint="dark"
            className="flex-row items-center px-3 py-2 rounded-full overflow-hidden border border-white/10"
          >
            <Avatar source={post.user.image} size={30} className="mr-2" />
            <View>
              <Typo size={14} className="text-white font-bold leading-none">
                {post.user.display_name || post.user.username.split('@')[0]}
              </Typo>
              <Typo size={11} className="text-white/80 leading-none mt-0.5">
                @{post.user.username.split('@')[0]} •{' '}
                {smartTime(post.date_created)}
              </Typo>
            </View>
          </BlurView>

          {/* Three-dot ellipsis - Commented out as requested */}
          {/* <TouchableOpacity>
          <BlurView intensity={40} tint="dark" className="p-2 rounded-full overflow-hidden border border-white/10">
            <Ionicons name="ellipsis-horizontal" size={18} color="white" />
          </BlurView>
        </TouchableOpacity> */}
        </View>

        {/* Content & Actions Overlay */}
        <View className="absolute bottom-6 left-5 right-5 z-10">
          <View className="flex-row items-end justify-between">
            <View className="flex-1 mr-4">
              {hasMedia && (
                <>
                  {post.title && (
                    <Typo
                      size={18}
                      className="text-white font-bold mb-1 shadow-md"
                    >
                      {post.title}
                    </Typo>
                  )}
                  <Typo
                    size={14}
                    className="text-white/90 leading-5 shadow-md"
                    textProps={{numberOfLines: 2}}
                  >
                    {post.content}
                  </Typo>
                </>
              )}
            </View>

            <View className="items-center">
              <BlurView
                intensity={40}
                tint="dark"
                className="rounded-full px-1.5 py-4 overflow-hidden border border-white/10 space-y-4 items-center"
              >
                {/* Like */}
                <TouchableOpacity
                  onPress={handleLike}
                  className="items-center px-1"
                >
                  <Animated.View style={heartStyle}>
                    <Ionicons
                      name={isLiked ? 'heart' : 'heart-outline'}
                      size={26}
                      color={isLiked ? '#ff4b4b' : 'white'}
                    />
                  </Animated.View>
                  <Typo size={11} className="text-white font-bold mt-1">
                    {likeCount}
                  </Typo>
                </TouchableOpacity>

                {/* Comment - Commented out as requested */}
                {/* <TouchableOpacity className="items-center px-1">
                <Ionicons name="chatbubble-outline" size={24} color="white" />
                <Typo size={11} className="text-white font-bold mt-1">{post.total_comments}</Typo>
              </TouchableOpacity> */}

                {/* Share/Repost Count - Commented out as requested */}
                {/* <TouchableOpacity className="items-center px-1">
                <Ionicons name="paper-plane-outline" size={24} color="white" />
                <Typo size={11} className="text-white font-bold mt-1">{post.total_reposts}</Typo>
              </TouchableOpacity> */}
              </BlurView>

              {/* Repost Button */}
              {onRepostPress && (
                <TouchableOpacity
                  onPress={onRepostPress}
                  className="bg-[#007AFF] p-3 rounded-full shadow-lg mt-3"
                >
                  <Ionicons name="repeat" size={22} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  )
}
