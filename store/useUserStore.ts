import { create } from "zustand";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

/**
 Adjust this type to match YOUR backend
 */
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type UserState = {
  user: User | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;

  fetchUser: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  clearUser: () => void;
};

/**
 Prevent duplicate fetch calls
 */
let fetchPromise: Promise<void> | null = null;

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  isUpdating: false,
  error: null,

  /**
   ✅ Fetch Profile
   */
  fetchUser: async () => {
    if (fetchPromise) return fetchPromise;

    fetchPromise = (async () => {
      try {
        set({isLoading: true, error: null})

        const res = await api.get('/user/profile/')
        // console.log(res.data)

        set({
          user: res.data,
          isLoading: false
        })
      } catch (err: any) {
        set({
          isLoading: false,
          error: err.message,
        });

        /**
         If unauthorized — logout
         interceptor usually handles this,
         but extra safety is good.
        */
        if (err.status === 401) {
          useAuthStore.getState().logout();
        }
      } finally {
        fetchPromise = null;
      }
    })();

    return fetchPromise;
  },

  /**
   ✅ Update User (Optimistic)
   */
  updateUser: async (data) => {
    const currentUser = get().user;
    if (!currentUser) return;

    // optimistic update
    set({
      user: { ...currentUser, ...data },
      isUpdating: true,
    });

    try {
      const res = await api.post("/user/profile/update/", data);

      set({
        user: res.data,
        isUpdating: false,
      });
    } catch (err: any) {
      // rollback
      set({
        user: currentUser,
        isUpdating: false,
        error: err.message,
      });
    }
  },

  /**
   ✅ Clear user on logout
   */
  clearUser: () => {
    set({
      user: null,
      error: null,
    });
  },
}));
