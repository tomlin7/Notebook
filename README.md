# Notebook: Turn study notes into podcasts

Notebook is an AI-powered platform that helps you explore your documents by generating exclusive podcast episodes (with 2 guests), concise summaries, and interactive chat sessions. It uses Coqui TTS models for the audio generation and Google Gemini 2.0 models for text summarization.
[Open Notebook](https://notebookxyz.vercel.app).

![preview](https://github.com/user-attachments/assets/290741c8-aed0-4827-87ad-807b94b2cfdf)

- Upload documents (PDF, TXT)
- Notebook will instantly summarize the uploaded document.
- Wait for few seconds and the podcast episode will pop up in the main page as well (this can take upto a minute)
- For chat switch to the chat tab, then start talking to the document.

## Running the server

Create a `.env` file. Set `GEMINI_API_KEY` variable to your Google AI API key.

```bash
bun i
bun run dev
```

## Planned
- Optimize podcast generation 
- Real time podcast session where user can join in podcasts with the guests
