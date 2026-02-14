import React, {useMemo, useState} from 'react'
import {Pressable, ScrollView, View} from 'react-native'
import Typo from './Typo'
import Input from './Input'
import {Ionicons} from '@expo/vector-icons'
import {clsx} from 'clsx'
import type {ComponentProps} from 'react'

// TYPES

export type ListItemType = {
  id: string
  title: string
  subtitle?: string
  icon?: ComponentProps<typeof Ionicons>['name']
  isDanger?: boolean
  screen?: string // For navigation
  action?: string // For custom actions
  // Allow any other properties
  [key: string]: any
}

export type ListSectionType = {
  header: string
  items: ListItemType[]
}

type ListScreenProps = {
  title: string
  sections: ListSectionType[]
  renderHeader?: React.ReactNode
  onItemPress: (item: ListItemType) => void
  renderCustomItem?: (item: ListItemType) => React.ReactNode
  showSearch?: boolean
}

// SUB-COMPONENTS

  const ListItem = ({
  item,
  onPress,
  isLast
}: {
  item: ListItemType
  onPress: () => void
  isLast: boolean
}) => {
  const iconColor = item.isDanger ? '#EF4444' : '#0EA5E9' // danger or primary
  const textColor = item.isDanger ? 'text-danger' : 'text-text-primary' // danger or text-primary

  return (
    <Pressable
      onPress={onPress}
      className={clsx(
        'flex-row items-center py-4 px-4', // Increased padding
        !isLast && 'border-b border-border' // Use border color
      )}
    >
      {item.icon && (
        <View
          className="w-10 h-10 rounded-lg items-center justify-center mr-4"
          style={{backgroundColor: `${iconColor}1A`}}
        >
          <Ionicons name={item.icon} size={20} color={iconColor} />
        </View>
      )}
      <View className="flex-1">
        <Typo className={clsx('font-sans', textColor)}>{item.title}</Typo>
        {item.subtitle && (
          <Typo size={12} className="text-text-secondary mt-1">
            {item.subtitle}
          </Typo>
        )}
      </View>
      {item.action !== 'logout' && (
        <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
      )}
    </Pressable>
  )
}

// MAIN COMPONENT

const ListScreen = ({
  title,
  sections,
  renderHeader,
  onItemPress,
  renderCustomItem,
  showSearch = true
}: ListScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = useMemo(() => {
    if (!searchQuery) {
      return sections
    }
    const lowercasedQuery = searchQuery.toLowerCase()

    return sections
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            item.title.toLowerCase().includes(lowercasedQuery) ||
            item.subtitle?.toLowerCase().includes(lowercasedQuery)
        )
      }))
      .filter((section) => section.items.length > 0)
  }, [searchQuery, sections])

  return (
    <View className="flex-1 "> 
      <View className="px-4 pt-4 pb-2">
        <Typo size={32} className="font-heading text-text-primary">
          {title}
        </Typo>
      </View>

      {showSearch && (
        <View className="px-4 mt-4 mb-2">
          <Input
            leftIcon="search"
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}} // Removed horizontal padding from contentContainerStyle
      >
        {renderHeader && <View className="mt-4 px-4">{renderHeader}</View>} 

        {filteredSections.map((section) => (
          <View key={section.header} className="mt-8 px-4"> 
            <Typo
              size={14}
              className="font-sans font-semibold text-text-secondary uppercase tracking-wider pb-2" // Removed px-2, relying on parent px-4
            >
              {section.header}
            </Typo>
            <View> 
              {section.items.map((item, index) => (
                <View key={item.id} className={clsx(
                  "bg-surface rounded-xl", // Individual item background and rounded corners
                  !item.isDanger && "border border-border", // Border only for non-danger items
                  index === 0 && "mt-2", // Add margin top to first item in section
                  index === section.items.length - 1 ? "mb-2" : "mb-1" // Consistent margin bottom, less for last item
                )}>
                  {renderCustomItem && renderCustomItem(item) ? (
                    renderCustomItem(item)
                  ) : (
                    <ListItem
                      item={item}
                      onPress={() => onItemPress(item)}
                      isLast={index === section.items.length - 1}
                    />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}
export default ListScreen
