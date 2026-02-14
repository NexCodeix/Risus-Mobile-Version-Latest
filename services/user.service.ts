import { api } from "@/lib/axios";
import { User } from "@/store/useUserStore";

/**
 * Fetches the user profile from the API.
 * @returns A promise that resolves to the user data.
 */
export const getUserProfile = async (): Promise<User> => {
  const response = await api.get("/user/profile/?q=settings");
  return response.data;
};

/**
 * Posts a request to deactivate the user's account.
 * @returns A promise that resolves when the request is successful.
 */
export const deactivateAccount = async (): Promise<void> => {
  await api.post("/user/deactivate-account/");
};

/**
 * Posts a request to delete the user's account.
 * @returns A promise that resolves when the request is successful.
 */
export const requestDeleteAccount = async (): Promise<void> => {
  await api.post("/user/request-delete/");
};
