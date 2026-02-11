import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/useAuthStore";
import { ActivityIndicator, View } from "react-native";

export default function TabsLayout() {
  const { accessToken, isHydrated } = useAuthStore();

  // ⏳ WAIT FOR HYDRATION
  if (!isHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    );
  }

  // 🔒 NOT AUTHENTICATED
  if (!accessToken) {
    return <Redirect href="/(auth)/signin" />;
  }
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#9CA3AF",

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      {/* ================= DASHBOARD ================= */}

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />

      {/* ================= ORDERS ================= */}

      <Tabs.Screen
        name="create-post"
        options={{
          title: "Create Post",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" size={size} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
