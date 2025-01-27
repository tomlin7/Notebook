import io
import os
from typing import List, Literal, Optional

import PyPDF2

# import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.output_parsers import StrOutputParser
from langchain_google_genai import GoogleGenerativeAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = GoogleGenerativeAI(model="gemini-1.5-flash", api_key=os.getenv("GOOGLE_API_KEY"))

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=2000,
    chunk_overlap=200,
    length_function=len,
)


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: Optional[int] = None


class ChatRequest(BaseModel):
    messages: List[Message]
    context: str


def extract_text_from_pdf(file_bytes: UploadFile):
    pdf = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf.pages:
        text += page.extract_text()

    return text


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.post("/api/summarize")
async def summarize_document(file: UploadFile):
    try:
        content = await file.read()

        if file.filename.endswith(".pdf"):
            text = extract_text_from_pdf(content)
        else:
            text = content.decode("utf-8")

        summary_prompt = PromptTemplate(
            template="""Use markdown for better readability, headings bolder, bullet points, etc.
            Provide a comprehensive summary, focus on the key points and main ideas:
            {text}""",
            input_variables=["text"],
        )

        summary_chain = summary_prompt | llm | StrOutputParser()
        out = summary_chain.invoke(text)

        return {"summary": out}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat")
async def chat_with_document(request: ChatRequest):
    try:
        chat_prompt = PromptTemplate(
            template="""Context from document:
            {context}
            
            Previous conversation:
            {chat_history}

            Use markdown formatting for better readability, headings bolder, bullet points, etc.
            Don't get side-tracked, stay on topic. Be concise and to the point.
            Apologize if you don't know the answer and ask for clarification if needed, don't make things up.
            Point out if the question is out of scope of the document and provide a helpful, accurate response based on the context from document and previous conversation.
            """,
            input_variables=["context", "chat_history"],
        )

        chat_history = "\n\n".join(
            [f"{msg.role}: {msg.content}" for msg in request.messages]
        )

        chat_chain = chat_prompt | llm | StrOutputParser()
        out = chat_chain.invoke(
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
