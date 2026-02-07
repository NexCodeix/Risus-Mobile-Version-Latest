import React, { ReactNode } from "react";
import {
  Keyboard,
  StatusBar,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ================= TYPES ================= */

type AppScreenProps = {
  children: ReactNode;
  backgroundColor?: string;
  style?: ViewStyle;
  statusBarStyle?: "light" | "dark";
};

/* ================= COMPONENT ================= */

export default function AppScreen({
  children,
  backgroundColor = "#FFFFFF",
  style,
  statusBarStyle = "dark",
}: AppScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={[
          {
            flex: 1,
            backgroundColor,
            paddingTop: insets.top,
          },
          style,
        ]}
      >
        <StatusBar
          barStyle={statusBarStyle === "dark" ? "dark-content" : "light-content"}
          backgroundColor={backgroundColor}
        />

        {children}
      </View>
    </TouchableWithoutFeedback>
  );
}

/* =====================================================
 *
 * ⚠️ IMPORTANT GUIDELINES
 *
 * ✅ USE AppScreen FOR:
 * - Every main screen
 * - Forms
 * - Chat screens
 * - Lists
 * - Profile pages
 *
 * ❌ DO NOT USE AppScreen FOR:
 * - BottomSheetModal
 * - Gorhom BottomSheet content
 * - React Native Modal content
 *
 * -----------------------------------------------------
 *
 * 🧠 COMMON PATTERN (RECOMMENDED)
 *
 * <AppScreen>
 *   <AppKeyboardAvoidingView>
 *     ...content
 *   </AppKeyboardAvoidingView>
 * </AppScreen>
 *
 * =====================================================
 */