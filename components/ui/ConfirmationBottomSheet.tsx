import React, {
  useCallback,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle
} from 'react'
import {View} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet'
import Typo from './Typo'
import AppButton from './AppButton'
import {clsx} from 'clsx'

type ConfirmationBottomSheetProps = {
  title: string
  message: string
  confirmText: string
  onConfirm: () => void
  onClose: () => void // Added onClose prop
  isDanger?: boolean
  isLoading?: boolean
}

export interface ConfirmationBottomSheetRef {
  present: () => void
  dismiss: () => void
}

const ConfirmationBottomSheet = forwardRef<
  ConfirmationBottomSheetRef,
  ConfirmationBottomSheetProps
>(
  (
    {
      title,
      message,
      confirmText,
      onConfirm,
      onClose,
      isDanger = false,
      isLoading = false
    },
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheet>(null)

    // expose present and dismiss methods to parent component
    useImperativeHandle(ref, () => ({
      present: () => {
        bottomSheetRef.current?.snapToIndex(1)
      },
      dismiss: () => {
        bottomSheetRef.current?.close()
      }
    }))

    const snapPoints = useMemo(() => ['25%', '40%'], []) // Adjust snap points as needed

    const handleSheetChanges = useCallback(
      (index: number) => {
        if (index === -1) {
          onClose()
        }
      },
      [onClose]
    )

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // -1 means hidden
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onChange={handleSheetChanges}
        backgroundStyle={{backgroundColor: '#FFFFFF', borderRadius: 20}} // Apply theme color
        handleIndicatorStyle={{backgroundColor: '#E0F2F7'}} // Apply theme color
      >
        <BottomSheetView className="flex-1 items-center px-5 py-3">
          <Ionicons
            name={isDanger ? 'warning-outline' : 'information-circle-outline'}
            size={60}
            color={isDanger ? '#EF4444' : '#0EA5E9'} // Use danger or primary color
            className="mb-4"
          />

          <Typo
            size={20}
            className="font-bold text-center mb-3 text-text-primary"
          >
            {title}
          </Typo>
          <Typo size={14} className="text-text-secondary text-center mb-6">
            {message}
          </Typo>

          <View className="w-full space-y-3">
            <AppButton
              title={isLoading ? '' : confirmText}
              onPress={onConfirm}
              loading={isLoading}
              disabled={isLoading}
              className={clsx(isDanger ? 'bg-danger' : 'bg-primary')}
            />
            <AppButton
              title="Cancel"
              onPress={() => {
                bottomSheetRef.current?.close()
                onClose()
              }}
              disabled={isLoading}
              className="bg-surface" // Using surface color for cancel button
            />
          </View>
        </BottomSheetView>
      </BottomSheet>
    )
  }
)

ConfirmationBottomSheet.displayName = 'ConfirmationBottomSheet'

export default ConfirmationBottomSheet
