import React, {useState} from 'react'
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {Ionicons} from '@expo/vector-icons'
import Animated, {FadeIn, SlideInDown} from 'react-native-reanimated'
import AppScreen from '@/components/ui/AppScreen'
import {useCamera} from '@/hooks/useCamera'
import {useCreatePostWithMedia} from '@/hooks/usePostMutations'
import {CameraComponent} from '@/components/ui/CameraComponent'
import {MediaPreview} from '@/components/ui/MediaPreview'
import {PostData} from '@/types/media.types'
import {MEDIA_CONFIG} from '@/constants/api.constants'
import {AppToast} from '@/components/ui/AppToast'
import Input from '@/components/ui/Input'
import ModernSwitch from '@/components/ui/ModernSwitch'
import Typo from '@/components/ui/Typo'
import {SendHorizontal} from 'lucide-react-native'

const {MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_MEDIA_COUNT} = MEDIA_CONFIG
type Visibility = 'everyone' | 'followers' | 'private'

export default function CreatePostScreen() {
  const navigation = useNavigation()

  // Form state
  const [postTitle, setPostTitle] = useState('')
  const [description, setDescription] = useState('')
  const [enableCommunity, setEnableCommunity] = useState(true)
  const [visibility, setVisibility] = useState<Visibility>('everyone')
  // const [isVisibilitySheetOpen, setVisibilitySheetOpen] = useState(false)

  // Hooks
  const {
    isCameraActive,
    openCamera,
    closeCamera,
    selectedMedia,
    addMedia,
    removeMedia,
    clearMedia,
    pickFromLibrary
  } = useCamera()

  const {createPostWithMedia, isLoading} = useCreatePostWithMedia()

  // Character count color
  const getTitleColor = () => {
    const progress = (postTitle.length / MAX_TITLE_LENGTH) * 100
    if (progress >= 100) return 'text-red-500'
    if (progress >= 80) return 'text-orange-500'
    return 'text-green-500'
  }

  // Handlers
  const handleCameraCapture = (media: (typeof selectedMedia)[0]) => {
    if (selectedMedia.length >= MAX_MEDIA_COUNT) {
      AppToast.error({
        title: 'Limit Reached',
        description: `Maximum ${MAX_MEDIA_COUNT} images allowed`
      })
      return
    }
    addMedia(media)
  }

  const handleGalleryPick = async () => {
    const remainingSlots = MAX_MEDIA_COUNT - selectedMedia.length
    if (remainingSlots <= 0) {
      AppToast.error({
        title: 'Limit Reached',
        description: `Maximum ${MAX_MEDIA_COUNT} images allowed`
      })
      return
    }

    const media = await pickFromLibrary(remainingSlots)
    if (media.length > 0) {
      addMedia(media)
    }
  }

  const validateForm = (): boolean => {
    if (!postTitle.trim()) {
      AppToast.error({
        title: 'Required',
        description: 'Please enter a post title'
      })
      return false
    }

    if (!description.trim()) {
      AppToast.error({
        title: 'Required',
        description: 'Please enter a description'
      })
      return false
    }

    if (postTitle.length > MAX_TITLE_LENGTH) {
      AppToast.error({
        title: 'Title Too Long',
        description: `Maximum ${MAX_TITLE_LENGTH} characters allowed`
      })
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    if (!validateForm() || isLoading) return

    try {
      const postData: PostData = {
        title: postTitle.trim(),
        content: description.trim(),
        isRepost: false,
        isDraft: false,
        isHighlight: false,
        enableComment: false,
        enableCommunity: enableCommunity
        // visibility: visibility
      }

      await createPostWithMedia(postData, selectedMedia)

      AppToast.success({
        title: 'Success',
        description: 'Post created successfully!'
      })
      setPostTitle('')
      setDescription('')
      clearMedia()
      navigation.goBack()
    } catch (error: any) {
      console.error('Post creation error:', error)
      AppToast.error({
        title: 'Error',
        description:
          error?.message || 'Failed to create post. Please try again.'
      })
    }
  }

  const visibilityOptions: {
    id: Visibility
    label: string
    icon: keyof typeof Ionicons.glyphMap
  }[] = [
    {id: 'everyone', label: 'Everyone', icon: 'globe-outline'},
    {id: 'followers', label: 'Followers', icon: 'people-outline'},
    {id: 'private', label: 'Only me', icon: 'lock-closed-outline'}
  ]

  const currentVisibilityLabel = visibilityOptions.find(
    (o) => o.id === visibility
  )?.label

  const isFormValid = postTitle.trim() && description.trim() && !isLoading

  return (
    <AppScreen animateOnFocus isEnableLinearGradient>
      {/* Camera Modal */}
      <Modal
        visible={isCameraActive}
        animationType="slide"
        statusBarTranslucent
      >
        <CameraComponent
          onClose={closeCamera}
          onCapture={handleCameraCapture}
        />
      </Modal>

      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Typo size={16} className="text-lg font-bold text-gray-900">
            Create Post
          </Typo>
          {/* <Typo size={10} className="text-lg font-bold text-slate-500">
            Share your toughts
          </Typo> */}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!isFormValid}
          activeOpacity={0.8}
          className={`w-24 h-9 items-center justify-center rounded-lg flex-row gap-2  ${
            isFormValid ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Typo size={12} className="text-white font-semibold">
                Publish
              </Typo>
              <SendHorizontal color="white" size={15} />
            </>
          )}
        </TouchableOpacity>
      </Animated.View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20}
      >
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 110, paddingTop: 16}}
        >
          {/* Title Section */}
          <Animated.View entering={SlideInDown.delay(100).springify()}>
            <View className="flex-row justify-between items-center mb-1">
              <Typo size={15} className="text-base font-semibold text-gray-800">
                Caption
              </Typo>
              <Typo
                size={13}
                className={`text-sm font-medium ${getTitleColor()} self-end`}
              >
                {postTitle.length}/{MAX_TITLE_LENGTH}
              </Typo>
            </View>
            <Input
              placeholder="What's your post about?"
              value={postTitle}
              onChangeText={setPostTitle}
              maxLength={MAX_TITLE_LENGTH}
              containerClassName="mt-2"
            />
          </Animated.View>

          {/* Description Section */}
          <Animated.View
            entering={SlideInDown.delay(200).springify()}
            className="mt-6"
          >
            <View className="flex-row justify-between items-center mb-1">
              <Typo size={15} className="text-base font-semibold text-gray-800">
                Description
              </Typo>
              <Typo size={13} className="text-sm text-gray-500 self-end">
                {description.length}/{MAX_DESCRIPTION_LENGTH}
              </Typo>
            </View>
            <Input
              placeholder="Share your thoughts..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              maxLength={MAX_DESCRIPTION_LENGTH}
              inputClassName="min-h-[140px] py-3"
              containerClassName="mt-2"
            />
          </Animated.View>

          {/* Media Picker */}
          <Animated.View
            entering={SlideInDown.delay(300).springify()}
            className="mt-6"
          >
            <Typo
              size={15}
              className="text-base font-semibold text-gray-800 mb-5"
            >
              Attach Media
            </Typo>
            <View className="flex-row gap-4 mb-2">
              <TouchableOpacity
                onPress={openCamera}
                disabled={isLoading || selectedMedia.length >= MAX_MEDIA_COUNT}
                className="w-16 h-16 bg-gray-100 rounded-xl items-center justify-center border border-gray-200"
              >
                <Ionicons name="camera-outline" size={28} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleGalleryPick}
                disabled={isLoading || selectedMedia.length >= MAX_MEDIA_COUNT}
                className="w-16 h-16 bg-gray-100 rounded-xl items-center justify-center border border-gray-200"
              >
                <Ionicons name="images-outline" size={28} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* Media Preview */}
          <MediaPreview
            media={selectedMedia}
            onRemove={removeMedia}
            maxItems={MAX_MEDIA_COUNT}
            className="mt-4"
          />

          {/* Post Settings */}
          <Animated.View
            entering={SlideInDown.delay(400).springify()}
            className="mt-6 space-y-2"
          >
            <Typo
              size={15}
              className="text-base font-semibold text-gray-800 mb-5"
            >
              Post Settings
            </Typo>

            {/* Who can see */}
            <TouchableOpacity
              // onPress={() => setVisibilitySheetOpen(true)}
              className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3 mb-4 border border-gray-200"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <Ionicons name="globe-outline" size={20} color={'#3B82F6'} />
                </View>
                <View className="flex-1">
                  <Typo size={14} className=" font-medium text-gray-800">
                    Who can see this
                  </Typo>
                  <Typo size={12} className=" text-gray-500 mt-0.5 capitalize">
                    {currentVisibilityLabel}
                  </Typo>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>

            {/* Community Settings */}
            <View className="flex-row items-center justify-between bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center mr-3">
                  <Ionicons
                    name={enableCommunity ? 'people' : 'people-outline'}
                    size={20}
                    color={enableCommunity ? '#3B82F6' : '#6B7280'}
                  />
                </View>
                <View className="flex-1">
                  <Typo
                    size={14}
                    className="text-base font-medium text-gray-800"
                  >
                    Allow Community Join
                  </Typo>
                  <Typo size={12} className="text-sm text-gray-500 mt-0.5">
                    Users can join when pinging
                  </Typo>
                </View>
              </View>
              <ModernSwitch
                isEnabled={enableCommunity}
                onToggleSwitch={() => setEnableCommunity(!enableCommunity)}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  )
}
