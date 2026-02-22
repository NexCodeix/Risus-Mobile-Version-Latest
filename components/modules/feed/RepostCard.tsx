import { Post } from '@/types/feed';
import { smartTime } from '@/utils/Time';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Avatar from '../../ui/Avatar';
import Typo from '../../ui/Typo';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ASSET_HEIGHT = 280;

interface RepostCardProps {
    repost: Post;
    onPressOriginal?: () => void;
}

const RepostCard: React.FC<RepostCardProps> = ({ repost }) => {
    const [currentAssetIndex, setCurrentAssetIndex] = useState(0);
    const assets = repost.images || [];
    const hasMultipleAssets = assets.length > 1;

    const handleAssetTap = (event: any) => {
        if (!hasMultipleAssets) return;
        const x = event.nativeEvent.locationX;
        const containerWidth = SCREEN_WIDTH - 64; // Horizontal margin + padding

        if (x < containerWidth / 3) {
            setCurrentAssetIndex(prev => Math.max(0, prev - 1));
        } else if (x > (containerWidth * 2) / 3) {
            setCurrentAssetIndex(prev => Math.min(assets.length - 1, prev + 1));
        }
        // Middle third does nothing or could toggle play/pause for video
    };

    const currentAsset = assets[currentAssetIndex];

    return (
        <View className="bg-white rounded-3xl mx-4 my-3 p-4 shadow-md border border-gray-100">
            {/* User Info */}
            <View className="flex-row items-center mb-3">
                <Avatar source={repost.user.image} size={40} className="mr-3 border border-gray-50" />
                <View className="flex-1">
                    <Typo size={15} className="text-gray-900 font-bold leading-tight">
                        {repost.user.display_name}
                    </Typo>
                    <View className="flex-row items-center">
                        <Typo size={12} className="text-gray-500">
                            @{repost.user.username.split('@')[0]}
                        </Typo>
                        <View className="w-1 h-1 bg-gray-300 rounded-full mx-2" />
                        <Typo size={12} className="text-gray-500">
                            {smartTime(repost.date_created)}
                        </Typo>
                    </View>
                </View>
            </View>

            {/* Asset Display */}
            {assets.length > 0 && (
                <TouchableWithoutFeedback onPress={handleAssetTap}>
                    <View className="rounded-2xl overflow-hidden mb-3 bg-gray-100" style={{ height: ASSET_HEIGHT }}>
                        {currentAsset.file_type === 'video' ? (
                            <View className="flex-1 items-center justify-center bg-black">
                                {/* Simplified video placeholder for now, would use OptimizedVideo in real app */}
                                <Ionicons name="play" size={40} color="white opacity-60" />
                                <View className="absolute bottom-4 left-4 right-4 h-1 bg-white/30 rounded-full overflow-hidden">
                                    <View className="h-full bg-white w-1/3" />
                                </View>
                            </View>
                        ) : (
                            <Image
                                source={{ uri: currentAsset.file }}
                                style={StyleSheet.absoluteFill}
                                contentFit="cover"
                                transition={200}
                                cachePolicy="memory-disk"
                            />
                        )}

                        {/* Navigation Dots */}
                        {hasMultipleAssets && (
                            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center space-x-1.5">
                                {assets.map((_, idx) => (
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => setCurrentAssetIndex(idx)}
                                        className={clsx(
                                            "w-2 h-2 rounded-full",
                                            idx === currentAssetIndex ? "bg-white" : "bg-white/50"
                                        )}
                                    />
                                ))}
                            </View>
                        )}

                        {/* Asset Counter Badge */}
                        {hasMultipleAssets && (
                            <View className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-full">
                                <Typo size={11} className="text-white font-bold">
                                    {currentAssetIndex + 1}/{assets.length}
                                </Typo>
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Content Text */}
            {repost.content && (
                <View className="mb-4">
                    <Typo size={14} className="text-gray-800 leading-relaxed">
                        {repost.content}
                    </Typo>
                </View>
            )}

            {/* Stats Row */}
            <View className="flex-row items-center pt-4 border-t border-gray-100">
                <View className="flex-row items-center mr-6">
                    <Ionicons name="heart-outline" size={18} color="#6B7280" />
                    <Typo size={14} className="text-gray-500 ml-1.5 font-medium">{repost.total_likes || 0}</Typo>
                </View>
                <View className="flex-row items-center">
                    <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                    <Typo size={14} className="text-gray-500 ml-1.5 font-medium">{repost.total_comments || 0}</Typo>
                </View>
            </View>
        </View>
    );
};

export default RepostCard;
