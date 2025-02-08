# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.10.11
FROM ghcr.io/coqui-ai/tts-cpu:latest as base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# ARG UID=10001
# RUN adduser \
#     --disabled-password \
#     --gecos "" \
#     --home "/nonexistent" \
#     --shell "/sbin/nologin" \
#     --no-create-home \
#     --uid "${UID}" \
#     appuser

# USER appuser

RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg && \
    rm -rf /var/lib/apt/lists/*

RUN --mount=type=cache,target=/root/.cache/pip \
    --mount=type=bind,source=requirements.txt,target=requirements.txt \
    python -m pip install -r requirements.txt

COPY . .

RUN python vits.py
ENTRYPOINT [""]

EXPOSE ${PORT}
CMD uvicorn 'main:app' --host=0.0.0.0 --port=${PORT}
