/**
 * RepostSheet — "Pings"
 *
 * Stack:
 *   • NativeWind v4  (className-based styling)
 *   • react-native-reanimated v3  (enter/like animations)
 *   • react-native-svg  (puzzle-piece card shape)
 *   • expo-image  (Image component)
 *   • @gorhom/bottom-sheet  (BottomSheetModal)
 *
 * Features:
 *   ✅ SVG Bezier puzzle card shape (notch ↓ / bump ↑)
 *   ✅ NativeWind className everywhere (zero StyleSheet except constants)
 *   ✅ Reanimated FadeInDown staggered card entrance
 *   ✅ Reanimated spring like-button scale + heart colour interpolation
 *   ✅ Full-bleed image with dark scrim  OR  dark solid card (no image)
 *   ✅ No user avatar in card header
 *   ✅ Clean @username  (strips spaces/specials after first word)
 *   ✅ "Read More" truncation at MAX_CHARS
 *   ✅ Responsive via useWindowDimensions
 *   ✅ Centred "Pings" title with mirror spacer trick
 */

import {useReposts} from '@/hooks/useFeedApi'
import {Post} from '@/types/feed'
import {Ionicons} from '@expo/vector-icons'
import {BottomSheetFlatList, BottomSheetModal} from '@gorhom/bottom-sheet'
import {Image} from 'expo-image'
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {
  ActivityIndicator,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
  useWindowDimensions
} from 'react-native'
import Animated, {
  FadeInDown,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from 'react-native-reanimated'
import Svg, {ClipPath, Defs, G, Path, Rect} from 'react-native-svg'
import Skeleton from '../../feedback/Skeleton'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const CARD_R = 22 // corner radius
const NOTCH_W = 88 // puzzle tab width
const NOTCH_H = 28 // puzzle tab depth
const MAX_CHARS = 130 // chars before "Read More"
const H_IMG = 275 // card height — with image
const H_NO = 195 // card height — no image

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

/** "@andrewdoms" from "andrewdoms • 1m ago" or "andrewdoms" */
function cleanUsername(raw = ''): string {
  const first = raw
    .replace(/[^a-zA-Z0-9_.]/g, ' ')
    .trim()
    .split(/\s+/)[0]
  return `@${first}`
}

/**
 * SVG path for a puzzle-piece rectangle.
 *
 *   topBump  — convex tab extending UP   from top-centre
 *   botNotch — concave tab cut DOWN from bottom-centre
 */
function puzzlePath(
  w: number,
  h: number,
  topBump: boolean,
  botNotch: boolean
): string {
  const r = CARD_R
  const nw = NOTCH_W
  const nh = NOTCH_H
  const cx = w / 2

  let d = `M ${r} 0 `

  // Top edge
  if (topBump) {
    d += `L ${cx - nw / 2} 0 `
    d += `C ${cx - nw / 2} ${-nh} ${cx + nw / 2} ${-nh} ${cx + nw / 2} 0 `
  }
  d += `L ${w - r} 0 Q ${w} 0 ${w} ${r} `

  // Right edge → bottom-right corner
  d += `L ${w} ${h - r} Q ${w} ${h} ${w - r} ${h} `

  // Bottom edge
  if (botNotch) {
    d += `L ${cx + nw / 2} ${h} `
    d += `C ${cx + nw / 2} ${h + nh} ${cx - nw / 2} ${h + nh} ${cx - nw / 2} ${h} `
  }
  d += `L ${r} ${h} Q 0 ${h} 0 ${h - r} `

  // Left edge back up
  d += `L 0 ${r} Q 0 0 ${r} 0 Z`

  return d
}

// ─────────────────────────────────────────────────────────────────────────────
// LIKE BUTTON  (Reanimated spring scale + colour)
// ─────────────────────────────────────────────────────────────────────────────
function LikeButton({count, onPress}: {count: number; onPress: () => void}) {
  const [liked, setLiked] = useState(false)
  const progress = useSharedValue(0) // 0 = not liked, 1 = liked
  const scale = useSharedValue(1)

  const handlePress = () => {
    const next = !liked
    setLiked(next)
    onPress()

    // Pop scale
    scale.value = withSpring(1.4, {damping: 4, stiffness: 300}, () => {
      scale.value = withSpring(1, {damping: 6, stiffness: 200})
    })

    // Colour transition
    progress.value = withTiming(next ? 1 : 0, {duration: 250})
  }

  const animIcon = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}]
  }))

  const animCount = useAnimatedStyle(() => ({
    color: interpolateColor(progress.value, [0, 1], ['#ffffff', '#FF4E6A'])
  }))

  return (
    <Pressable onPress={handlePress} className="items-center gap-1 pt-0.5">
      <Animated.View style={animIcon}>
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={26}
          color={liked ? '#FF4E6A' : '#ffffff'}
        />
      </Animated.View>
      <Animated.Text style={[animCount, {fontSize: 12, fontWeight: '700'}]}>
        {count.toLocaleString()}
      </Animated.Text>
    </Pressable>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REPOST CARD
// ─────────────────────────────────────────────────────────────────────────────
interface RepostCardProps {
  repost: Post
  isFirst: boolean
  isLast: boolean
  index: number
}

function RepostCard({repost, isFirst, isLast, index}: RepostCardProps) {
  const {width: screenW} = useWindowDimensions()
  const [cardW, setCardW] = useState(screenW - 24)
  const [expanded, setExpanded] = useState(false)

  const imageUri = repost.images?.[0]?.file
  const hasImage = !!imageUri
  const cardH = hasImage ? H_IMG : H_NO

  const topBump = !isFirst
  const botNotch = !isLast

  // Total SVG canvas height = card + bump above + notch below
  const svgH = cardH + (topBump ? NOTCH_H : 0) + (botNotch ? NOTCH_H : 0)
  const pathY = topBump ? NOTCH_H : 0 // shift path down so top bump shows

  const path = puzzlePath(cardW, cardH, topBump, botNotch)

  const onLayout = (e: LayoutChangeEvent) =>
    setCardW(e.nativeEvent.layout.width)

  // Text
  const fullText = repost.content ?? ''
  const needsTrunc = fullText.length > MAX_CHARS
  const bodyText =
    expanded || !needsTrunc
      ? fullText
      : fullText.slice(0, MAX_CHARS).trimEnd() + '…'

  const username = cleanUsername(
    repost.user?.username ?? repost.user?.display_name
  )
  const likeCount = repost.total_likes ?? 0

  // Unique IDs for SVG clip paths
  const clipId = `clip-card-${repost.id}`
  const imgClipId = `img-clip-${repost.id}`

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .springify()
        .damping(16)}
      style={{marginTop: topBump ? -NOTCH_H : 0}}
      onLayout={onLayout}
      className="w-full"
    >
      {/* ── SVG background shape ── */}
      <Svg
        width={cardW}
        height={svgH}
        style={{position: 'absolute', top: 0, left: 0}}
      >
        <Defs>
          <ClipPath id={clipId}>
            <Path d={path} translateY={pathY} />
          </ClipPath>
        </Defs>

        {/* Card background fill */}
        <Path
          d={path}
          translateY={pathY}
          fill={hasImage ? 'rgba(5,5,18,0.03)' : '#1C1C2E'}
        />

        {/* Subtle border */}
        <Path
          d={path}
          translateY={pathY}
          fill="none"
          stroke={
            hasImage ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)'
          }
          strokeWidth={1}
        />
      </Svg>

      {/* ── Image (clipped to puzzle shape) ── */}
      {hasImage && (
        <>
          {/* SVG clip mask for image */}
          <Svg
            width={cardW}
            height={svgH}
            style={{position: 'absolute', top: 0, left: 0}}
            pointerEvents="none"
          >
            <Defs>
              <ClipPath id={imgClipId}>
                <Path d={path} translateY={pathY} />
              </ClipPath>
            </Defs>
            <G clipPath={`url(#${imgClipId})`}>
              {/* This rect is transparent — clip mask is the point */}
              <Rect
                x={0}
                y={pathY}
                width={cardW}
                height={cardH}
                fill="transparent"
              />
            </G>
          </Svg>

          {/* Actual image behind everything */}
          <View
            style={{
              position: 'absolute',
              top: pathY,
              left: 0,
              width: cardW,
              height: cardH,
              borderRadius: CARD_R,
              overflow: 'hidden'
            }}
          >
            <Image
              source={{uri: imageUri}}
              style={{width: '100%', height: '100%'}}
              contentFit="cover"
            />
            {/* Gradient scrim */}
            <View
              style={{
                ...{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
                backgroundColor: 'rgba(4,4,18,0.52)'
              }}
            />
          </View>
        </>
      )}

      {/* ── Inner card content ── */}
      <View
        style={{
          position: 'absolute',
          top: pathY + 16,
          left: 16,
          right: 16,
          height: cardH - 32,
          justifyContent: 'space-between'
        }}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View className="flex-1 mr-3">
            <Text
              className="text-white font-extrabold text-lg leading-tight mb-0.5"
              numberOfLines={1}
            >
              {repost.user.display_name}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-white/60 text-xs font-medium">
                {username}
              </Text>
              <View className="w-[3px] h-[3px] rounded-full bg-white/30 mx-1.5" />
              <Text className="text-white/50 text-xs">1m ago</Text>
            </View>
          </View>

          <LikeButton count={likeCount} onPress={() => {}} />
        </View>

        {/* Body text */}
        <View>
          <Text
            className="text-white/90 text-sm leading-[21px]"
            style={{fontWeight: '400'}}
          >
            {bodyText}
            {needsTrunc && !expanded && (
              <Text
                className="text-white font-extrabold underline text-sm"
                onPress={() => setExpanded(true)}
              >
                {'  '}Read More
              </Text>
            )}
          </Text>
        </View>
      </View>

      {/* Spacer for the SVG canvas */}
      <View style={{height: svgH}} />
    </Animated.View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCards() {
  return (
    <View className="p-3 gap-4">
      {[H_IMG, H_NO, H_IMG].map((h, i) => (
        <Skeleton key={i} height={h} borderRadius={CARD_R} />
      ))}
    </View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <Animated.View
      entering={FadeInDown.springify().damping(14)}
      className="flex-1 items-center justify-center pt-20 px-8"
    >
      <View className="w-20 h-20 rounded-full bg-gray-200 items-center justify-center mb-5">
        <Ionicons name="megaphone-outline" size={44} color="#9CA3AF" />
      </View>
      <Text className="text-gray-900 text-xl font-extrabold mb-1.5">
        No Pings Yet
      </Text>
      <Text className="text-gray-500 text-sm text-center">
        Be the first to ping this post!
      </Text>
    </Animated.View>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REPOST SHEET
// ─────────────────────────────────────────────────────────────────────────────
interface RepostSheetProps {
  isOpen: boolean
  onClose: () => void
  post?: Post
}

export function RepostSheet({isOpen, onClose, post}: RepostSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => ['92%', '98%'], [])

  const threadId = post?.thread?.toString() || post?.id?.toString() || null

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    refetch,
    isRefetching
  } = useReposts(threadId, isOpen && !!threadId)

  const reposts: Post[] = useMemo(
    () => data?.pages.flatMap((p) => p.results) ?? [],
    [data]
  )

  useEffect(() => {
    if (isOpen) bottomSheetRef.current?.present()
    else bottomSheetRef.current?.dismiss()
  }, [isOpen])

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose()
    },
    [onClose]
  )

  const renderItem = useCallback(
    ({item, index}: {item: Post; index: number}) => (
      <RepostCard
        repost={item}
        isFirst={index === 0}
        isLast={index === reposts.length - 1}
        index={index}
      />
    ),
    [reposts.length]
  )

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backgroundStyle={{backgroundColor: '#F3F4F6', borderRadius: 32}}
      handleIndicatorStyle={{backgroundColor: '#D1D5DB', width: 48}}
    >
      <View className="flex-1 bg-gray-100">
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between px-4 pt-1.5 pb-3">
          {/* Back button */}
          <Pressable
            onPress={() => bottomSheetRef.current?.dismiss()}
            className="w-9 h-9 rounded-full bg-white items-center justify-center shadow-sm"
            style={{
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 6,
              shadowOffset: {width: 0, height: 2},
              elevation: 3
            }}
            hitSlop={16}
          >
            <Ionicons name="chevron-back" size={22} color="#1F2937" />
          </Pressable>

          {/* Title — centred because both sides are w-9 */}
          <Text className="text-xl font-extrabold italic text-gray-900 tracking-wide">
            Pings
          </Text>

          {/* Mirror spacer */}
          <View className="w-9" />
        </View>

        {/* ── List ── */}
        <BottomSheetFlatList
          data={reposts}
          keyExtractor={(item: Post) => item.id.toString()}
          renderItem={renderItem}
          onEndReached={() => {
            if (hasNextPage) fetchNextPage()
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={isLoading ? <SkeletonCards /> : <EmptyState />}
          ListFooterComponent={() =>
            isFetchingNextPage ? (
              <ActivityIndicator
                size="small"
                color="#4f8ef7"
                className="py-7"
              />
            ) : (
              <View className="h-14" />
            )
          }
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingTop: 4,
            paddingBottom: 60
          }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </BottomSheetModal>
  )
}
