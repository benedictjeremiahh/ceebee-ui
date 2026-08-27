'use client';

import React, { useState } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Space } from '@ceebee/ui/client';

const LocalizedModal = () => {
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const hideModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Modal
      </Button>
      <Modal
        title="Modal"
        open={open}
        onOk={hideModal}
        onCancel={hideModal}
        okText="Yes"
        cancelText="No"
      >
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
        <p>Bla bla ...</p>
      </Modal>
    </>
  );
};

const App: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();

  const confirm = () => {
    modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Bla bla ...',
      okText: 'Yes',
      cancelText: 'No',
    });
  };

  return (
    <>
      <Space>
        <LocalizedModal />
        <Button onClick={confirm}>Confirm</Button>
      </Space>
      {contextHolder}
    </>
  );
};

export default App;
