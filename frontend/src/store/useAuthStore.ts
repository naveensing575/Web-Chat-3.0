import { create } from "zustand";
import { axiosInstance } from "../services/axios";
import { toast } from "react-hot-toast";

interface AuthState {
  authUser: any;
  isCheckingAuth: boolean;
  isSingingUp: boolean;
  isLoginingIn: boolean;
  isUpdatingProfile: boolean;
  checkAuth: () => Promise<void>;
  signUp: (data: Record<string, string>) => Promise<void>;
  signIn: (data: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
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
      const res = await axiosInstance.get("/auth/checkAuth");
      set({ authUser: res.data });
    } catch (error) {
      console.error("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSingingUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Sign-up successful!");
    } catch (error: any) {
      console.error("SignUp error: ", error.response?.data?.message || error);
      toast.error(error.response?.data?.message || "Sign-up failed.");
    } finally {
      set({ isSingingUp: false });
    }
  },

  signIn: async (data) => {
    set({ isLoginingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Sign-in successful!");
    } catch (error: any) {
      console.error("SignIn error: ", error.response?.data?.message || error);
      toast.error(error.response?.data?.message || "Sign-in failed.");
    } finally {
      set({ isLoginingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout");
      set({ authUser: null });
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error: ", error);
      toast.error("Logout failed.");
    }
  },
}));
