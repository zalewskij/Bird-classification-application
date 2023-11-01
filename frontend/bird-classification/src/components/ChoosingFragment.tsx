import { useNavigate  } from 'react-router-dom';
import { Button, Card, Typography, Slider, Space } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { uploadedFileState } from '../atoms';
import { useRecoilValue } from 'recoil';
import { FaPause, FaPlay } from 'react-icons/fa6';

const { Text } = Typography;

const displayTime = (seconds: number = 0) => `${Math.floor(seconds / 60)}:${(Math.floor(seconds % 60)).toString().padStart(2, '0')}`;

export default function ChoosingFragment() {
  const navigate = useNavigate();
  const uploadedFile = useRecoilValue(uploadedFileState);
  const [audioURL, setAudioURL] = useState<string | undefined>(undefined);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLength, setAudioLength] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null);
  const playAnimationRef = useRef<number>(0);

  const onProgressChange = (newValue: number) => {
    if (audioRef.current === null) return;
    setCurrentTime(newValue);
    audioRef.current.currentTime = newValue;
  };
  
    const repeat = useCallback(() => {
      if (audioRef.current === null) return;
      setCurrentTime(audioRef.current.currentTime);
      playAnimationRef.current = requestAnimationFrame(repeat);
    }, []);
  
  useEffect(() => {
    if (uploadedFile === null) {
      navigate('/');
      return;
    }

    const url = window.URL.createObjectURL(uploadedFile);
    setAudioURL(url);
  }, []);

  useEffect(() => {
    if (playing) {
      audioRef.current?.play();
      playAnimationRef.current = requestAnimationFrame(repeat);
    } else {
      audioRef.current?.pause();
      cancelAnimationFrame(playAnimationRef.current);
    }
  }, [playing, audioRef, repeat]);

  return (
    <Card>
      <audio src={audioURL} ref={audioRef} onEnded={() => {
        setPlaying(false);
        setCurrentTime(0);
      }} onCanPlayThrough={() => {
        setAudioLength(Math.floor(audioRef.current?.duration ?? 0));
      }} />

      <Slider onChange={onProgressChange} value={currentTime} min={0} max={audioLength} tooltip={{ formatter: displayTime }} />
      
      <Space>
        <Button icon={playing ? <FaPause /> : <FaPlay />} onClick={() => setPlaying(!playing)} />
        <Text>{displayTime(currentTime)} / {displayTime(audioLength)}</Text>
      </Space>
    </Card>
  );
}