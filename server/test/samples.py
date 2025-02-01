from pathlib import Path

from pydub import AudioSegment
from TTS.api import TTS

Path("temp").mkdir(exist_ok=True)

# list all models

tts = TTS(
    model_name="tts_models/multilingual/multi-dataset/xtts_v2",
    progress_bar=False,
    gpu=False,
)
for model in tts.speakers:
    print(model)

audio_files = []
for speaker_id in tts.speakers:
    file_path = "temp/{}.wav".format(speaker_id.replace("\n", ""))
    tts.tts_to_file(
        text="Her diverse skill set and practical experience make her a highly attractive prospect",
        file_path=file_path,
        speaker=speaker_id,
    )
    audio_files.append(file_path)

final_audio = AudioSegment.empty()
for file in audio_files:
    final_audio += AudioSegment.from_wav(file)

final_audio.export("output.wav", format="wav")
print("Conversation saved as 'output.wav'")
