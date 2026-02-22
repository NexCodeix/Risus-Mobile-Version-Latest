import {Text, View} from 'react-native'
import React from 'react'
import AppScreen from '@/components/ui/AppScreen'

const notification = () => {
  return (
    <AppScreen isEnableLinearGradient animateOnFocus>
      <View>
        <Text>Notificaions</Text>
      </View>
    </AppScreen>
  )
}

export default notification
