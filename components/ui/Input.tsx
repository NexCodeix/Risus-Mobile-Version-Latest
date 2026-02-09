import {InputProps} from '@/types/common'
import React, {useState, forwardRef} from 'react'
import {TextInput, View, Pressable, Text} from 'react-native'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useAnimatedStyle,
  withTiming,
  interpolateColor
} from 'react-native-reanimated'
import {clsx} from 'clsx'
import {useTheme} from '@/provider/ThemeProvider'

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      leftIcon,
      rightIcon,
      iconSize = 20,
      iconColor,
      error,
      helperText,
      containerClassName,
      inputWrapperClassName,
      inputClassName,
      labelClassName,
      onRightIconPress,
      disabled = false,
      secureTextEntry,
      ...props
    },
    ref
  ) => {
    // STATE MANAGEMENT
    const {theme} = useTheme()
    const [isFocused, setIsFocused] = useState(false)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    // ANIMATED STYLES

    /**
     * Animated border style that changes color on focus
     */
    const animatedBorderStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        isFocused ? 1 : 0,
        [0, 1],
        [
          error ? theme.colors.error : theme.colors.border.DEFAULT,
          error ? theme.colors.error : theme.colors.primary
        ]
      )

      return {
        borderColor: withTiming(borderColor, {duration: 200}),
        borderWidth: withTiming(isFocused ? 2 : 1, {duration: 200})
      }
    })

    /**
     * Animated background style that slightly changes on focus
     */
    const animatedBackgroundStyle = useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        isFocused ? 1 : 0,
        [0, 1],
        [theme.colors.bg.surface, theme.colors.bg.surfaceAlt]
      )

      return {
        backgroundColor: withTiming(backgroundColor, {duration: 200})
      }
    })

    // HANDLERS

    /**
     * Toggle password visibility
     */
    const handleTogglePassword = () => {
      setIsPasswordVisible((prev) => !prev)
    }

    /**
     * Handle right icon press
     */
    const handleRightIconPress = () => {
      if (secureTextEntry) {
        handleTogglePassword()
      } else if (onRightIconPress) {
        onRightIconPress()
      }
    }

    // COMPUTED VALUES

    /**
     * Determine which right icon to show
     * Password toggle takes precedence over custom right icon
     */
    const displayRightIcon = secureTextEntry
      ? isPasswordVisible
        ? 'eye-off'
        : 'eye'
      : rightIcon

    /**
     * Determine if password should be shown
     */
    const shouldSecureText = secureTextEntry && !isPasswordVisible

    const defaultIconColor = theme.colors.text.muted

    // RENDER

    return (
      <View className={clsx('w-full', containerClassName)}>
        {/* Label */}
        {label && (
          <Text
            className={clsx('mb-2 text-sm font-medium', labelClassName)}
            style={{
              color: error ? theme.colors.error : theme.colors.text.secondary
            }}
          >
            {label}
          </Text>
        )}

        {/* Input Wrapper with Animated Border and Background */}
        <Animated.View
          style={[animatedBorderStyle, animatedBackgroundStyle]}
          className={clsx(
            'flex-row items-center rounded-2xl px-5 py-1',
            disabled && 'opacity-50',
            inputWrapperClassName
          )}
        >
          {/* Left Icon */}
          {leftIcon && (
            <View className="mr-3">
              <Feather
                name={leftIcon}
                size={iconSize}
                color={
                  isFocused
                    ? theme.colors.primary
                    : iconColor || defaultIconColor
                }
              />
            </View>
          )}

          {/* Text Input */}
          <TextInput
            ref={ref} // Forward the ref here
            {...props}
            editable={!disabled}
            secureTextEntry={shouldSecureText}
            onFocus={(e) => {
              setIsFocused(true)
              props.onFocus?.(e)
            }}
            onBlur={(e) => {
              setIsFocused(false)
              props.onBlur?.(e)
            }}
            className={clsx('flex-1 px-2 py-3  text-base', inputClassName)}
            style={[{color: theme.colors.text.primary}, props.style]}
            placeholderTextColor={theme.colors.text.muted}
          />

          {/* Right Icon / Password Toggle */}
          {displayRightIcon && (
            <Pressable
              onPress={handleRightIconPress}
              className="ml-3 p-1"
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Feather
                name={displayRightIcon}
                size={iconSize}
                color={
                  isFocused
                    ? theme.colors.primary
                    : iconColor || defaultIconColor
                }
              />
            </Pressable>
          )}
        </Animated.View>

        {/* Error or Helper Text */}
        {(error || helperText) && (
          <Text
            style={{
              color: error ? theme.colors.error : theme.colors.text.muted
            }}
            className={clsx('mt-2 text-xs')}
          >
            {error || helperText}
          </Text>
        )}
      </View>
    )
  }
)

Input.displayName = 'Input' // Add display name for better debugging

export default Input
