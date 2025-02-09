FROM ghcr.io/coqui-ai/tts-cpu:latest AS base

ENV PORT=8080
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

COPY . .

ENTRYPOINT uvicorn main:app --host 0.0.0.0 --port ${PORT}