# import uvicorn
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .chains import CHAT, PODCAST, SUMMARY
from .models import ChatRequest, PodcastRequest
from .pdf import extract_text_from_pdf
from .synthesis import generate_audio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/summarize")
async def summarize_document(file: UploadFile):
    try:
        content = await file.read()

        if file.filename.endswith(".pdf"):
            text = extract_text_from_pdf(content)  # removed for now
        else:
            text = content.decode("utf-8")

        summary = SUMMARY.invoke(text)
        return {
            "summary": summary,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/podcast")
async def podcast_audio(request: PodcastRequest):
    try:
        podcast = PODCAST.invoke(request.summary)

        if "dialogue" in podcast:
            generate_audio(podcast["dialogue"])

            return FileResponse(
                "podcast.wav", media_type="audio/wav", filename="podcast.wav"
            )

        raise HTTPException(status_code=500, detail="Failed to generate podcast audio")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    try:
        chat_history = "\n\n".join(
            [f"{msg.role}: {msg.content}" for msg in request.messages]
        )

        out = CHAT.invoke(
            {
                "context": request.context,
                "chat_history": chat_history,
            }
        )

        return {"response": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8000)
