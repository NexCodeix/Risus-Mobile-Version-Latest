import { Redirect } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { getToken } from "@/utils/storage";
import { useUser } from "@/hooks/useUser";

export default function Index() {
  const token = getToken();

  const { isUserLoading } = useUser();

  // 🔒 Not logged in
  if (!token) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // ⏳ Wait for user query
  if (isUserLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  // ✅ Logged in
  return <Redirect href="/(tabs)" />;
}
