'use client';

import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from '@ceebee/ui/client';
import { Button, message, Upload } from '@ceebee/ui/client';

const App: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const props: UploadProps = {
    beforeUpload: (file) => {
      const isPNG = file.type === 'image/png';
      if (!isPNG) {
        messageApi.error(`${file.name} is not a png file`);
      }
      return isPNG || Upload.LIST_IGNORE;
    },
    onChange: (info) => {
      console.log(info.fileList);
    },
  };

  return (
    <>
      {contextHolder}
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Upload png only</Button>
      </Upload>
    </>
  );
};

export default App;
