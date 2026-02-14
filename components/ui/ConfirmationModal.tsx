/**
 * @component ConfirmationModal
 * @description Reusable modal for confirmations with customizable styles
 * @author Refactored Code
 * @date 2026-02-13
 */

import React from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ModalConfig } from '@/types/common';

interface ConfirmationModalProps extends Omit<ModalConfig, 'visible'> {
  visible: boolean;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  icon,
  iconColor,
  confirmText,
  confirmColor,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !isLoading && onCancel()}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-5">
        <View className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm items-center">
          {/* Icon */}
          <View className="mb-4">
            <Ionicons name={icon as any} size={60} color={iconColor} />
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
            {title}
          </Text>

          {/* Message */}
          <Text className="text-base text-gray-500 dark:text-gray-400 text-center leading-6 mb-6">
            {message}
          </Text>

          {/* Buttons */}
          <View className="flex-row w-full gap-3">
            <TouchableOpacity
              className="flex-1 py-3.5 bg-gray-100 dark:bg-gray-800 rounded-xl items-center justify-center min-h-[48px]"
              onPress={onCancel}
              disabled={isLoading}
            >
              <Text className="text-base font-semibold text-gray-900 dark:text-white">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 py-3.5 rounded-xl items-center justify-center min-h-[48px]"
              style={{ backgroundColor: confirmColor }}
              onPress={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-base font-semibold text-white">
                  {confirmText}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};