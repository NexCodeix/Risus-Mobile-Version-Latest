/**
 * StackedCardBackground
 *
 * Ghost cards are LARGER than the FeedCard and sit behind it,
 * so they always peek out from the left, right, and bottom edges
 * regardless of the FeedCard's content or background colour.
 *
 *   Ghost card size = FeedCard + extra padding on all sides
 *   → peek amount is predictable and never hidden by the FeedCard
 *
 * Stack:
 *   • NativeWind v4  (className)
 *   • react-native-reanimated v3  (spring entrance)
 *   • useWindowDimensions  (responsive)
 */

import React, { useEffect } from 'react'
import { useWindowDimensions, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface StackedCardBackgroundProps {
  /** Exact rendered width of your FeedCard */
  cardWidth: number
  /** Exact rendered height of your FeedCard */
  cardHeight: number
  children: React.ReactNode
}

interface GhostCardProps {
  width: number
  height: number
  rotateDeg: number
  translateX: number
  translateY: number
  opacity: number
  borderRadius: number
  delay: number
  color: string
}

// ─────────────────────────────────────────────────────────────────────────────
// GHOST CARD
// ─────────────────────────────────────────────────────────────────────────────
function GhostCard({
  width,
  height,
  rotateDeg,
  translateX,
  translateY,
  opacity,
  borderRadius,
  delay,
  color,
}: GhostCardProps) {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withSpring(1, { damping: 22, stiffness: 90 }),
    )
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    opacity: progress.value * opacity,
    transform: [
      { translateX: translateX * progress.value },
      { translateY: translateY * progress.value },
      { rotate: `${rotateDeg * progress.value}deg` },
    ],
  }))

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width,
          height,
          borderRadius,
          backgroundColor: color,
          // Ensure ghost cards are always BELOW the FeedCard
          zIndex: 0,
        },
        animStyle,
      ]}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STACKED CARD BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
export function StackedCardBackground({
  cardWidth,
  cardHeight,
  children,
}: StackedCardBackgroundProps) {
  const { width: SW } = useWindowDimensions()

  /**
   * Ghost cards are BIGGER than the FeedCard.
   * This guarantees they always peek out from the edges
   * no matter what colour/content the FeedCard has.
   *
   * peekSide  = how many px show on left & right
   * peekBottom = how many px show below
   */
  const peekSide   = SW * 0.06   // ~24px on a 390pt screen
  const peekBottom = SW * 0.055  // ~21px

  const ghostW = cardWidth  + peekSide * 2    // wider than FeedCard
  const ghostH = cardHeight + peekBottom      // taller than FeedCard

  /**
   * Layer config — back to front:
   *
   *  back  : rotated left  (−6°), shifts down-left
   *  mid   : rotated right (+5°), shifts down-right slightly
   */
  const layers: Omit<GhostCardProps, 'width' | 'height'>[] = [
    // ── Back card (left tilt, most offset) ──────────────────────────────
    {
      rotateDeg:   -6,
      translateX:  -peekSide * 0.35,
      translateY:   peekBottom * 0.9,
      opacity:      0.5,
      borderRadius: 28,
      color:        '#B8D8F0',
      delay:        0,
    },
    // ── Mid card (right tilt, less offset) ──────────────────────────────
    {
      rotateDeg:    5,
      translateX:   peekSide * 0.2,
      translateY:   peekBottom * 0.55,
      opacity:      0.72,
      borderRadius: 26,
      color:        '#C6E0F5',
      delay:        70,
    },
  ]

  /**
   * Container:
   *   - Width/height = FeedCard size (what the parent lays out)
   *   - overflow: visible → ghost cards can poke outside
   *   - alignItems/justifyContent center → FeedCard centred
   */
  return (
    <View
      style={{
        width:          cardWidth,
        height:         cardHeight,
        alignItems:     'center',
        justifyContent: 'center',
        overflow:       'visible',  // critical — lets ghost cards show outside
      }}
    >
      {layers.map((layer, i) => (
        <GhostCard
          key={i}
          width={ghostW}
          height={ghostH}
          {...layer}
        />
      ))}

      {/* FeedCard — zIndex 10 keeps it above ghost layers */}
      <View
        style={{
          width:    cardWidth,
          height:   cardHeight,
          zIndex:   10,
        }}
      >
        {children}
      </View>
    </View>
  )
}

export default StackedCardBackground