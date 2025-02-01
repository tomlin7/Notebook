import io

import PyPDF2
from fastapi import UploadFile


def extract_text_from_pdf(file_bytes: UploadFile):
    pdf = PyPDF2.PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in pdf.pages:
        text += page.extract_text()

    return text
