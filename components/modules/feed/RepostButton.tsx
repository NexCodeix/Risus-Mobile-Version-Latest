import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { Text, TouchableOpacity } from 'react-native'
import Animated, {
    interpolate,
    SharedValue,
    useAnimatedStyle
} from 'react-native-reanimated'

interface RepostButtonProps {
    onPress: () => void
    translateY: SharedValue<number>
}

export function RepostButton({ onPress, translateY }: RepostButtonProps) {
    const animatedStyle = useAnimatedStyle(() => {
        const translateYVal = interpolate(translateY.value, [-100, 0], [0, 100], 'clamp')
        return {
            transform: [{ translateY: translateYVal }],
        }
    })

    return (
        <Animated.View
            style={animatedStyle}
            className="absolute bottom-5 left-0 right-0 items-center z-50"
        >
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                className="overflow-hidden rounded-full"
            >
                <BlurView intensity={30} tint="light" className="px-6 py-3 flex-row items-center gap-2 bg-white/30 border border-white/20">
                    <Ionicons name="arrow-up" size={18} color="white" />
                    <Text className="text-white font-medium">Swipe Up to see the ping</Text>
                </BlurView>
            </TouchableOpacity>
        </Animated.View>
    )
}
