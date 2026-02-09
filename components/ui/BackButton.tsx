import {BackButtonProps} from '@/types/common'
import {Ionicons} from '@expo/vector-icons'
import {router} from 'expo-router'
import {TouchableOpacity} from 'react-native'
import {useTheme} from '@/provider/ThemeProvider'

const BackButton = ({
  onPress,
  iconName = 'chevron-back',
  iconColor,
  iconSize = 24,
  className,
  ...props
}: BackButtonProps) => {
  const {theme} = useTheme()

  const handlePress = () => {
    if (onPress) {
      onPress()
    } else {
      router.back()
    }
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      className={`p-2 font-bold ${className}`}
      {...props}
    >
      <Ionicons
        name={iconName}
        size={iconSize}
        color={iconColor || theme.colors.text.primary}
      />
    </TouchableOpacity>
  )
}

export default BackButton
