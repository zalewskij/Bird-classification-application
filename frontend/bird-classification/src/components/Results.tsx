import { useActionData, type ActionFunctionArgs, useNavigate, Link } from 'react-router-dom';
import { Card, List, Space, Typography, Image, Result, Popover, Button } from 'antd';
import { FaInfo, FaRegCircleQuestion } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { chosenFragmentState, polishVersionState, recordingState } from '../atoms';
import { BACKEND_URL, PRIMARY_COLOR } from '../constants';

const { Title, Text } = Typography;

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  return fetch(BACKEND_URL, {
    method: 'POST',
    body: formData,
  }).catch((reason) => ({
    error: reason.toString(),
    serverError: true,
  }));
}

interface ResultType {
  probability: number;
  english_name: string;
  polish_name: string;
  latin_name: string;
  order: string;
  family: string;
  image: string;
}

export default function Results() {
  const navigate = useNavigate();
  const isPolishVersion = useRecoilValue(polishVersionState);
  const setRecording = useSetRecoilState(recordingState);
  const setChosenFragment = useSetRecoilState(chosenFragmentState);

  const actionData = useActionData() as { results: ResultType[] | undefined, error: string | undefined, serverError: boolean | undefined };
  const [results, setResults] = useState<ResultType[]>([]);
  const [mostProbableResult, setMostProbableResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (actionData && actionData.error) {
      console.error(actionData);
      setError(actionData.serverError
        ? (isPolishVersion ? 'Wystąpił błąd podczas łączenia z serwerem.' : 'An error occured while connecting to the server')
        : actionData.error);
    } else if (actionData && actionData.results) {
      setResults(actionData.results.sort((a, b) => b.probability - a.probability));

      if (actionData.results.length > 0) {
        setRecording(null);
        setChosenFragment([]);
      }
    } else {
      navigate('/');
    }
  }, [actionData]);

  useEffect(() => {
    if (results.length === 0) return;
    setMostProbableResult(results[0].english_name);
  }, [results]);

  return (
    <Card>
      {
        error
          ? <Result status='warning' title={error}
            extra={<Link to='/choosing_fragment'><Button type='primary'>{isPolishVersion ? 'Spróbuj ponownie' : 'Try again'}</Button></Link>}
            subTitle={navigator.onLine === false ? (isPolishVersion ? 'Proszę sprawdzić połączenia z internetem' : 'Please check your internet connection') : ''}
          />
          : (results.length == 0
            ? <Result
              icon={<FaRegCircleQuestion style={{ fontSize: '5rem', color: PRIMARY_COLOR }} />}
              title={isPolishVersion ? 'Nie rozponano żadnego gatunku ptaka w tym nagraniu.' : 'No bird species was recognized in this recording.'}
              extra={<Space direction="vertical">
              <Link to='/choosing_fragment'>
                <Button style={{ whiteSpace: 'normal', height: 'fit-content' }}>
                  {isPolishVersion ? 'Spróbuj z innym fragmentem nagrania' : 'Try with a different fragment of the recording'}
                </Button>
              </Link>
              <Button style={{ whiteSpace: 'normal', height: 'fit-content' }} onClick={() => {
                  setRecording(null);
                  setChosenFragment([]);
                  navigate('/');
                }}>
                {isPolishVersion ? 'Zacznij od nowa' : 'Start from the beginning'}
              </Button>
              </Space>}
            />
            : <List
              itemLayout="vertical"
              size="large"
              pagination={false}
              dataSource={results}
              renderItem={(result) => (
                <List.Item key={result.english_name} className='result'>
                  <Space direction='vertical'>
                    <Title level={result.english_name === mostProbableResult ? 2 : 4}>
                      {isPolishVersion ? result.polish_name : result.english_name}
                    </Title>
                    <Text italic strong>
                      {result.latin_name}
                      <Popover content={
                        <div>
                          <p>{isPolishVersion ? 'Rząd' : 'Order'}: {result.order}</p>
                          <p>{isPolishVersion ? 'Rodzina' : 'Family'}: {result.family}</p>
                        </div>
                      } trigger='click'>
                        <Button shape="circle" icon={<FaInfo />} size='small' style={{ marginLeft: '5px' }} />
                      </Popover>
                    </Text>
                    <Text>{isPolishVersion ? 'Prawdopodobieństwo' : 'Probability'}: {(result.probability * 100).toFixed(2)}%</Text>
                  </Space>
                  <Image width={100} src={result.image} />
                </List.Item>
              )}
            />
          )
      }
    </Card>
  );
}