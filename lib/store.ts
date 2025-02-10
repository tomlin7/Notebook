import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppState, ChatSession, DocumentData, Message } from "./types";

interface ChatStore extends AppState {
  addMessage: (sessionId: string, message: Message) => void;
  updateLastMessage: (sessionId: string, content: string) => void;
  createSession: (id: string, context: string) => void;
  setCurrentSession: (id: string | null) => void;
  getSession: (id: string) => ChatSession | undefined;
  addDocument: (document: DocumentData) => void;
  updateDocument: (name: string, updates: Partial<DocumentData>) => void;
  getDocument: (name: string) => DocumentData | undefined;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      documents: [],
      sessions: {},
      currentSession: null,

      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, document],
        })),

      updateDocument: (name, updates) =>
        set((state) => ({
          documents: state.documents.map((doc) =>
            doc.name === name ? { ...doc, ...updates } : doc
          ),
        })),

      getDocument: (name) => get().documents.find((doc) => doc.name === name),

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
    }),
    {
      name: "notebook-storage",
    }
  )
);
