import React, { useEffect } from 'react';
import { Pressable } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const SWITCH_WIDTH = 52;
const SWITCH_HEIGHT = 32;
const THUMB_SIZE = 28;
const PADDING = 2;

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 200,
  mass: 0.2,
};

interface ModernSwitchProps {
  isEnabled: boolean;
  onToggleSwitch: () => void;
}

const ModernSwitch = ({ isEnabled, onToggleSwitch }: ModernSwitchProps) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(isEnabled ? 1 : 0, SPRING_CONFIG);
  }, [isEnabled, progress]);

  const animatedTrackStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#E5E7EB', '#3B82F6'] // gray-200 to blue-500
    );
    return {
      backgroundColor,
    };
  });

  const animatedThumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [PADDING, SWITCH_WIDTH - THUMB_SIZE - PADDING]
    );
    const scale = interpolate(
      progress.value,
      [0, 0.5, 1],
      [1, 1.2, 1] // Add a little bounce
    );
    return {
      transform: [{ translateX }, { scale }],
    };
  });

  return (
    <Pressable onPress={onToggleSwitch}>
      <Animated.View
        style={[
          animatedTrackStyle,
          {
            width: SWITCH_WIDTH,
            height: SWITCH_HEIGHT,
            borderRadius: SWITCH_HEIGHT / 2,
            justifyContent: 'center',
          },
        ]}>
        <Animated.View
          style={[
            animatedThumbStyle,
            {
              width: THUMB_SIZE,
              height: THUMB_SIZE,
              borderRadius: THUMB_SIZE / 2,
              backgroundColor: '#FFFFFF',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 4,
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
};

export default ModernSwitch;
