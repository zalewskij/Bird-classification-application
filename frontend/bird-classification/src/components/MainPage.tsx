import { useNavigate } from 'react-router-dom';
import { Card, Space, Button, Upload, message, Typography } from 'antd';
import { FaUpload, FaRegCircleDot } from 'react-icons/fa6';
import { useSetRecoilState } from 'recoil';
import { uploadedFileState } from '../atoms';

const { Text } = Typography;

export default function MainPage() {
  const navigate = useNavigate();
  const setUploadedFile = useSetRecoilState(uploadedFileState);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('audio/')) {
      message.error('File could not be opened');
      return false;
    }

    return true;
  }

  const uploadFile = (file: File | string | Blob) => {
    if (!(file instanceof File)) {
      message.error('An error occured while loading the file');
      return;
    }

    setUploadedFile(file);
    navigate('/choosing_fragment');
  }

  return (
    <Card>
      <Space direction='vertical' size='large' style={{ display: 'flex', alignItems: 'center' }}>
        <Text>
          To classify a bird, start recording or upload a file.
        </Text>

        <Upload showUploadList={false} maxCount={1} accept='audio/*'
          customRequest={({ file }) => uploadFile(file)}
          beforeUpload={validateFile}>
          <Button type='primary' icon={<FaUpload />}  size='large'>
            Click to&nbsp;<span style={{ fontWeight: 'bold' }}>upload</span>
          </Button>
        </Upload>

        <Button type='primary' icon={<FaRegCircleDot />} size='large'>
          Click to&nbsp;<span style={{ fontWeight: 'bold' }}>record</span>
        </Button>
      </Space>
    </Card>
  );
}