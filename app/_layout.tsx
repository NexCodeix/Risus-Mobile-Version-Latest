import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "../global.css"
import { AppToastRoot } from "@/components/ui/AppToast";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const queryClient = new QueryClient()

export default function RootLayout() {
  const hydrate = useAuthStore(state => state.hydrate);

  useEffect(() => {
    hydrate();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
        <AppToastRoot />
      </SafeAreaProvider>
    </QueryClientProvider>
  )
}
