import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, theme, FloatButton, ConfigProvider, notification } from 'antd';
import { FaQuestion, FaSun, FaGear, FaMoon, FaDownload } from 'react-icons/fa6'
import { useRecoilState } from 'recoil';
import { darkModeState, polishVersionState } from '../atoms';
import MenuHeader from './MenuHeader';
import { PRIMARY_COLOR } from '../constants';

const { Content, Footer } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

function App() {
  const [floatMenuOpen, setFloatMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeState);
  const [isPolishVersion, setIsPolishVersion] = useRecoilState(polishVersionState);
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  useEffect(() => {
    const openOfflineNotification = () => {
      api.warning({
        message: isPolishVersion ? 'Jesteś offline' : 'You are offline',
        placement: 'bottom',
      });
    };
    
    const openOnlineNotification = () => {
      api.info({
        message: isPolishVersion ? 'Jesteś z powrotem online' : 'You are online again',
        placement: 'bottom',
      });
    };
    
    window.addEventListener('online', openOnlineNotification);
    window.addEventListener('offline', openOfflineNotification);

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    });
  }, []);

  return (
    <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      token: {
        colorPrimary: PRIMARY_COLOR,
        colorInfo: PRIMARY_COLOR,
        colorBgBase: isDarkMode ? '#101010' : '#ffffff',
      },
    }}>
      <Layout style={{ minHeight: '100vh' }}>
        {contextHolder}
        <MenuHeader />
        <Content className='content'>
          <Outlet />
        </Content>
        <Footer className='footer'>{isPolishVersion ? 'Rozpoznawanie ptaków' : 'Bird classification'} &copy; 2024</Footer>
        <FloatButton.Group open={floatMenuOpen} trigger='click' icon={<FaGear />} onClick={() => setFloatMenuOpen(!floatMenuOpen)} className='float-button'>
          <FloatButton icon={isDarkMode ? <FaSun /> : <FaMoon />} onClick={() => {
            setIsDarkMode(!isDarkMode);
            setFloatMenuOpen(false);
          }} />
          <FloatButton description={isPolishVersion ? 'EN' : 'PL'} shape='square' onClick={() => {
            setIsPolishVersion(!isPolishVersion);
            setFloatMenuOpen(false);
          }} />
          <FloatButton icon={<FaDownload />} onClick={async () => {
            console.log(installPrompt);
            if (installPrompt === null) return;
            await installPrompt.prompt();
          }} style={{ display: installPrompt !== null ? 'block' : 'none' }} />
          <FloatButton icon={<FaQuestion />} onClick={() => navigate('/about')} />
        </FloatButton.Group>
      </Layout>
    </ConfigProvider>
  )
}

export default App
