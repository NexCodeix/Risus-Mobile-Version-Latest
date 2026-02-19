import {OptimizedImage} from '@/components/ui/OptimizedImage'
import {Dimensions, TouchableOpacity, View} from 'react-native'
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated'

const {width: SCREEN_WIDTH} = Dimensions.get('window')

interface MediaCarouselProps {
  images: string[]
  scrollX: SharedValue<number>
  onPress: () => void
}

export function MediaCarousel({images, scrollX, onPress}: MediaCarouselProps) {
  // Ensure we have exactly 3 images, use placeholders if needed
  const displayImages = [...images]

  while (displayImages.length < 3) {
    displayImages.push(
      'https://via.placeholder.com/200/3B82F6/FFFFFF?text=Ping'
    )
  }

  // Only show first 3
  const finalImages = displayImages.slice(0, 3)

  return (
    <View className="absolute bottom-20 left-0 right-0 h-28 items-center justify-center">
      <View className="flex-row items-center justify-center">
        {finalImages.map((image, index) => (
          <CarouselCard
            key={`carousel-${index}-${image.slice(-10)}`}
            image={image}
            index={index}
            scrollX={scrollX}
            onPress={onPress}
          />
        ))}
      </View>
    </View>
  )
}

interface CarouselCardProps {
  image: string
  index: number
  scrollX: SharedValue<number>
  onPress: () => void
}

function CarouselCard({image, index, scrollX, onPress}: CarouselCardProps) {
  // Animation for rotation and position
  const animatedStyle = useAnimatedStyle(() => {
    // Left card: rotate left
    // Center card: slight dynamic rotation
    // Right card: rotate right
    const rotation = index === 0 ? -15 : index === 2 ? 15 : 0

    const translateX = index === 0 ? -15 : index === 2 ? 15 : 0
    const scale = index === 1 ? 1.05 : 0.95
    const zIndex = index === 1 ? 3 : index === 0 ? 2 : 1

    return {
      transform: [
        {rotate: `${rotation}deg`},
        {translateX: withSpring(translateX)},
        {scale: withSpring(scale)}
      ],
      zIndex
    }
  })

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          marginHorizontal: -8
        }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        className="bg-blue-50 rounded-2xl overflow-hidden shadow-xl border-2 border-blue-100"
        style={{width: 140, height: 100}}
        activeOpacity={0.8}
      >
        <OptimizedImage
          source={image}
          contentFit="cover"
          className="w-full h-full"
          cachePolicy="memory-disk"
          showSkeleton
        />

        {/* Overlay gradient */}
        <View className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </TouchableOpacity>
    </Animated.View>
  )
}
