import { Button, Result } from 'antd';
import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary"><Link to='/'>Go back</Link></Button>}
    />
  );
}