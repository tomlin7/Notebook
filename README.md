# Notebook

Note Taking & Research Assistant Powered by AI. [Open a Notebook](https://notebookxyz.vercel.app).

![preview](https://github.com/user-attachments/assets/290741c8-aed0-4827-87ad-807b94b2cfdf)

So, at uni, we were handed chonky books and paper work, which were very inefficient to read and understand. Why not make a RAG tool to simulate asking direct questions to the document? This is where **Notebook** comes in. It can summarize documents, answer questions, and chat with you about the document.

- Upload documents (PDF, TXT)
- Notebook will summarize the uploaded document.
- Switch to the chat tab, then start talking to the document.

## Building from source

Create a `.env.local` in root directory. Set the `NEXT_PUBLIC_GEMINI_API_KEY` environment variable to your Google AI API key.

```bash
bun i
bun run dev
```
