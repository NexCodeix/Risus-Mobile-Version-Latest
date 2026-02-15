import {TouchableOpacity, View} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import Typo from './Typo'
import Skeleton from '../feedback/Skeleton'
import {useRouter} from 'expo-router'
import Avatar from './Avatar' // Import the new Avatar component
import {clsx} from 'clsx'
import {User} from '@/types/user.types'

type ProfileCardProps = {
  user: User | null | undefined
  isLoading: boolean
  cardClassName?: string
  textClass?: string
}

const ProfileCard = ({
  user,
  isLoading,
  cardClassName,
  textClass = 'text-text-secondary '
}: ProfileCardProps) => {
  const router = useRouter()

  if (isLoading) {
    return (
      <View
        className={clsx('flex-row items-center space-x-4 p-4', cardClassName)}
      >
        <Skeleton
          shimmerDuration={2}
          height={64}
          width={64}
          borderRadius={32}
        />
        <View className="flex-1 space-y-2">
          <Skeleton shimmerDuration={2} className="w-3/4" />
          <Skeleton shimmerDuration={2} className="w-1/2" />
        </View>
      </View>
    )
  }

  return (
    <TouchableOpacity
      className={clsx(
        'flex-row items-center p-4  bg-gray-100 rounded-2xl border border-border',
        cardClassName
      )}
      onPress={() => router.push('/(routes)/profile')}
    >
      <Avatar
        source={user?.image}
        size={64} // w-16 h-16 -> 64px
        borderWidth={2}
        borderColor="#E0F2F7" // border from theme
        fallbackBackgroundColor="#E0F2F7" // border from theme
        fallbackTextColor="#1F2937" // text-primary from theme
        fallbackText={user?.first_name ? user.first_name[0] : undefined}
      />
      <View className="flex-1 mx-4">
        <Typo size={18} className={clsx("font-heading",  textClass)}>
          {user?.first_name} {user?.last_name}
        </Typo>
        <Typo size={14} className="text-text-secondary mt-1"> 
          @{user?.username || "username"}
        </Typo>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
    </TouchableOpacity>
  )
}

export default ProfileCard
