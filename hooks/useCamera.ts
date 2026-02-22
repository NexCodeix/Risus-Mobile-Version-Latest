import {useState, useEffect, useCallback} from 'react'
import {Alert, Linking} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import {CameraView, useCameraPermissions} from 'expo-camera'
import {CameraPermissions, MediaItem} from '@/types/media.types'

export const useCamera = () => {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions()
  const [libraryPermission, setLibraryPermission] =
    useState<ImagePicker.MediaLibraryPermissionResponse | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaItem[]>([])

  // Check permissions on mount
  useEffect(() => {
    checkLibraryPermissions()
  }, [])

  const checkLibraryPermissions = async () => {
    const {status} = await ImagePicker.getMediaLibraryPermissionsAsync()
    setLibraryPermission({
      status,
      granted: status === 'granted',
      canAskAgain: true,
      expires: 'never'
    })
  }

  const requestLibraryPermission = async (): Promise<boolean> => {
    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync()
    setLibraryPermission({
      status,
      granted: status === 'granted',
      canAskAgain: true,
      expires: 'never'
    })
    return status === 'granted'
  }

  const handlePermissionDenied = useCallback((type: 'camera' | 'library') => {
    Alert.alert(
      `${type === 'camera' ? 'Camera' : 'Photo Library'} Permission Required`,
      `Please enable ${type} access in your device settings to use this feature.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Open Settings', onPress: () => Linking.openSettings()}
      ]
    )
  }, [])

  const ensureCameraPermission = async (): Promise<boolean> => {
    if (!cameraPermission) return false

    if (cameraPermission.granted) {
      return true
    }

    if (cameraPermission.canAskAgain) {
      const {granted} = await requestCameraPermission()
      if (!granted) {
        handlePermissionDenied('camera')
      }
      return granted
    }

    handlePermissionDenied('camera')
    return false
  }

  const ensureLibraryPermission = async (): Promise<boolean> => {
    if (libraryPermission?.granted) {
      return true
    }

    const granted = await requestLibraryPermission()
    if (!granted) {
      handlePermissionDenied('library')
    }
    return granted
  }

  const openCamera = useCallback(async () => {
    const hasPermission = await ensureCameraPermission()
    if (hasPermission) {
      setIsCameraActive(true)
    }
  }, [cameraPermission])

  const closeCamera = useCallback(() => {
    setIsCameraActive(false)
  }, [])

  const pickFromLibrary = async (
    maxSelection: number = 10
  ): Promise<MediaItem[]> => {
    const hasPermission = await ensureLibraryPermission()
    if (!hasPermission) return []

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // Images only
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: maxSelection
      })

      if (result.canceled) return []

      const newMedia: MediaItem[] = result.assets.map((asset) => ({
        uri: asset.uri,
        type: 'image', // Only images
        mimeType: asset.mimeType ?? 'image/jpeg',
        name:
          asset.fileName ??
          asset.uri.split('/').pop() ??
          `image_${Date.now()}.jpg`,
        width: asset.width,
        height: asset.height,
        fileSize: asset.fileSize
      }))

      return newMedia
    } catch (error) {
      console.error('Error picking images:', error)
      Alert.alert('Error', 'Failed to pick images. Please try again.')
      return []
    }
  }

  const addMedia = useCallback((media: MediaItem | MediaItem[]) => {
    const mediaArray = Array.isArray(media) ? media : [media]
    setSelectedMedia((prev) => [...prev, ...mediaArray])
  }, [])

  const removeMedia = useCallback((index: number) => {
    setSelectedMedia((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearMedia = useCallback(() => {
    setSelectedMedia([])
  }, [])

  return {
    // Permissions
    cameraPermission,
    libraryPermission,
    requestCameraPermission,
    requestLibraryPermission,
    ensureCameraPermission,
    ensureLibraryPermission,

    // Camera state
    isCameraActive,
    openCamera,
    closeCamera,

    // Media management (images only)
    selectedMedia,
    addMedia,
    removeMedia,
    clearMedia,
    pickFromLibrary
  }
}
