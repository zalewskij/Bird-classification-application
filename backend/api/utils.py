import torch

def mix_down(waveform):
    """
    Convert stereo to mono using a mean of two signals.
    https://github.com/pytorch/audio/issues/363
    Parameters
    ----------
    waveform: torch.Tensor

    Returns
    -------
    waveform: torch.Tensor
        Mono waveform
    """
    if waveform.shape[0] > 1:
        waveform = torch.mean(waveform, dim=0, keepdim=True)
    return waveform


def right_pad(waveform, minimal_length):
    """
    Right padding of signal if the signal is shorter the desired length
    Parameters
    ----------
    waveform: torch.Tensor
    minimal_length: int
    Returns
    -------
    waveform: torch.Tensor
        Padded waveform
    """
    length_signal = waveform.shape[1]
    if length_signal < minimal_length:
        missing_samples = minimal_length - length_signal
        last_dim_padding = (0, missing_samples)
        waveform = torch.nn.functional.pad(waveform, last_dim_padding)
    return waveform
