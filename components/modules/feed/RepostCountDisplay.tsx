import { useReposts } from '@/hooks/useFeedApi';
import { useUser } from '@/hooks/useUser';
import { Post } from '@/types/feed';
import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Avatar from '../../ui/Avatar';
import Typo from '../../ui/Typo';

interface RepostCountDisplayProps {
    post: Post;
    onPress: () => void;
}

/**
 * Formats numbers into a readable format like 1k, 10k, 1M, or 100+ as requested.
 */
const formatPingCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    if (count >= 100) return '100+';
    return count.toString();
};

const RepostCountDisplay: React.FC<RepostCountDisplayProps> = ({ post, onPress }) => {
    const { user: currentUser } = useUser();
    const { data: repostsData } = useReposts(post.thread?.toString() || post.id.toString(), post.total_reposts > 0);

    // Get all reposts from the first page
    const allReposts = repostsData?.pages[0]?.results || [];

    // Filter out current user's ping if requested ("dont count own post")
    // Note: currentUser.id comes from useUser, while r.user.user_id comes from Feed API types.
    const userPinged = allReposts.some(r => r.user.user_id === currentUser?.id);
    const displayCount = userPinged ? Math.max(0, post.total_reposts - 1) : post.total_reposts;

    // Filtered reposts for the avatar stack (exclude current user)
    const otherReposts = allReposts.filter(r => r.user.user_id !== currentUser?.id);

    // Final logic: if no pings (after excluding own), show nothing
    if (displayCount === 0) return null;

    // Get first 3 unique avatars of OTHER users
    const avatars = otherReposts.slice(0, 3).map(r => r.user.image);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-2 py-1"
        >
            <View className="flex-row items-center">
                {/* Avatar Stack (Max 3) */}
                {avatars.length > 0 && (
                    <View className="flex-row mr-3">
                        {avatars.map((img, idx) => (
                            <View
                                key={idx}
                                style={{ zIndex: 10 - idx }}
                                className={clsx(idx !== 0 && "-ml-3")}
                            >
                                <Avatar
                                    source={img}
                                    size={28}
                                    borderWidth={2}
                                    borderColor="#FFFFFF"
                                    className="shadow-sm"
                                />
                            </View>
                        ))}
                    </View>
                )}

                {/* Count Text with Formatting */}
                <Typo size={14} className="text-gray-800 font-bold">
                    {formatPingCount(displayCount)} {displayCount === 1 ? 'ping' : 'pings'}
                </Typo>
            </View>

         
        </TouchableOpacity>
    );
};

export default RepostCountDisplay;
