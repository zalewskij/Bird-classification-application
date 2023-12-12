import json
from flask.testing import FlaskClient
import pytest
import io
import torch

from preprocessing import load_audio, preprocess_audio
from application import app, setup_application

FILE1 = '../../tests/sounds/cygnus_olor_1.wav'
FILE2 = '../../tests/sounds/cygnus_olor_2.mp3'

def read_audio_file(file_path):
    with open(file_path, 'rb') as file:
        audio_data = file.read()

    return (io.BytesIO(audio_data), 'test_audio.wav')

@pytest.fixture(scope="module", autouse=True)
def setup():
    setup_application()

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def assert_error(response, error):
    assert response.status_code == 400
    assert response.headers['Content-Type'] == 'application/json'
    json_response = json.loads(response.text)
    assert 'error' in json_response
    assert json_response['error'] == error

def test_analyze_audio_missing_file(client: FlaskClient):
    response = client.post('/analyze-audio')
    assert_error(response, 'No audio file provided')

def test_analyze_audio_missing_start(client: FlaskClient):
    response = client.post('/analyze-audio', data={
        'recording': read_audio_file(FILE1)
    })
    assert_error(response, 'No start time provided')

def test_analyze_audio_missing_end(client: FlaskClient):
    response = client.post('/analyze-audio', data={
        'recording': read_audio_file(FILE1),
        'start': 3
    })
    assert_error(response, 'No end time provided')

def test_analyze_audio_wrong_request_format(client: FlaskClient):
    response = client.post('/analyze-audio', data={
        'recording': read_audio_file(FILE1),
        'start': '3',
        'end': 'forty three'
    })
    assert_error(response, 'Invalid format of request')

def test_analyze_audio_wrong_audio_format(client: FlaskClient):
    response = client.post('/analyze-audio', data={
        'recording': read_audio_file('preprocessing.py'),
        'start': 3,
        'end': 13
    })
    assert_error(response, 'Invalid audio format')

def test_analyze_audio_too_short(client: FlaskClient):
    response = client.post('/analyze-audio', data={
        'recording': read_audio_file(FILE1),
        'start': 3,
        'end': 4
    })
    assert_error(response, 'Audio is too short')

def test_analyze_audio_too_long(client: FlaskClient):
    response = client.post('/analyze-audio', data={
        'recording': read_audio_file(FILE1),
        'start': 3,
        'end': 103
    })
    assert_error(response, 'Audio is too long')

def test_analyze_audio_fragment_too_long(client: FlaskClient):
    response = client.post('/analyze-audio', data={
        'recording': read_audio_file(FILE1),
        'start': 1000,
        'end': 1010
    })
    assert_error(response, 'Audio is too short')

def test_preprocess_audio():
    for filename, start, end, x in [(FILE1, 0, 43, 21), (FILE2, 20, 30, 4)]:
        file, _ = read_audio_file(filename)
        y, _ = load_audio(file, 32000)
        input = preprocess_audio(y, start, end, sr=32000, n_fft=512, hop_length=384, length_in_seconds=3)
        assert isinstance(input, list)
        assert len(input) == x
        assert all(isinstance(tensor, torch.Tensor) for tensor in input)
        assert all(tensor.shape[0] == 1 and tensor.shape[1] == 64 and tensor.shape[2] == 251 for tensor in input)

def test_analyze_audio(client: FlaskClient):
    for filename in [FILE1, FILE2]:
        response = client.post('/analyze-audio', data={
            'recording': read_audio_file(filename),
            'start': 3,
            'end': 10
        })
        assert response.status_code == 200
        assert response.headers['Content-Type'] == 'application/json'
        json_response = json.loads(response.text)
        assert 'results' in json_response
        assert isinstance(json_response['results'] , list)
        expected_keys = ['probability', "polish_name", "english_name", "latin_name", "order", "family", "image"]

        for item in json_response['results']:
            assert isinstance(item, dict)
            assert all(key in item for key in expected_keys)