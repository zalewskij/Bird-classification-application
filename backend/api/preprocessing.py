from spectrogram import generate_mel_spectrogram
from utils import mix_down, right_pad
import torch
import torchaudio


def load_audio(audio_file, sr):
  try:
    y, sr2 = torchaudio.load(audio_file)
    if sr2 != sr:
      y = torchaudio.transforms.Resample(orig_freq=sr2, new_freq=sr)(y)
    real_duration = y.size()[1] / sr
    return y, real_duration
  except Exception:
    raise Exception('Invalid audio format')

def preprocess_audio(waveform, start_time, end_time, sr, n_fft, hop_length, length_in_seconds):
  length = length_in_seconds * sr

  waveform = mix_down(waveform)
  waveform = right_pad(waveform, minimal_length=length)

  spectrograms = list(map(
    lambda start: generate_mel_spectrogram(waveform[:, start:start+length], sr, n_fft, hop_length),
    [s * sr for s in range(start_time, end_time + 1 - length_in_seconds, length_in_seconds - 1)]
  ))

  return list(map(lambda spectrogram: torch.unsqueeze(torch.from_numpy(spectrogram), dim=0), spectrograms))

def classify_audio(input_tensors, model, binary_classifier, device):
  softmax = torch.nn.Softmax(dim=1)
  cumulative_output = torch.zeros(30).to(device)
  not_recognised = 0

  with torch.no_grad():
      for input_tensor in input_tensors:
        input = torch.unsqueeze(input_tensor, dim=0).to(device)
        is_bird = binary_classifier(input)
        is_bird = softmax(is_bird)[0, 1]

        if is_bird > 0.9:
          output = model(input)
          output = softmax(output).squeeze()
          cumulative_output = torch.maximum(output, cumulative_output)
        else:
          not_recognised += 1

  cumulative_output.divide_(cumulative_output.sum())
  return cumulative_output.tolist()