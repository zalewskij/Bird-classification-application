import librosa
import numpy as np
# import torchaudio
import torch

def generate_mel_spectrogram(y, sr, n_fft, hop_length, number_of_bands = 64, fmin = 150, fmax = 15000):
    """
    Generates mel spectrogram for a given signal
    Parameters
    ----------
    y : Tensor
        Signal for generating spectrogram
    sr : int
        sampling rate
    n_fft : int
        frames per window
    hop_length : int
        overlap of windows
    number_of_bands : int
        number of mel bands
    fmin : int
        minimal frequency for spectrogram
    fmax : int
        maximal frequency for spectrogram

    Returns
    -------
    Tensor
        Spectrogram represented as a 2d array
    """
    # transform = torchaudio.transforms.MelSpectrogram(sample_rate=sr, n_fft=n_fft, hop_length=hop_length, f_min=fmin, f_max=fmax, n_mels=number_of_bands)
    # M = transform(y)[0]
    # M_db = librosa.power_to_db(M, ref=np.max)
    # return M_db
    M = librosa.feature.melspectrogram(y=y, sr=sr, n_fft=n_fft, hop_length=hop_length, n_mels=number_of_bands, fmin=fmin, fmax=fmax)
    M_db = librosa.power_to_db(M, ref=np.max)
    return torch.from_numpy(M_db)
