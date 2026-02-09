import {Feather, Ionicons} from '@expo/vector-icons'
import {ComponentProps} from 'react'
import {
  StyleProp,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableOpacityProps
} from 'react-native'

// Typo
export type TypoProps = {
  size?: number
  children: React.ReactNode
  className?: string
  style?: StyleProp<TextStyle>
  textProps?: TextProps
}
//loader type
export type LoaderType =
  | 'spinner'
  | 'dots'
  | 'bar'
  | 'pulse'
  | 'bounce'
  | 'wave'
  | 'orbit'
  | 'gradient'

export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl'
export interface LoaderProps {
  type?: LoaderType
  size?: LoaderSize
  color?: string
  secondaryColor?: string
  className?: string
  speed?: number
}

// Button
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'white'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type FeatherIconName = keyof typeof Feather.glyphMap
export interface ButtonProps extends Omit<TouchableOpacityProps, 'children'> {
  /** Button content */
  children: React.ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  loaderType?: LoaderType
  leftIcon?: FeatherIconName
  rightIcon?: FeatherIconName
  iconSize?: number
  fullWidth?: boolean
  className?: string
  contentClassName?: string
  animated?: boolean
  iconColor?: string
  enhancedAnimation?: boolean
}

//input types
export interface InputProps extends TextInputProps {
  label?: string
  leftIcon?: keyof typeof Feather.glyphMap
  rightIcon?: keyof typeof Feather.glyphMap
  iconSize?: number
  iconColor?: string
  error?: string
  helperText?: string
  containerClassName?: string
  inputWrapperClassName?: string
  inputClassName?: string
  labelClassName?: string
  onRightIconPress?: () => void
  disabled?: boolean
}

//backbutton prop
export type BackButtonProps = {
  onPress?: () => void
  iconName?: ComponentProps<typeof Ionicons>['name']
  iconColor?: string
  iconSize?: number
} & TouchableOpacityProps
