import { Link } from 'react-router-dom';
import { Layout, theme } from 'antd';
import logo from '../assets/logo128.png';
import { polishVersionState } from '../atoms';
import { useRecoilValue } from 'recoil';

const { Header } = Layout;
const { useToken } = theme;

export default function MenuHeader() {
  const { token } = useToken();
  const isPolishVersion = useRecoilValue(polishVersionState);

  return (
    <Header className='header' style={{ backgroundColor: token.colorPrimaryBg }}>
      <Link to='/' className='header-logo'>
        <img src={logo} alt='' />
        {isPolishVersion ? 'Rozpoznawanie ptaków' : 'Bird classification'}
      </Link>
      <Link to='/about'>
        {isPolishVersion ? 'Więcej o aplikacji' : 'About'}
      </Link>
    </Header>
  );
}