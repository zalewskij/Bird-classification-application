import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { Card, Space, Button, Upload, message, Typography, Alert } from 'antd';
import { FaUpload, FaRegCircleDot, FaStop, FaMicrophone } from 'react-icons/fa6';
import { recordingURLState } from '../atoms';

const { Text } = Typography;

export default function MainPage() {
  const navigate = useNavigate();
  const setRecordingURLState = useSetRecoilState(recordingURLState);
  const [recordingUnavailable, setRecordingUnavailable] = useState(false);
  const [ongoingRecording, setOngoingRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      message.error('File could not be opened');
      return false;
    }

    return true;
  }

  const uploadFile = (file: File | string | Blob) => {
    if (!(file instanceof File)) {
      message.error('An error occured while loading the file');
      return;
    }

    const audioURL = window.URL.createObjectURL(file);
    setRecordingURLState(audioURL);
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
        setRecorder(mediaRecorder);

        mediaRecorder.start();

        mediaRecorder.addEventListener('dataavailable', (e) => {
          chunks.push(e.data);
        });

        mediaRecorder.addEventListener('stop', () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = window.URL.createObjectURL(blob);
          setRecordingURLState(audioURL);
          navigate('/choosing_fragment');
        });
      })
      .catch(() => {
        setRecordingUnavailable(true);
      });
  };

  return (
    <Card>
      <Space direction='vertical' size='large' style={{ display: 'flex', alignItems: 'center' }}>
        <Text>
          To classify a bird, start recording or upload a file.
        </Text>

        <Upload showUploadList={false} maxCount={1} accept='audio/*'
          customRequest={({ file }) => uploadFile(file)}
          beforeUpload={validateFile}>
          <Button type='primary' icon={<FaUpload />}  size='large' disabled={ongoingRecording}>
            Click to&nbsp;<span style={{ fontWeight: 'bold' }}>upload</span>
          </Button>
        </Upload>

        <Button type='primary' icon={<FaRegCircleDot />} size='large' disabled={recordingUnavailable || ongoingRecording}
          onClick={startRecording}>
          Click to&nbsp;<span style={{ fontWeight: 'bold' }}>record</span>
        </Button>
        {
          recordingUnavailable && <Alert message='Recording audio is not available on this device' type='warning' showIcon closable />
        }
        {
          ongoingRecording && <>
            <div className='recording'>
              <FaMicrophone />
            </div>
            <Button type='primary' icon={<FaStop />} size='large' onClick={() => {
              if (recorder === null) return;
              recorder.stop();
              setOngoingRecording(false);
            }}>Stop</Button>
          </>
        }
      </Space>
    </Card>
  );
}
