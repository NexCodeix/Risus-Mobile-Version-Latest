

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, ColorValue } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { clsx } from 'clsx';
import { useTheme } from '@/provider/ThemeProvider';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  className?: string;
  shimmerDuration?: number;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  className,
  shimmerDuration = 1500,
}) => {
  const { theme } = useTheme();
  const progress = useSharedValue(-1);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: shimmerDuration }), -1, false);
  }, [progress, shimmerDuration]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [-1, 1], [-300, 300], Extrapolation.CLAMP);
    return {
      transform: [{ translateX }],
    };
  });

  const skeletonStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: theme.colors.bg.surface,
  };

  const gradientColors = [
    'transparent',
    theme.colors.bg.surfaceAlt,
    'transparent',
  ];

  return (
    <View
      style={[styles.container, skeletonStyle as ViewStyle]}
      className={clsx('overflow-hidden', className)}>
      <AnimatedLinearGradient
        colors={gradientColors as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[StyleSheet.absoluteFill, animatedStyle]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Skeleton;
