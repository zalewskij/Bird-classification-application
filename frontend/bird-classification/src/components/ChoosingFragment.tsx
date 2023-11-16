import { useNavigate, useSubmit  } from 'react-router-dom';
import { Button, Card, Typography, Slider, Space, Alert, Spin } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { recordingURLState } from '../atoms';
import { useRecoilValue } from 'recoil';
import { FaPause, FaPlay, FaVolumeHigh, FaVolumeLow, FaVolumeOff, FaVolumeXmark } from 'react-icons/fa6';
import WaveSurfer from 'wavesurfer.js'
import SpectrogramPlugin from 'wavesurfer.js/dist/plugins/spectrogram.js';

const { Text } = Typography;

const displayTime = (seconds: number = 0) => `${Math.floor(seconds / 60)}:${(Math.floor(seconds % 60)).toString().padStart(2, '0')}`;

export default function ChoosingFragment() {
  const navigate = useNavigate();
  const submit = useSubmit();
  const recordingURL = useRecoilValue(recordingURLState);

  const [audioLoading, setAudioLoading] = useState(true);
  const [chosenFragment, setChosenFragment] = useState([0, 1]);
  const [warning, setWarning] = useState('');

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioLength, setAudioLength] = useState(0)
  const [volume, setVolume] = useState(60);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playAnimationRef = useRef<number>(0);

  const spectrogramRef = useRef<HTMLDivElement>(null);
  const [spectrogramLoading, setSpectrogramLoading] = useState(true);

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
    if (recordingURL === '') {
      navigate('/');
      return;
    }

    if (spectrogramRef.current)
      spectrogramRef.current.innerHTML = '';

    const ws = WaveSurfer.create({
      container: '#spectrogramContainer',
      url: recordingURL,
      sampleRate: 32000,
      interact: false,
      cursorWidth: 0,
      height: 0,
      plugins: [
        SpectrogramPlugin.create({
          labels: true,
          height: 200,
          splitChannels: false,
        }),
      ]
    });

    ws.on('ready', () => {
      
      setSpectrogramLoading(false);
    });
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

  useEffect(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume / 100;
    }
  }, [volume, muted, audioRef]);

  useEffect(() => {
    const fragmentLength = Math.abs(chosenFragment[1] - chosenFragment[0]);
    if (fragmentLength < 3) setWarning('Selection has to be at least 3 seconds long');
    else if (fragmentLength > 60) setWarning('Selection has to be at most 60 seconds long');
    else setWarning('');
  }, chosenFragment);

  return (
    <Spin spinning={audioLoading}>
      <Card className='choosing-fragment'>
        <audio src={recordingURL} ref={audioRef} onEnded={() => {
          setPlaying(false);
          setCurrentTime(0);
        }} onLoadedData={() => {
          const length = Math.floor(audioRef.current?.duration ?? 0);
          setAudioLength(length);
          setChosenFragment([0, length]);
          setAudioLoading(false);
        }} />

        <Text strong style={{ display: 'block', textAlign: 'center' }}>To analyze the recording, select the relevant fragment using the slider below the spectrogram.</Text>

        <Spin spinning={spectrogramLoading}>
          <div id='spectrogramContainer' ref={spectrogramRef} style={{ margin: '20px 0', minHeight: '50px' }}></div>
        </Spin>

        <Slider onChange={(newValue: number[]) => setChosenFragment(newValue)}
          min={0} max={audioLength} range={{ draggableTrack: true }} value={chosenFragment} tooltip={{ formatter: displayTime }} />
        <Slider onChange={onProgressChange} value={currentTime} min={0} max={audioLength} tooltip={{ formatter: displayTime }} />

        <Space className='playerControls'>
          <Button icon={playing ? <FaPause /> : <FaPlay />} onClick={() => setPlaying(!playing)} />
          <Text>{displayTime(currentTime)} / {displayTime(audioLength)}</Text>
          <Button onClick={() => setMuted(!muted)}
            icon={muted ? <FaVolumeXmark /> : (volume <= 20 ? <FaVolumeOff /> : (volume < 70 ? <FaVolumeLow /> : <FaVolumeHigh />))} />
          <Slider onChange={(newValue) => setVolume(newValue)} value={volume}
            min={0} max={100} tooltip={{ formatter: (value) => `${value}%` }}
            style={{ width: '100px' }} disabled={muted} />
          
          <Button type='primary' disabled={warning !== ''} size='large'
            onClick={async () => {
              setAudioLoading(true);
              let formData = new FormData();
              formData.append('start', chosenFragment[0].toString());
              formData.append('end', chosenFragment[1].toString());
              formData.append('recording', await fetch(recordingURL).then(r => r.blob()));
              submit(formData, {
                method: 'POST',
                action: '/results',
                encType: 'multipart/form-data',
              });
            }}>
            Analyze recording</Button>
        </Space>

        {
          (warning) ? <Alert message={warning} type='warning' showIcon /> : <></>
        }
      </Card>
    </Spin>
  );
}