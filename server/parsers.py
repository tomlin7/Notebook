from typing import List

from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field


class DialogueTurn(BaseModel):
    id: str = Field(..., description="Speaker ID")
    text: str = Field(..., description="Dialogue text")


class PodcastDialogue(BaseModel):
    dialogue: List[DialogueTurn]


PODCAST_PARSER = JsonOutputParser(pydantic_object=PodcastDialogue)
