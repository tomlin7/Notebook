import { create } from "zustand";
import { ChatSession, Message } from "./types";

interface ChatStore {
  sessions: Record<string, ChatSession>;
  currentSession: string | null;
  addMessage: (sessionId: string, message: Message) => void;
  updateLastMessage: (sessionId: string, content: string) => void;
  createSession: (id: string, context: string) => void;
  setCurrentSession: (id: string | null) => void;
  getSession: (id: string) => ChatSession | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: {},
  currentSession: null,

  addMessage: (sessionId, message) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [sessionId]: {
          ...state.sessions[sessionId],
          messages: [...state.sessions[sessionId].messages, message],
        },
      },
    })),

  updateLastMessage: (sessionId, content) =>
    set((state) => {
      const session = state.sessions[sessionId];
      if (!session) return state;

      const messages = [...session.messages];
      messages[messages.length - 1] = {
        ...messages[messages.length - 1],
        content,
      };

      return {
        sessions: {
          ...state.sessions,
          [sessionId]: {
            ...session,
            messages,
          },
        },
      };
    }),

  createSession: (id, context) =>
    set((state) => ({
      sessions: {
        ...state.sessions,
        [id]: {
          id,
          context,
          messages: [],
        },
      },
    })),

  setCurrentSession: (id) =>
    set(() => ({
      currentSession: id,
    })),

  getSession: (id) => get().sessions[id],
}));
