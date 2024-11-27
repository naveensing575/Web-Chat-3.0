import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../services/axios";
import { useAuthStore } from "./useAuthStore";

// Define types for the state and actions
interface User {
  id: string;
  name: string;
  profilePic: string;
  fullName: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: string;
  image: string;
  text: string;
}

interface ChatState {
  messages: Message[];
  users: User[];
  sendMessage: (messageData: any) => Promise<void>;
  selectedUser: User | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;

  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  setSelectedUser: (selectedUser: User | null) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
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

  sendMessage: async (messageData: any) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser?.id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    if (!socket) {
      console.error("Socket is null, cannot subscribe to messages.");
      return;
    }

    socket.on("newMessage", (newMessage: Message) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser.id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;

    if (!socket) {
      console.error("Socket is null, cannot unsubscribe from messages.");
      return;
    }

    socket.off("newMessage");
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
