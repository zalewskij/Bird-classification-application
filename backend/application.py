import librosa
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
    y, sr = librosa.load(audio_file)
    real_duration = librosa.get_duration(y=y, sr=sr)
    if real_duration < end_time:
      return { 'error': 'Audio is too short' }, 400

    return {
      'results': [
          {
              'probability': 0.2,
              'english_name': 'Common swift',
              'polish_name': 'Jerzyk',
              'latin_name': 'Apus apus',
              'order': 'Apodiformes',
              'family': 'Apodidae',
              'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/ApusApusKlausRoggel01.jpg/150px-ApusApusKlausRoggel01.jpg',
          },
          {
              'probability': 0.8,
              'english_name': 'Pallid swift',
              'polish_name': 'Jerzyk blady',
              'latin_name': 'Apus pallidus',
              'order': 'Apodiformes',
              'family': 'Apodidae',
              'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Apuspallidus_9043.JPG/150px-Apuspallidus_9043.JPG',
          },
          {
              'probability': 0.3,
              'english_name': 'Common snipe',
              'polish_name': 'Kszyk',
              'latin_name': 'Gallinago gallinago',
              'order': 'Charadriiformes',
              'family': 'Scolopacidae',
              'image': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Gallinago_gallinago_1_%28Marek_Szczepanek%29.jpg/150px-Gallinago_gallinago_1_%28Marek_Szczepanek%29.jpg',
          },
      ]
    }

  except Exception as e:
    return { 'error': str(e) }, 400

if __name__ == '__main__':
  app.run(debug=True)
