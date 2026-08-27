'use client';

import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from '@ceebee/ui/client';
import { Button, message, Upload } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        messageApi.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        messageApi.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  return (
    <>
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
    </>
  );
};

export default App;
