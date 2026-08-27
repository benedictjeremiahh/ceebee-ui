'use client';

import React, { useEffect, useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from '@ceebee/ui/client';
import { App, Button, Form, Upload } from '@ceebee/ui/client';

interface OSSDataType {
  dir: string;
  expire: string;
  host: string;
  accessId: string;
  policy: string;
  signature: string;
}

interface ObjectStorageUploadProps {
  value?: UploadFile[];
  onChange?: (fileList: UploadFile[]) => void;
}

// Stands in for the signed-policy endpoint an object store would give you.
const mockOSSData = () => {
  const mockData = {
    dir: 'user-dir/',
    expire: '1577811661',
    host: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    accessId: 'c2hhb2RhaG9uZw==',
    policy: 'eGl4aWhhaGFrdWt1ZGFkYQ==',
    signature: 'ZGFob25nc2hhbw==',
  };
  return Promise.resolve(mockData);
};

const ObjectStorageUpload: React.FC<Readonly<ObjectStorageUploadProps>> = ({ value, onChange }) => {
  const { message } = App.useApp();

  const [OSSData, setOSSData] = useState<OSSDataType>();

  const init = async () => {
    try {
      const result = await mockOSSData();
      setOSSData(result);
    } catch (err) {
      if (err instanceof Error) {
        message.error(err.message);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);

  const handleChange: UploadProps['onChange'] = ({ fileList }) => {
    console.log('object storage:', fileList);
    onChange?.([...fileList]);
  };

  const onRemove = (file: UploadFile) => {
    const files = (value || []).filter((v) => v.url !== file.url);
    onChange?.(files);
  };

  const getExtraData: UploadProps['data'] = (file) => ({
    key: file.url,
    OSSAccessKeyId: OSSData?.accessId,
    policy: OSSData?.policy,
    Signature: OSSData?.signature,
  });

  const beforeUpload: UploadProps['beforeUpload'] = async (file) => {
    if (!OSSData) {
      return false;
    }

    const expire = Number(OSSData.expire) * 1000;

    if (expire < Date.now()) {
      await init();
    }

    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    // @ts-ignore
    file.url = OSSData.dir + filename;

    return file;
  };

  const uploadProps: UploadProps = {
    name: 'file',
    fileList: value,
    action: OSSData?.host,
    onChange: handleChange,
    onRemove,
    data: getExtraData,
    beforeUpload,
  };

  return (
    <Upload {...uploadProps}>
      <Button icon={<UploadOutlined />}>Click to Upload</Button>
    </Upload>
  );
};

const Demo: React.FC = () => (
  <Form labelCol={{ span: 4 }}>
    <Form.Item label="Photos" name="photos">
      <ObjectStorageUpload />
    </Form.Item>
  </Form>
);

export default Demo;
