import {ChevronRight} from 'lucide-react-native'
import React from 'react'
import {View, TouchableOpacity} from 'react-native'
import Typo from './Typo' 


interface SectionHeaderProps {
  title: string
  color?: string
}

export const SectionHeader = ({
  title,
  color = 'text-gray-900'
}: SectionHeaderProps) => (
  <Typo className={`text-base font-bold mt-6 mb-2 ${color}`}>{title}</Typo>
)

interface ListItemProps {
  Icon: React.ElementType
  iconProps?: any
  title: string
  subtitle?: string
  titleColor?: string
  onPress?: () => void
}

export const ListItem = ({
  Icon,
  iconProps = {},
  title,
  subtitle,
  titleColor = 'text-gray-800',
  onPress
}: ListItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center py-4 border-b border-gray-50"
  >
    <View className="w-10 h-10 bg-blue-50/50 rounded-full items-center justify-center">
      {Icon && <Icon {...iconProps} />}
    </View>
    <View className="ml-4 flex-1">
      <Typo size={14} className={`text-base font-medium ${titleColor}`}>
        {title}
      </Typo>
      {subtitle && (
        <Typo size={12} className="text-gray-400 text-sm">
          {subtitle}
        </Typo>
      )}
    </View>
    <ChevronRight size={18} color="#cbd5e1" />
  </TouchableOpacity>
)
