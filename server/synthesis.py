from pathlib import Path
from typing import Dict, List

from pydub import AudioSegment
from TTS.api import TTS

Path("temp").mkdir(exist_ok=True)

tts = TTS(model_name="tts_models/en/vctk/vits", progress_bar=False, gpu=False)


def generate_audio_files(podcast: List[Dict[str, str]]) -> List[str]:
    audio_files = []
    for i, line in enumerate(podcast):
        file_path = f"temp/line_{i}.wav"
        tts.tts_to_file(text=line["text"], file_path=file_path, speaker=line["id"])
        audio_files.append(file_path)

    return audio_files


def combine_audio_files(audio_files: List[str], output_file: str):
    combined = AudioSegment.empty()
    for file in audio_files:
        combined += AudioSegment.from_wav(file)

    combined.export(output_file, format="wav")


def generate_audio(podcast: List[Dict[str, str]]) -> str:
    if not podcast:
        return None

    audio_files = generate_audio_files(podcast)
    output_file = "podcast.wav"
    combine_audio_files(audio_files, output_file)

    return output_file
