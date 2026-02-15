import AppScreen from '@/components/ui/AppScreen';
import { Edit3, Search } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

// --- Mock Data (Replace with API later) ---
const ACTIVE_USERS = [
  { id: '1', name: 'You', image: 'https://i.pravatar.cc/150?u=me', online: true },
  { id: '2', name: 'Alex', image: 'https://i.pravatar.cc/150?u=2', online: true },
  { id: '3', name: 'Sarah', image: 'https://i.pravatar.cc/150?u=3', online: true },
  { id: '4', name: 'John', image: 'https://i.pravatar.cc/150?u=4', online: true },
  { id: '5', name: 'Emma', image: 'https://i.pravatar.cc/150?u=5', online: true },
];

const CHAT_DATA = [
  {
    id: '1',
    name: 'Alex Rivera',
    lastMessage: 'The new design looks amazing! 🔥',
    time: '2m ago',
    unread: 2,
    image: 'https://i.pravatar.cc/150?u=2',
    online: true,
  },
  {
    id: '2',
    name: 'Sarah Jenkins',
    lastMessage: 'Are we still meeting at 5?',
    time: '1h ago',
    unread: 0,
    image: 'https://i.pravatar.cc/150?u=3',
    online: false,
  },
  {
    id: '3',
    name: 'NexCodeix Support',
    lastMessage: 'Your ticket #102 has been resolved.',
    time: '3h ago',
    unread: 0,
    image: 'https://i.pravatar.cc/150?u=9',
    online: true,
  },
];

const ChatList = () => {
  return (
    <AppScreen isEnableLinearGradient animateOnFocus>
      {/* Header */}
      <View className="py-4 flex-row justify-between items-center">
        <Text className="text-3xl font-bold text-slate-900">Messages</Text>
        <TouchableOpacity className="bg-slate-100 p-2 rounded-full">
          <Edit3 size={20} color="#1e293b" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className=" mb-6">
        <View className="flex-row items-center bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
          <Search size={20} color="#94a3b8" />
          <TextInput
            placeholder="Search messages..."
            className="flex-1 ml-3 text-slate-700 font-medium"
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {/* Active Now Section */}
      {/* <View className="mb-6">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={ACTIVE_USERS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity className="items-center mr-5">
              <View>
                <Image source={{ uri: item.image }} className="w-14 h-14 rounded-full border-2 border-indigo-500 p-1" />
                {item.online && <View className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />}
              </View>
              <Text className="text-xs mt-2 text-slate-500 font-medium">{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View> */}

      {/* Conversations List */}
      <FlatList
        data={CHAT_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center mb-6">
            <Image source={{ uri: item.image }} className="w-16 h-16 rounded-2xl" />
            <View className="flex-1 ml-4 border-b border-slate-50 pb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-lg font-bold text-slate-800">{item.name}</Text>
                <Text className="text-xs text-slate-400 font-medium">{item.time}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-500 flex-1 mr-2" numberOfLines={1}>
                  {item.lastMessage}
                </Text>
                {item.unread > 0 && (
                  <View className="bg-indigo-500 px-2 py-1 rounded-full">
                    <Text className="text-[10px] text-white font-bold">{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </AppScreen>
  );
};

export default ChatList;