import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/useAuthStore";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const { accessToken, isHydrated } = useAuthStore();

  // ⏳ Wait for hydration
  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  // 🔒 Not logged in
  if (!accessToken) {
    return <Redirect href="/(auth)/signin" />;
    // return <Redirect href="/(tabs)/Setting" />;
  }

  // ✅ Logged in
  return <Redirect href="/(tabs)" />;
}
