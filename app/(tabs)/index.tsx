import {FeedCard} from '@/components/modules/feed/FeedCard'
import {FeedHeader} from '@/components/modules/feed/FeedHeader'
import {MediaCarousel} from '@/components/modules/feed/MediaCarousel'
import RepostCountDisplay from '@/components/modules/feed/RepostCountDisplay'
import {RepostSheet} from '@/components/modules/feed/RepostSheet'
import AppScreen from '@/components/ui/AppScreen'
import {useFeed, useRepostImages} from '@/hooks/useFeedApi'
import {Post} from '@/types/feed'
import React, {useCallback, useMemo, useRef, useState} from 'react'
import {ActivityIndicator, Dimensions, FlatList, Text, View} from 'react-native'
import {useSharedValue} from 'react-native-reanimated'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

export default function HomeScreen() {
  const {data, fetchNextPage, hasNextPage, isLoading, refetch, isRefetching} =
    useFeed()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isRepostSheetOpen, setIsRepostSheetOpen] = useState(false)

  const scrollX = useSharedValue(0)

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) || []
  }, [data])

  const currentPost = posts[currentIndex] || null

  const currentThreadId = useMemo(
    () => (currentPost?.thread ? String(currentPost.thread) : null),
    [currentPost]
  )

  const repostImages = useRepostImages(currentThreadId)

  const finalCarouselImages = useMemo(() => {
    if (repostImages && repostImages.length > 0) {
      return repostImages
    }
    return currentPost?.images?.map((img) => img.file) || []
  }, [repostImages, currentPost])

  const handleScroll = (event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x
  }

  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    if (
      viewableItems &&
      viewableItems.length > 0 &&
      viewableItems[0].index !== null
    ) {
      setCurrentIndex(viewableItems[0].index)
    }
  }, [])

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60
  }).current

  const handleEndReached = useCallback(() => {
    if (hasNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, fetchNextPage])

  // Modal Handlers
  const openPingsSheet = () => setIsRepostSheetOpen(true)
  const handleCreateRepost = () => {
    console.log('TRIGGER: Create Repost Modal for post ID:', currentPost?.id)
    // User can implement the "Create Repost" UI here
  }

  if (isLoading && !posts.length) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-4 text-gray-400 font-medium">
          Loading your feed...
        </Text>
      </View>
    )
  }

  return (
    <AppScreen animateOnFocus isEnableLinearGradient removeHorizontalPadding>
      <FeedHeader />

      <View className="flex-1">
        <FlatList
          data={posts}
          renderItem={({item}: {item: Post}) => (
            <View
              style={{
                width: SCREEN_WIDTH,
                paddingTop: SCREEN_HEIGHT * 0.01,
                paddingBottom: 250 // Sufficient space for Avatar Row and Bottom Carousel
              }}
              className="items-center justify-start"
            >
              <FeedCard post={item} onRepostPress={handleCreateRepost} />

              {/* Repost Counter Row - Clearly below FeedCard with margin */}
              <View style={{width: SCREEN_WIDTH * 0.88}} className="mt-4">
                <RepostCountDisplay post={item} onPress={openPingsSheet} />
              </View>
            </View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onRefresh={refetch}
          refreshing={isRefetching}
          removeClippedSubviews={true}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0">
        <MediaCarousel
          images={finalCarouselImages}
          onPress={openPingsSheet}
          totalReposts={currentPost?.total_reposts}
        />
      </View>

      <RepostSheet
        isOpen={isRepostSheetOpen}
        onClose={() => setIsRepostSheetOpen(false)}
        post={currentPost}
      />
    </AppScreen>
  )
}
