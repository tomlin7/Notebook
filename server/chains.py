from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from .llm import LLM
from .parsers import PODCAST_PARSER

__all__ = ["SUMMARY", "PODCAST", "CHAT"]


summary_prompt = PromptTemplate(
    template="""Use markdown for better readability, headings bolder, bullet points, etc.
    Provide a comprehensive summary, focus on the key points and main ideas:
    {text}""",
    input_variables=["text"],
)

podcast_prompt = PromptTemplate(
    template="""Based on the following document summary, create an engaging podcast dialogue where two experts discuss the main points.
        Make it natural and conversational, but keep it focused on the key insights:

        Documents:
        {summary}

        Use only the following speaker IDs:
            expert1_id = "p236"
            expert2_id = "p227"
        Don't speak the speaker IDs, just use them to differentiate between the two speakers in the dialogue.

        {format_instructions}""",
    input_variables=["summary"],
    partial_variables={"format_instructions": PODCAST_PARSER.get_format_instructions()},
)

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

# ---------------------------------------------------------

SUMMARY = summary_prompt | LLM | StrOutputParser()
PODCAST = podcast_prompt | LLM | PODCAST_PARSER
CHAT = chat_prompt | LLM | StrOutputParser()
