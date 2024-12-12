import { GoogleGenerativeAI } from "@google/generative-ai";
import { formatChatHistory } from "./chat";
import { Message } from "./types";


const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyD1zY8yPlnanEDwH8wtyLlfUfvvDIACcug"
);

export async function generateSummary(
  text: string,
  onChunk: (chunk: string) => void
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Use markdown for better readability, Headings bolder , bullet points etc . Provide a comprehensive summary, focus on the key points and main ideas: 
  ${text}`;

  const result = await model.generateContentStream(prompt);
  let fullResponse = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullResponse += chunkText;
    onChunk(fullResponse);
  }

  return fullResponse;
}

export async function chatWithDocument(
  messages: Message[],
  documentContext: string,
  onChunk: (chunk: string) => void
) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const formattedPrompt = formatChatHistory(messages.slice(), documentContext);

  const result = await model.generateContentStream(formattedPrompt);
  let fullResponse = "";

  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullResponse += chunkText;
    onChunk(fullResponse);
  }

  return fullResponse;
}
