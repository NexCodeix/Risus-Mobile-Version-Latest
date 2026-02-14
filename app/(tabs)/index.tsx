import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import AppButton from "@/components/ui/AppButton";
import { AppToast } from "@/components/ui/AppToast";
import AppScreen from "@/components/ui/AppScreen";
import { router } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";

export default function HomeScreen() {
    const { user, isUserLoading } = useUser();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.replace("/(auth)/welcome");
    };

    if (isUserLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    return (
        <AppScreen>
          <Text className="text-xl font-bold mb-4">
              Welcome {user?.name || user?.email}
          </Text>

          <AppButton
              title="Success"
              onPress={() => AppToast.success({ title: "Hey" })}
          />

          <AppButton
              title="Logout"
              onPress={handleLogout}
          />

          <AppButton
              title="Welcome Screen"
              onPress={() => router.push("/(auth)/welcome")}
          />
      </AppScreen>
  );
}
