import { Link } from 'react-router-dom';
import { Layout, theme } from 'antd';
import logo from '../assets/logo128.png';

const { Header } = Layout;
const { useToken } = theme;

export default function MenuHeader() {
  const { token } = useToken();

  return (
    <Header className='header' style={{ backgroundColor: token.colorPrimaryBg }}>
      <Link to='/' className='header-logo'>
        <img src={logo} alt='' />
        Bird classification
      </Link>
      <Link to='/about'>
        About
      </Link>
    </Header>
  );
}