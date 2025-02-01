import { Message } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function generateSummary(
  text: string,
  onSummary: (chunk: string) => void
): Promise<string> {
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
  onSummary(data.summary);
  return data.summary;
}

export async function generatePodcast(
  summary: string,
  onPodcast: (audioUrl: string) => void
) {
  try {
    const response = await fetch(`${API_URL}/podcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ summary }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate podcast");
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    onPodcast(audioUrl); // Pass the URL to the callback
    return audioUrl;
  } catch (error) {
    console.error("Failed to generate podcast:", error);
    throw error;
  }
}

export async function chatWithDocument(
  messages: Message[],
  documentContext: string,
  onChat: (chat: string) => void
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

  if (!response.ok) {
    throw new Error("Failed to chat with document");
  }

  const data = await response.json();
  onChat(data.response);
  return data.response;
}
