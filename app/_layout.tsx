import {Stack} from 'expo-router'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import '../global.css'
import {AppToastRoot} from '@/components/ui/AppToast'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {useEffect} from 'react'
import {useAuthStore} from '@/store/useAuthStore'
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync()

const queryClient = new QueryClient()

export default function RootLayout() {
  const hydrate = useAuthStore((state) => state.hydrate)

  const [loaded, error] = useFonts({
    Poppins_Regular: Poppins_400Regular,
    Poppins_SemiBold: Poppins_600SemiBold,
    Poppins_Bold: Poppins_700Bold
  })

  useEffect(() => {
    // Hide splash screen once fonts are loaded OR if there's an error
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  useEffect(() => {
    hydrate()
  }, [])

  // Return null to keep splash screen visible until fonts are ready
  if (!loaded && !error) {
    return null
  }

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <BottomSheetModalProvider>
            <Stack screenOptions={{headerShown: false}} />
            <AppToastRoot />
          </BottomSheetModalProvider>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  )
}
