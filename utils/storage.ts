import {createMMKV} from 'react-native-mmkv'

export const storage = createMMKV({
  id: 'risus-storage'
  // encryptionKey: process.env.MMKV_KEY
})

/* Token Keys */
const ACCESS = 'access_token'
const USER_INFO = 'user_info'

/* Helpers */

export const setToken = (access: string) => {
  // console.log('Token at storage', access)
  storage.set(ACCESS, access)
}

export const getToken = () => {
  return storage.getString(ACCESS) ?? null
}

console.log('MMKV token:', getToken())

export const clearToken = () => {
  storage.remove(ACCESS)
}

// Google login
export const setUserInfo = (userInfo: any) => {
  storage.set(USER_INFO, JSON.stringify(userInfo))
}
