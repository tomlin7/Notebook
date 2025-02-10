export interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  context: string;
  messages: Message[];
}

export interface DocumentData {
  name: string;
  content: string;
  summary?: string;
  audio?: string;
  isGeneratingPodcast?: boolean;
}

export interface AppState {
  documents: DocumentData[];
  sessions: Record<string, ChatSession>;
  currentSession: string | null;
}
