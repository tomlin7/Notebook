from typing import List, Literal, Optional

from pydantic import BaseModel


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    timestamp: Optional[int] = None


class ChatRequest(BaseModel):
    messages: List[Message]
    context: str


class PodcastRequest(BaseModel):
    summary: str
