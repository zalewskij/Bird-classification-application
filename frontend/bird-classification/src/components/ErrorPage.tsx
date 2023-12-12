import { Button, Result } from 'antd';
import { Link, useRouteError } from 'react-router-dom';
import { polishVersionState } from '../atoms';
import { useRecoilValue } from 'recoil';

export default function ErrorPage() {
  const isPolishVersion = useRecoilValue(polishVersionState);
  const error: any = useRouteError();
  console.error(error);

  return (
    <Result
      status='404'
      title='404'
      subTitle={isPolishVersion ? 'Przepraszamy, ta strona nie istnieje.' : 'Sorry, the page you visited does not exist.'}
      extra={<Button type='primary'><Link to='/'>{isPolishVersion ? 'Wróć do strony głównej' : 'Go back'}</Link></Button>}
    />
  );
}