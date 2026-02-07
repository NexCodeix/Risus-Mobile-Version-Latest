
import { ButtonProps, ButtonSize, ButtonVariant } from '@/types/common';
import { verticalScale } from '@/lib/styling';
import { Feather } from '@expo/vector-icons';
import { clsx } from 'clsx';
import React, { forwardRef } from 'react';
import { Platform, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import Loader from './Loader';
import { useTheme } from '@/provider/ThemeProvider';

const SIZE_CONFIG: Record<ButtonSize, { height: number; paddingX: number; fontSize: number }> = {
  sm: { height: verticalScale(35), paddingX: 16, fontSize: 14 },
  md: { height: verticalScale(48), paddingX: 20, fontSize: 16 },
  lg: { height: verticalScale(56), paddingX: 24, fontSize: 18 },
  xl: { height: verticalScale(64), paddingX: 28, fontSize: 20 },
};

// Create animated component (more compatible approach)
const createAnimatedTouchable = () => {
  if (Platform.OS === 'web') {
    return TouchableOpacity;
  }
  return Animated.createAnimatedComponent(TouchableOpacity);
};

const AnimatedTouchable = createAnimatedTouchable();

// MAIN BUTTON COMPONENT

export const Button = forwardRef<View, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      loaderType = 'spinner',
      leftIcon,
      rightIcon,
      iconSize,
      fullWidth = false,
      className,
      iconColor,
      contentClassName,
      animated = true,
      enhancedAnimation = false,
      disabled = false,
      style,
      onPressIn,
      onPressOut,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();

    const VARIANT_CONFIG: Record<
      ButtonVariant,
      {
        container: string;
        text: string;
        iconColor: string;
        loader: string;
        disabled: string;
      }
    > = {
      primary: {
        container: 'bg-primary',
        text: 'text-white',
        iconColor: theme.colors.text.inverse,
        loader: theme.colors.text.inverse,
        disabled: 'bg-primary/50',
      },
      secondary: {
        container: 'bg-secondary',
        text: 'text-white',
        iconColor: theme.colors.text.inverse,
        loader: theme.colors.text.inverse,
        disabled: 'bg-secondary/50',
      },
      outline: {
        container: 'bg-transparent border-2 border-primary',
        text: 'text-primary',
        iconColor: theme.colors.primary,
        loader: theme.colors.primary,
        disabled: 'border-primary/50',
      },
      ghost: {
        container: 'bg-transparent',
        text: 'text-primary',
        iconColor: theme.colors.primary,
        loader: theme.colors.primary,
        disabled: 'bg-gray-100',
      },
      danger: {
        container: 'bg-red-500',
        text: 'text-white',
        iconColor: theme.colors.text.inverse,
        loader: theme.colors.text.inverse,
        disabled: 'bg-red-500/50',
      },
      success: {
        container: 'bg-green-500',
        text: 'text-white',
        iconColor: theme.colors.text.inverse,
        loader: theme.colors.text.inverse,
        disabled: 'bg-green-500/50',
      },
      white: {
        container: 'bg-white',
        text: 'text-primary',
        iconColor: theme.colors.primary,
        loader: theme.colors.primary,
        disabled: 'bg-gray-200',
      },
    };

    // ANIMATION VALUES

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const rotate = useSharedValue(0);
    const translateY = useSharedValue(0);

    // COMPUTED VALUES

    const sizeConfig = SIZE_CONFIG[size];
    const variantConfig = VARIANT_CONFIG[variant];
    const isDisabled = disabled || loading;

    // Determine icon size based on button size if not explicitly provided
    const computedIconSize =
      iconSize || (size === 'sm' ? 16 : size === 'md' ? 18 : size === 'lg' ? 20 : 22);

    // Determine icon color - use prop if provided, otherwise use variant default
    const computedIconColor = iconColor || variantConfig.iconColor;

    // ANIMATED STYLES

    /**
     * Animated style for press feedback
     */
    const animatedStyle = useAnimatedStyle(() => {
      if (enhancedAnimation) {
        return {
          transform: [
            { scale: scale.value },
            { translateY: translateY.value },
            { rotate: `${rotate.value}deg` },
          ],
          opacity: opacity.value,
        };
      }
      return {
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
      };
    });

    // HANDLERS

    /**
     * Handle press in with smooth scale animation (no wobbling)
     */
    const handlePressIn = (event: any) => {
      if (animated && !isDisabled) {
        if (enhancedAnimation) {
          // Enhanced modern animation
          scale.value = withTiming(0.96, {
            duration: 120,
            easing: Easing.out(Easing.ease),
          });
          opacity.value = withTiming(0.85, {
            duration: 120,
            easing: Easing.out(Easing.ease),
          });
          translateY.value = withTiming(2, {
            duration: 120,
            easing: Easing.out(Easing.ease),
          });
          rotate.value = withTiming(-0.5, {
            duration: 120,
            easing: Easing.out(Easing.ease),
          });
        } else {
          // Simple, smooth animation
          scale.value = withTiming(0.98, {
            duration: 100,
            easing: Easing.out(Easing.ease),
          });
          opacity.value = withTiming(0.9, {
            duration: 100,
            easing: Easing.out(Easing.ease),
          });
        }
      }
      onPressIn?.(event);
    };

    /**
     * Handle press out with smooth scale animation (no wobbling)
     */
    const handlePressOut = (event: any) => {
      if (animated && !isDisabled) {
        if (enhancedAnimation) {
          // Enhanced modern animation with subtle bounce back
          scale.value = withSequence(
            withTiming(1.02, {
              duration: 100,
              easing: Easing.out(Easing.ease),
            }),
            withTiming(1, {
              duration: 150,
              easing: Easing.inOut(Easing.ease),
            })
          );
          opacity.value = withTiming(1, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
          });
          translateY.value = withSequence(
            withTiming(-1, {
              duration: 100,
              easing: Easing.out(Easing.ease),
            }),
            withTiming(0, {
              duration: 150,
              easing: Easing.inOut(Easing.ease),
            })
          );
          rotate.value = withTiming(0, {
            duration: 200,
            easing: Easing.inOut(Easing.ease),
          });
        } else {
          // Simple, smooth return animation
          scale.value = withTiming(1, {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          });
          opacity.value = withTiming(1, {
            duration: 150,
            easing: Easing.inOut(Easing.ease),
          });
        }
      }
      onPressOut?.(event);
    };

    // RENDER

    return (
      <AnimatedTouchable
        ref={ref}
        activeOpacity={0.7}
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={clsx(
          'flex-row items-center justify-center rounded-full',
          fullWidth && 'w-full',
          !isDisabled ? variantConfig.container : variantConfig.disabled,
          enhancedAnimation && 'shadow-lg',
          className
        )}
        style={[
          animated ? animatedStyle : {},
          {
            height: sizeConfig.height,
            paddingHorizontal: sizeConfig.paddingX,
            minWidth: fullWidth ? undefined : sizeConfig.height,
          } as ViewStyle,
          style,
        ]}
        {...props}>
        {/* Loading State */}
        {loading ? (
          <Loader
            type={loaderType}
            size={size === 'sm' ? 'sm' : size === 'xl' ? 'lg' : 'md'}
            color={variantConfig.loader}
          />
        ) : (
          /* Normal Content */
          <View className={clsx('flex-row items-center justify-center gap-2', contentClassName)}>
            {/* Left Icon */}
            {leftIcon && (
              <Feather name={leftIcon} size={computedIconSize} color={computedIconColor} />
            )}

            {/* Children Content */}
            {typeof children === 'string' ? (
              <Text
                className={clsx(
                  'font-semibold',
                  variantConfig.text,
                  `text-[${sizeConfig.fontSize}px]`
                )}>
                {children}
              </Text>
            ) : (
              <View>{children}</View>
            )}

            {/* Right Icon */}
            {rightIcon && (
              <Feather name={rightIcon} size={computedIconSize} color={computedIconColor} />
            )}
          </View>
        )}
      </AnimatedTouchable>
    );
  }
);

Button.displayName = 'Button';    