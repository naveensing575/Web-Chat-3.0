import { create } from "zustand";
import { axiosInstance } from "../services/axios";

interface AuthState {
  authUser: any;
  isCheckingAuth: boolean;
  isSingingUp: boolean;
  isLoginingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
}

// Create the auth store with Zustand
export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSingingUp: false,
  isLoginingIn: false,
  isUpdatingProfile: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
