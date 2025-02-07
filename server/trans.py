import scipy
import torch
from transformers import AutoTokenizer, VitsModel

model = VitsModel.from_pretrained("kakao-enterprise/vits-vctk")
tokenizer = AutoTokenizer.from_pretrained("kakao-enterprise/vits-vctk")

text = "Hey, it's Hugging Face on the phone"
inputs = tokenizer(text, return_tensors="pt")

with torch.no_grad():
    output = model(**inputs).waveform

scipy.io.wavfile.write("techno.wav", rate=model.config.sampling_rate, data=output)
