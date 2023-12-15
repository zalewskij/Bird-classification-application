import { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Link, useNavigate } from 'react-router-dom';
import { Card, Space, Button, Upload, message, Alert } from 'antd';
import { FaUpload, FaRegCircleDot, FaStop, FaMicrophone } from 'react-icons/fa6';
import { chosenFragmentState, recordingState } from '../atoms';
import { polishVersionState } from '../atoms';
import { useRecoilValue } from 'recoil';

export default function MainPage() {
  const navigate = useNavigate();
  const isPolishVersion = useRecoilValue(polishVersionState);
  const [recording, setRecording] = useRecoilState(recordingState);
  const setChosenFragment = useSetRecoilState(chosenFragmentState);

  const [recordingUnavailable, setRecordingUnavailable] = useState(false);
  const [ongoingRecording, setOngoingRecording] = useState(false);
  const [firstThreeSeconds, setFirstThreeSeconds] = useState(true);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      message.error(isPolishVersion ? 'Nie można otworzyć pliku' : 'File could not be opened');
      return false;
    }

    return true;
  }

  const uploadFile = (file: File | string | Blob) => {
    if (!(file instanceof File)) {
      message.error(isPolishVersion ? 'Wystąpił błąd podczas otwierania pliku' : 'An error occured while loading the file');
      return;
    }

    setRecording(file);
    setChosenFragment([]);
    navigate('/choosing_fragment');
  }

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingUnavailable(true);
    }
  });

  const startRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setRecordingUnavailable(true);
      return;
    }

    setRecordingUnavailable(false);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        let chunks: Blob[] = [];

        setOngoingRecording(true);
        setTimeout(() => {
          setFirstThreeSeconds(false);
        }, 3000);
        setRecorder(mediaRecorder);

        mediaRecorder.start();

        mediaRecorder.addEventListener('dataavailable', (e) => {
          chunks.push(e.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: "audio/wav" });
          setRecording(blob);
          setChosenFragment([]);
          navigate('/choosing_fragment');
        });
      })
      .catch(() => {
        setRecordingUnavailable(true);
      });
  };

  return (
    <Card>
      <Space direction='vertical' size='large' style={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Space direction='vertical'>
          {isPolishVersion ? 'By rozpoznać gatunek ptaka, zacznij nagrywanie lub wgraj plik.' : 'To classify a bird, start recording or upload a file.'}
          {
            recording !== null &&
            <Space wrap style={{ justifyContent: 'center' }}>
              {isPolishVersion ? 'Poprzednie nagranie nie zostało sklasyfikowane.' : 'The previous recording has not been classified.'}
              <Space>
                <Link to='/choosing_fragment'><Button>{isPolishVersion ? 'Analizuj' : 'Analyze'}</Button></Link>
                <Button danger onClick={() => {
                  setRecording(null);
                  setChosenFragment([]);
                }}>{isPolishVersion ? 'Usuń' : 'Delete'}</Button>
              </Space>
            </Space>
          }
        </Space>

        <Upload showUploadList={false} maxCount={1} accept='audio/*'
          customRequest={({ file }) => uploadFile(file)}
          beforeUpload={validateFile}>
          <Button type='primary' icon={<FaUpload />} size='large' disabled={ongoingRecording}>
            {isPolishVersion ? 'Kliknij, aby' : 'Click to'}&nbsp;<span style={{ fontWeight: 'bold' }}>{isPolishVersion ? 'wgrać plik' : 'upload'}</span>
          </Button>
        </Upload>

        <Button type='primary' icon={<FaRegCircleDot />} size='large' disabled={recordingUnavailable || ongoingRecording}
          onClick={startRecording}>
          {isPolishVersion ? 'Kliknij, aby' : 'Click to'}&nbsp;<span style={{ fontWeight: 'bold' }}>{isPolishVersion ? 'nagrywać' : 'record'}</span>
        </Button>
        {
          recordingUnavailable && <Alert message={
            isPolishVersion ? 'Nagrywanie dźwięku nie jest dostępne na tym urządzeniu' : 'Recording audio is not available on this device'
          } type='warning' showIcon closable />
        }
        {
          ongoingRecording && <>
            <div className='recording'>
              <FaMicrophone />
            </div>
            {
              firstThreeSeconds
                ? <Alert message={isPolishVersion ? 'Proszę czekać, nagranie powinno mieć co najmniej 3 sekundy' : 'Wait, the recording should be at least 3 seconds long'} type='warning' showIcon />
                : <Button type='primary' icon={<FaStop />} size='large' onClick={() => {
                    if (recorder === null) return;
                    recorder.stop();
                    setOngoingRecording(false);
                    setFirstThreeSeconds(true);
                  }}>Stop</Button>
            }
            <Button onClick={() => {
              recorder?.pause();
              setRecorder(null);

              setOngoingRecording(false);
              setFirstThreeSeconds(true);
            }}>{isPolishVersion ? 'Anuluj' : 'Cancel'}</Button>
          </>
        }
      </Space>
    </Card>
  );
}
