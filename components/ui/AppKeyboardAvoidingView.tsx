import React, { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ================= TYPES ================= */

type AppKeyboardAvoidingViewProps = {
  children: ReactNode;
  style?: string;
  extraOffset?: number;
};

/* ================= COMPONENT ================= */

export default function AppKeyboardAvoidingView({
  children,
  style,
  extraOffset = 0,
}: AppKeyboardAvoidingViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${style}`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={insets.top + extraOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

/* =====================================================
 *
 * ⚠️ IMPORTANT GUIDELINES (READ BEFORE USING)
 *
 * ✅ USE THIS COMPONENT FOR:
 * - Normal screens
 * - Forms
 * - Chat pages
 * - Fixed input bars
 *
 * ❌ DO NOT USE THIS COMPONENT FOR:
 * - BottomSheetModal
 * - Gorhom BottomSheet
 * - React Native Modal
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
 *
 * -----------------------------------------------------
 *
 * 🧠 TEXT INPUT RULES
 *
 * - TextInput should be inside this wrapper
 * - Avoid nesting ScrollView inside ScrollView
 * - FlatList is allowed (NOT inside ScrollView)
 *
 * =====================================================
 */