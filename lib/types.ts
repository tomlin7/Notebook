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
