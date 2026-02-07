
import React, { useEffect, useMemo } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { LoaderProps, LoaderSize, LoaderType } from '@/types/common';
import { verticalScale } from '@/lib/styling';
import { clsx } from 'clsx';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/provider/ThemeProvider';

// CONFIGURATION
const SIZE_CONFIG: Record<LoaderSize, {
  indicatorSize: 'small' | 'large';
  dotSize: number;
  barHeight: number;
  pulseSize: number;
  orbitSize: number;
}> = {
  sm: {
    indicatorSize: 'small',
    dotSize: verticalScale(6),
    barHeight: verticalScale(4),
    pulseSize: verticalScale(24),
    orbitSize: verticalScale(32),
  },
  md: {
    indicatorSize: 'large',
    dotSize: verticalScale(8),
    barHeight: verticalScale(5),
    pulseSize: verticalScale(32),
    orbitSize: verticalScale(48),
  },
  lg: {
    indicatorSize: 'large',
    dotSize: verticalScale(10),
    barHeight: verticalScale(6),
    pulseSize: verticalScale(40),
    orbitSize: verticalScale(64),
  },
  xl: {
    indicatorSize: 'large',
    dotSize: verticalScale(12),
    barHeight: verticalScale(7),
    pulseSize: verticalScale(56),
    orbitSize: verticalScale(80),
  },
};

// UTILITY FUNCTIONS
const getAnimationDuration = (baseDuration: number, speed: number = 1) => baseDuration / speed;

// LOADER IMPLEMENTATIONS

const SpinnerLoader: React.FC<Pick<LoaderProps, 'size' | 'color'>> = ({
  size = 'md',
  color
}) => {
  const { theme } = useTheme();
  return <ActivityIndicator size={SIZE_CONFIG[size].indicatorSize} color={color || theme.colors.primary} />
};

const DotsLoader: React.FC<Pick<LoaderProps, 'size' | 'color' | 'speed'>> = ({
  size = 'md',
  color,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const dotSize = SIZE_CONFIG[size].dotSize;
  const animations = useMemo(() => [useSharedValue(0), useSharedValue(0), useSharedValue(0)], []);
  const loaderColor = color || theme.colors.primary;

  useEffect(() => {
    const duration = getAnimationDuration(500, speed);
    animations.forEach((anim, i) => {
      anim.value = withDelay(
        i * (duration / 2),
        withRepeat(
          withSequence(
            withSpring(1, { damping: 10, stiffness: 120 }),
            withSpring(0.5, { damping: 10, stiffness: 120 })
          ),
          -1,
          true
        )
      );
    });
  }, [speed, animations]);

  const createAnimatedStyle = (anim: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: anim.value }],
    }));

  return (
    <View className="flex-row items-center justify-center gap-x-2">
      {animations.map((anim, i) => (
        <Animated.View
          key={i}
          className="rounded-full"
          style={[
            { width: dotSize, height: dotSize, backgroundColor: loaderColor },
            createAnimatedStyle(anim),
          ]}
        />
      ))}
    </View>
  );
};

const BarLoader: React.FC<Pick<LoaderProps, 'size' | 'color' | 'speed'>> = ({
  size = 'md',
  color,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const barHeight = SIZE_CONFIG[size].barHeight;
  const loaderColor = color || theme.colors.primary;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: getAnimationDuration(1200, speed),
        easing: Easing.bezier(0.65, 0, 0.35, 1)
      }),
      -1,
      true
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${interpolate(progress.value, [0, 0.5, 1], [0, 100, 0])}%`,
  }));

  return (
    <View
      className="w-full rounded-full overflow-hidden"
      style={[{ height: barHeight, backgroundColor: `${loaderColor}20` }]}
    >
      <Animated.View
        className="h-full rounded-full"
        style={[{ backgroundColor: loaderColor }, animatedStyle]}
      />
    </View>
  );
};

const PulseLoader: React.FC<Pick<LoaderProps, 'size' | 'color' | 'speed'>> = ({
  size = 'md',
  color,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const pulse = useSharedValue(0);
  const pulseSize = SIZE_CONFIG[size].pulseSize;
  const loaderColor = color || theme.colors.primary;

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, {
        duration: getAnimationDuration(1800, speed),
        easing: Easing.out(Easing.quad)
      }),
      -1,
      false
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulse.value, [0, 1], [0.5, 1.5]);
    const opacity = interpolate(pulse.value, [0, 1], [1, 0]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View className="items-center justify-center" style={{ width: pulseSize * 1.5, height: pulseSize * 1.5 }}>
      <Animated.View
        className="rounded-full absolute"
        style={[
          { width: pulseSize, height: pulseSize, backgroundColor: loaderColor },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const BounceLoader: React.FC<Pick<LoaderProps, 'size' | 'color' | 'speed'>> = ({
  size = 'md',
  color,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const bounce = useSharedValue(0);
  const dotSize = SIZE_CONFIG[size].dotSize * 1.2;
  const loaderColor = color || theme.colors.primary;

  useEffect(() => {
    bounce.value = withRepeat(
      withSequence(
        withTiming(1, { duration: getAnimationDuration(500, speed), easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: getAnimationDuration(500, speed), easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(bounce.value, [0, 1], [0, -verticalScale(25)]);
    const scale = interpolate(bounce.value, [0, 0.5, 1], [1, 0.8, 1]);

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  return (
    <View className="items-center justify-center" style={{ height: verticalScale(40) }}>
      <Animated.View
        className="rounded-full"
        style={[
          { width: dotSize, height: dotSize, backgroundColor: loaderColor },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const WaveLoader: React.FC<Pick<LoaderProps, 'size' | 'color' | 'speed'>> = ({
  size = 'md',
  color,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const barHeight = SIZE_CONFIG[size].dotSize * 2.5;
  const barWidth = SIZE_CONFIG[size].dotSize / 1.5;
  const loaderColor = color || theme.colors.primary;
  const waves = useMemo(() => [
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
    useSharedValue(0),
  ], []);

  useEffect(() => {
    const duration = getAnimationDuration(1000, speed);
    waves.forEach((wave, i) => {
      wave.value = withDelay(
        i * (duration / 4),
        withRepeat(
          withSequence(
            withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
            withTiming(0.2, { duration, easing: Easing.inOut(Easing.ease) })
          ),
          -1,
          true
        )
      );
    });
  }, [speed, waves]);

  const createAnimatedStyle = (wave: Animated.SharedValue<number>) =>
    useAnimatedStyle(() => {
      const scale = interpolate(wave.value, [0.2, 1], [0.2, 1], Extrapolation.CLAMP);
      return { transform: [{ scaleY: scale }] };
    });

  return (
    <View className="flex-row items-end justify-center gap-x-1" style={{ height: barHeight }}>
      {waves.map((wave, i) => (
        <Animated.View
          key={i}
          className="rounded"
          style={[
            { width: barWidth, height: barHeight, backgroundColor: loaderColor },
            createAnimatedStyle(wave),
          ]}
        />
      ))}
    </View>
  );
};

const OrbitLoader: React.FC<Pick<LoaderProps, 'size' | 'color' | 'secondaryColor' | 'speed'>> = ({
  size = 'md',
  color,
  secondaryColor,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const rotation = useSharedValue(0);
  const orbitSize = SIZE_CONFIG[size].orbitSize;
  const dotSize = SIZE_CONFIG[size].dotSize * 1.1;
  const loaderColor = color || theme.colors.primary;
  const loaderSecondaryColor = secondaryColor || theme.colors.secondary;

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: getAnimationDuration(1800, speed),
        easing: Easing.linear
      }),
      -1,
      false
    );
  }, [speed]);

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { translateX: orbitSize / 2.5 },
      { rotate: `${-rotation.value}deg` },
    ],
  }));

  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value + 180}deg` },
      { translateX: orbitSize / 2.5 },
      { rotate: `${-rotation.value}deg` },
    ],
  }));

  return (
    <View
      className="items-center justify-center"
      style={{ width: orbitSize, height: orbitSize }}
    >
      <Animated.View
        className="rounded-full absolute"
        style={[
          { width: dotSize, height: dotSize, backgroundColor: loaderColor },
          animatedStyle1,
        ]}
      />
      <Animated.View
        className="rounded-full absolute"
        style={[
          { width: dotSize, height: dotSize, backgroundColor: loaderSecondaryColor },
          animatedStyle2,
        ]}
      />
    </View>
  );
};

const GradientLoader: React.FC<Pick<LoaderProps, 'size' | 'color' | 'secondaryColor' | 'speed'>> = ({
  size = 'md',
  color,
  secondaryColor,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const progress = useSharedValue(0);
  const barHeight = SIZE_CONFIG[size].barHeight;
  const loaderColor = color || theme.colors.primary;
  const loaderSecondaryColor = secondaryColor || theme.colors.secondary;

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: getAnimationDuration(2000, speed),
        easing: Easing.linear,
      }),
      -1,
      true
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [loaderColor, loaderSecondaryColor]
    );
    return { backgroundColor };
  });

  return (
    <View
      className="w-full rounded-full overflow-hidden"
      style={{ height: barHeight, backgroundColor: `${loaderColor}20` }}
    >
      <Animated.View className="h-full w-full" style={animatedStyle} />
    </View>
  );
};


const LOADER_MAP: Record<LoaderType, React.FC<Pick<LoaderProps, 'size' | 'color' | 'secondaryColor' | 'speed'>>> = {
  spinner: SpinnerLoader,
  dots: DotsLoader,
  bar: BarLoader,
  pulse: PulseLoader,
  bounce: BounceLoader,
  wave: WaveLoader,
  orbit: OrbitLoader,
  gradient: GradientLoader,
};

// MAIN LOADER COMPONENT
const Loader: React.FC<LoaderProps> = ({
  type = 'spinner',
  size = 'md',
  color,
  secondaryColor,
  className,
  speed = 1,
}) => {
  const { theme } = useTheme();
  const LoaderComponent = LOADER_MAP[type];
  const loaderColor = color || theme.colors.primary;

  if (!LoaderComponent) {
    if (Platform.OS !== 'web') {
      console.warn(`Loader type "${type}" is not supported.`);
    }
    return <SpinnerLoader size={size} color={loaderColor} />;
  }

  return (
    <View className={clsx('items-center justify-center', className)}>
      <LoaderComponent
        size={size}
        color={loaderColor}
        secondaryColor={secondaryColor}
        speed={speed}
      />
    </View>
  );
};

export default Loader;