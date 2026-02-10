import {createMMKV} from 'react-native-mmkv'

export const storage = createMMKV({
  id: 'risus-storage'
  // encryptionKey: process.env.MMKV_KEY
})

/* Token Keys */
const ACCESS = 'access_token'

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
