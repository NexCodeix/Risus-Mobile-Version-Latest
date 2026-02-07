import { Stack } from "expo-router";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import "../global.css"
import { AppToastRoot } from "@/components/ui/AppToast";

const queryClient = new QueryClient()

export default function RootLayout() {

  return (
    <QueryClientProvider client={queryClient}>
      <Stack />
      <AppToastRoot />
    </QueryClientProvider>
  )
}
