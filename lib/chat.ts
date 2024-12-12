import { Message } from "./types";

export function formatChatHistory(
  messages: Message[],
  context: string
): string {
  const formattedMessages = messages
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n\n");

  console.log(formattedMessages);

  return `Context from the document:
  ${context}
  
  Previous conversation:
  ${formattedMessages}
  
  Use markdown formatting for better readability,, Headings bolder , bullet points etc.
  Don't get sidetracked. Be concise and to the point.
  Apologize for any mistakes and ask for clarification if needed, don't provide false information.
  Point out if the asked question is out of scope and provide a helpful, accurate response based on the document context and previous conversation.`;
}

export function createMessage(role: Message["role"], content: string): Message {
  return {
    role,
    content,
    timestamp: Date.now(),
  };
}
