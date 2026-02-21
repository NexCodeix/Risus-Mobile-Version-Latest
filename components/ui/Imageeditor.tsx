import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageEditorProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onSave: (uri: string) => void;
}

interface EditOptions {
  brightness: number;
  contrast: number;
  saturation: number;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  visible,
  imageUri,
  onClose,
  onSave,
}) => {
  const [activeControl, setActiveControl] = useState<'brightness' | 'contrast' | 'saturation' | null>(null);
  const [editOptions, setEditOptions] = useState<EditOptions>({
    brightness: 1,
    contrast: 1,
    saturation: 1,
  });

  const controlScale = useSharedValue(1);

  const controlAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: controlScale.value }],
  }));

  const handleControlPress = (control: typeof activeControl) => {
    setActiveControl(control);
    controlScale.value = withSpring(1.1, {}, () => {
      controlScale.value = withSpring(1);
    });
  };

  const handleReset = () => {
    setEditOptions({
      brightness: 1,
      contrast: 1,
      saturation: 1,
    });
  };

  const handleSave = () => {
    // In a real implementation, you would apply the filters and save
    onSave(imageUri);
  };

  const getImageStyle = () => {
    return {
      filter: [
        `brightness(${editOptions.brightness})`,
        `contrast(${editOptions.contrast})`,
        `saturate(${editOptions.saturation})`,
      ].join(' '),
    };
  };

  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 pt-14 pb-4">
          <TouchableOpacity
            onPress={onClose}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold">Edit Image</Text>

          <TouchableOpacity
            onPress={handleReset}
            className="w-10 h-10 items-center justify-center"
          >
            <MaterialCommunityIcons name="refresh" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Image Preview */}
        <View className="flex-1 items-center justify-center">
          <Image
            source={{ uri: imageUri }}
            style={{
              width: SCREEN_WIDTH,
              height: SCREEN_HEIGHT * 0.6,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Active Control Slider */}
        {activeControl && (
          <View className="px-6 py-4 bg-gray-900">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-sm font-medium capitalize">
                {activeControl}
              </Text>
              <Text className="text-gray-400 text-sm">
                {editOptions[activeControl].toFixed(2)}
              </Text>
            </View>
            <Slider
              style={{ width: '100%', height: 40 }}
              minimumValue={0}
              maximumValue={2}
              value={editOptions[activeControl]}
              onValueChange={(value) =>
                setEditOptions((prev) => ({ ...prev, [activeControl]: value }))
              }
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#4B5563"
              thumbTintColor="#3B82F6"
            />
          </View>
        )}

        {/* Controls */}
        <View className="px-4 py-6 bg-black border-t border-gray-800">
          <View className="flex-row justify-around mb-4">
            {/* Brightness */}
            <TouchableOpacity
              onPress={() => handleControlPress('brightness')}
              className="items-center"
            >
              <Animated.View
                style={
                  activeControl === 'brightness' ? controlAnimatedStyle : {}
                }
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  activeControl === 'brightness' ? 'bg-blue-500' : 'bg-gray-800'
                }`}
              >
                <Ionicons name="sunny" size={24} color="white" />
              </Animated.View>
              <Text className="text-white text-xs mt-2">Brightness</Text>
            </TouchableOpacity>

            {/* Contrast */}
            <TouchableOpacity
              onPress={() => handleControlPress('contrast')}
              className="items-center"
            >
              <Animated.View
                style={activeControl === 'contrast' ? controlAnimatedStyle : {}}
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  activeControl === 'contrast' ? 'bg-blue-500' : 'bg-gray-800'
                }`}
              >
                <MaterialCommunityIcons
                  name="contrast-circle"
                  size={24}
                  color="white"
                />
              </Animated.View>
              <Text className="text-white text-xs mt-2">Contrast</Text>
            </TouchableOpacity>

            {/* Saturation */}
            <TouchableOpacity
              onPress={() => handleControlPress('saturation')}
              className="items-center"
            >
              <Animated.View
                style={
                  activeControl === 'saturation' ? controlAnimatedStyle : {}
                }
                className={`w-14 h-14 rounded-full items-center justify-center ${
                  activeControl === 'saturation' ? 'bg-blue-500' : 'bg-gray-800'
                }`}
              >
                <MaterialCommunityIcons
                  name="palette"
                  size={24}
                  color="white"
                />
              </Animated.View>
              <Text className="text-white text-xs mt-2">Saturation</Text>
            </TouchableOpacity>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className="bg-blue-500 rounded-xl py-4 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold text-base">
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};