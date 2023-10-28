import { Card, Space } from 'antd';
import type { UploadProps } from 'antd';
import { Button, Upload, message, Typography } from 'antd';
import { FaUpload, FaRegCircleDot } from 'react-icons/fa6';

const { Text } = Typography;

const props: UploadProps = {
  name: 'file',
  action: '',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }

    if (info.file.status === 'done') {
      message.success(`File uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`File upload failed.`);
    }
  },
  showUploadList: false,
  maxCount: 1,
  accept: 'audio/*',
};

export default function MainPage() {
  return (
    <Card>
      <Space direction='vertical' size='large' className='main-page'>
        <Text>
          To classify a bird, start recording or upload a file.
        </Text>

        <Upload {...props}>
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