import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

/* =====================================================
   🔥 ROUNDY GLASS BASE
===================================================== */

const baseCard =
  "mx-4 px-5 py-4 rounded-[28px] flex-row items-center shadow-lg border";

/* =====================================================
   🎨 TOAST UI
===================================================== */

export const toastConfig: ToastConfig = {
  success: ({ text1, text2 }) => (
    <View
      className={`${baseCard} bg-emerald-50/95 border-emerald-200`}
    >
      <Ionicons
        name="checkmark-circle"
        size={26}
        color="#10B981"
        style={{ marginRight: 12 }}
      />

      <View className="flex-1">
        {text1 && (
          <Text className="text-[16px] font-semibold text-gray-900">
            {text1}
          </Text>
        )}

        {text2 && (
          <Text className="text-[13px] mt-1 text-gray-500">
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View
      className={`${baseCard} bg-red-50/95 border-red-200`}
    >
      <Ionicons
        name="close-circle"
        size={26}
        color="#EF4444"
        style={{ marginRight: 12 }}
      />

      <View className="flex-1">
        <Text className="text-[16px] font-semibold text-gray-900">
          {text1}
        </Text>

        {text2 && (
          <Text className="text-[13px] mt-1 text-gray-500">
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View
      className={`${baseCard} bg-blue-50/95 border-blue-200`}
    >
      <Ionicons
        name="information-circle"
        size={26}
        color="#3B82F6"
        style={{ marginRight: 12 }}
      />

      <View className="flex-1">
        <Text className="text-[16px] font-semibold text-gray-900">
          {text1}
        </Text>

        {text2 && (
          <Text className="text-[13px] mt-1 text-gray-500">
            {text2}
          </Text>
        )}
      </View>
    </View>
  ),

  loading: ({ text1 }) => (
    <View className={`${baseCard} bg-gray-900 border-gray-800`}>
      <ActivityIndicator size="small" color="white" style={{ marginRight: 12 }} />

      <Text className="text-white font-semibold text-[15px]">
        {text1 ?? "Loading..."}
      </Text>
    </View>
  ),
};

/* =====================================================
   ⚡ API
===================================================== */

type ToastOptions = {
  title: string;
  description?: string;
  duration?: number;
};

export const AppToast = {
  success({ title, description, duration = 2800 }: ToastOptions) {
    Toast.show({
      type: "success",
      text1: title,
      text2: description,
      visibilityTime: duration,
    });
  },

  error({ title, description, duration = 3200 }: ToastOptions) {
    Toast.show({
      type: "error",
      text1: title,
      text2: description,
      visibilityTime: duration,
    });
  },

  info({ title, description, duration = 2800 }: ToastOptions) {
    Toast.show({
      type: "info",
      text1: title,
      text2: description,
      visibilityTime: duration,
    });
  },

  loading(title = "Please wait...") {
    Toast.show({
      type: "loading",
      text1: title,
      autoHide: false,
    });
  },

  hide() {
    Toast.hide();
  },

  /* 🔥 VERY PRO FEATURE */
  async promise<T>(
    promise: Promise<T>,
    {
      loading = "Processing...",
      success = "Done!",
      error = "Something went wrong",
    }
  ) {
    this.loading(loading);

    try {
      const result = await promise;

      Toast.hide();

      this.success({ title: success });

      return result;
    } catch (e) {
      Toast.hide();

      this.error({ title: error });

      throw e;
    }
  },
};

/* =====================================================
   ROOT
===================================================== */

export function AppToastRoot() {
  return (
    <Toast
      config={toastConfig}
      position="top"
      topOffset={60}
    />
  );
}


/* =====================================================
 *
 * 🧠 USAGE GUIDELINES
 *
 *
 * 🧩 EXAMPLES
 *
 * AppToast.success({
 *   title: "Post created",
 *   description: "Your post is now live."
 * });
 *
 * AppToast.error({
 *   title: "Something went wrong",
 *   description: "Please try again."
 * });
 *
 * AppToast.info({
 *   title: "Saved",
 * });
 *
 * -----------------------------------------------------
 *
 * 🎨 CUSTOMIZATION
 *
 * - Change colors in toastConfig
 * - Add icons / animations
 * - Add new variants (warning, loading, etc.)
 *
 * =====================================================
 */