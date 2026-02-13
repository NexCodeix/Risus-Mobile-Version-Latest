import { View, Text } from 'react-native'
import React from 'react'
import AppButton from '@/components/ui/AppButton'
import { AppToast } from '@/components/ui/AppToast'
import AppScreen from '@/components/ui/AppScreen'
import { useAuthStore } from '@/store/useAuthStore'
import { router } from 'expo-router'
import { useUserStore } from '@/store/useUserStore'

export default function HomeScreen() {
    const profile = useUserStore(state => state.user)
    console.log("profile", profile?.username)
    // console.log("profile", JSON.stringify(profile, null, 2))
    const handleLogout = () => {
        useAuthStore.getState().logout();
        useUserStore.getState().clearUser()
        router.replace("/(auth)/welcome");
    };
    return (
        <AppScreen>
            <Text>HomeScreen</Text>
            <AppButton title='Success' onPress={() => AppToast.success({ title: "Hey" })} />
            <AppButton title='Logout' onPress={handleLogout} />
            <AppButton title='Welcome Screen' onPress={() => router.push("/(auth)/welcome")} />
        </AppScreen>
    )
}