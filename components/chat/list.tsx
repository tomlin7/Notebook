import { Message } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollRef} className="flex-1 p-4">
      {messages.map((message, i) => (
        <div
          key={`${message.timestamp}-${i}`}
          className={`mb-4 ${
            message.role === "user" ? "text-right" : "text-left"
          }`}
        >
          <div
            className={`inline-block p-3 rounded-lg max-w-[80%] ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {message.content || (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
