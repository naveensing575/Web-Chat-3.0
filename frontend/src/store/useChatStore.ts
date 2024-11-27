import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axios";

// Define types for the state and actions
interface User {
  id: string;
  name: string;
  [key: string]: any;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  [key: string]: any;
}

interface ChatState {
  messages: Message[];
  users: User[];
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users", {
        withCredentials: true,
      });
      if (res.data.success && res.data.data) {
        const userData: User[] = res.data.data;
        set({ users: userData });
      } else {
        console.error("Authentication failed:", res.data.message);
        set({ users: [] });
      }
    } catch (error) {
      console.error("Error in getUsers:", error);
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId: string) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`, {
        withCredentials: true,
      });
      if (res.data.success && res.data.data) {
        const messagesData: Message[] = res.data.data;
        set({ messages: messagesData });
      } else {
        console.error("Authentication failed:", res.data.message);
        set({ messages: [] });
      }
    } catch (error) {
      console.error("Error in getMessages:", error);
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (selectedUser: User | null) => set({ selectedUser }),
}));
