import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native'
import Animated, { FadeIn, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import Typo from '../../ui/Typo'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
const CAROUSEL_HEIGHT = 220; // Taller for the larger cards
const CARD_WIDTH = 155;
const CARD_HEIGHT = 200;

interface MediaCarouselProps {
  images: string[]
  onPress: () => void
  totalReposts?: number
}

export function MediaCarousel({ images, onPress, totalReposts = 0 }: MediaCarouselProps) {
  const displayImages = [...images]
  while (displayImages.length < 3) {
    displayImages.push('placeholder')
  }

  return (
    <View style={styles.container}>
      {/* Background Blob Shape */}
      <View style={styles.blobContainer}>
       
        {/* Watermark */}
        <View style={StyleSheet.absoluteFill} className="items-center justify-center opacity-[0.03] mt-10">
          <Typo size={120} className="font-bold text-blue-900 uppercase">Risus</Typo>
        </View>
      </View>

      <View style={styles.cardsWrapper}>
        {displayImages.slice(0, 3).map((img, index) => (
          <CarouselCard
            key={`card-${index}`}
            image={img === 'placeholder' ? null : img}
            index={index}
            onPress={onPress}
          />
        ))}
      </View>

     
    </View>
  ) 
}

interface CarouselCardProps {
  image: string | null
  index: number
  onPress: () => void
}

function CarouselCard({ image, index, onPress }: CarouselCardProps) {
  const isMiddle = index === 1;

  const animatedStyle = useAnimatedStyle(() => {
    const rotation = index === 0 ? -8 : index === 2 ? 8 : 0
    const translateX = index === 0 ? -35 : index === 2 ? 35 : 0
    const scale = isMiddle ? 1.15 : 0.95
    const zIndex = isMiddle ? 10 : index === 0 ? 5 : 4

    return {
      transform: [
        { rotate: `${rotation}deg` },
        { translateX: withSpring(translateX) },
        { scale: withSpring(scale) }
      ],
      zIndex
    }
  })

  return (
    <Animated.View
      entering={FadeIn.delay(index * 150)}
      style={[
        animatedStyle,
        { marginHorizontal: -25 }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-white rounded-[32px] overflow-hidden shadow-2xl border-[3px] border-white/80"
        style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
        activeOpacity={0.9}
      >
        {image ? (
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={{ uri: image }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
            />
            {!isMiddle && (
              <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />
            )}
          </View>
        ) : (
          <LinearGradient
            colors={['#F8FAFC', '#F1F5F9']}
            style={StyleSheet.absoluteFill}
            className="items-center justify-center"
          >
            <Ionicons name="image-outline" size={24} color="#94A3B8" />
            {!isMiddle && (
              <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
            )}
          </LinearGradient>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: CAROUSEL_HEIGHT,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 0, // Touch bottom
  },
  blobContainer: {
    position: 'absolute',
    bottom: -50,
    width: SCREEN_WIDTH * 1.2,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    width: '100%',
    height: '100%',
    borderRadius: SCREEN_WIDTH,
    transform: [{ scaleX: 1.5 }],
  },
  cardsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 20, // Distance from edge
  },
});
