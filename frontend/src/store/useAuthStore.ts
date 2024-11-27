import { create } from "zustand";
import { axiosInstance } from "../services/axios";
import { toast } from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:4000" : "/";

interface AuthUser {
  id?: string;
  email?: string;
  profilePic?: string;
  fullName?: string;
  createdAt?: string;
}

interface AuthState {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoginingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: AuthUser[];
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  signUp: (data: Record<string, string>) => Promise<void>;
  signIn: (data: Record<string, string>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfilePic: (file: File) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoginingIn: false,
  isUpdatingProfile: false,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/checkAuth", {
        withCredentials: true,
      });
      if (res.data.success && res.data.data) {
        const userData = res.data.data;
        set({ authUser: userData });
      } else {
        console.error("Authentication failed:", res.data.message);
        set({ authUser: null });
      }
    } catch (error) {
      console.error("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data, {
        withCredentials: true,
      });
      if (res.data.success && res.data.data) {
        const userData = res.data.data;
        set({ authUser: userData });
        toast.success("Sign-up successful!");
      } else {
        console.error("Sign-up failed:", res.data.message);
        toast.error(res.data.message || "Sign-up failed.");
      }
    } catch (error: any) {
      console.error("SignUp error:", error.response?.data?.message || error);
      toast.error(error.response?.data?.message || "Sign-up failed.");
    } finally {
      set({ isSigningUp: false });
    }
  },

  signIn: async (data) => {
    set({ isLoginingIn: true });
    try {
      const res = await axiosInstance.post("/auth/signin", data, {
        withCredentials: true,
      });
      if (res.data.success && res.data.data) {
        const userData = res.data.data;
        set({ authUser: userData });
        toast.success("Sign-in successful!");
      } else {
        console.error("Sign-in failed:", res.data.message);
        toast.error(res.data.message || "Sign-in failed.");
      }
    } catch (error: any) {
      console.error("SignIn error:", error.response?.data?.message || error);
      toast.error(error.response?.data?.message || "Sign-in failed.");
    } finally {
      set({ isLoginingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/signout", {}, { withCredentials: true });
      set({ authUser: null });
      toast.success("Logout successful!");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed.");
    }
  },

  updateProfilePic: async (file) => {
    const formData = new FormData();
    formData.append("profilePic", file);

    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfilePic", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success && res.data.data.profilePic) {
        const updatedProfilePic = res.data.data.profilePic;

        set((state) => ({
          authUser: {
            ...state.authUser,
            profilePic: updatedProfilePic,
          },
        }));

        toast.success("Profile picture updated successfully!");
      } else {
        console.error("Profile picture update failed:", res.data.message);
        toast.error(res.data.message || "Profile picture update failed.");
      }
    } catch (error: any) {
      console.error("Error updating profile picture:", error);
      toast.error(
        error.response?.data?.message || "Profile picture update failed."
      );
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket: Socket = io(BASE_URL, {
      query: {
        userId: authUser.id,
      },
    });

    set({ socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket && socket.connected) {
      socket.disconnect();
    }
  },
}));
