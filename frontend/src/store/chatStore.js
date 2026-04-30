import { create } from 'zustand';
import { io } from 'socket.io-client';
import { chatAPI } from '../utils/api';

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const useChatStore = create((set, get) => ({
  socket: null,
  conversations: [],
  activeConversation: null,
  messages: [],
  isLoading: false,
  isTyping: false,

  connectSocket: (token) => {
    if (get().socket) return;
    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on("receive_message", (message) => {
      const { activeConversation } = get();
      if (activeConversation && activeConversation.id === message.conversationId) {
        set((state) => ({ messages: [...state.messages, message] }));
      }
      // Also update the lastMessage in conversations list
      set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === message.conversationId
            ? { ...conv, lastMessage: message, updatedAt: message.createdAt }
            : conv
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      }));
    });

    socket.on("typing", ({ userId, isTyping }) => {
      set({ isTyping });
    });

    socket.on("new_message_notification", ({ conversationId, message }) => {
      // Called when a message arrives for a conversation that is NOT currently open
      set((state) => ({
        conversations: state.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, lastMessage: message, updatedAt: message.createdAt }
            : conv
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      }));
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const { data } = await chatAPI.getConversations();
      set({ conversations: data.data, isLoading: false });
    } catch (error) {
      console.error("Error fetching conversations:", error);
      set({ isLoading: false });
    }
  },

  setActiveConversation: async (conversation) => {
    set({ activeConversation: conversation, messages: [], isLoading: true });
    const { socket } = get();

    if (socket && conversation) {
      socket.emit("join_conversation", conversation.id);
    }

    try {
      if (conversation) {
        const { data } = await chatAPI.getMessages(conversation.id);
        set({ messages: data.data, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ isLoading: false });
    }
  },

  sendMessage: (content, receiverId) => {
    const { socket, activeConversation } = get();
    if (socket && activeConversation) {
      socket.emit("send_message", {
        conversationId: activeConversation.id,
        content,
        receiverId
      });
    }
  },

  setTyping: (isTyping) => {
    const { socket, activeConversation } = get();
    if (socket && activeConversation) {
      socket.emit("typing", {
        conversationId: activeConversation.id,
        isTyping
      });
    }
  }
}));

export default useChatStore;
