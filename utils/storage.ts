import {createMMKV} from 'react-native-mmkv'

export const storage = createMMKV({
  id: 'risus-storage',
  encryptionKey: process.env.MMKV_KEY
})

/* Token Keys */
const ACCESS = 'access_token'

/* Helpers */

export const setToken = (access: string) => {
  storage.set(ACCESS, access)
}

export const getTokens = () => ({
  accessToken: storage.getString(ACCESS) ?? null
})

export const clearTokens = () => {
  storage.remove(ACCESS)
}
