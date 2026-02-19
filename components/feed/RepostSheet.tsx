import { useReposts } from '@/hooks/useFeedApi'
import { Post } from '@/types/feed'
import { Ionicons } from '@expo/vector-icons'
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet'
import React, { useCallback, useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FeedCard } from './FeedCard'

interface RepostSheetProps {
    isOpen: boolean
    onClose: () => void
    post?: Post
}

export function RepostSheet({ isOpen, onClose, post }: RepostSheetProps) {
    const bottomSheetRef = React.useRef<BottomSheetModal>(null)
    const snapPoints = useMemo(() => ['50%', '90%'], [])

    const { data, fetchNextPage, hasNextPage, isLoading } = useReposts(
        post?.thread || null,
        isOpen && !!post?.thread
    )

    const reposts = data?.pages.flatMap((page) => page.results) || []

    React.useEffect(() => {
        if (isOpen) {
            bottomSheetRef.current?.present()
        } else {
            bottomSheetRef.current?.dismiss()
        }
    }, [isOpen])

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                onClose()
            }
        },
        [onClose]
    )

    const handleEndReached = useCallback(() => {
        if (hasNextPage) {
            fetchNextPage()
        }
    }, [hasNextPage, fetchNextPage])

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enablePanDownToClose
            backgroundStyle={{ backgroundColor: '#f0f9ff' }}
            handleIndicatorStyle={{ backgroundColor: '#cbd5e1' }}
        >
            <View className="flex-1">
                <View className="flex-row justify-center items-center py-4 border-b border-gray-200 bg-white">
                    <Text className="text-lg font-bold text-blue-500">Pings</Text>
                    <View className="absolute right-4">
                        <Ionicons name="people-circle-outline" size={30} color="#3b82f6" />
                    </View>
                </View>

                <BottomSheetFlatList
                    data={reposts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View className="mb-6 items-center">
                            <FeedCard post={item} onRepostPress={() => { }} />
                        </View>
                    )}
                    contentContainerStyle={styles.contentContainer}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.5}
                />
            </View>
        </BottomSheetModal>
    )
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingTop: 16,
        paddingBottom: 40,
    },
})
