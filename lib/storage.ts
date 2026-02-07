import { createMMKV } from 'react-native-mmkv'

export const storage = createMMKV({
  id: "risus-storage",
  encryptionKey: process.env.MMKV_KEY,
});

/* Helpers (typed & clean) */

export const setAccessToken = (token: string) =>
  storage.set("access_token", token);

export const getAccessToken = () => storage.getString("access_token");

export const setRefreshToken = (token: string) =>
  storage.set("refresh_token", token);

export const getRefreshToken = () => storage.getString("refresh_token");

export const clearTokens = () => {
  storage.remove("access_token");
  storage.remove("refresh_token");
};
