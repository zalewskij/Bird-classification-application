import { useActionData, type ActionFunctionArgs, useNavigate } from 'react-router-dom';
import { Card, List, Space, Typography, Image, Result, Popover, Button } from 'antd';
import { FaInfo } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { polishVersionState } from '../atoms';

const { Title, Text } = Typography;

const BACKEND_URL = 'http://127.0.0.1:5000/analyze-audio'

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  return fetch(BACKEND_URL, {
    method: 'POST',
    body: formData,
  }).catch((reason) => ({
    error: reason.toString()
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
  const actionData = useActionData() as { results: ResultType[] | undefined, error: string | undefined };
  const [results, setResults] = useState<ResultType[]>([]);
  const [mostProbableResult, setMostProbableResult] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (actionData && actionData.error) {
      console.log(actionData);
      setError(actionData.error);
    } else if (actionData && actionData.results) {
      setResults(actionData.results.sort((a, b) => b.probability - a.probability));
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
        (error) ? <Result status='warning' title={error.toString()} /> : <></>
      }
      <List
        itemLayout="vertical"
        size="large"
        pagination={false}
        dataSource={results}
        renderItem={(result) => (
          <List.Item key={result.english_name} className='result'>
            <Space direction='vertical'>
              <Title level={result.english_name === mostProbableResult ? 2 : 4} style={{ textTransform: 'capitalize' }}>
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
    </Card>
  );
}