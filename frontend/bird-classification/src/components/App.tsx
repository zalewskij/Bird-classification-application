import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Layout, theme, FloatButton, ConfigProvider } from 'antd';
import { FaQuestion, FaSun, FaGear, FaMoon } from 'react-icons/fa6'
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState, polishVersionState, primaryColorState } from '../atoms';
import MenuHeader from './MenuHeader';

const { Content, Footer } = Layout;
const { defaultAlgorithm, darkAlgorithm } = theme;

function App() {
  const [floatMenuOpen, setFloatMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeState);
  const [isPolishVersion, setIsPolishVersion] = useRecoilState(polishVersionState);
  const primaryColor = useRecoilValue(primaryColorState);
  const navigate = useNavigate();

  return (
    <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
      token: {
        colorPrimary: primaryColor,
        colorInfo: primaryColor,
        colorBgBase: isDarkMode ? '#101010' : '#ffffff',
      },
    }}>
      <Layout style={{ minHeight: '100vh' }}>
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
          <FloatButton icon={<FaQuestion />} onClick={() => navigate('/about')} />
        </FloatButton.Group>
      </Layout>
    </ConfigProvider>
  )
}

export default App
