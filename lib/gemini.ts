import { Message } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateSummary(
  text: string,
  onChunk: (chunk: string) => void
) {
  const formData = new FormData();
  const file = new Blob([text], { type: "text/plain" });
  formData.append("file", file, "document.txt");

  const response = await fetch(`${API_URL}/summarize`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to generate summary");
  }

  const data = await response.json();
  onChunk(data.summary);
  return data.summary;
}

export async function chatWithDocument(
  messages: Message[],
  documentContext: string,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
      context: documentContext,
    }),
  });

  console.log("reached here!");

  if (!response.ok) {
    throw new Error("Failed to chat with document");
  }

  console.log(response);

  const data = await response.json();
  onChunk(data.response);
  return data.response;
}
