from pathlib import Path

from pydub import AudioSegment
from TTS.api import TTS

Path("temp").mkdir(exist_ok=True)

tts = TTS(model_name="tts_models/en/vctk/vits", progress_bar=False, gpu=False)

male_speaker_id = "p226"  # M
female_speaker_id = "ED\n"  # F


dialogue = [
    ("Interviewer", "Can you tell me about yourself?", male_speaker_id),
    (
        "Candidate",
        "Sure! I'm an artist.",
        female_speaker_id,
    ),
    ("Interviewer", "What languages do you use?", male_speaker_id),
    ("Candidate", "I primarily use english.", female_speaker_id),
]

audio_files = []
for i, (speaker, text, speaker_id) in enumerate(dialogue):
    file_path = f"temp/line_{i}.wav"
    tts.tts_to_file(text=text, file_path=file_path, speaker=speaker_id)
    audio_files.append(file_path)

final_audio = AudioSegment.empty()
for file in audio_files:
    final_audio += AudioSegment.from_wav(file)

final_audio.export("output.wav", format="wav")
print("saved as 'output.wav'")
