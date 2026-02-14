import React from "react";
import { Tabs } from "expo-router";
import { View, TouchableOpacity, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Home, MessageCircle, Plus, Settings } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
        },
      }}
      tabBar={(props: any) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="create-post" options={{ title: "Create" }} />
      <Tabs.Screen name="setting" options={{ title: "Setting" }} />
    </Tabs>
  );
}

function CustomTabBar({ state, navigation }: any) {
  return (
    // Positioning the bar at the bottom with some padding
    <View className="absolute bottom-10 left-5 right-5 items-center">
      <BlurView
        intensity={100}
        tint="light" // Light mode glassy effect
        className="flex-row items-center justify-between px-2 py-2 rounded-[40px] overflow-hidden border border-white/60 bg-white shadow-sm"
        style={{ width: '100%', height: 75 }}
      >
        {state.routes.map((route: { key: React.Key | null | undefined; name: string; }, index: any) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const renderIcon = () => {
            const iconSize = 24;
            // Modern slate colors for inactive state
            const inactiveColor = "#64748b";

            let IconComponent;
            switch (route.name) {
              case "index": IconComponent = Home; break;
              case "chat": IconComponent = MessageCircle; break;
              case "create-post": IconComponent = Plus; break;
              case "setting": IconComponent = Settings; break;
              default: IconComponent = Home;
            }

            // If the tab is active, wrap it in the Purple Gradient Circle
            if (isFocused) {
              return (
                <LinearGradient
                  colors={["#D946EF", "#9333EA"]} // Matches the image's vibrant purple
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 27,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // Adding a slight outer glow/shadow to the active button
                    shadowColor: "#9333EA",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <IconComponent
                    size={route.name === "create-post" ? 30 : 24}
                    color="white"
                    strokeWidth={2.5}
                  />
                </LinearGradient>
              );
            }

            // Inactive State
            return <IconComponent size={iconSize} color={inactiveColor} strokeWidth={2} />;
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              className="items-center justify-center flex-1"
            >
              {renderIcon()}
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}