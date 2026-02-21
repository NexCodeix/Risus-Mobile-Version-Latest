import AppScreen from '@/components/ui/AppScreen';
import { api } from '@/lib/axios';
import { smartTime } from '@/utils/Time';
import { useQuery } from '@tanstack/react-query';
import { Edit3, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

type GroupListResponse = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: GroupRoomItem[];
};

type GroupRoomItem = {
  id: string;
  group?: {
    id?: string;
    name?: string | null;
    timestamp?: string | null;
    post?: {
      title?: string | null;
      content?: string | null;
      user?: {
        image?: string | null;
      };
    } | null;
  } | null;
  last_message?: {
    content?: string | null;
    timestamp?: string | null;
    user?: {
      image?: string | null;
    };
  } | null;
};

const ChatList = () => {
  const [searchText, setSearchText] = useState('');

  const { data: groupList } = useQuery({
    queryKey: ["groupList"],
    queryFn: async () => {
      try {
        const res = await api.get("/rooms/?q=group");
        return (res.data ?? {}) as GroupListResponse;
      } catch (error) {
        console.log(error);
        return { results: [] } as GroupListResponse;
      }
    }
  });

  const rooms = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    const list = groupList?.results ?? [];

    if (!query) return list;

    return list.filter((item) => {
      const name = (item.group?.name ?? item.group?.post?.title ?? '').toLowerCase();
      const lastMessage = (item.last_message?.content ?? item.group?.post?.content ?? '').toLowerCase();
      return name.includes(query) || lastMessage.includes(query);
    });
  }, [groupList?.results, searchText]);

  // const wsUrl = `${BASE_SOCKET_URL}/chat/?token=${token}`;
  // const response = await fetch(`${BASE_URL}/api/rooms/${inbox.id}/messages/`)

  // console.log("groupList", JSON.stringify(groupList?.results, null, 2))

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
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>


      {/* Conversations List */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center mb-6">
            <Image
              source={{
                uri:
                  item.last_message?.user?.image ??
                  item.group?.post?.user?.image ??
                  'https://i.pravatar.cc/150?u=group-room',
              }}
              className="w-16 h-16 rounded-2xl"
            />
            <View className="flex-1 ml-4 border-b border-slate-50 pb-4">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-lg font-bold text-slate-800" numberOfLines={1}>
                  {item.group?.name ?? item.group?.post?.title ?? 'Untitled Group'}
                </Text>
                <Text className="text-xs text-slate-400 font-medium">
                  {smartTime(item.last_message?.timestamp ?? item.group?.timestamp ?? '')}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-500 flex-1 mr-2" numberOfLines={1}>
                  {item.last_message?.content ?? item.group?.post?.content ?? 'No messages yet'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View className="py-12 items-center">
            <Text className="text-slate-500 font-medium">No groups found</Text>
          </View>
        }
      />
    </AppScreen>
  );
};

export default ChatList;