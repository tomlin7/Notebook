import { useToast } from "@/hooks/use-toast";
import { createMessage } from "@/lib/chat";
import { chatWithDocument } from "@/lib/gemini";
import { useChatStore } from "@/lib/store";
import { useState } from "react";
import { MessageInput } from "./input";
import { MessageList } from "./list";

interface ChatPanelProps {
  sessionId: string;
}

export function ChatPanel({ sessionId }: ChatPanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { getSession, addMessage, updateLastMessage } = useChatStore();

  const session = getSession(sessionId);

  const handleSend = async (content: string) => {
    if (!session || isLoading) return;

    const userMessage = createMessage("user", content);
    addMessage(sessionId, userMessage);

    setIsLoading(true);
    const assistantMessage = createMessage("assistant", "");
    addMessage(sessionId, assistantMessage);

    try {
      await chatWithDocument(
        [...session.messages, userMessage],
        session.context,
        (chunk) => updateLastMessage(sessionId, chunk)
      );
    } catch (error) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-col h-[600px]">
      <MessageList messages={session.messages} />
      <MessageInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
