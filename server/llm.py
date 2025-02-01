import os

from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAI

load_dotenv()

LLM = GoogleGenerativeAI(model="gemini-1.5-flash", api_key=os.getenv("GOOGLE_API_KEY"))
