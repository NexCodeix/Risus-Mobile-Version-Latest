import * as ImagePicker from 'expo-image-picker'
import {router} from 'expo-router'
import {
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  GraduationCap,
  Heart,
  MoreVertical
} from 'lucide-react-native'
import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated'
import {FlashList} from '@shopify/flash-list'

import EditProfileSheet from '@/components/modules/Profile/EditProfileSheet'
import {useUser} from '@/hooks/useUser'

interface FormData {
  firstName: string
  lastName: string
  phoneNumber: string
  dateOfBirth: string
  country: string
  summary: string
  companyName: string
  graduationDate: string
  achievements: string
  image: any
  cover_image: any
}

const PostCard = ({post, index}: {post: any; index: number}) => {
  return (
    <Animated.View
      key={post.id}
      entering={FadeInDown.delay(150 * index)}
      className="w-full aspect-[4/5] bg-slate-50 rounded-[30px] mb-4 overflow-hidden border border-slate-100 p-4 justify-between mx-1"
    >
      <View>
        <Text className="text-slate-800 font-bold" numberOfLines={2}>
          {post.title}
        </Text>
        <Text className="text-slate-500 text-[11px] mt-2" numberOfLines={4}>
          {post.content}
        </Text>
      </View>

      <View className="flex-row items-center">
        <Heart size={14} color="#f43f5e" fill="#f43f5e" />
        <Text className="text-xs font-bold ml-1 text-slate-700">
          {post.total_likes}
        </Text>
      </View>
    </Animated.View>
  )
}

export default function ProfileScreen() {
  const {user, isUserLoading, updateUser, isUpdating} = useUser()
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    dateOfBirth: '',
    country: '',
    summary: '',
    companyName: '',
    graduationDate: '',
    achievements: '',
    image: null,
    cover_image: null
  })

  // Initialize form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.first_name ?? '',
        lastName: user.last_name ?? '',
        phoneNumber: user.phone_number ?? '',
        dateOfBirth: user.date_of_birth ?? '',
        country: user.country ?? '',
        summary: user.summary ?? '',
        companyName: user.company_name ?? '',
        graduationDate: user.graduation_date ?? '',
        achievements: user.achievements ?? '',
        image: null,
        cover_image: null
      })
    }
  }, [user])

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({...prev, [field]: value}))
  }

  const pickImage = async (type: 'image' | 'cover_image') => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert(
        'Permission required',
        'We need access to your gallery to upload images.'
      )
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === 'image' ? [1, 1] : [16, 9],
      quality: 0.8
    })
    if (result.canceled || !result.assets?.length) return
    const asset = result.assets[0]
    const imageData = {
      uri: asset.uri,
      type: asset.mimeType ?? 'image/jpeg',
      name: `${type}_${Date.now()}.jpg`
    }
    updateField(type, imageData)
  }

  const handleSave = async () => {
    try {
      const dataToSend = new FormData()
      dataToSend.append('firstName', formData.firstName)
      dataToSend.append('lastName', formData.lastName)
      if (formData.phoneNumber)
        dataToSend.append('phoneNumber', formData.phoneNumber)
      if (formData.dateOfBirth)
        dataToSend.append('dateOfBirth', formData.dateOfBirth)
      if (formData.country) dataToSend.append('country', formData.country)
      if (formData.summary) dataToSend.append('summary', formData.summary)
      if (formData.companyName)
        dataToSend.append('companyName', formData.companyName)
      if (formData.graduationDate)
        dataToSend.append('graduationDate', formData.graduationDate)
      if (formData.achievements)
        dataToSend.append('achievements', formData.achievements)
      if (formData.image) {
        dataToSend.append('image', {
          uri: formData.image.uri,
          type: formData.image.type,
          name: formData.image.name
        } as any)
      }
      if (formData.cover_image) {
        dataToSend.append('cover_image', {
          uri: formData.cover_image.uri,
          type: formData.cover_image.type,
          name: formData.cover_image.name
        } as any)
      }
      await updateUser(dataToSend as any)
      Alert.alert('Success', 'Profile updated successfully!')
      setVisible(false)
      updateField('image', null)
      updateField('cover_image', null)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile')
    }
  }

  if (isUserLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator />
      </View>
    )
  }

  if (!user) return null

  const fullName = `${user.first_name} ${user.last_name}`
  const username = `@${user.username}`
  const stats = [
    {label: 'Posts', value: user.total_contribution},
    {label: 'Followers', value: user.total_followers},
    {label: 'Views', value: user.total_views},
    {label: 'Likes', value: user.total_likes}
  ]

  const ProfileHeader = () => (
    <>
      <View className="h-60 w-full relative">
        <Image
          source={{uri: formData.cover_image?.uri || user.cover_image}}
          className="w-full h-full bg-slate-200"
          resizeMode="cover"
        />
        <View className="absolute inset-0 pt-12 px-6 flex-row justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/20 items-center justify-center"
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-black/20 items-center justify-center">
            <MoreVertical color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-4 -mt-16">
        <Animated.View
          entering={FadeInUp.springify()}
          className="bg-white rounded-[40px] p-6 shadow-xl shadow-black/5 border border-slate-100"
        >
          <View className="flex-row items-end justify-between -mt-16 mb-4">
            <View className="p-1 bg-white rounded-full">
              <Image
                source={{uri: formData.image?.uri || user.image}}
                className="w-24 h-24 rounded-full bg-slate-100"
              />
            </View>
            <View className="flex-row gap-2 mb-2">
              <TouchableOpacity
                onPress={() => setVisible(true)}
                className="bg-slate-900 px-5 py-2 rounded-full"
              >
                <Text className="text-white font-bold text-xs">
                  Edit Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-slate-100 px-5 py-2 rounded-full border border-slate-200">
                <Text className="text-slate-900 font-bold text-xs">Share</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-row items-center">
            <Text className="text-2xl font-bold text-slate-900 mr-1">
              {fullName}
            </Text>
            <CheckCircle2 size={18} color="#3B82F6" fill="#3B82F6" />
          </View>
          <Text className="text-slate-400 font-medium mb-4">{username}</Text>
          <View className="flex-row justify-between bg-slate-50 py-4 px-4 rounded-3xl mb-6">
            {stats.map((stat) => (
              <View key={stat.label} className="items-center">
                <Text className="text-base font-bold text-slate-900">
                  {stat.value}
                </Text>
                <Text className="text-[10px] text-slate-400 uppercase font-bold">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
          <View className="space-y-2">
            {user.designation && (
              <View className="flex-row items-center mb-1">
                <Briefcase size={14} color="#64748b" />
                <Text className="ml-2 text-slate-600 text-sm">
                  {user.designation}
                  {user.company_name && (
                    <>
                      {' @ '}
                      <Text className="text-blue-600 font-bold">
                        {user.company_name}
                      </Text>
                    </>
                  )}
                </Text>
              </View>
            )}
            {user.study && (
              <View className="flex-row items-center">
                <GraduationCap size={14} color="#64748b" />
                <Text
                  className="ml-2 text-slate-600 text-sm flex-1"
                  numberOfLines={1}
                >
                  {user.study}
                </Text>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
      <View className="mt-8 px-6 mb-4">
        <Text className="text-lg font-bold text-slate-900">Posts</Text>
      </View>
    </>
  )

  return (
    <View className="flex-1 bg-white ">
      <FlashList
        data={user.posts}
        renderItem={({item, index}) => <PostCard post={item} index={index} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        bouncesZoom={true}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ProfileHeader}
        masonry
        optimizeItemArrangement
      />
      <EditProfileSheet
        visible={visible}
        setVisible={setVisible}
        pickImage={pickImage}
        formData={formData}
        user={user}
        updateField={updateField}
        isUpdating={isUpdating}
        handleSave={handleSave}
      />
    </View>
  )
}
