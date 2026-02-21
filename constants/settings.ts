import {Href, router} from 'expo-router'
import {
  BarChart2,
  Bell,
  Bookmark,
  FileText,
  Hand,
  HelpCircle,
  Info,
  Key,
  PauseCircle,
  PieChart,
  Rocket,
  Trash2,
  User,
  Wallet
} from 'lucide-react-native'
import React from 'react'

// Icon colors
const ICON_COLORS = {
  primary: '#3b82f6',
  warning: '#eab308',
  danger: '#ef4444'
} as const

// Reusable navigation handler
const navigateTo = (route: Href) => () => router.push(route)

// Account section items
export const ACCOUNT_ITEMS: SettingItem[] = [
  {
    Icon: User,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Edit my profile',
    onPress: navigateTo('/(routes)/(settings)/profile')
  },
  {
    Icon: Key,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Change Password',
    onPress: navigateTo('/(auth)/change-pass')
  },
  {
    Icon: Wallet,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'RUSD Balance',
    subtitle: 'View your current RUSD holdings',
    onPress: navigateTo('/coming-soon')
  },
  {
    Icon: Wallet,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'RISUS Balance',
    subtitle: 'View your current RISUS holdings',
    onPress: navigateTo('/coming-soon')
  }
]

// Promotions section items
export const PROMOTIONS_ITEMS: SettingItem[] = [
  {
    Icon: Hand,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Influencer Partnerships',
    subtitle: 'Collaborate with creators to promote your brand',
    onPress: navigateTo('/coming-soon')
  },
  {
    Icon: BarChart2,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Monetize Pings',
    subtitle: 'Earn from Ping and boost engagement automatically',
    onPress: navigateTo('/coming-soon')
  },
  {
    Icon: Rocket,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Post Promotion',
    subtitle: 'Promote posts and reach a wider audience fast',
    onPress: navigateTo('/coming-soon')
  }
]

// General section items
export const GENERAL_ITEMS: SettingItem[] = [
  {
    Icon: Bookmark,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Bookmarks',
    onPress: navigateTo('/bookmarks')
  },
  {
    Icon: Bell,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Notifications',
     onPress: navigateTo('/notification')
  },
  {
    Icon: PieChart,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Analytics',
    onPress: navigateTo('/coming-soon')
  },
  {
    Icon: HelpCircle,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'FAQ',
    onPress : navigateTo('/faq')
  },
  {
    Icon: FileText,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'Terms & Conditions',
    onPress: navigateTo('/(routes)/(settings)/terms-conditions')
  },
  {
    Icon: Info,
    iconProps: {size: 20, color: ICON_COLORS.primary},
    title: 'About App',
     onPress: navigateTo('/about-app')
  }
]

// Account action items
export const ACCOUNT_ACTION_ITEMS: SettingItem[] = [
  {
    Icon: PauseCircle,
    iconProps: {size: 20, color: ICON_COLORS.warning},
    title: 'Deactivate Account',
    subtitle: 'Temporarily disable your account',
    titleColor: 'text-yellow-600'
  },
  {
    Icon: Trash2,
    iconProps: {size: 20, color: ICON_COLORS.danger},
    title: 'Request Account Deletion',
    subtitle: 'Permanently delete your account and data',
    titleColor: 'text-red-500'
  }
]

// Section configuration for easy mapping

type SettingItem = {
  Icon: React.ComponentType<any>
  iconProps: {size: number; color: string}
  title: string
  subtitle?: string // Make subtitle optional
  titleColor?: string
  onPress?: () => void
}

export const SETTINGS_SECTIONS: {
  title: string
  items: SettingItem[]
  titleColor?: string
}[] = [
  {title: 'Account', items: ACCOUNT_ITEMS},
  {title: 'Promotions', items: PROMOTIONS_ITEMS},
  {title: 'General', items: GENERAL_ITEMS},
  {
    title: 'Account Action',
    items: ACCOUNT_ACTION_ITEMS,
    titleColor: 'text-red-500'
  }
]

export const LANGUAGES = [
  {code: 'en', name: 'English'},
  {code: 'zh', name: 'Mandarin Chinese'},
  {code: 'hi', name: 'Hindi'},
  {code: 'es', name: 'Spanish'},
  {code: 'fr', name: 'French'},
  {code: 'ar', name: 'Standard Arabic'},
  {code: 'bn', name: 'Bengali'},
  {code: 'ru', name: 'Russian'},
  {code: 'pt', name: 'Portuguese'},
  {code: 'ur', name: 'Urdu'}
]
