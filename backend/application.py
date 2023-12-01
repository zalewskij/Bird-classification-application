import os
from flask import Flask, request
from flask_cors import CORS
import pandas as pd
import torch

from birdclassification.training.cnn_training_torch.CNN_model import CNNNetwork
from preprocessing import classify_audio, load_audio, preprocess_audio

app = Flask(__name__)
CORS(app)

DEVICE = 'cuda' if torch.cuda.is_available() else 'cpu'
base_path = os.path.realpath(os.path.dirname(__file__))

model = CNNNetwork().to(DEVICE)
model.load_state_dict(torch.load(os.path.join(base_path, 'cnn_1.pt')))
model.eval()

df = pd.read_csv(os.path.join(base_path, 'bird-list-extended.csv'), delimiter=";")
birds_list = df[df["Top 30"] == 1].sort_values(by='latin_name')

@app.route('/analyze-audio', methods=['POST'])
def analyze_audio():
  if 'recording' not in request.files:
    return { 'error': 'No audio file provided'}, 400
  
  if 'start' not in request.form:
    return { 'error': 'No start time provided'}, 400
  
  if 'end' not in request.form:
    return { 'error': 'No end time provided'}, 400

  audio_file = request.files['recording']

  if audio_file.filename == '':
    return { 'error': 'No audio file selected' }, 400

  try:
    start_time = int(request.form['start'])
    end_time = int(request.form['end'])
  except Exception as e:
    return { 'error': 'Invalid format of request' }, 400

  duration = end_time - start_time

  if duration < 3:
    return { 'error': 'Audio is too short' }, 400
  
  if duration > 60:
    return { 'error': 'Audio is too long' }, 400

  try:
    y, real_duration = load_audio(audio_file, sr=32000)
    if real_duration < end_time or real_duration < 3:
      return { 'error': 'Audio is too short' }, 400

    input = preprocess_audio(y, start_time, end_time, sr=32000, n_fft=512, hop_length=384, length_in_seconds=3)
    output = classify_audio(input, model, DEVICE)
    result = []

    for i, value in enumerate(output):
      if value > 0.01:
        bird = birds_list.iloc[i].to_dict()
        bird['probability'] = value
        result.append(bird)

    return {
      'results': result
    }

  except Exception as e:
    return { 'error': str(e) }, 400

if __name__ == '__main__':
  app.run(debug=True)
