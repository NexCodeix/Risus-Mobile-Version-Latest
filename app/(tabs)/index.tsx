import {FeedCard} from '@/components/feed/FeedCard'
import {FeedHeader} from '@/components/feed/FeedHeader'
import {MediaCarousel} from '@/components/feed/MediaCarousel'
import {RepostButton} from '@/components/feed/RepostButton'
import {RepostSheet} from '@/components/feed/RepostSheet'
import AppScreen from '@/components/ui/AppScreen'
import {useFeed, useRepostImages} from '@/hooks/useFeedApi'
import {Post} from '@/types/feed'
import {FlashList} from '@shopify/flash-list'
import {useCallback, useState} from 'react'
import {ActivityIndicator, Dimensions, Text, View} from 'react-native'
import {useSharedValue} from 'react-native-reanimated'

const {width: SCREEN_WIDTH} = Dimensions.get('window')

export default function HomeScreen() {
  const {data, fetchNextPage, hasNextPage, isLoading, refetch} = useFeed()
  console.log('feed data', data)
  const scrollX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [showRepostSheet, setShowRepostSheet] = useState(false)

  // Get all posts (filtered reposts already in hook)
  const posts = data?.pages.flatMap((page) => page.results) || []
  const currentPost = posts[currentIndex]

  // Get bottom carousel images from reposts
  const repostImages = useRepostImages(currentPost?.thread || null)

  const handleViewableItemsChanged = useCallback(({viewableItems}: any) => {
    if (viewableItems[0]?.index !== undefined) {
      setCurrentIndex(viewableItems[0].index)
    }
  }, [])

  const handleEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage])

  const handleOpenRepostSheet = useCallback(() => {
    setShowRepostSheet(true)
  }, [])

  const handleCloseRepostSheet = useCallback(() => {
    setShowRepostSheet(false)
  }, [])

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading feed...</Text>
      </View>
    )
  }

  return (
    <AppScreen animateOnFocus isEnableLinearGradient removeHorizontalPadding>
      <FeedHeader />

      <FlashList
        data={posts}
        renderItem={({item}: {item: Post}) => (
          <View
            style={{
              width: SCREEN_WIDTH,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <FeedCard post={item} onRepostPress={handleOpenRepostSheet} />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{itemVisiblePercentThreshold: 80}}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isLoading}
        onScroll={(e) => {
          scrollX.value = e.nativeEvent.contentOffset.x
        }}
      />

      {/* Bottom 3-card carousel */}
      <MediaCarousel
        images={repostImages}
        scrollX={scrollX}
        onPress={handleOpenRepostSheet}
      />

      {/* Swipe up button */}
      <RepostButton onPress={handleOpenRepostSheet} translateY={translateY} />

      {/* Repost bottom sheet */}
      <RepostSheet
        isOpen={showRepostSheet}
        onClose={handleCloseRepostSheet}
        post={currentPost}
      />
    </AppScreen>
  )
}
