import AppBottomSheet from '@/components/ui/AppBottomSheet'
import AppButton from '@/components/ui/AppButton'
import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { Calendar, Camera, Globe, Phone } from 'lucide-react-native'
import React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'

export default function EditProfileSheet({
  visible, 
  setVisible, 
  pickImage, 
  formData, 
  user, 
  updateField, 
  isUpdating, 
  handleSave
}: any) {
  return (
    <AppBottomSheet
      visible={visible}
      onClose={() => setVisible(false)}
      snapPoints={["90%"]}
    >
      <BottomSheetScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: 100 
        }}
      >
        <Text className="text-2xl font-bold mb-6 text-slate-900">Edit Profile</Text>

        {/* Profile Image */}
        <View className="mb-6">
          <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-3">
            Profile Picture
          </Text>
          <TouchableOpacity
            onPress={() => pickImage('image')}
            className="flex-row items-center bg-slate-50 p-4 rounded-2xl border border-slate-200"
          >
            <View className="w-16 h-16 rounded-full bg-slate-200 items-center justify-center mr-4 overflow-hidden">
              {formData.image?.uri || user?.image ? (
                <Image
                  source={{ uri: formData.image?.uri || user.image }}
                  className="w-16 h-16"
                />
              ) : (
                <Camera size={24} color="#64748b" />
              )}
            </View>
            <Text className="text-blue-600 font-bold">Change Profile Picture</Text>
          </TouchableOpacity>
        </View>

        {/* Cover Image */}
        <View className="mb-6">
          <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-3">
            Cover Image
          </Text>
          <TouchableOpacity
            onPress={() => pickImage('cover_image')}
            className="h-32 bg-slate-50 rounded-2xl border border-slate-200 items-center justify-center overflow-hidden"
          >
            {formData.cover_image?.uri || user?.cover_image ? (
              <Image
                source={{ uri: formData.cover_image?.uri || user.cover_image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Camera size={32} color="#64748b" />
            )}
          </TouchableOpacity>
        </View>

        {/* Name Fields */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
              First Name
            </Text>
            <View className="border-b border-slate-200 py-3">
              <TextInput
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(val) => updateField('firstName', val)}
                className="text-slate-800 font-medium"
              />
            </View>
          </View>

          <View className="flex-1">
            <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
              Last Name
            </Text>
            <View className="border-b border-slate-200 py-3">
              <TextInput
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(val) => updateField('lastName', val)}
                className="text-slate-800 font-medium"
              />
            </View>
          </View>
        </View>

        {/* Phone Number */}
        <View className="mb-4">
          <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
            Phone Number
          </Text>
          <View className="flex-row items-center border-b border-slate-200 py-3">
            <Phone size={18} color="#64748b" />
            <TextInput
              placeholder="+1234567890"
              value={formData.phoneNumber}
              onChangeText={(val) => updateField('phoneNumber', val)}
              keyboardType="phone-pad"
              className="flex-1 ml-3 text-slate-800 font-medium"
            />
          </View>
        </View>

        {/* Date of Birth */}
        <View className="mb-4">
          <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
            Date of Birth
          </Text>
          <View className="flex-row items-center border-b border-slate-200 py-3">
            <Calendar size={18} color="#64748b" />
            <TextInput
              placeholder="YYYY-MM-DD"
              value={formData.dateOfBirth}
              onChangeText={(val) => updateField('dateOfBirth', val)}
              className="flex-1 ml-3 text-slate-800 font-medium"
            />
          </View>
        </View>

        {/* Country */}
        <View className="mb-4">
          <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
            Country
          </Text>
          <View className="flex-row items-center border-b border-slate-200 py-3">
            <Globe size={18} color="#64748b" />
            <TextInput
              placeholder="Country"
              value={formData.country}
              onChangeText={(val) => updateField('country', val)}
              className="flex-1 ml-3 text-slate-800 font-medium"
            />
          </View>
        </View>

        {/* Summary */}
        <View className="mb-4">
          <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
            Summary
          </Text>
          <View className="border-b border-slate-200 py-3">
            <TextInput
              placeholder="Tell us about yourself..."
              value={formData.summary}
              onChangeText={(val) => updateField('summary', val)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="text-slate-800 font-medium min-h-[80px]"
            />
          </View>
        </View>

        {/* Achievements */}
        <View className="mb-6">
          <Text className="text-slate-600 font-bold text-xs uppercase tracking-wider mb-2">
            Achievements
          </Text>
          <View className="border-b border-slate-200 py-3">
            <TextInput
              placeholder="Your achievements..."
              value={formData.achievements}
              onChangeText={(val) => updateField('achievements', val)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="text-slate-800 font-medium min-h-[80px]"
            />
          </View>
        </View>

        <AppButton
          title={isUpdating ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          disabled={isUpdating}
          className='text-center py-5 items-center justify-center'
        />
      </BottomSheetScrollView>
    </AppBottomSheet>
  )
}