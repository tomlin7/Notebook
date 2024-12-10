import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);

export async function generateSummary(text: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Provide a comprehensive summary, focus on the key points and main ideas: 
  ${text}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateVoiceScript(summary: string) {
  return "not implemented";
}
