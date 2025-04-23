"use client";

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface WellnessState {
  checkIns: {
    _id: string;
    date: string;
    responses: Record<string, string>;
  }[];
  addCheckIn: (date: string, responses: Record<string, string>) => Promise<void>;
  fetchCheckIns: () => Promise<void>;
  shouldPromptNewCheckIn: () => boolean;
}

export const useWellnessStore = create<WellnessState>()((set, get) => ({
  checkIns: [],
  addCheckIn: async (date, responses) => {
    try {
      const response = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, responses }),
      });
      
      if (!response.ok) throw new Error('Failed to save check-in');
      
      const checkIn = await response.json();
      set((state) => ({
        checkIns: [checkIn, ...state.checkIns],
      }));
    } catch (error) {
      console.error('Error adding check-in:', error);
      throw error;
    }
  },
  fetchCheckIns: async () => {
    try {
      const response = await fetch('/api/wellness');
      if (!response.ok) throw new Error('Failed to fetch check-ins');
      
      const checkIns = await response.json();
      set({ checkIns });
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  },
  shouldPromptNewCheckIn: () => {
    const checkIns = get().checkIns;
    if (checkIns.length === 0) return true;
    
    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = new Date(checkIns[0].date).toISOString().split('T')[0];
    
    return today !== lastCheckIn;
  },
}));

interface Message {
  _id?: string;
  id?: string;
  content: string;
  role: 'user' | 'system' | 'assistant';
  createdAt: string;
}

interface Chat {
  _id: string;
  id?: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

interface ChatState {
  chats: Chat[];
  activeChat: string | null;
  createChat: (title: string) => Promise<string>;
  getChat: (id: string) => Chat | undefined;
  addMessage: (chatId: string, content: string, role: 'user' | 'system' | 'assistant') => Promise<void>;
  setActiveChat: (chatId: string) => void;
  fetchChats: () => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  chats: [],
  activeChat: null,
  createChat: async (title) => {
    try {
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) throw new Error('Failed to create chat');
      
      const chat = await response.json();
      
      set((state) => ({
        chats: [chat, ...state.chats],
        activeChat: chat._id,
      }));
      
      return chat._id;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw error;
    }
  },
  getChat: (id) => {
    return get().chats.find(chat => chat._id === id || chat.id === id);
  },
  addMessage: async (chatId, content, role) => {
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, role }),
      });

      if (!response.ok) throw new Error('Failed to add message');
      
      const updatedChat = await response.json();
      
      set((state) => ({
        chats: state.chats.map(chat => 
          chat._id === chatId || chat.id === chatId
            ? updatedChat
            : chat
        ),
      }));
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },
  setActiveChat: (chatId) => {
    set({ activeChat: chatId });
  },
  fetchChats: async () => {
    try {
      const response = await fetch('/api/chats');
      if (!response.ok) throw new Error('Failed to fetch chats');
      
      const chats = await response.json();
      set({ chats });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },
}));