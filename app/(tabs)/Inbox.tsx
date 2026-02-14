import { Text, View} from 'react-native'
import React from 'react'
import AppScreen from '@/components/ui/AppScreen'

const Inbox = () => {
  return (
    <AppScreen removeHorizontalPadding animateOnFocus statusBarStyle="dark">
      <View>
        <Text>Inbox</Text>
      </View>
    </AppScreen>
  )
}

export default Inbox
